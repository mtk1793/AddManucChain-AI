import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'
import Fuse from 'fuse.js'

// Advanced search with full-text capabilities
export async function POST(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { query, entityType, filters, sortBy, limit = 50 } = await request.json()
    
    const startTime = Date.now()
    let results: any[] = []
    
    // Fetch data based on entity type
    switch (entityType) {
      case 'order':
        results = await db.order.findMany({
          where: buildOrderFilter(filters),
          include: { requester: true, center: true, blueprint: true },
          take: limit,
          orderBy: buildOrderSort(sortBy),
        })
        break
        
      case 'blueprint':
        results = await db.blueprint.findMany({
          where: buildBlueprintFilter(filters),
          take: limit,
          orderBy: buildOrderSort(sortBy),
        })
        break
        
      case 'center':
        results = await db.printCenter.findMany({
          where: buildCenterFilter(filters),
          take: limit,
          orderBy: buildOrderSort(sortBy),
        })
        break
        
      case 'report':
        results = await db.report.findMany({
          where: buildReportFilter(filters),
          take: limit,
          orderBy: buildOrderSort(sortBy),
        })
        break
    }
    
    // Apply full-text search using Fuse.js
    if (query) {
      const fuse = new Fuse(results, {
        keys: getSearchKeys(entityType),
        threshold: 0.3,
        minMatchCharLength: 2,
      })
      results = fuse.search(query).map(r => r.item)
    }
    
    const executionTime = Date.now() - startTime
    
    // Log search
    await db.searchLog.create({
      data: {
        userId: session.user.id,
        query: query || '',
        entityType,
        filters: JSON.stringify(filters || {}),
        resultCount: results.length,
        executionTime,
      },
    })
    
    return NextResponse.json({
      results,
      resultCount: results.length,
      executionTime,
      query,
      entityType,
    })
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

// Save filter
export async function PUT(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { name, description, entityType, filters, sortBy, isPublic } = await request.json()
    
    const savedFilter = await db.savedFilter.create({
      data: {
        userId: session.user.id,
        name,
        description,
        entityType,
        filters: JSON.stringify(filters),
        sortBy,
        isPublic,
      },
    })
    
    return NextResponse.json({ success: true, savedFilter })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save filter' }, { status: 500 })
  }
}

// Get saved filters
export async function GET(request: Request) {
  const { session, error } = await requireAuth()
  if (error) return error
  
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    
    const filters = await db.savedFilter.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { isPublic: true },
        ],
        entityType: entityType || undefined,
      },
      orderBy: { lastUsed: 'desc' },
    })
    
    return NextResponse.json({ filters })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
  }
}

// Helper functions
function buildOrderFilter(filters: any) {
  if (!filters) return {}
  return {
    status: filters.status,
    priority: filters.priority,
    createdAt: filters.dateRange ? {
      gte: new Date(filters.dateRange.from),
      lte: new Date(filters.dateRange.to),
    } : undefined,
  }
}

function buildBlueprintFilter(filters: any) {
  if (!filters) return {}
  return {
    status: filters.status,
    category: filters.category,
    material: filters.material,
  }
}

function buildCenterFilter(filters: any) {
  if (!filters) return {}
  return {
    status: filters.status,
    location: filters.location,
  }
}

function buildReportFilter(filters: any) {
  if (!filters) return {}
  return {
    type: filters.type,
    format: filters.format,
    status: filters.status,
  }
}

function buildOrderSort(sortBy: any) {
  if (!sortBy) return { createdAt: 'desc' }
  return { [sortBy.field]: sortBy.order || 'asc' }
}

function getSearchKeys(entityType: string) {
  const keyMap: { [key: string]: string[] } = {
    'order': ['orderId', 'partName', 'status', 'priority'],
    'blueprint': ['blueprintId', 'name', 'category', 'material'],
    'center': ['centerId', 'name', 'location'],
    'report': ['reportId', 'title', 'type', 'description'],
  }
  return keyMap[entityType] || []
}
