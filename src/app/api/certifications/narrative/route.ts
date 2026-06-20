import { NextRequest, NextResponse } from 'next/server'
import { askAI } from '@/lib/ai'

/**
 * POST /api/certifications/narrative
 * Generate an AI narrative explaining cert expiry urgency
 * Request: { certId, certName, issuer, expiryDate, partsCount, activeOrders }
 */
export async function POST(req: NextRequest) {
  try {
    const { certId, certName, issuer, expiryDate, partsCount = 0, activeOrders = 0 } = await req.json()

    if (!certId || !certName || !expiryDate) {
      return NextResponse.json({ error: 'Missing required fields: certId, certName, expiryDate' }, { status: 400 })
    }

    // Calculate days until expiry
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const systemPrompt =
      'You are an expert compliance advisor for an advanced manufacturing platform serving offshore oil & gas.'
    const userMessage = `Generate a concise 1-2 sentence urgency narrative for a certification about to expire. Be direct and action-oriented.

**Certification Details:**
- Name: ${certName}
- Issuer: ${issuer}
- Expiry Date: ${expiryDate}
- Days Until Expiry: ${daysUntilExpiry}
- Parts Covered: ${partsCount}
- Active Orders Dependent: ${activeOrders}

**Rules:**
1. If < 7 days: Use "URGENT" language
2. If 7-14 days: Use "CRITICAL" language
3. If 14-30 days: Use "ACTION REQUIRED" language
4. If > 30 days: Use "UPCOMING" language
5. Include the main consequence (what breaks if renewal doesn't happen)
6. Max 2 sentences. No markdown.

Output ONLY the narrative text, nothing else.`

    const narrative = await askAI(systemPrompt, userMessage)

    return NextResponse.json({
      certId,
      narrative: narrative.trim(),
      daysUntilExpiry,
      urgencyLevel: daysUntilExpiry < 7 ? 'URGENT' : daysUntilExpiry < 14 ? 'CRITICAL' : daysUntilExpiry < 30 ? 'ACTION' : 'UPCOMING',
    })

  } catch (err) {
    console.error('Cert narrative error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
