import { NextRequest, NextResponse } from 'next/server'
import { askAIJson } from '@/lib/ai'
import { physicalParts, physicalSites, blueprints, printCenters } from '@/lib/static-data'

// ─── ROI / Business-Case Calculator ──────────────────────────────────────────
//
// Grounded in customer interviews (see worklog RESEARCH-1):
//   • Mark Kirby (#9): "The biggest barrier is the business case." Proposed a
//     cross-budget business case calculator.
//   • Douglas Garcia, Equinor (#44): "My cost is 1-2% of total capex. If you
//     don't have it, you can lose 98% of production."
//   • David Bursey, Cenovus (#75): "Cost of one day offshore downtime:
//     ~$100K+. Cost of on-site printing: ~$500-2,000 per part. ROI on printing
//     saves money on first emergency."
//   • Ali Mahmoudi (#47): "They are looking for at least 10-15% ROI."

interface RoiRequest {
  partId: string
  // Optional overrides; defaults derived from the part + blueprint data.
  annualDemand?: number
  downtimeCostPerDay?: number
  traditionalLeadTimeDays?: number
  amLeadTimeDays?: number
}

interface RoiResult {
  part: {
    partNumber: string
    name: string
    category: string
    material: string
    siteName: string
    unitCost: number
  }
  inputs: {
    annualDemand: number
    downtimeCostPerDay: number
    traditionalLeadTimeDays: number
    amLeadTimeDays: number
    traditionalUnitCost: number
    amUnitCost: number
  }
  costs: {
    traditionalAnnual: number
    amAnnual: number
    amSetupCost: number // one-time certification + qualification
    amSetupDescription: string
  }
  savings: {
    downtimeAvoidedPerYear: number // days
    downtimeSavings: number // $
    hotShotFreightSavings: number // $
    workingCapitalFreed: number // $
    totalAnnualSavings: number // $
  }
  roi: {
    netBenefitYear1: number // savings - setup cost
    roiPercent: number // netBenefit / setupCost * 100
    paybackMonths: number
    meetsThreshold: boolean // >= 15% per Ali Mahmoudi #47
  }
  crossBudget: {
    pays: { department: string; amount: number; rationale: string }[]
    saves: { department: string; amount: number; rationale: string }[]
  }
  recommendation: 'Proceed' | 'Pilot First' | 'Not Viable'
  narrative: {
    summary: string
    keyAssumptions: string[]
    riskFactors: string[]
  }
}

