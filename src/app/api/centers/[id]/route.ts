import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET single print center
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const center = await db.printCenter.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!center) {
      return NextResponse.json({ error: 'Center not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...center,
      materials: JSON.parse(center.materials),
      specialties: JSON.parse(center.specialties),
    })
  } catch (error) {
    console.error('Error fetching center:', error)
    return NextResponse.json({ error: 'Failed to fetch center' }, { status: 500 })
  }
}

// PUT update print center
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const body = await request.json()
    const { status, capacity, currentJobs, activePrinters, completedToday } = body

    const center = await db.printCenter.update({
      where: { id },
      data: {
        status,
        capacity,
        currentJobs,
        activePrinters,
        completedToday,
      },
    })

    return NextResponse.json({
      ...center,
      materials: JSON.parse(center.materials),
      specialties: JSON.parse(center.specialties),
    })
  } catch (error) {
    console.error('Error updating center:', error)
    return NextResponse.json({ error: 'Failed to update center' }, { status: 500 })
  }
}

// DELETE print center
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    
    // First, update any orders assigned to this center to have no center
    await db.order.updateMany({
      where: { centerId: id },
      data: { centerId: null },
    })
    
    await db.printCenter.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting center:', error)
    return NextResponse.json({ error: 'Failed to delete center' }, { status: 500 })
  }
}
