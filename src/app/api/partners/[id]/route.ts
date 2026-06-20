import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// DELETE a partner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    
    await db.partner.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 })
  }
}

// GET a single partner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    
    const partner = await db.partner.findUnique({
      where: { id },
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json({ error: 'Failed to fetch partner' }, { status: 500 })
  }
}

// PUT update a partner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const body = await request.json()
    
    const partner = await db.partner.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 })
  }
}
