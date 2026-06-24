import { NextRequest, NextResponse } from 'next/server'

// Mock database of parts with risk scores
const partInventory = [
  {
    id: 'BP-001',
    partName: 'Pump Impeller Type 316L',
    category: 'Pumping Equipment',
    material: '316L Stainless Steel',
    riskScore: 85,
    currentStock: 2,
    minStock: 5,
    leadTimeDays: 14,
    printCount: 240,
    criticality: 'production_stopped',
    lastUsed: '2 days ago',
    oem: 'Sulzer AG',
  },
  {
    id: 'BP-002',
    partName: 'Valve Seat DN80',
    category: 'Valves & Fittings',
    material: 'Cast iron',
    riskScore: 72,
    currentStock: 4,
    minStock: 6,
    leadTimeDays: 10,
    printCount: 180,
    criticality: 'degraded',
    lastUsed: '5 days ago',
    oem: 'Flowserve',
  },
  {
    id: 'BP-003',
    partName: 'Bearing Housing',
    category: 'Bearings',
    material: 'Aluminum 6061',
    riskScore: 65,
    currentStock: 8,
    minStock: 4,
    leadTimeDays: 7,
    printCount: 120,
    criticality: 'operational_risk',
    lastUsed: '1 week ago',
    oem: 'SKF',
  },
  {
    id: 'BP-004',
    partName: 'Heat Exchanger Core',
    category: 'Heat Transfer',
    material: 'Titanium Grade 5',
    riskScore: 58,
    currentStock: 1,
    minStock: 3,
    leadTimeDays: 21,
    printCount: 95,
    criticality: 'safety_risk',
    lastUsed: '2 weeks ago',
    oem: 'APV Group',
  },
  {
    id: 'BP-005',
    partName: 'Coupling Hub',
    category: 'Couplings',
    material: 'Carbon Steel',
    riskScore: 44,
    currentStock: 15,
    minStock: 8,
    leadTimeDays: 5,
    printCount: 450,
    criticality: 'operational_risk',
    lastUsed: '3 days ago',
    oem: 'Rexnord',
  },
  {
    id: 'BP-006',
    partName: 'Gasket Retainer',
    category: 'Seals & Gaskets',
    material: 'Brass',
    riskScore: 28,
    currentStock: 32,
    minStock: 10,
    leadTimeDays: 3,
    printCount: 650,
    criticality: 'unknown',
    lastUsed: '1 day ago',
    oem: 'Freudenberg',
  },
]

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const riskMin = parseInt(url.searchParams.get('risk_min') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const partId = url.searchParams.get('id')

    // If specific part requested
    if (partId) {
      const part = partInventory.find(p => p.id === partId)
      if (!part) {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 })
      }
      return NextResponse.json(part)
    }

    // Filter by risk score minimum
    const filtered = partInventory
      .filter(p => p.riskScore >= riskMin)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, limit)

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching digital inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, partId, riskScore } = body

    // Simulate updating risk scores
    if (action === 'update_risk' && partId && riskScore !== undefined) {
      const part = partInventory.find(p => p.id === partId)
      if (part) {
        part.riskScore = Math.max(0, Math.min(100, riskScore))
      }
      return NextResponse.json({ success: true, part })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating digital inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
