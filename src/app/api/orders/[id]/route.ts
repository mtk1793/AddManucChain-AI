import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const order = await db.order.findUnique({
      where: { id },
      include: {
        requester: true,
        blueprint: true,
        center: true,
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PUT update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const body = await request.json()
    const { status, priority, centerId, notes } = body

    const order = await db.order.update({
      where: { id },
      data: {
        status,
        priority,
        centerId,
        notes,
      },
      include: {
        requester: true,
        blueprint: true,
        center: true,
      },
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        orderId: order.id,
        action: 'ORDER_UPDATED',
        details: `Order status changed to ${status}`,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    
    // Delete audit logs first
    await db.auditLog.deleteMany({
      where: { orderId: id },
    })

    await db.order.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