// Industry-standard defaults derived from interviews.
const DEFAULTS = {
  downtimeCostPerDay: 100_000, // Bursey #75 offshore O&G
  amUnitCostMultiplier: 0.6, // AM part typically 60% of traditional unit cost at maturity
  amSetupCost: 15_000, // DRL-3 qualification + first-article testing (Saxty #45 framework)
  traditionalLeadTimeDays: 42, // ~6 weeks OEM lead
  amLeadTimeDays: 2, // print + post-process + QC
  hotShotFreightPerTrip: 8_500, // emergency air freight
  workingCapitalRate: 0.12, // 12% carrying cost
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RoiRequest
    const part = physicalParts.find((p) => p.id === body.partId)
    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }
    const bp = blueprints.find((b) => b.id === part.blueprintId)
    const site = physicalSites.find((s) => s.id === part.siteId)

    // Derive annual demand from min stock + consumption pattern (heuristic).
    const annualDemand =
      body.annualDemand ?? Math.max(part.minStock * 4, part.minStock + 2, 4)
    const downtimeCostPerDay = body.downtimeCostPerDay ?? DEFAULTS.downtimeCostPerDay
    const traditionalLeadTimeDays = body.traditionalLeadTimeDays ?? DEFAULTS.traditionalLeadTimeDays
    const amLeadTimeDays = body.amLeadTimeDays ?? DEFAULTS.amLeadTimeDays

    const traditionalUnitCost = part.unitCost
    const amUnitCost = Math.round(part.unitCost * DEFAULTS.amUnitCostMultiplier)

    // ── Costs ──
    const traditionalAnnual = traditionalUnitCost * annualDemand
    const amAnnual = amUnitCost * annualDemand
    const amSetupCost = bp?.certification && bp.certification !== 'Self-certified'
      ? Math.round(DEFAULTS.amSetupCost * 0.5) // approval cascade: half the setup
      : DEFAULTS.amSetupCost
    const amSetupDescription =
      bp?.certification && bp.certification !== 'Self-certified'
        ? `Reduced setup — blueprint pre-certified by ${bp.certification} (approval cascade). Covers first-article test coupon + production qualification only.`
        : 'Full qualification: design review + material spec + facility qualification + feedstock qualification + part qualification (per LR 7-step framework).'

    // ── Savings ──
    // Downtime avoided: (traditional lead time - AM lead time) × downtime cost × (emergency frequency)
    // Emergency frequency: assume 30% of orders are urgent (rush/unplanned).
    const emergencyFraction = 0.3
    const downtimeAvoidedPerYear = Math.round(
      (traditionalLeadTimeDays - amLeadTimeDays) * emergencyFraction * Math.min(annualDemand, 6),
    )
    const downtimeSavings = downtimeAvoidedPerYear * downtimeCostPerDay

    // Hot-shot freight savings: emergency air freight avoided on urgent orders.
    const hotShotFreightSavings = Math.round(DEFAULTS.hotShotFreightPerTrip * emergencyFraction * annualDemand)

    // Working capital freed: no need to hold safety stock (print on demand).
    const workingCapitalFreed = Math.round(traditionalUnitCost * part.minStock * DEFAULTS.workingCapitalRate)

    const totalAnnualSavings = downtimeSavings + hotShotFreightSavings + workingCapitalFreed + (traditionalAnnual - amAnnual)

    // ── ROI ──
    const netBenefitYear1 = totalAnnualSavings - amSetupCost
    const roiPercent = amSetupCost > 0 ? Math.round((netBenefitYear1 / amSetupCost) * 100) : 0
    const paybackMonths = totalAnnualSavings > 0 ? Math.max(0.1, Math.round((amSetupCost / totalAnnualSavings) * 12 * 10) / 10) : 99
    const meetsThreshold = roiPercent >= 15

    let recommendation: RoiResult['recommendation'] = 'Not Viable'
    if (roiPercent >= 50 && paybackMonths <= 6) recommendation = 'Proceed'
    else if (roiPercent >= 15) recommendation = 'Pilot First'

    // ── Cross-budget attribution (Mark Kirby #9's core ask) ──
    const crossBudget = {
      pays: [
        { department: 'Operations / Maintenance', amount: amSetupCost, rationale: 'AM qualification & first-article testing' },
        { department: 'Procurement', amount: amAnnual, rationale: 'Per-part print cost (replaces traditional unit cost)' },
      ],
      saves: [
        { department: 'Production / Revenue', amount: downtimeSavings, rationale: `${downtimeAvoidedPerYear} downtime days avoided (at $${downtimeCostPerDay.toLocaleString()}/day)` },
        { department: 'Logistics', amount: hotShotFreightSavings, rationale: 'Emergency air-freight replaced by on-site print' },
        { department: 'Finance / Treasury', amount: workingCapitalFreed, rationale: 'Safety-stock working capital freed (print on demand)' },
        { department: 'Procurement', amount: traditionalAnnual - amAnnual, rationale: 'Per-unit cost reduction vs traditional OEM part' },
      ],
    }

    // ── AI narrative ──
    const systemPrompt = `You are a financial analyst for AddManuChain, a certified 3D-printing platform for remote industrial operations. You produce concise, board-ready business cases. Be specific and quantitative. Ground every number in the data provided — do not invent figures. Tone: confident but honest about risks.`

    const userMessage = `Generate a business-case narrative for this AM candidate:

PART: ${part.name} (${part.partNumber}), category ${part.category}, material ${bp?.material ?? 'unknown'}, site ${site?.name ?? 'unknown'}.
TRADITIONAL: unit cost $${traditionalUnitCost.toLocaleString()}, lead time ${traditionalLeadTimeDays} days, annual demand ${annualDemand} units.
ADDITIVE: unit cost $${amUnitCost.toLocaleString()}, lead time ${amLeadTimeDays} days, one-time setup $${amSetupCost.toLocaleString()} (${amSetupDescription}).
ANNUAL SAVINGS: downtime $${downtimeSavings.toLocaleString()} (${downtimeAvoidedPerYear} days avoided @ $${downtimeCostPerDay.toLocaleString()}/day), hot-shot freight $${hotShotFreightSavings.toLocaleString()}, working capital $${workingCapitalFreed.toLocaleString()}, unit-cost $${(traditionalAnnual - amAnnual).toLocaleString()}.
TOTAL ANNUAL SAVINGS: $${totalAnnualSavings.toLocaleString()}. YEAR-1 NET BENEFIT: $${netBenefitYear1.toLocaleString()}. ROI: ${roiPercent}%. PAYBACK: ${paybackMonths} months. RECOMMENDATION: ${recommendation}.

Write a 3-sentence executive summary (reference the 1-2% / 98% framing if relevant), then list 3 key assumptions and 3 risk factors. Keep each item under 15 words.`

    const narrative = await askAIJson(
      systemPrompt,
      userMessage,
      {
        summary: '3-sentence executive summary string',
        keyAssumptions: 'array of 3 short assumption strings',
        riskFactors: 'array of 3 short risk strings',
      },
    )

    const result: RoiResult = {
      part: {
        partNumber: part.partNumber,
        name: part.name,
        category: part.category,
        material: bp?.material ?? 'Unknown',
        siteName: site?.name ?? '—',
        unitCost: part.unitCost,
      },
      inputs: {
        annualDemand,
        downtimeCostPerDay,
        traditionalLeadTimeDays,
        amLeadTimeDays,
        traditionalUnitCost,
        amUnitCost,
      },
      costs: {
        traditionalAnnual,
        amAnnual,
        amSetupCost,
        amSetupDescription,
      },
      savings: {
        downtimeAvoidedPerYear,
        downtimeSavings,
        hotShotFreightSavings,
        workingCapitalFreed,
        totalAnnualSavings,
      },
      roi: {
        netBenefitYear1,
        roiPercent,
        paybackMonths,
        meetsThreshold,
      },
      crossBudget,
      recommendation,
      narrative: {
        summary: narrative.summary ?? '',
        keyAssumptions: narrative.keyAssumptions ?? [],
        riskFactors: narrative.riskFactors ?? [],
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('ROI analysis error:', error)
    return NextResponse.json({ error: 'Failed to compute ROI' }, { status: 500 })
  }
}
