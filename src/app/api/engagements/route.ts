import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all customer engagements
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const phase = searchParams.get('phase')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (phase && phase !== 'all') {
      where.phase = phase
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { accountManager: { contains: search, mode: 'insensitive' } },
      ]
    }

    const engagements = await db.customerEngagement.findMany({
      where,
      include: {
        trainingSessions: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(engagements)
  } catch (error) {
    console.error('Error fetching engagements:', error)
    return NextResponse.json({ error: 'Failed to fetch engagements' }, { status: 500 })
  }
}

// POST create new customer engagement
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { customerId, customerName, industry, accountManager, rigCount, notes } = body

    if (!customerName || !accountManager) {
      return NextResponse.json({ error: 'Customer name and account manager are required' }, { status: 400 })
    }

    const engagement = await db.customerEngagement.create({
      data: {
        customerId: customerId || `CUST-${Date.now()}`,
        customerName,
        industry: industry || 'Oil & Gas',
        phase: 'assessment',
        accountManager,
        rigCount: rigCount || 0,
        healthScore: 50,
        status: 'active',
        notes: notes || '',
      },
    })

    return NextResponse.json(engagement, { status: 201 })
  } catch (error) {
    console.error('Error creating engagement:', error)
    return NextResponse.json({ error: 'Failed to create engagement' }, { status: 500 })
  }
}

// PUT update customer engagement
export async function PUT(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { id, phase, healthScore, status, notes, assessmentDate, adoptionDate, integrationDate, trainingDate, maintenanceStartDate } = body

    if (!id) {
      return NextResponse.json({ error: 'Engagement ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (phase !== undefined) updateData.phase = phase
    if (healthScore !== undefined) updateData.healthScore = healthScore
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (assessmentDate !== undefined) updateData.assessmentDate = new Date(assessmentDate)
    if (adoptionDate !== undefined) updateData.adoptionDate = new Date(adoptionDate)
    if (integrationDate !== undefined) updateData.integrationDate = new Date(integrationDate)
    if (trainingDate !== undefined) updateData.trainingDate = new Date(trainingDate)
    if (maintenanceStartDate !== undefined) updateData.maintenanceStartDate = new Date(maintenanceStartDate)

    const engagement = await db.customerEngagement.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(engagement)
  } catch (error) {
    console.error('Error updating engagement:', error)
    return NextResponse.json({ error: 'Failed to update engagement' }, { status: 500 })
  }
}

// DELETE a customer engagement
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Engagement ID is required' }, { status: 400 })
    }

    await db.customerEngagement.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Engagement deleted successfully' })
  } catch (error) {
    console.error('Error deleting engagement:', error)
    return NextResponse.json({ error: 'Failed to delete engagement' }, { status: 500 })
  }
}
