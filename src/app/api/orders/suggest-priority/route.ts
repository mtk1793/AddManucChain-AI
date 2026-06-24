import { NextRequest, NextResponse } from 'next/server'
import { askAIJson } from '@/lib/ai'

/**
 * POST /api/orders/suggest-priority
 * AI recommends order priority based on operational context
 * Request: { partName, vesselLocation, partCriticality, lastReplacementDaysAgo, currentInventory }
 */
export async function POST(req: NextRequest) {
  try {
    const {
      partName,
      vesselLocation,
      partCriticality = 'MEDIUM',
      lastReplacementDaysAgo = 365,
      currentInventory = 0,
      operationalStatus = 'ACTIVE',
    } = await req.json()

    if (!partName) {
      return NextResponse.json({ error: 'Missing required field: partName' }, { status: 400 })
    }

    const systemPrompt =
      'You are an operational priority expert for offshore oil & gas manufacturing.'
    const userMessage = `Based on operational context, recommend a priority level for an order. Respond with ONLY a JSON object, no markdown.

**ORDER DETAILS:**
- Part: ${partName}
- Vessel Location: ${vesselLocation}
- Part Criticality: ${partCriticality} (LOW / MEDIUM / HIGH / CRITICAL)
- Days Since Last Replacement: ${lastReplacementDaysAgo}
- Current Inventory on Hand: ${currentInventory} units
- Operational Status: ${operationalStatus} (ACTIVE / PLANNED_MAINTENANCE / STANDBY)

**PRIORITY ANALYSIS:**
1. If criticality is CRITICAL AND last replacement > 90 days: Likely CRITICAL
2. If criticality is CRITICAL AND active operations: Consider CRITICAL
3. If inventory at 0 AND criticality HIGH: Recommend URGENT
4. If operational status is ACTIVE AND criticality HIGH: Recommend HIGH or URGENT
5. Otherwise: Recommend based on lead time buffer

**RESPONSE FORMAT:**
{
  "recommendedPriority": "LOW" | "NORMAL" | "HIGH" | "CRITICAL",
  "reasoning": "One sentence explanation of why this priority level",
  "confidence": number (0-100),
  "riskLevel": "SAFE" | "CAUTION" | "ALERT"
}

Output ONLY valid JSON.`

    const recommendation = await askAIJson<{
      recommendedPriority: string
      reasoning: string
      confidence: number
      riskLevel: string
    }>(
      systemPrompt,
      userMessage,
      {
        recommendedPriority: 'NORMAL',
        reasoning: 'Default recommendation due to parse error',
        confidence: 20,
        riskLevel: 'CAUTION',
      },
    )

    return NextResponse.json({
      partName,
      recommendation,
      timestamp: new Date().toISOString(),
    })

  } catch (err) {
    console.error('Priority suggestion error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
