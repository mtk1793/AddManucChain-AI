import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all print centers
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const centers = await db.printCenter.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    })

    // Transform centers to include parsed JSON fields
    const transformedCenters = centers.map(center => ({
      ...center,
      materials: JSON.parse(center.materials),
      specialties: JSON.parse(center.specialties),
      orderCount: center._count.orders,
    }))

    return NextResponse.json(transformedCenters)
  } catch (error) {
    console.error('Error fetching centers:', error)
    return NextResponse.json({ error: 'Failed to fetch centers' }, { status: 500 })
  }
}

// POST create new print center
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { 
      name, 
      location, 
      certification, 
      totalPrinters, 
      contactName, 
      contactEmail, 
      materials, 
      specialties 
    } = body

    // Generate center ID
    const lastCenter = await db.printCenter.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    const centerNum = lastCenter ? parseInt(lastCenter.centerId.split('-')[1]) + 1 : 6
    const centerId = `PC-${String(centerNum).padStart(3, '0')}`

    const center = await db.printCenter.create({
      data: {
        centerId,
        name,
        location,
        status: 'online',
        certification,
        totalPrinters: parseInt(totalPrinters) || 1,
        activePrinters: 0,
        capacity: 0,
        currentJobs: 0,
        completedToday: 0,
        contactName,
        contactEmail,
        materials: JSON.stringify(materials || []),
        specialties: JSON.stringify(specialties || []),
      },
    })

    return NextResponse.json({
      ...center,
      materials: JSON.parse(center.materials),
      specialties: JSON.parse(center.specialties),
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating center:', error)
    return NextResponse.json({ error: 'Failed to create center' }, { status: 500 })
  }
}
