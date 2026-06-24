import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET comparative metrics
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    
    if (customerId) {
      where.customerId = customerId
    }
    
    if (startDate && endDate) {
      where.metricMonth = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const metrics = await db.comparativeMetrics.findMany({
      where,
      orderBy: { metricMonth: 'desc' },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching comparative metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch comparative metrics' }, { status: 500 })
  }
}

// POST create new comparative metric entry
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const {
      customerId,
      metricMonth,
      traditionalLeadTime,
      almatechLeadTime,
      traditionalWarehouseCost,
      almatechWarehouseCost,
      partsRepaired,
      partsReplaced,
      designIterations
    } = body

    if (!customerId || !metricMonth) {
      return NextResponse.json({ error: 'Customer ID and metric month are required' }, { status: 400 })
    }

    const leadTimeReduction = ((traditionalLeadTime - almatechLeadTime) / traditionalLeadTime) * 100
    const warehouseSavings = ((traditionalWarehouseCost - almatechWarehouseCost) / traditionalWarehouseCost) * 100

    const metric = await db.comparativeMetrics.create({
      data: {
        customerId,
        metricMonth: new Date(metricMonth),
        traditionalLeadTime: traditionalLeadTime || 0,
        almatechLeadTime: almatechLeadTime || 0,
        leadTimeReduction,
        traditionalWarehouseCost: traditionalWarehouseCost || 0,
        almatechWarehouseCost: almatechWarehouseCost || 0,
        warehouseSavings,
        partsRepaired: partsRepaired || 0,
        partsReplaced: partsReplaced || 0,
        designIterations: designIterations || 0,
      },
    })

    return NextResponse.json(metric, { status: 201 })
  } catch (error) {
    console.error('Error creating comparative metric:', error)
    return NextResponse.json({ error: 'Failed to create comparative metric' }, { status: 500 })
  }
}
