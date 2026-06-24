import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all certification authorities
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
        { acronym: { contains: search, mode: 'insensitive' } },
      ]
    }

    const authorities = await db.certificationAuthority.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(authorities)
  } catch (error) {
    console.error('Error fetching authorities:', error)
    return NextResponse.json({ error: 'Failed to fetch authorities' }, { status: 500 })
  }
}

// POST create new certification authority
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const body = await request.json()
    const { authorityId, name, acronym, type, contactEmail, contactPhone, specializations, websiteUrl } = body

    if (!name || !acronym || !contactEmail) {
      return NextResponse.json({ error: 'Name, acronym, and contact email are required' }, { status: 400 })
    }

    const authority = await db.certificationAuthority.create({
      data: {
        authorityId: authorityId || `CA-${Date.now()}`,
        name,
        acronym,
        type: type || 'General',
        contactEmail,
        contactPhone: contactPhone || '',
        specializations: specializations || '[]',
        websiteUrl: websiteUrl || '',
        status: 'active',
        approvedParts: 0,
        averageLeadTime: 0,
      },
    })

    return NextResponse.json(authority, { status: 201 })
  } catch (error) {
    console.error('Error creating authority:', error)
    return NextResponse.json({ error: 'Failed to create authority' }, { status: 500 })
  }
}

// DELETE a certification authority
export async function DELETE(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Authority ID is required' }, { status: 400 })
    }

    await db.certificationAuthority.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Authority deleted successfully' })
  } catch (error) {
    console.error('Error deleting authority:', error)
    return NextResponse.json({ error: 'Failed to delete authority' }, { status: 500 })
  }
}
