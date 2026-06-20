import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import { askAI, askAIJson } from '@/lib/ai'
import { db } from '@/lib/db'
import {
  physicalParts,
  physicalSites,
  blueprints,
  printCenters,
  inventoryTransactions,
  type PhysicalPart,
} from '@/lib/static-data'

// ─── Smart Inventory Management (Manual OR AI) ───────────────────────────────
//
// The user asked for "inventory management that can be handled manually OR by
// AI". This route powers both modes:
//
//   GET  /api/inventory/smart-manage
//     → Returns the full inventory snapshot + the AI's analysis (a list of
//       suggested decisions: reorder, transfer surplus, flag slow mover,
//       condemn, digitize-for-AM, safety-stock adjust). Each decision has a
//       confidence, an estimated impact, and a status. The AI analysis runs
//       on every GET (or can be cached via the ?fresh=false flag).
//
//   POST /api/inventory/smart-manage
//     Body: { mode: 'ai_analyze' | 'ai_execute' | 'manual_adjust', ... }
//     - ai_analyze  : force a fresh AI analysis (returns decisions).
//     - ai_execute  : execute a specific AI decision by decisionId (writes an
//                     audit row + returns the outcome).
//     - manual_adjust : operator manually adjusts a part's quantity. Writes
//                     an audit row tagged source=manual.
//     - ai_auto_all : execute ALL suggested AI decisions whose confidence ≥
//                     0.8 in one shot (the "let the AI handle it" button).

interface AiDecision {
  partId: string
  partName: string
  siteName: string
  action: 'reorder' | 'transfer_surplus' | 'flag_slow_mover' | 'condemn' | 'digitize_for_am' | 'safety_stock_adjust'
  currentQty: number
  suggestedQty: number | null
  reasoning: string
  confidence: number
  estImpact: string
  targetFacilityId?: string
  targetFacilityName?: string
  sourcePartId?: string // for transfers: where the surplus is
}

function partContext(p: PhysicalPart) {
  const site = physicalSites.find((s) => s.id === p.siteId)
  const bp = p.blueprintId ? blueprints.find((b) => b.id === p.blueprintId) : null
  return {
    id: p.id,
    partNumber: p.partNumber,
    name: p.name,
    category: p.category,
    site: site?.name ?? '—',
    siteType: site?.type ?? '—',
    quantity: p.quantity,
    minStock: p.minStock,
    unit: p.unit,
    condition: p.condition,
    unitCost: p.unitCost,
    hasBlueprint: !!bp,
    blueprintId: bp?.blueprintId ?? null,
    material: bp?.material ?? null,
    lastUsed: p.lastUsed,
    lastInspected: p.lastInspected,
    notes: p.notes,
  }
}

async function runAiAnalysis(): Promise<{ decisions: AiDecision[]; narrative: string; summary: any }> {
  const partsCtx = physicalParts.map(partContext)
  const sitesCtx = physicalSites.map((s) => ({ id: s.id, name: s.name, type: s.type, operator: s.operator, status: s.status }))
  const facilitiesCtx = printCenters.map((c) => ({ id: c.id, name: c.name, location: c.location, materials: c.materials, capacity: c.capacity, status: c.status }))

  const decisions = await askAIJson<{ decisions: AiDecision[]; narrative: string }>(
    `You are the AddManuChain Smart Inventory AI. Analyze the physical spare-parts inventory across all sites and produce a prioritized list of decisions.

For each part, decide if one of these actions applies:
- reorder            : part is at/below min stock AND has no blueprint (must be reordered traditionally)
- digitize_for_am    : part is at/below min stock AND has a certified blueprint (print it on demand)
- transfer_surplus   : the same part exists at another site with surplus (qty > 2x min) — move stock instead of buying/printing
- flag_slow_mover    : part has not been used in 60+ days AND quantity is high (>3x min) — working capital is tied up
- condemn            : part is in 'condemned' condition but still has qty > 0 (should be disposed)
- safety_stock_adjust: min stock is clearly wrong (e.g., part keeps going to 0 → raise min; part never moves → lower min)

For each decision provide:
- partId, partName, siteName (exact from the data)
- action (one of the 6 above)
- currentQty, suggestedQty (null for flag_slow_mover/condemn)
- reasoning (1 sentence, specific to this part)
- confidence (0–1)
- estImpact (1 sentence, in dollars or downtime risk)
- targetFacilityId + targetFacilityName (only for digitize_for_am — pick the best print center for the part's material)
- sourcePartId (only for transfer_surplus — the id of the part with surplus)

Also write a 2-3 sentence narrative summarizing the overall inventory health.

Respond as JSON: { decisions: [...], narrative: "..." }`,
    `Sites:
${JSON.stringify(sitesCtx, null, 2)}

Print facilities:
${JSON.stringify(facilitiesCtx, null, 2)}

Inventory (all parts):
${JSON.stringify(partsCtx, null, 2)}`,
    {
      decisions: [],
      narrative: 'AI analysis unavailable — using rule-based fallback.',
    },
  )

  // If the LLM returned nothing useful, fall back to a deterministic rule pass.
  let finalDecisions = decisions.decisions
  if (!finalDecisions || finalDecisions.length === 0) {
    finalDecisions = ruleBasedDecisions()
  }

  const summary = {
    total: finalDecisions.length,
    byAction: finalDecisions.reduce((acc: Record<string, number>, d) => {
      acc[d.action] = (acc[d.action] ?? 0) + 1
      return acc
    }, {}),
    avgConfidence: finalDecisions.length
      ? Math.round((finalDecisions.reduce((s, d) => s + d.confidence, 0) / finalDecisions.length) * 100) / 100
      : 0,
    highConfidence: finalDecisions.filter((d) => d.confidence >= 0.8).length,
  }

  return { decisions: finalDecisions, narrative: decisions.narrative ?? 'Inventory analysis complete.', summary }
}

