import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all partners
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (type && type !== 'all') {
      where.type = type
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const partners = await db.partner.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 })
  }
}

// POST create new partner
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { name, email, phone, type, address, notes } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const partner = await db.partner.create({
      data: {
        name,
        email,
        phone: phone || '',
        type: type || 'OEM',
        status: 'pending',
        address: address || '',
        notes: notes || '',
        blueprints: 0,
        totalPrints: 0,
        revenue: 0,
      },
    })

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 })
  }
}
