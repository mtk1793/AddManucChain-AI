import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'
import { getDemoShipments } from '@/lib/demo-api-data'

// GET all shipments
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { trackingId: { contains: search, mode: 'insensitive' } },
      ]
    }

    const shipments = await db.shipment.findMany({
      where,
      include: {
        order: {
          select: {
            orderId: true,
            partName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(shipments)
  } catch (error) {
    console.error('getDemoShipments database read failed; serving demo data:', error)
    return NextResponse.json(getDemoShipments(request.nextUrl.searchParams))
  }
}
