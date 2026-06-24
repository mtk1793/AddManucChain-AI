import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/require-auth'
import {
  physicalParts,
  physicalSites,
  blueprints,
  printCenters,
} from '@/lib/static-data'

// ─── Smart Replenishment & Auto-Triggered Printing ───────────────────────────
//
// Grounded in customer interviews (see worklog RESEARCH-1):
//   • David Bursey, Cenovus (#75): "If we could print components offshore in a
//     way of just being an automatic process, and when inventory drops, the
//     printer kicks in and produces more... that would be fantastic."
//   • JP Hudon, Glencore (#69): "Ensure work-order planning identifies required
//     parts in advance, pre-positions them at job location, and has fallback
//     systems if primary parts unavailable."
//
// Rules live in memory (demo). In production these would be a Prisma model.
// Auto-print rules define: which part, what threshold, which facility, whether
// to auto-trigger or require approval.

export interface AutoPrintRule {
  id: string
  partId: string
  partName: string
  partNumber: string
  siteName: string
  threshold: number // trigger when stock <= threshold
  targetQuantity: number // how many to print when triggered
  targetFacilityId: string
  targetFacilityName: string
  autoTrigger: boolean // true = auto-open job; false = suggest only
  approvalRequired: boolean
  enabled: boolean
  createdAt: string
  lastTriggered: string | null
  triggerCount: number
}

// Seed a few rules based on the physical parts that have blueprints (printable).
function seedRules(): AutoPrintRule[] {
  const printable = physicalParts.filter((p) => p.blueprintId)
  const rules: AutoPrintRule[] = []
  printable.slice(0, 5).forEach((part, i) => {
    const bp = blueprints.find((b) => b.id === part.blueprintId)
    const site = physicalSites.find((s) => s.id === part.siteId)
    // Pick a facility that can print the blueprint's material.
    const facility = printCenters.find(
      (c) => c.status !== 'offline' && bp && c.materials.includes(bp.material),
    ) ?? printCenters[0]
    rules.push({
      id: `apr-${i + 1}`,
      partId: part.id,
      partName: part.name,
      partNumber: part.partNumber,
      siteName: site?.name ?? '—',
      threshold: part.minStock,
      targetQuantity: Math.max(part.minStock, 3),
      targetFacilityId: facility?.id ?? 'pc-1',
      targetFacilityName: facility?.name ?? 'Atlantic XL',
      autoTrigger: i < 2, // first two rules auto-trigger
      approvalRequired: i >= 2,
      enabled: true,
      createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      lastTriggered: i === 0 ? new Date(Date.now() - 3 * 86400000).toISOString() : null,
      triggerCount: i === 0 ? 2 : 0,
    })
  })
  return rules
}

// In-memory store (resets on server restart — acceptable for demo).
let rulesStore: AutoPrintRule[] = seedRules()

export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error
    return NextResponse.json({ rules: rulesStore })
  } catch (error) {
    console.error('Auto-print rules GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAuth()
    if (error) return error
    const body = await req.json()
    const part = physicalParts.find((p) => p.id === body.partId)
    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }
    const facility = printCenters.find((c) => c.id === body.targetFacilityId)
    const site = physicalSites.find((s) => s.id === part.siteId)
    const newRule: AutoPrintRule = {
      id: `apr-${Date.now()}`,
      partId: part.id,
      partName: part.name,
      partNumber: part.partNumber,
      siteName: site?.name ?? '—',
      threshold: body.threshold ?? part.minStock,
      targetQuantity: body.targetQuantity ?? Math.max(part.minStock, 3),
      targetFacilityId: facility?.id ?? 'pc-1',
      targetFacilityName: facility?.name ?? 'Atlantic XL',
      autoTrigger: body.autoTrigger ?? false,
      approvalRequired: body.approvalRequired ?? true,
      enabled: body.enabled ?? true,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      triggerCount: 0,
    }
    rulesStore = [newRule, ...rulesStore]
    return NextResponse.json({ rule: newRule, rules: rulesStore })
  } catch (error) {
    console.error('Auto-print rules POST error:', error)
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { error } = await requireAuth()
    if (error) return error
    const { ruleId, ...updates } = await req.json()
    const idx = rulesStore.findIndex((r) => r.id === ruleId)
    if (idx < 0) return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    rulesStore[idx] = { ...rulesStore[idx], ...updates }
    return NextResponse.json({ rule: rulesStore[idx], rules: rulesStore })
  } catch (error) {
    console.error('Auto-print rules PUT error:', error)
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { error } = await requireAuth()
    if (error) return error
    const { searchParams } = new URL(req.url)
    const ruleId = searchParams.get('ruleId')
    if (!ruleId) return NextResponse.json({ error: 'ruleId required' }, { status: 400 })
    rulesStore = rulesStore.filter((r) => r.id !== ruleId)
    return NextResponse.json({ rules: rulesStore })
  } catch (error) {
    console.error('Auto-print rules DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 })
  }
}
