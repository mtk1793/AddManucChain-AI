import { NextResponse } from 'next/server'
import { askAIJson } from '@/lib/ai'
import {
  physicalParts,
  physicalSites,
  blueprints,
  printCenters,
} from '@/lib/static-data'

// ─── AM-Candidate Suitability Scoring Engine ─────────────────────────────────
//
// Grounded in customer interviews (see worklog RESEARCH-1):
//   • Heather Davis, Aker Solutions (#52): the scoring checklist — certification
//     level, material printability, nearby qualified facilities, safety
//     criticality, cost-benefit, lead-time comparison.
//   • Craig Dicken, ExxonMobil (#60): "Just because it can be printed doesn't
//     mean it should."
//   • Cameron Munro, DRDC (#81): "Here are some parts that are going to be
//     problematic, and these parts are also suitable for AM."
//
// Six axes, each 0–100, weighted into a composite AM-Suitability Score.

interface AxisScore {
  score: number
  rationale: string
}

interface PartAssessment {
  partId: string
  partNumber: string
  name: string
  category: string
  siteName: string
  quantity: number
  minStock: number
  unitCost: number
  hasBlueprint: boolean
  blueprintId?: string
  material?: string
  oem?: string
  axes: {
    geometryFeasibility: AxisScore
    leadTimePain: AxisScore
    criticality: AxisScore
    certificationPathway: AxisScore
    demandFrequency: AxisScore
    ipStatus: AxisScore
  }
  compositeScore: number
  verdict: 'Highly Suitable' | 'Suitable' | 'Marginal — Review' | 'Not Recommended'
  recommendedAction: string
}

// Categories that map well to AM (vs. commodity parts to screen out per
// Cassidy Silbernagel #72: "be really good at what is the right 5%").
const AM_STRONG_CATEGORIES = ['Structural', 'Hydraulic', 'Thermal', 'Rotating', 'Coupling']
const AM_WEAK_CATEGORIES = ['Seals', 'Electrical'] // often commodity / material-limited

type PhysPart = (typeof physicalParts)[0]
type Blueprint = (typeof blueprints)[0]

function scoreGeometryFeasibility(part: PhysPart, bp: Blueprint | undefined): AxisScore {
  let score = 50
  const reasons: string[] = []
  if (bp) {
    score += 30
    reasons.push('Digital blueprint exists — geometry validated')
    if (bp.printCount > 20) {
      score += 12
      reasons.push(`${bp.printCount} prior successful prints`)
    } else if (bp.printCount > 0) {
      score += 6
      reasons.push(`${bp.printCount} prior prints`)
    }
  } else {
    score -= 15
    reasons.push('No digital blueprint — requires reverse engineering (scan-to-CAD)')
  }
  if (AM_STRONG_CATEGORIES.includes(part.category)) {
    score += 8
    reasons.push(`${part.category} parts typically have AM-friendly geometry`)
  } else if (AM_WEAK_CATEGORIES.includes(part.category)) {
    score -= 12
    reasons.push(`${part.category} parts often commodity / material-limited`)
  }
  score = Math.max(5, Math.min(100, score))
  return { score, rationale: reasons.join('; ') }
}

function scoreLeadTimePain(part: PhysPart): AxisScore {
  let score = 50
  const reasons: string[] = []
  if (part.quantity === 0) {
    score += 40
    reasons.push('Out of stock — immediate supply gap')
  } else if (part.quantity < part.minStock) {
    score += 28
    reasons.push(`Below min stock (${part.quantity}/${part.minStock})`)
  } else if (part.quantity <= part.minStock * 1.5) {
    score += 12
    reasons.push('Near reorder threshold')
  }
  if (part.condition === 'condemned') {
    score += 15
    reasons.push('Condemned unit — replacement needed')
  } else if (part.condition === 'used') {
    score += 8
    reasons.push('Used condition — nearing end of life')
  }
  if (part.unitCost > 5000) {
    score += 10
    reasons.push(`High-value part ($${part.unitCost.toLocaleString()}) — long OEM lead time likely`)
  } else if (part.unitCost > 1000) {
    score += 5
    reasons.push('Medium-value part')
  }
  score = Math.max(5, Math.min(100, score))
  return { score, rationale: reasons.join('; ') }
}

function scoreCriticality(part: PhysPart, bp: Blueprint | undefined): AxisScore {
  let score = 50
  const reasons: string[] = []
  if (['Structural', 'Rotating'].includes(part.category)) {
    score += 20
    reasons.push(`${part.category} — safety-critical application`)
  } else if (['Thermal', 'Hydraulic', 'Coupling'].includes(part.category)) {
    score += 12
    reasons.push(`${part.category} — operational criticality`)
  }
  const n = part.name.toLowerCase()
  if (/pressure|housing|seal|bearing|shaft|impeller|valve/.test(n)) {
    score += 10
    reasons.push('Pressure-bearing / dynamic function')
  }
  if (bp && bp.certification && bp.certification !== 'Self-certified') {
    score += 8
    reasons.push(`Certified by ${bp.certification} — regulated part`)
  }
  score = Math.max(10, Math.min(100, score))
  return { score, rationale: reasons.join('; ') }
}