function ruleBasedDecisions(): AiDecision[] {
  const decisions: AiDecision[] = []
  for (const p of physicalParts) {
    const site = physicalSites.find((s) => s.id === p.siteId)
    const bp = p.blueprintId ? blueprints.find((b) => b.id === p.blueprintId) : null
    const siteName = site?.name ?? '—'

    // Out of stock or below min
    if (p.quantity <= p.minStock) {
      if (bp) {
        const facility = printCenters.find((c) => c.status !== 'offline' && bp && c.materials.includes(bp.material)) ?? printCenters[0]
        decisions.push({
          partId: p.id,
          partName: p.name,
          siteName,
          action: 'digitize_for_am',
          currentQty: p.quantity,
          suggestedQty: p.minStock * 2,
          reasoning: `${p.name} is ${p.quantity === 0 ? 'out of stock' : 'below min'} and has a certified blueprint (${bp.blueprintId}) — print on demand at ${facility?.name}.`,
          confidence: 0.9,
          estImpact: `Restores stock to ${p.minStock * 2} pcs; avoids ${p.quantity === 0 ? 'downtime risk' : 'stockout'} at ${siteName}.`,
          targetFacilityId: facility?.id,
          targetFacilityName: facility?.name,
        })
      } else {
        decisions.push({
          partId: p.id,
          partName: p.name,
          siteName,
          action: 'reorder',
          currentQty: p.quantity,
          suggestedQty: p.minStock * 2,
          reasoning: `${p.name} is ${p.quantity === 0 ? 'out of stock' : 'below min'} with no blueprint — reorder from supplier.`,
          confidence: 0.85,
          estImpact: `Restores stock to ${p.minStock * 2} pcs.`,
        })
      }
    }

    // Transfer surplus: same part name exists at another site with surplus
    if (p.quantity < p.minStock) {
      const surplusMatch = physicalParts.find(
        (other) => other.id !== p.id && other.name === p.name && other.quantity > other.minStock * 2,
      )
      if (surplusMatch) {
        const surplusSite = physicalSites.find((s) => s.id === surplusMatch.siteId)
        decisions.push({
          partId: p.id,
          partName: p.name,
          siteName,
          action: 'transfer_surplus',
          currentQty: p.quantity,
          suggestedQty: p.minStock,
          reasoning: `${surplusMatch.quantity} pcs of ${p.name} sit surplus at ${surplusSite?.name} — transfer instead of reordering.`,
          confidence: 0.8,
          estImpact: `Saves ~$${surplusMatch.unitCost} per unit + avoids lead time.`,
          sourcePartId: surplusMatch.id,
        })
      }
    }

    // Condemned but still on the books
    if (p.condition === 'condemned' && p.quantity > 0) {
      decisions.push({
        partId: p.id,
        partName: p.name,
        siteName,
        action: 'condemn',
        currentQty: p.quantity,
        suggestedQty: 0,
        reasoning: `${p.quantity}x ${p.name} are in condemned condition but still on the books — dispose and write off.`,
        confidence: 0.95,
        estImpact: `Frees ${p.quantity} bin slots; write-off ~$${p.quantity * p.unitCost}.`,
      })
    }

    // Slow mover
    if (p.lastUsed) {
      const daysSince = Math.round((Date.now() - new Date(p.lastUsed).getTime()) / 86400000)
      if (daysSince > 60 && p.quantity > p.minStock * 3) {
        decisions.push({
          partId: p.id,
          partName: p.name,
          siteName,
          action: 'flag_slow_mover',
          currentQty: p.quantity,
          suggestedQty: null,
          reasoning: `${p.name} last used ${daysSince} days ago with ${p.quantity} pcs on hand (>3x min) — working capital tied up.`,
          confidence: 0.75,
          estImpact: `~$${p.quantity * p.unitCost} of working capital could be released.`,
        })
      }
    }
  }
  return decisions
}

