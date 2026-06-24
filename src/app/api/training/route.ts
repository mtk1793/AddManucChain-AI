import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all training sessions
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (customerId) {
      where.customerId = customerId
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (type && type !== 'all') {
      where.type = type
    }

    const sessions = await db.trainingSession.findMany({
      where,
      include: {
        customer: true,
      },
      orderBy: { scheduledDate: 'desc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching training sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch training sessions' }, { status: 500 })
  }
}

// POST create new training session
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { sessionId, customerId, title, type, scheduledDate, duration, trainer, location, attendees, materials } = body

    if (!customerId || !title || !scheduledDate) {
      return NextResponse.json({ error: 'Customer ID, title, and scheduled date are required' }, { status: 400 })
    }

    const session = await db.trainingSession.create({
      data: {
        sessionId: sessionId || `TS-${new Date().getFullYear()}-${Date.now()}`,
        customerId,
        title,
        type: type || 'Operation',
        scheduledDate: new Date(scheduledDate),
        duration: duration || 240,
        trainer: trainer || 'TBD',
        location: location || 'TBD',
        attendees: attendees || '[]',
        status: 'scheduled',
        materials: materials || '',
      },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating training session:', error)
    return NextResponse.json({ error: 'Failed to create training session' }, { status: 500 })
  }
}

// PUT update training session
export async function PUT(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { id, status, feedback, attendees } = body

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (feedback !== undefined) updateData.feedback = feedback
    if (attendees !== undefined) updateData.attendees = attendees

    const session = await db.trainingSession.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating training session:', error)
    return NextResponse.json({ error: 'Failed to update training session' }, { status: 500 })
  }
}

// DELETE a training session
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    await db.trainingSession.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Training session deleted successfully' })
  } catch (error) {
    console.error('Error deleting training session:', error)
    return NextResponse.json({ error: 'Failed to delete training session' }, { status: 500 })
  }
}
