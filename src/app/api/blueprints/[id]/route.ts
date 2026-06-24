import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET single blueprint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const blueprint = await db.blueprint.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            requester: true,
            center: true,
          },
        },
      },
    })

    if (!blueprint) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 })
    }

    return NextResponse.json(blueprint)
  } catch (error) {
    console.error('Error fetching blueprint:', error)
    return NextResponse.json({ error: 'Failed to fetch blueprint' }, { status: 500 })
  }
}

// PUT update blueprint
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, material, oem, certification, status, description } = body

    const blueprint = await db.blueprint.update({
      where: { id },
      data: {
        name,
        category,
        material,
        oem,
        certification,
        status,
        description,
      },
    })

    return NextResponse.json(blueprint)
  } catch (error) {
    console.error('Error updating blueprint:', error)
    return NextResponse.json({ error: 'Failed to update blueprint' }, { status: 500 })
  }
}

// DELETE blueprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { id } = await params
    await db.blueprint.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blueprint:', error)
    return NextResponse.json({ error: 'Failed to delete blueprint' }, { status: 500 })
  }
}
