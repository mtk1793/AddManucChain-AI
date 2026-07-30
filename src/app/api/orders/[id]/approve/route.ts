import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

const TRANSITIONS: Record<string, string> = {
  pending: 'oem_approved',
  oem_approved: 'cert_approved',
  cert_approved: 'printing',
  printing: 'completed',
  completed: 'archived',
}

const ROLE_FOR_STEP: Record<string, string> = {
  pending: 'operator',
  oem_approved: 'oem_partner',
  cert_approved: 'cert_authority',
  printing: 'print_center',
  completed: 'print_center',
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const body = await request.json()
    const { step } = body

    if (!['oem', 'cert', 'print', 'complete', 'archive'].includes(step)) {
      return NextResponse.json({ error: 'Invalid step. Must be: oem, cert, print, complete, archive' }, { status: 400 })
    }

    const order = await db.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'archived') {
      return NextResponse.json({ error: 'Order is already archived' }, { status: 400 })
    }

    const statusAtStep: Record<string, string> = {
      oem: 'pending',
      cert: 'oem_approved',
      print: 'cert_approved',
      complete: 'printing',
      archive: 'completed',
    }

    const requiredStatus = statusAtStep[step]
    if (order.status !== requiredStatus) {
      return NextResponse.json({
        error: `Order must be in "${requiredStatus}" status to perform "${step}" approval. Current status: "${order.status}"`
      }, { status: 400 })
    }

    const userEmail = (session as any)?.user?.email || 'unknown'
    const userName = (session as any)?.user?.name || userEmail
    const now = new Date()

    const updateData: any = { status: TRANSITIONS[order.status] || order.status }

    if (step === 'oem') {
      updateData.oemApprovedAt = now
      updateData.oemApprovedBy = userName
    } else if (step === 'cert') {
      updateData.certApprovedAt = now
      updateData.certApprovedBy = userName
    } else if (step === 'complete') {
      updateData.completedAt = now
    } else if (step === 'archive') {
      updateData.archivedAt = now
    }

    const updated = await db.order.update({
      where: { id },
      data: updateData,
      include: { requester: true, blueprint: true, center: true },
    })

    await db.auditLog.create({
      data: {
        orderId: order.id,
        action: 'ORDER_UPDATED',
        details: `Order transitioned: ${order.status} → ${updated.status} (step: ${step}) by ${userName}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error in approval:', error)
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}
