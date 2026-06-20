import { NextRequest, NextResponse } from 'next/server'
import { askAI } from '@/lib/ai'

/**
 * POST /api/audit/generate-report
 * Generate a compliance report from audit logs
 * Request: { dateRange, standard, format }
 */
export async function POST(req: NextRequest) {
  try {
    const {
      dateRangeDays = 90,
      standard = 'DNV',
      auditEvents = [],
    } = await req.json()

    if (!standard) {
      return NextResponse.json({ error: 'Missing standard parameter (DNV, ABS, Lloyd\'s, ISO9001)' }, { status: 400 })
    }

    const eventSummary = auditEvents.slice(-50).map((e: any) => {
      const date = new Date(e.timestamp).toLocaleDateString()
      return `${date} - ${e.actionType}: ${e.description ?? 'No details'}`
    }).join('\n')

    const totalOrders = auditEvents.filter((e: any) => e.actionType === 'ORDER_CREATED').length
    const totalApprovals = auditEvents.filter((e: any) => e.actionType === 'OEM_APPROVED' || e.actionType === 'CERT_APPROVED').length
    const tamperedEvents = auditEvents.filter((e: any) => e.chainBroken).length

    const systemPrompt =
      'You are a compliance expert for regulated manufacturing in offshore oil & gas.'
    const userMessage = `Generate a compliance audit summary for submission to regulators. Be concise, professional, and factual.

**AUDIT PERIOD:** Last ${dateRangeDays} days
**REGULATORY STANDARD:** ${standard}
**TOTAL AUDIT EVENTS:** ${auditEvents.length}

**KEY METRICS:**
- Total Orders Executed: ${totalOrders}
- Total Approvals (OEM + Cert): ${totalApprovals}
- Tampered Events (Chain Broken): ${tamperedEvents}
- Compliance Rate: ${totalApprovals > 0 ? Math.round((totalApprovals / totalOrders) * 100) : 0}%

**RECENT EVENTS:**
${eventSummary}

**COMPLIANCE SUMMARY FORMAT:**
Generate an executive summary (3–4 sentences) covering:
1. Overall compliance status (COMPLIANT / AT RISK / CRITICAL)
2. Key metrics and trends
3. Any anomalies or concerns
4. Recommendation for next steps (continue monitoring / urgent review required / approved)

Output ONLY plain text, no markdown or formatting.`

    const summary = await askAI(systemPrompt, userMessage)

    const complianceStatus = tamperedEvents > 0
      ? 'AT RISK'
      : totalApprovals === totalOrders
      ? 'COMPLIANT'
      : 'PARTIAL'

    return NextResponse.json({
      standard,
      dateRangeDays,
      generatedAt: new Date().toISOString(),
      complianceStatus,
      metrics: {
        totalOrders,
        totalApprovals,
        tamperedEvents,
        complianceRate: totalOrders > 0 ? Math.round((totalApprovals / totalOrders) * 100) : 100,
      },
      summary: summary.trim(),
      reportText: `
COMPLIANCE AUDIT REPORT
Standard: ${standard}
Period: Last ${dateRangeDays} days
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY:
${summary.trim()}

COMPLIANCE METRICS:
- Total Orders Executed: ${totalOrders}
- Fully Approved Orders: ${totalApprovals}
- Unapproved Orders: ${totalOrders - totalApprovals}
- Compliance Rate: ${totalOrders > 0 ? Math.round((totalApprovals / totalOrders) * 100) : 100}%
- Chain Integrity Events: ${tamperedEvents}

STATUS: ${complianceStatus}

AUDIT EVENTS (Last 50):
${eventSummary}
`.trim(),
    })

  } catch (err) {
    console.error('Audit report error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
