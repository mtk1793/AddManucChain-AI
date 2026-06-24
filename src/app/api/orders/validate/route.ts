import { NextRequest, NextResponse } from 'next/server'
import { askAIJson } from '@/lib/ai'

/**
 * POST /api/orders/validate
 * Validate a new order for anomalies before submission
 * Request: { partName, quantity, priority, printCenterId, operatorHistory, inventoryContext }
 */
export async function POST(req: NextRequest) {
  try {
    const {
      partName,
      quantity,
      priority,
      printCenterId,
      operatorHistory = [],
      inventoryContext = {},
    } = await req.json()

    if (!partName || !quantity) {
      return NextResponse.json({ error: 'Missing required fields: partName, quantity' }, { status: 400 })
    }

    const recentOrders = operatorHistory.slice(-5).map((o: any) => `${o.partName} (qty ${o.quantity})`)
    const avgHistoricalQty = operatorHistory.length > 0
      ? Math.round(operatorHistory.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0) / operatorHistory.length)
      : 0

    const systemPrompt =
      'You are an order validation expert for a precision manufacturing platform.'
    const userMessage = `Analyze the following order for anomalies. Respond with ONLY a JSON object, no markdown.

**ORDER DETAILS:**
- Part: ${partName}
- Quantity Requested: ${quantity}
- Priority: ${priority}
- Print Center: ${printCenterId}

**OPERATOR CONTEXT:**
- Recent Orders: ${recentOrders.length > 0 ? recentOrders.join(', ') : 'None'}
- Average Historical Qty: ${avgHistoricalQty}
- Total Orders This Month: ${operatorHistory.length}

**INVENTORY CONTEXT:**
- Current Stock: ${inventoryContext.currentStock ?? 'Unknown'}
- Lead Time: ${inventoryContext.leadTimeDays ?? 'Unknown'} days
- Stock Status: ${inventoryContext.status ?? 'Unknown'}

**ANOMALY CHECKS:**
1. Quantity far above historical average (> 3x)?
2. Part ordered recently (duplicate within 3 days)?
3. Print center has insufficient capacity (< 10% available)?
4. Quantity seems unusually high relative to operational needs?

**RESPONSE FORMAT:**
{
  "hasAnomalies": boolean,
  "anomalies": [
    {
      "type": "HIGH_QUANTITY" | "DUPLICATE" | "CAPACITY_CONCERN" | "OTHER",
      "severity": "WARNING" | "CAUTION" | "INFO",
      "message": "Human readable explanation"
    }
  ],
  "recommendation": "Proceed" | "Review" | "Escalate",
  "confidence": number (0-100)
}

Output ONLY valid JSON.`

    const validation = await askAIJson<{
      hasAnomalies: boolean
      anomalies: Array<{
        type: string
        severity: string
        message: string
      }>
      recommendation: string
      confidence: number
    }>(
      systemPrompt,
      userMessage,
      {
        hasAnomalies: false,
        anomalies: [],
        recommendation: 'Proceed',
        confidence: 50,
      },
    )

    return NextResponse.json({
      partName,
      quantity,
      validation,
      timestamp: new Date().toISOString(),
    })

  } catch (err) {
    console.error('Order validation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
