import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import { physicalParts, physicalSites, blueprints, printCenters } from '@/lib/static-data'

// ─── Auto-Print Evaluation ───────────────────────────────────────────────────
//
// Evaluates the current physical inventory against all enabled auto-print rules.
// Returns suggested print jobs (stock at/below threshold) + their status:
//   • auto → already triggered (or will auto-open) per rule config
//   • approval → needs human approval before the print job opens
//
// Grounded in David Bursey, Cenovus #75: "when inventory drops, the printer
// kicks in and produces more."

interface SuggestedPrintJob {
  ruleId: string
  partId: string
  partName: string
  partNumber: string
  siteName: string
  currentStock: number
  threshold: number
  targetQuantity: number
  facilityName: string
  facilityId: string
  material: string
  blueprintId: string | null
  autoTrigger: boolean
  status: 'auto_triggered' | 'approval_required' | 'info_only'
  severity: 'critical' | 'warning' | 'info'
  estimatedPrintHours: number
  estimatedCost: number
}

export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    // Re-seed the rule baseline here (same logic as the rules route) so this
    // evaluation route is self-contained. In production both would share a
    // Prisma model; for the demo, evaluation uses the seeded baseline rules.
    const printable = physicalParts.filter((p) => p.blueprintId)
    const rules: {
      id: string; partId: string; threshold: number; targetQuantity: number;
      targetFacilityId: string; autoTrigger: boolean; approvalRequired: boolean; enabled: boolean
    }[] = printable.slice(0, 5).map((part, i) => {
      const bp = blueprints.find((b) => b.id === part.blueprintId)
      const facility = printCenters.find(
        (c) => c.status !== 'offline' && bp && c.materials.includes(bp.material),
      ) ?? printCenters[0]
      return {
        id: `apr-${i + 1}`,
        partId: part.id,
        threshold: part.minStock,
        targetQuantity: Math.max(part.minStock, 3),
        targetFacilityId: facility?.id ?? 'pc-1',
        autoTrigger: i < 2,
        approvalRequired: i >= 2,
        enabled: true,
      }
    })

    const suggestions: SuggestedPrintJob[] = []
    for (const rule of rules) {
      if (!rule.enabled) continue
      const part = physicalParts.find((p) => p.id === rule.partId)
      if (!part) continue
      // Trigger when stock <= threshold.
      if (part.quantity > rule.threshold) continue

      const bp = blueprints.find((b) => b.id === part.blueprintId)
      const site = physicalSites.find((s) => s.id === part.siteId)
      const facility = printCenters.find((c) => c.id === rule.targetFacilityId)

      const severity: SuggestedPrintJob['severity'] =
        part.quantity === 0 ? 'critical' : part.quantity <= rule.threshold * 0.5 ? 'warning' : 'info'

      const status: SuggestedPrintJob['status'] = rule.autoTrigger
        ? 'auto_triggered'
        : rule.approvalRequired
          ? 'approval_required'
          : 'info_only'

      // Estimate print time + cost (heuristic from blueprint print count + material).
      const estimatedPrintHours = Math.max(4, Math.round((part.unitCost / 1000) * 3 + 6))
      const estimatedCost = Math.round(part.unitCost * 0.6 * rule.targetQuantity)

      suggestions.push({
        ruleId: rule.id,
        partId: part.id,
        partName: part.name,
        partNumber: part.partNumber,
        siteName: site?.name ?? '—',
        currentStock: part.quantity,
        threshold: rule.threshold,
        targetQuantity: rule.targetQuantity,
        facilityName: facility?.name ?? '—',
        facilityId: facility?.id ?? 'pc-1',
        material: bp?.material ?? 'Unknown',
        blueprintId: part.blueprintId,
        autoTrigger: rule.autoTrigger,
        status,
        severity,
        estimatedPrintHours,
        estimatedCost,
      })
    }

    // Sort by severity (critical first), then by stock ascending.
    const severityRank = { critical: 0, warning: 1, info: 2 }
    suggestions.sort((a, b) => {
      if (severityRank[a.severity] !== severityRank[b.severity]) {
        return severityRank[a.severity] - severityRank[b.severity]
      }
      return a.currentStock - b.currentStock
    })

    const summary = {
      totalSuggestions: suggestions.length,
      critical: suggestions.filter((s) => s.severity === 'critical').length,
      warning: suggestions.filter((s) => s.severity === 'warning').length,
      autoTriggered: suggestions.filter((s) => s.status === 'auto_triggered').length,
      approvalRequired: suggestions.filter((s) => s.status === 'approval_required').length,
      totalEstimatedCost: suggestions.reduce((s, j) => s + j.estimatedCost, 0),
    }

    return NextResponse.json({ suggestions, summary })
  } catch (error) {
    console.error('Auto-print evaluate error:', error)
    return NextResponse.json({ error: 'Failed to evaluate auto-print rules' }, { status: 500 })
  }
}

// POST — "approve" a suggested job (simulated: would create an Order in production)
export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAuth()
    if (error) return error
    const { ruleId, partId, targetQuantity, facilityId } = await req.json()
    const part = physicalParts.find((p) => p.id === partId)
    const facility = printCenters.find((c) => c.id === facilityId)
    if (!part) return NextResponse.json({ error: 'Part not found' }, { status: 404 })

    // Simulate creating a print job (in production: db.order.create).
    const jobId = `JOB-${Date.now().toString().slice(-6)}`
    return NextResponse.json({
      success: true,
      jobId,
      message: `Print job ${jobId} created for ${targetQuantity}× ${part.name} at ${facility?.name ?? 'facility'}.`,
      ruleId,
    })
  } catch (error) {
    console.error('Auto-print approve error:', error)
    return NextResponse.json({ error: 'Failed to create print job' }, { status: 500 })
  }
}
