import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all customization requests
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const blueprintId = searchParams.get('blueprintId')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (blueprintId) {
      where.blueprintId = blueprintId
    }

    const requests = await db.customizationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching customization requests:', error)
    return NextResponse.json({ error: 'Failed to fetch customization requests' }, { status: 500 })
  }
}

// POST create new customization request
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { requestId, blueprintId, requesterId, requesterName, description, justification, estimatedCost, estimatedTime } = body

    if (!blueprintId || !requesterId || !description) {
      return NextResponse.json({ error: 'Blueprint ID, requester ID, and description are required' }, { status: 400 })
    }

    const custRequest = await db.customizationRequest.create({
      data: {
        requestId: requestId || `CUST-REQ-${Date.now()}`,
        blueprintId,
        requesterId,
        requesterName: requesterName || 'Unknown',
        description,
        justification: justification || '',
        status: 'pending',
        estimatedCost: estimatedCost || null,
        estimatedTime: estimatedTime || null,
      },
    })

    return NextResponse.json(custRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating customization request:', error)
    return NextResponse.json({ error: 'Failed to create customization request' }, { status: 500 })
  }
}

// PUT update customization request
export async function PUT(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { id, status, assignedTo, estimatedCost, estimatedTime } = body

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime

    const custRequest = await db.customizationRequest.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(custRequest)
  } catch (error) {
    console.error('Error updating customization request:', error)
    return NextResponse.json({ error: 'Failed to update customization request' }, { status: 500 })
  }
}

// DELETE a customization request
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    await db.customizationRequest.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Customization request deleted successfully' })
  } catch (error) {
    console.error('Error deleting customization request:', error)
    return NextResponse.json({ error: 'Failed to delete customization request' }, { status: 500 })
  }
}
