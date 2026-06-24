import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET all materials with stock information
export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    const materials = await db.material.findMany({
      orderBy: { name: 'asc' },
      include: {
        stocks: {
          include: {
            center: {
              select: { id: true, name: true }
            }
          }
        }
      },
    })

    // Transform to include computed fields
    const transformedMaterials = materials.map(material => ({
      ...material,
      centerStocks: material.stocks.map(s => ({
        centerName: s.center.name,
        stock: s.stock
      }))
    }))

    return NextResponse.json(transformedMaterials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}
