import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all audit logs
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    if (action && action !== 'all') {
      where.action = action
    }

    const logs = await db.auditLog.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            orderId: true,
            partName: true,
          }
        }
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
