import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all certification requests
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const authorityId = searchParams.get('authorityId')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (authorityId) {
      where.authorityId = authorityId
    }

    const requests = await db.certificationRequest.findMany({
      where,
      include: {
        authority: true,
      },
      orderBy: { submittedDate: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching certification requests:', error)
    return NextResponse.json({ error: 'Failed to fetch certification requests' }, { status: 500 })
  }
}

// POST create new certification request
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { requestId, blueprintId, authorityId, notes } = body

    if (!blueprintId || !authorityId) {
      return NextResponse.json({ error: 'Blueprint ID and Authority ID are required' }, { status: 400 })
    }

    const certRequest = await db.certificationRequest.create({
      data: {
        requestId: requestId || `CR-${new Date().getFullYear()}-${Date.now()}`,
        blueprintId,
        authorityId,
        status: 'submitted',
        notes: notes || '',
      },
    })

    return NextResponse.json(certRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating certification request:', error)
    return NextResponse.json({ error: 'Failed to create certification request' }, { status: 500 })
  }
}

// PUT update certification request
export async function PUT(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { id, status, notes, reviewerName, documentUrl } = body

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (reviewerName !== undefined) updateData.reviewerName = reviewerName
    if (documentUrl !== undefined) updateData.documentUrl = documentUrl
    
    if (status === 'approved' || status === 'rejected') {
      updateData.reviewedDate = new Date()
    }

    const certRequest = await db.certificationRequest.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(certRequest)
  } catch (error) {
    console.error('Error updating certification request:', error)
    return NextResponse.json({ error: 'Failed to update certification request' }, { status: 500 })
  }
}