function scoreCertificationPathway(part: PhysPart, bp: Blueprint | undefined): AxisScore {
  let score = 50
  const reasons: string[] = []
  if (!bp) {
    score = 25
    reasons.push('No blueprint — full qualification pathway required (facility + part + production)')
    return { score, rationale: reasons.join('; ') }
  }
  if (bp.certification && bp.certification !== 'Self-certified') {
    score += 35
    reasons.push(`Blueprint pre-certified by ${bp.certification} — approval cascade applies`)
  } else {
    score -= 5
    reasons.push('Self-certified only — needs authority qualification')
  }
  if (bp.status === 'active') {
    score += 10
    reasons.push('Blueprint status active')
  } else if (bp.status === 'pending_review') {
    score -= 8
    reasons.push('Blueprint pending review')
  }
  const qualifiedCenters = printCenters.filter(
    (c) => c.status !== 'offline' && c.materials.some((m) => m === bp.material),
  )
  if (qualifiedCenters.length > 0) {
    score += 12
    reasons.push(`${qualifiedCenters.length} qualified facilit${qualifiedCenters.length === 1 ? 'y' : 'ies'} can print ${bp.material}`)
  } else {
    score -= 15
    reasons.push(`No active facility certified for ${bp.material}`)
  }
  score = Math.max(5, Math.min(100, score))
  return { score, rationale: reasons.join('; ') }
}

function scoreDemandFrequency(part: PhysPart): AxisScore {
  let score = 40
  const reasons: string[] = []
  if (part.lastUsed) {
    const daysSince = (Date.now() - new Date(part.lastUsed).getTime()) / 86_400_000
    if (daysSince < 14) {
      score += 30
      reasons.push(`Consumed ${Math.round(daysSince)}d ago — high demand frequency`)
    } else if (daysSince < 45) {
      score += 18
      reasons.push(`Consumed ${Math.round(daysSince)}d ago — moderate demand`)
    } else if (daysSince < 90) {
      score += 8
      reasons.push(`Consumed ${Math.round(daysSince)}d ago — occasional demand`)
    } else {
      score -= 5
      reasons.push(`Last consumed ${Math.round(daysSince)}d ago — low demand`)
    }
  } else {
    reasons.push('No consumption history — demand unknown')
  }
  if (part.minStock <= 2) {
    score += 12
    reasons.push('Low min stock — specialty / low-volume (ideal for AM)')
  } else if (part.minStock >= 10) {
    score -= 10
    reasons.push('High min stock — commodity volume (better for traditional mfg)')
  }
  score = Math.max(5, Math.min(100, score))
  return { score, rationale: reasons.join('; ') }
}

function scoreIpStatus(part: PhysPart, bp: Blueprint | undefined): AxisScore {
  let score = 50
  const reasons: string[] = []
  if (!bp) {
    score = 55
    reasons.push('No blueprint on file — likely obsolete-OEM; reverse engineering viable (skips OEM IP gate)')
    return { score, rationale: reasons.join('; ') }
  }
  if (bp.oem && bp.certification && bp.certification !== 'Self-certified') {
    score += 25
    reasons.push(`OEM (${bp.oem}) + authority (${bp.certification}) — clean IP release path`)
  } else if (bp.oem) {
    score += 5
    reasons.push(`OEM (${bp.oem}) on file — IP negotiation needed`)
  }
  if (bp.status === 'active') {
    score += 8
    reasons.push('Blueprint active — OEM engaged')
  }
  score = Math.max(10, Math.min(100, score))
  return { score, rationale: reasons.join('; ') }
}

function compositeScore(axes: PartAssessment['axes']): number {
  const w = {
    geometryFeasibility: 0.22,
    leadTimePain: 0.20,
    criticality: 0.15,
    certificationPathway: 0.18,
    demandFrequency: 0.13,
    ipStatus: 0.12,
  }
  return Math.round(
    axes.geometryFeasibility.score * w.geometryFeasibility +
      axes.leadTimePain.score * w.leadTimePain +
      axes.criticality.score * w.criticality +
      axes.certificationPathway.score * w.certificationPathway +
      axes.demandFrequency.score * w.demandFrequency +
      axes.ipStatus.score * w.ipStatus,
  )
}

function verdict(score: number): PartAssessment['verdict'] {
  if (score >= 70) return 'Highly Suitable'
  if (score >= 55) return 'Suitable'
  if (score >= 40) return 'Marginal — Review'
  return 'Not Recommended'
}

