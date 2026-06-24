import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET environmental impact records
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    const where: any = {}
    
    if (orderId) {
      where.orderId = orderId
    }

    const impacts = await db.environmentalImpact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(impacts)
  } catch (error) {
    console.error('Error fetching environmental impact:', error)
    return NextResponse.json({ error: 'Failed to fetch environmental impact' }, { status: 500 })
  }
}

// GET aggregated environmental stats
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const allImpacts = await db.environmentalImpact.findMany()
    
    const totalCO2Saved = allImpacts.reduce((sum, record) => sum + record.co2SavedKg, 0)
    const totalMilesAvoided = allImpacts.reduce((sum, record) => sum + record.milesAvoided, 0)
    const totalWasteReduced = allImpacts.reduce((sum, record) => sum + record.wasteReduced, 0)
    const recordCount = allImpacts.length

    return NextResponse.json({
      totalCO2Saved,
      totalMilesAvoided,
      totalWasteReduced,
      recordCount,
      avgCO2PerOrder: recordCount > 0 ? totalCO2Saved / recordCount : 0,
    })
  } catch (error) {
    console.error('Error calculating environmental stats:', error)
    return NextResponse.json({ error: 'Failed to calculate environmental stats' }, { status: 500 })
  }
}
