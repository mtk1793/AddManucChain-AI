import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'
import ExcelJS from 'exceljs'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'

// Generate report in requested format
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { type, format, filters, title } = await request.json()
    
    // Validate input
    if (!['orders', 'analytics', 'compliance', 'cost_analysis', 'operational'].includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }
    
    if (!['pdf', 'excel', 'csv', 'json'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
    
    // Create report entry
    const reportId = `RPT-${Date.now()}`
    const report = await db.report.create({
      data: {
        reportId,
        type,
        title: title || `${type} Report`,
        format,
        generatedBy: session.user.email,
        filters: JSON.stringify(filters || {}),
        status: 'generating',
      },
    })
    
    // Fetch data based on report type
    let data: any = {}
    
    switch (type) {
      case 'orders':
        data = await db.order.findMany({
          include: { requester: true, center: true, blueprint: true },
          take: 1000,
        })
        break
      case 'analytics':
        const stats = await db.dashboardStats.findFirst()
        const orders = await db.order.findMany({ take: 100 })
        data = { stats, orders }
        break
      case 'compliance':
        data = await db.certification.findMany({ take: 500 })
        break
      case 'cost_analysis':
        data = await db.costOptimization.findMany({ take: 500 })
        break
      case 'operational':
        data = {
          centers: await db.printCenter.findMany(),
          materials: await db.material.findMany(),
        }
        break
    }
    
    // Generate file
    let fileBuffer: Buffer
    let mimeType: string
    
    if (format === 'pdf') {
      // For PDF, return JSON and let client handle rendering
      fileBuffer = Buffer.from(JSON.stringify(data))
      mimeType = 'application/json'
    } else if (format === 'excel') {
      fileBuffer = await generateExcel(type, title, data)
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else if (format === 'csv') {
      fileBuffer = await generateCSV(type, data)
      mimeType = 'text/csv'
    } else {
      fileBuffer = Buffer.from(JSON.stringify(data, null, 2))
      mimeType = 'application/json'
    }
    
    // Save file
    const ext = format === 'json' ? 'json' : format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf'
    const filename = `${reportId}.${ext}`
    const filepath = path.join(process.cwd(), 'public', 'reports', filename)
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    fs.writeFileSync(filepath, fileBuffer)
    
    // Update report
    await db.report.update({
      where: { id: report.id },
      data: {
        status: 'ready',
        fileUrl: `/reports/${filename}`,
        resultCount: Array.isArray(data) ? data.length : Object.values(data).flat().length,
        data: JSON.stringify(data).slice(0, 10000), // Store partial data
      },
    })
    
    return NextResponse.json({
      success: true,
      reportId,
      fileUrl: `/reports/${filename}`,
      format,
    })
  } catch (error) {
    console.error('Report generation failed:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

// Get reports
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const reports = await db.report.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    
    return NextResponse.json({ reports })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

// Helper functions
async function generateExcel(type: string, title: string, data: any): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(title.slice(0, 31))
  
  if (Array.isArray(data) && data.length > 0) {
    const keys = Object.keys(data[0])
    worksheet.columns = keys.map(key => ({ header: key, key, width: 15 }))
    
    data.forEach((row: any) => {
      worksheet.addRow(row)
    })
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        worksheet.addRow({ key, value: `${value.length} items` })
      } else {
        worksheet.addRow({ key, value })
      }
    })
  }
  
  return await workbook.xlsx.writeBuffer() as Buffer
}

async function generateCSV(type: string, data: any): Promise<Buffer> {
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]).map(h => ({ id: h, title: h }))
    const filename = `${type}-${Date.now()}.csv`
    const filepath = path.join(process.cwd(), 'temp', filename)
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    
    const writer = createObjectCsvWriter({ path: filepath, header: headers })
    await writer.writeRecords(data)
    
    const content = fs.readFileSync(filepath)
    fs.unlinkSync(filepath)
    return content
  }
  
  return Buffer.from('No data to export')
}
