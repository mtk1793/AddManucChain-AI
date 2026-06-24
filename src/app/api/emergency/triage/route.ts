import { NextRequest, NextResponse } from 'next/server'
import { askAI, askAIJson } from '@/lib/ai'

/**
 * POST /api/emergency/triage
 * Emergency AI triage: natural language input → part identification → routing
 * Request: { description }
 */
export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    if (!description) {
      return NextResponse.json({ error: 'Missing description field' }, { status: 400 })
    }

    // Step 1: Extract part info from natural language description
    const extractionSystemPrompt =
      'You are an emergency response AI for offshore industrial equipment.'
    const extractionUserMessage = `From the following failure description, extract the part information. Respond with ONLY a JSON object.

FAILURE DESCRIPTION:
"${description}"

Extract:
{
  "bestGuess": "Most likely part name or category",
  "partType": "bearing | bracket | seal | valve | filter | coupling | housing | fastener | other",
  "material": "Most likely material (Ti, Inconel, Stainless Steel, etc.) or null",
  "approxSize": "Small (< 10cm) | Medium (10-30cm) | Large (> 30cm) or null",
  "criticality": "CRITICAL | HIGH | MEDIUM | LOW",
  "confidence": number (0-100)
}

Output ONLY valid JSON.`

    const partInfo = await askAIJson<{
      bestGuess: string
      partType: string
      material: string | null
      approxSize: string | null
      criticality: string
      confidence: number
    }>(extractionSystemPrompt, extractionUserMessage, {
      bestGuess: 'Unknown part',
      partType: 'other',
      material: null,
      approxSize: null,
      criticality: 'HIGH',
      confidence: 30,
    })

    // Step 2: Mock routing decision (in production, query actual print centers)
    const nearestCenterOptions = [
      { name: 'Halifax AM Hub', distance: 240, capacity: 85, certification: 'DNV-GL', eta: 18 },
      { name: 'PolyUnity NL', distance: 450, capacity: 60, certification: 'ABS', eta: 24 },
      { name: 'Dalhousie Lab', distance: 520, capacity: 30, certification: 'Multi-standard', eta: 36 },
    ]

    // Select best center (lowest eta, matching cert if possible)
    const selectedCenter = nearestCenterOptions[0]

    // Step 3: Generate recommendation
    const recSystemPrompt = 'You are an emergency response coordinator.'
    const recUserMessage = `Based on the extracted part information and time constraints, recommend an immediate action.

EXTRACTED PART: ${partInfo.bestGuess}
PART CRITICALITY: ${partInfo.criticality}
AVAILABLE CENTER: ${selectedCenter.name} (${selectedCenter.eta}h ETA, ${selectedCenter.certification})

Generate a brief (<50 words) action recommendation. Output ONLY the recommendation text, no JSON.`

    const recommendation = (await askAI(recSystemPrompt, recUserMessage)) || 'Proceed with order creation'

    return NextResponse.json({
      description,
      partExtraction: partInfo,
      selectedCenter: {
        name: selectedCenter.name,
        distance: `${selectedCenter.distance}km`,
        certification: selectedCenter.certification,
        estimatedETA: `${selectedCenter.eta}h`,
        capacity: `${selectedCenter.capacity}%`,
      },
      partName: partInfo.bestGuess,
      nearestCenter: selectedCenter.name,
      estimatedETA: selectedCenter.eta,
      certification: selectedCenter.certification,
      recommendation,
      status: 'READY_FOR_ORDER',
      timestamp: new Date().toISOString(),
    })

  } catch (err) {
    console.error('Emergency triage error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
