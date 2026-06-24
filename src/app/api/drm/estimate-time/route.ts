import { NextRequest, NextResponse } from 'next/server'

// Historical print job data for ML model training
const printJobs = [
  { partName: 'Pump Impeller', material: '316L Stainless', complexity: 'high', centerLoad: 'medium', printTimeMins: 240 },
  { partName: 'Valve Seat', material: 'Cast iron', complexity: 'medium', centerLoad: 'low', printTimeMins: 90 },
  { partName: 'Bearing Housing', material: 'Aluminum', complexity: 'low', centerLoad: 'high', printTimeMins: 45 },
  { partName: 'Heat Exchanger', material: 'Titanium', complexity: 'critical', centerLoad: 'medium', printTimeMins: 480 },
  { partName: 'Coupling Hub', material: 'Carbon Steel', complexity: 'low', centerLoad: 'low', printTimeMins: 60 },
  { partName: 'Gasket Retainer', material: 'Brass', complexity: 'low', centerLoad: 'high', printTimeMins: 30 },
  { partName: 'Manifold Block', material: '316L Stainless', complexity: 'high', centerLoad: 'high', printTimeMins: 300 },
  { partName: 'Seal Assembly', material: 'Titanium', complexity: 'medium', centerLoad: 'low', printTimeMins: 120 },
]

// Complexity multipliers for time estimation
const complexityMultiplier: Record<string, number> = {
  critical: 8,
  high: 5,
  medium: 2.5,
  low: 1,
}

// Material processing time factors (base minutes per cm³)
const materialTimeFactor: Record<string, number> = {
  'Titanium': 12,
  '316L Stainless': 10,
  'Aluminum': 6,
  'Carbon Steel': 8,
  'Cast iron': 9,
  'Brass': 5,
}

// Center load impact on queue time
const centerLoadImpact: Record<string, number> = {
  offline: 0,
  low: 1,
  medium: 1.5,
  high: 2,
  busy: 2.5,
}

function estimatePrintTime(request: {
  partName: string
  material: string
  complexity: string
  centerLoad: string
  estimatedVolume?: number
}): { estimatedMins: number; breakdown: Record<string, number>; confidence: number } {
  const baseMaterial = materialTimeFactor[request.material] || 8
  const baseComplexity = complexityMultiplier[request.complexity] || 2.5
  const loadFactor = centerLoadImpact[request.centerLoad] || 1

  // Find similar historical jobs
  const similar = printJobs.filter(
    j => j.material === request.material && j.complexity === request.complexity
  )

  let estimatedMins = 0
  let confidence = 0.5

  if (similar.length > 0) {
    // Use historical average
    const avgHistorical = similar.reduce((sum, j) => sum + j.printTimeMins, 0) / similar.length
    estimatedMins = Math.round(avgHistorical * loadFactor * 1.1) // +10% for queue
    confidence = Math.min(0.95, 0.6 + similar.length * 0.1)
  } else {
    // Estimate from factors
    const baseTime = 30 // base 30 mins
    estimatedMins = Math.round((baseTime + baseMaterial * baseComplexity) * loadFactor * 1.1)
    confidence = 0.5
  }

  return {
    estimatedMins,
    breakdown: {
      baseTime: 30,
      materialFactor: baseMaterial,
      complexityFactor: baseComplexity,
      queueWaitMins: Math.round(estimatedMins * 0.1),
      printMins: estimatedMins - Math.round(estimatedMins * 0.1),
    },
    confidence: Math.round(confidence * 100),
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { partName, material, complexity, centerLoad, estimatedVolume } = body

    if (!partName || !material || !complexity || !centerLoad) {
      return NextResponse.json(
        { error: 'Missing required fields: partName, material, complexity, centerLoad' },
        { status: 400 }
      )
    }

    const estimate = estimatePrintTime({
      partName,
      material,
      complexity,
      centerLoad,
      estimatedVolume,
    })

    return NextResponse.json({
      success: true,
      partName,
      material,
      complexity,
      centerLoad,
      ...estimate,
      completionTime: new Date(Date.now() + estimate.estimatedMins * 60000).toISOString(),
    })
  } catch (error) {
    console.error('Error estimating DRM queue time:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return historical data for training/reference
    return NextResponse.json({
      historicalJobs: printJobs,
      materials: Object.keys(materialTimeFactor),
      complexityLevels: Object.keys(complexityMultiplier),
      centerLoads: Object.keys(centerLoadImpact),
    })
  } catch (error) {
    console.error('Error fetching DRM stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
