import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all blueprints
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const certification = searchParams.get('certification')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (certification && certification !== 'all') {
      where.certification = { contains: certification, mode: 'insensitive' }
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { blueprintId: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { oem: { contains: search, mode: 'insensitive' } },
      ]
    }

    const blueprints = await db.blueprint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blueprints)
  } catch (error) {
    console.error('Error fetching blueprints:', error)
    return NextResponse.json({ error: 'Failed to fetch blueprints' }, { status: 500 })
  }
}

// POST create new blueprint
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { name, category, material, oem, certification, description } = body

    // Generate blueprint ID
    const lastBlueprint = await db.blueprint.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    const bpNum = lastBlueprint ? parseInt(lastBlueprint.blueprintId.split('-')[1]) + 1 : 1025
    const blueprintId = `BP-${bpNum}`

    const blueprint = await db.blueprint.create({
      data: {
        blueprintId,
        name,
        category,
        material,
        oem,
        certification,
        description,
        status: 'pending_review',
      },
    })

    return NextResponse.json(blueprint, { status: 201 })
  } catch (error) {
    console.error('Error creating blueprint:', error)
    return NextResponse.json({ error: 'Failed to create blueprint' }, { status: 500 })
  }
}