function recommendedAction(part: PartAssessment): string {
  if (part.compositeScore >= 70) {
    return part.hasBlueprint
      ? 'Digitize & pre-certify now — high ROI, fast path to print-on-demand'
      : 'Prioritize reverse engineering → then digitize & pre-certify'
  }
  if (part.compositeScore >= 55) {
    return 'Run full ROI analysis before investing in qualification'
  }
  if (part.compositeScore >= 40) {
    return 'Monitor — re-evaluate if lead-time pain increases'
  }
  return 'Skip — keep traditional procurement; AM not viable for this part'
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const assessments: PartAssessment[] = physicalParts.map((part) => {
      const bp = blueprints.find((b) => b.id === part.blueprintId)
      const site = physicalSites.find((s) => s.id === part.siteId)
      const axes = {
        geometryFeasibility: scoreGeometryFeasibility(part, bp),
        leadTimePain: scoreLeadTimePain(part),
        criticality: scoreCriticality(part, bp),
        certificationPathway: scoreCertificationPathway(part, bp),
        demandFrequency: scoreDemandFrequency(part),
        ipStatus: scoreIpStatus(part, bp),
      }
      const composite = compositeScore(axes)
      const assessment: PartAssessment = {
        partId: part.id,
        partNumber: part.partNumber,
        name: part.name,
        category: part.category,
        siteName: site?.name ?? '—',
        quantity: part.quantity,
        minStock: part.minStock,
        unitCost: part.unitCost,
        hasBlueprint: !!bp,
        blueprintId: bp?.id,
        material: bp?.material,
        oem: bp?.oem,
        axes,
        compositeScore: composite,
        verdict: verdict(composite),
        recommendedAction: '',
      }
      assessment.recommendedAction = recommendedAction(assessment)
      return assessment
    })

    assessments.sort((a, b) => b.compositeScore - a.compositeScore)

    const topCount = Math.max(3, Math.ceil(assessments.length * 0.05))
    const topCandidates = assessments.slice(0, topCount)

    const summary = {
      totalParts: assessments.length,
      highlySuitable: assessments.filter((a) => a.verdict === 'Highly Suitable').length,
      suitable: assessments.filter((a) => a.verdict === 'Suitable').length,
      marginal: assessments.filter((a) => a.verdict === 'Marginal — Review').length,
      notRecommended: assessments.filter((a) => a.verdict === 'Not Recommended').length,
      outOfStockCandidates: assessments.filter((a) => a.quantity === 0 && a.compositeScore >= 55).length,
      averageScore: Math.round(assessments.reduce((s, a) => s + a.compositeScore, 0) / assessments.length),
      topCandidatesCount: topCount,
    }

    return NextResponse.json({ assessments, topCandidates, summary })
  } catch (error) {
    console.error('Part suitability error:', error)
    return NextResponse.json({ error: 'Failed to assess parts' }, { status: 500 })
  }
}

// POST — generate an AI narrative for the top candidates (board-ready summary)
export async function POST(req: Request) {
  try {
    const { topCandidates } = await req.json()
    if (!Array.isArray(topCandidates) || topCandidates.length === 0) {
      return NextResponse.json({ error: 'No candidates provided' }, { status: 400 })
    }

    const candidateSummary = topCandidates
      .map(
        (c: PartAssessment, i: number) =>
          `${i + 1}. ${c.name} (${c.partNumber}) — Score ${c.compositeScore}/100 [${c.verdict}]. ${c.recommendedAction}. Key axes: geometry ${c.axes.geometryFeasibility.score}, lead-time ${c.axes.leadTimePain.score}, certification ${c.axes.certificationPathway.score}.`,
      )
      .join('\n')

    const systemPrompt = `You are an additive manufacturing business analyst for AddManuChain, a certified 3D-printing platform for remote industrial operations (offshore oil & gas, maritime, navy, mining). You analyze AM-candidate parts and produce a concise, board-ready executive summary. Be specific, quantitative where possible, and grounded in the data provided. Do not invent numbers. 3-4 sentences max.`

    const userMessage = `Here are the top ${topCandidates.length} AM-candidate parts identified by our suitability engine (scored on geometry feasibility, lead-time pain, criticality, certification pathway, demand frequency, and IP status):\n\n${candidateSummary}\n\nWrite a 3-4 sentence executive summary recommending these parts for digitization & pre-certification. Reference the interview-validated logic: focus on the parts that solve real lead-time pain for safety-critical operations, and note the "approval cascade" benefit (once pre-certified, future orders skip re-qualification).`

    const narrative = await askAIJson(
      systemPrompt,
      userMessage,
      {
        summary: '3-4 sentence executive summary',
        keyRisks: 'array of 1-3 short risk strings',
        nextSteps: 'array of 2-3 short next-step strings',
      },
    )

    return NextResponse.json({ narrative })
  } catch (error) {
    console.error('Suitability narrative error:', error)
    return NextResponse.json(
      {
        narrative: {
          summary: 'Unable to generate AI narrative at this time. See the ranked candidate list below.',
          keyRisks: ['AI service temporarily unavailable'],
          nextSteps: ['Review the top candidates manually', 'Run ROI analysis on each'],
        },
      },
      { status: 200 },
    )
  }
}