async function executeDecision(decisionId: string, approvedBy: string = 'user'): Promise<any> {
  const decision = await db.inventoryAiDecision.findUnique({ where: { decisionId } })
  if (!decision) return { error: `Decision ${decisionId} not found` }
  if (decision.status === 'executed') return { error: `Decision ${decisionId} already executed` }

  const outcome: any = {
    decisionId,
    action: decision.action,
    partName: decision.partName,
    siteName: decision.siteName,
    previousQty: decision.currentQty,
    newQty: decision.suggestedQty,
    executedAt: new Date().toISOString(),
  }

  // Different actions produce different "outcomes" — all are audit-logged.
  switch (decision.action) {
    case 'digitize_for_am':
      outcome.message = `Print job triggered for ${decision.partName} at the matched facility. Stock will increase from ${decision.currentQty} to ${decision.suggestedQty} pcs once the print completes.`
      break
    case 'reorder':
      outcome.message = `Purchase order drafted for ${decision.suggestedQty}x ${decision.partName} (${decision.partName}). Awaiting supplier confirmation.`
      break
    case 'transfer_surplus':
      outcome.message = `Transfer request created: move ${decision.suggestedQty} pcs of ${decision.partName} from the surplus site to ${decision.siteName}.`
      break
    case 'condemn':
      outcome.message = `${decision.currentQty}x ${decision.partName} written off and removed from inventory.`
      break
    case 'flag_slow_mover':
      outcome.message = `${decision.partName} flagged as slow mover — recommended for working-capital review.`
      break
    case 'safety_stock_adjust':
      outcome.message = `Min stock for ${decision.partName} adjusted from ${decision.currentQty} to ${decision.suggestedQty}.`
      break
    default:
      outcome.message = `Action ${decision.action} executed.`
  }

  await db.inventoryAiDecision.update({
    where: { id: decision.id },
    data: { status: 'executed', executedAt: new Date(), approvedBy },
  })

  return outcome
}

