import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all certifications
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }

    const certifications = await db.certification.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(certifications)
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 })
  }
}