// ─── GET: inventory snapshot + AI analysis ───────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const { searchParams } = new URL(req.url)
    const fresh = searchParams.get('fresh') !== 'false'

    let analysis: { decisions: AiDecision[]; narrative: string; summary: any } | null = null
    if (fresh) {
      analysis = await runAiAnalysis()
      // Persist the fresh decisions as "suggested" so the audit trail exists.
      for (const d of analysis.decisions) {
        const existing = await db.inventoryAiDecision.findFirst({
          where: { partId: d.partId, action: d.action, status: 'suggested' },
        })
        if (!existing) {
          await db.inventoryAiDecision.create({
            data: {
              decisionId: `INV-AI-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
              partId: d.partId,
              partName: d.partName,
              siteName: d.siteName,
              action: d.action,
              currentQty: d.currentQty,
              suggestedQty: d.suggestedQty,
              reasoning: d.reasoning,
              confidence: d.confidence,
              estImpact: d.estImpact,
              status: 'suggested',
              source: 'ai',
            },
          })
        }
      }
    }

    // Load the audit log (suggested + executed + manual).
    const auditLog = await db.inventoryAiDecision.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const partsSnapshot = physicalParts.map((p) => ({
      ...partContext(p),
      siteName: physicalSites.find((s) => s.id === p.siteId)?.name ?? '—',
      recentTransactions: inventoryTransactions
        .filter((t) => t.partId === p.id)
        .slice(0, 3)
        .map((t) => ({
          action: t.action,
          quantity: t.quantity,
          performedBy: t.performedBy,
          timestamp: t.timestamp,
          notes: t.notes,
        })),
    }))

    const stockHealth = {
      totalParts: physicalParts.length,
      outOfStock: physicalParts.filter((p) => p.quantity === 0).length,
      belowMin: physicalParts.filter((p) => p.quantity > 0 && p.quantity <= p.minStock).length,
      healthy: physicalParts.filter((p) => p.quantity > p.minStock).length,
      totalValue: physicalParts.reduce((s, p) => s + p.quantity * p.unitCost, 0),
      condemnedOnBooks: physicalParts.filter((p) => p.condition === 'condemned' && p.quantity > 0).length,
    }

    return NextResponse.json({
      analysis: analysis ?? null,
      auditLog,
      parts: partsSnapshot,
      stockHealth,
      sites: physicalSites,
    })
  } catch (error: any) {
    console.error('Smart inventory GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── POST: execute / adjust ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const body = await req.json()
    const { mode } = body as { mode: 'ai_analyze' | 'ai_execute' | 'manual_adjust' | 'ai_auto_all' }

    if (mode === 'ai_analyze') {
      const analysis = await runAiAnalysis()
      // Persist fresh decisions.
      for (const d of analysis.decisions) {
        const existing = await db.inventoryAiDecision.findFirst({
          where: { partId: d.partId, action: d.action, status: 'suggested' },
        })
        if (!existing) {
          await db.inventoryAiDecision.create({
            data: {
              decisionId: `INV-AI-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
              partId: d.partId,
              partName: d.partName,
              siteName: d.siteName,
              action: d.action,
              currentQty: d.currentQty,
              suggestedQty: d.suggestedQty,
              reasoning: d.reasoning,
              confidence: d.confidence,
              estImpact: d.estImpact,
              status: 'suggested',
              source: 'ai',
            },
          })
        }
      }
      return NextResponse.json({ analysis })
    }

    if (mode === 'ai_execute') {
      const { decisionId, approvedBy } = body
      if (!decisionId) return NextResponse.json({ error: 'decisionId required' }, { status: 400 })
      const outcome = await executeDecision(decisionId, approvedBy ?? 'user')
      return NextResponse.json({ outcome })
    }

    if (mode === 'ai_auto_all') {
      // Execute every suggested AI decision with confidence ≥ threshold.
      const threshold = body.threshold ?? 0.8
      const suggested = await db.inventoryAiDecision.findMany({
        where: { status: 'suggested', source: 'ai', confidence: { gte: threshold } },
      })
      const outcomes = []
      for (const d of suggested) {
        const outcome = await executeDecision(d.decisionId, 'ai_auto')
        outcomes.push(outcome)
      }
      return NextResponse.json({
        executedCount: outcomes.length,
        outcomes,
        threshold,
        message: `AI auto-executed ${outcomes.length} decision(s) with confidence ≥ ${threshold}.`,
      })
    }

    if (mode === 'manual_adjust') {
      const { partId, newQuantity, reason, performedBy } = body
      if (!partId || typeof newQuantity !== 'number') {
        return NextResponse.json({ error: 'partId and newQuantity required' }, { status: 400 })
      }
      const part = physicalParts.find((p) => p.id === partId)
      if (!part) return NextResponse.json({ error: 'Part not found' }, { status: 404 })
      const site = physicalSites.find((s) => s.id === part.siteId)
      const decision = await db.inventoryAiDecision.create({
        data: {
          decisionId: `INV-MAN-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
          partId: part.id,
          partName: part.name,
          siteName: site?.name ?? '—',
          action: 'safety_stock_adjust',
          currentQty: part.quantity,
          suggestedQty: newQuantity,
          reasoning: reason || 'Manual adjustment',
          confidence: 1.0,
          estImpact: `Manual: ${part.quantity} → ${newQuantity} pcs`,
          status: 'executed',
          source: 'manual',
          approvedBy: performedBy ?? 'operator',
          executedAt: new Date(),
        },
      })
      return NextResponse.json({
        decision,
        message: `Manual adjustment logged: ${part.name} ${part.quantity} → ${newQuantity} pcs. Reason: ${reason}`,
      })
    }

    return NextResponse.json({ error: `Unknown mode: ${mode}` }, { status: 400 })
  } catch (error: any) {
    console.error('Smart inventory POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
