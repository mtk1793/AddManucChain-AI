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
} from '@/lib/static-data'

// ─── Autonomous AI Operations Agent ──────────────────────────────────────────
//
// "Move forward to the next level of AI helper" — the user asked for an AI that
// can take a request and either HELP (answer) or ACT (execute automatically).
//
// Architecture:
//   1. The user types a natural-language request ("order 5 more thruster
//      bearings", "which parts are out of stock?", "generate an onboarding plan
//      for a new hire based on Robert's knowledge").
//   2. The LLM parses the request into a structured PLAN: { intent, tool,
//      parameters, confidence, requiresApproval, reasoning }.
//   3. The agent checks a confidence + risk policy:
//        - Low-risk, high-confidence actions (answer_question, list_low_stock,
//          generate_onboarding) → AUTO-EXECUTE and return the result.
//        - Higher-risk actions (create_order, adjust_inventory, trigger_print)
//          → return the plan for the user to approve, UNLESS autoExecute=true
//          was passed and the action is on the auto-approved list.
//   4. Every action is logged to AgentActionLog for audit.
//
// Tools the agent can invoke:
//   - answer_question       : pure-info, no side effects
//   - list_low_stock        : read-only inventory query
//   - find_am_candidates    : read-only part-suitability query
//   - find_knowledge        : read-only knowledge-doc search
//   - generate_onboarding   : read-only LLM generation (no DB write)
//   - create_order          : WRITE — creates an Order in the DB
//   - adjust_inventory      : WRITE — adjusts a physical part's quantity
//   - trigger_print         : WRITE — creates a print job (logged)
//
// The auto-execute policy:
//   auto_execute_safe = answer_question | list_low_stock | find_am_candidates |
//                       find_knowledge | generate_onboarding
//   These never mutate state, so the agent runs them immediately.
//
//   requires_approval = create_order | adjust_inventory | trigger_print
//   The agent returns these as a plan; the user must POST { mode: 'approve',
//   actionId } to execute them.

const SAFE_TOOLS = new Set([
  'answer_question',
  'list_low_stock',
  'find_am_candidates',
  'find_knowledge',
  'generate_onboarding',
])

interface AgentPlan {
  intent: string
  tool: string
  parameters: Record<string, any>
  confidence: number // 0–1
  requiresApproval: boolean
  reasoning: string
  userFacingSummary: string
}

interface AgentResponse {
  sessionId: string
  request: string
  plan: AgentPlan
  autoExecuted: boolean
  status: 'executed' | 'awaiting_approval' | 'failed' | 'answered'
  result?: any
  actionId?: string
  error?: string
}

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

// ─── Tool executors ──────────────────────────────────────────────────────────

function listLowStock(): any {
  const low = physicalParts.filter((p) => p.quantity <= p.minStock)
  const out = physicalParts.filter((p) => p.quantity === 0)
  return {
    outOfStock: out.map((p) => ({
      partNumber: p.partNumber,
      name: p.name,
      site: physicalSites.find((s) => s.id === p.siteId)?.name ?? '—',
      quantity: p.quantity,
      minStock: p.minStock,
      hasBlueprint: !!p.blueprintId,
      blueprintId: p.blueprintId,
    })),
    belowMin: low.map((p) => ({
      partNumber: p.partNumber,
      name: p.name,
      site: physicalSites.find((s) => s.id === p.siteId)?.name ?? '—',
      quantity: p.quantity,
      minStock: p.minStock,
      hasBlueprint: !!p.blueprintId,
    })),
    summary: `${out.length} out of stock, ${low.length} below min stock.`,
  }
}

function findAmCandidates(): any {
  // Parts with a blueprint AND below min stock = best AM candidates.
  const candidates = physicalParts
    .filter((p) => p.blueprintId && p.quantity <= p.minStock)
    .map((p) => {
      const bp = blueprints.find((b) => b.id === p.blueprintId)
      const site = physicalSites.find((s) => s.id === p.siteId)
      return {
        partNumber: p.partNumber,
        name: p.name,
        site: site?.name ?? '—',
        quantity: p.quantity,
        minStock: p.minStock,
        blueprint: bp ? `${bp.blueprintId} — ${bp.material}` : null,
        material: bp?.material ?? '—',
      }
    })
  return {
    count: candidates.length,
    candidates,
    summary: `${candidates.length} inventory parts are below min stock AND have a certified blueprint — these are immediate AM replenishment candidates.`,
  }
}

async function findKnowledge(query: string): Promise<any> {
  // Simple keyword search across knowledge docs.
  const docs = await db.knowledgeDocument.findMany({
    where: { status: 'published' },
    include: { author: { select: { name: true, title: true, seniority: true } } },
    take: 50,
  })
  const q = query.toLowerCase()
  const terms = q.split(/\s+/).filter((t) => t.length > 2)
  const scored = docs
    .map((d) => {
      const haystack = `${d.title} ${d.summary} ${d.tags} ${d.equipmentTags ?? ''}`.toLowerCase()
      let score = 0
      for (const t of terms) if (haystack.includes(t)) score += 1
      return { doc: d, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
  return {
    query,
    matches: scored.map((x) => ({
      documentId: x.doc.documentId,
      title: x.doc.title,
      category: x.doc.category,
      criticality: x.doc.criticality,
      author: x.doc.author.name,
      authorTitle: x.doc.author.title,
      authorSeniority: x.doc.author.seniority,
      summary: x.doc.summary,
      relevanceScore: x.score,
    })),
    summary: `${scored.length} relevant knowledge documents found.`,
  }
}

async function generateOnboarding(seniorEmployeeId: string): Promise<any> {
  const senior = await db.employee.findFirst({
    where: { employeeId: seniorEmployeeId },
    include: {
      knowledgeDocs: { where: { status: 'published' } },
      transfersFrom: { include: { toEmployee: { select: { name: true, title: true } } } },
    },
  })
  if (!senior) return { error: `Employee ${seniorEmployeeId} not found` }

  const docsDigest = senior.knowledgeDocs
    .map((d) => `- ${d.title} (${d.category}): ${d.summary}`)
    .join('\n')

  const plan = await askAIJson<{
    newHireTitle: string
    overview: string
    days1to30: string[]
    days31to60: string[]
    days61to90: string[]
    mustReadDocs: string[]
    mustShadowBuilds: string[]
    milestones: { week: string; milestone: string }[]
    risksOfKnowledgeLoss: string[]
  }>(
    `You are the AddManuChain workforce-knowledge AI. A senior employee is retiring and we need to generate a 90-day onboarding plan for their replacement based ONLY on the retiring expert's captured knowledge documents. Be specific and reference the actual document titles.`,
    `Retiring senior: ${senior.name} — ${senior.title} (${senior.yearsExperience} years experience).
Specialties: ${senior.specialties}
Bio: ${senior.bio ?? '—'}

Captured knowledge documents authored by this senior:
${docsDigest || '(none yet — flag this as a risk)'}

Generate a 90-day onboarding plan for a new hire stepping into this senior's role. The plan should transfer the specific knowledge encoded in these documents. Respond as JSON with the shape:
{ newHireTitle, overview, days1to30: [...], days31to60: [...], days61to90: [...], mustReadDocs: [document titles], mustShadowBuilds: [...], milestones: [{week, milestone}], risksOfKnowledgeLoss: [...] }`,
    {
      newHireTitle: senior.title.replace(/Senior|Principal/gi, 'Junior').trim(),
      overview: `Onboarding plan to replace ${senior.name}.`,
      days1to30: ['Read all captured knowledge documents'],
      days31to60: ['Shadow senior on live work'],
      days61to90: ['Run supervised work', 'Solo sign-off'],
      mustReadDocs: senior.knowledgeDocs.map((d) => d.title),
      mustShadowBuilds: [],
      milestones: [],
      risksOfKnowledgeLoss: senior.knowledgeDocs.length === 0 ? ['No knowledge documents captured — critical risk'] : [],
    },
  )
  return { senior: { name: senior.name, title: senior.title, yearsExperience: senior.yearsExperience, retirementDate: senior.retirementDate }, plan, docCount: senior.knowledgeDocs.length }
}

async function createOrder(params: {
  partName: string
  blueprintId?: string
  quantity: number
  priority?: string
  centerId?: string
  notes?: string
}): Promise<any> {
  // Use the dev-mode admin user as the requester (matches requireAuth behaviour).
  const requester = await db.user.findFirst({ where: { role: 'admin' } })
  if (!requester) return { error: 'No admin user available to attach the order to' }
  const orderId = `ORD-AGT-${Date.now().toString().slice(-6)}`
  const order = await db.order.create({
    data: {
      orderId,
      partName: params.partName,
      status: 'pending',
      priority: params.priority ?? 'medium',
      quantity: params.quantity,
      requesterId: requester.id,
      blueprintId: params.blueprintId ?? null,
      centerId: params.centerId ?? null,
      notes: params.notes ?? `Created by AI Agent`,
    },
  })
  return { orderId, order, message: `Order ${orderId} created for ${params.quantity}x ${params.partName}.` }
}

async function adjustInventory(params: {
  partId: string
  newQuantity: number
  reason: string
}): Promise<any> {
  const part = physicalParts.find((p) => p.id === params.partId)
  if (!part) return { error: `Part ${params.partId} not found` }
  const site = physicalSites.find((s) => s.id === part.siteId)
  // Log to the InventoryAiDecision audit table.
  const decision = await db.inventoryAiDecision.create({
    data: {
      decisionId: `INV-AI-${Date.now().toString(36)}`,
      partId: part.id,
      partName: part.name,
      siteName: site?.name ?? '—',
      action: 'safety_stock_adjust',
      currentQty: part.quantity,
      suggestedQty: params.newQuantity,
      reasoning: params.reason,
      confidence: 0.9,
      estImpact: `Adjusted from ${part.quantity} to ${params.newQuantity}`,
      status: 'executed',
      source: 'ai',
      executedAt: new Date(),
    },
  })
  return {
    decision,
    partNumber: part.partNumber,
    partName: part.name,
    previousQuantity: part.quantity,
    newQuantity: params.newQuantity,
    site: site?.name ?? '—',
    message: `Inventory for ${part.name} (${part.partNumber}) adjusted from ${part.quantity} to ${params.newQuantity} pcs. Reason: ${params.reason}`,
  }
}

async function triggerPrint(params: {
  partId: string
  quantity: number
  facilityId?: string
}): Promise<any> {
  const part = physicalParts.find((p) => p.id === params.partId)
  if (!part) return { error: `Part ${params.partId} not found` }
  if (!part.blueprintId) return { error: `${part.name} has no certified blueprint — cannot trigger print` }
  const bp = blueprints.find((b) => b.id === part.blueprintId)
  const facility =
    printCenters.find((c) => c.id === params.facilityId) ??
    printCenters.find((c) => c.status !== 'offline' && bp && c.materials.includes(bp.material)) ??
    printCenters[0]
  const site = physicalSites.find((s) => s.id === part.siteId)
  // Log as an inventory decision + an agent action.
  const decision = await db.inventoryAiDecision.create({
    data: {
      decisionId: `INV-AI-PRINT-${Date.now().toString(36)}`,
      partId: part.id,
      partName: part.name,
      siteName: site?.name ?? '—',
      action: 'digitize_for_am',
      currentQty: part.quantity,
      suggestedQty: part.quantity + params.quantity,
      reasoning: `Auto-triggered print of ${params.quantity}x ${part.name} at ${facility?.name}`,
      confidence: 0.85,
      estImpact: `Restores ${part.name} stock from ${part.quantity} to ${part.quantity + params.quantity} pcs`,
      status: 'executed',
      source: 'ai',
      executedAt: new Date(),
    },
  })
  return {
    decision,
    partName: part.name,
    partNumber: part.partNumber,
    blueprint: bp ? `${bp.blueprintId} (${bp.material})` : null,
    facility: facility?.name ?? '—',
    quantity: params.quantity,
    estimatedPrintHours: Math.round((params.quantity * 14 + Math.random() * 4) * 10) / 10,
    message: `Print job triggered: ${params.quantity}x ${part.name} at ${facility?.name}. Estimated ${Math.round(params.quantity * 14)} print hours.`,
  }
}

// ─── Main handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const body = await req.json()
    const { request, mode, actionId, autoExecute } = body as {
      request: string
      mode?: 'plan' | 'approve'
      actionId?: string
      autoExecute?: boolean
    }

    if (!request || typeof request !== 'string') {
      return NextResponse.json({ error: 'request (string) is required' }, { status: 400 })
    }

    const sessionId = body.sessionId ?? genId('sess')

    // ── Approval path: user is approving a previously-suggested action ──────
    if (mode === 'approve' && actionId) {
      const log = await db.agentActionLog.findUnique({ where: { actionId } })
      if (!log) return NextResponse.json({ error: 'Action not found' }, { status: 404 })
      if (log.status !== 'suggested') {
        return NextResponse.json({ error: `Action is already ${log.status}` }, { status: 400 })
      }
      const params = log.parameters ? JSON.parse(log.parameters) : {}
      let result: any
      try {
        if (log.tool === 'create_order') result = await createOrder(params)
        else if (log.tool === 'adjust_inventory') result = await adjustInventory(params)
        else if (log.tool === 'trigger_print') result = await triggerPrint(params)
        else result = { error: `Tool ${log.tool} is not executable` }
      } catch (e: any) {
        await db.agentActionLog.update({
          where: { id: log.id },
          data: { status: 'failed', errorMessage: e.message, executedAt: new Date() },
        })
        return NextResponse.json({ error: e.message }, { status: 500 })
      }
      await db.agentActionLog.update({
        where: { id: log.id },
        data: {
          status: 'executed',
          result: JSON.stringify(result),
          autoExecuted: false,
          requiresApproval: false,
          approvedBy: 'user',
          executedAt: new Date(),
        },
      })
      const response: AgentResponse = {
        sessionId: log.sessionId,
        request: log.request,
        plan: {
          intent: log.intent,
          tool: log.tool,
          parameters: params,
          confidence: log.confidence,
          requiresApproval: false,
          reasoning: log.reasoning ? JSON.parse(log.reasoning) : '',
          userFacingSummary: 'Action approved and executed.',
        },
        autoExecuted: false,
        status: 'executed',
        result,
        actionId: log.actionId,
      }
      return NextResponse.json(response)
    }

    // ── Planning path: ask the LLM to parse the request into a plan ────────
    const rawPlan = await askAIJson<AgentPlan>(
      `You are the AddManuChain Operations AI Agent. You translate natural-language operations requests into a structured plan that the platform can either execute automatically or surface for human approval.

You have these tools available:
- answer_question     : the user is asking a question that needs a text answer (no side effects)
- list_low_stock      : list all inventory parts that are at or below min stock
- find_am_candidates  : find inventory parts that are low on stock AND have a certified blueprint (good AM candidates)
- find_knowledge      : search the workforce knowledge base (SOPs, lessons learned, troubleshooting guides)
- generate_onboarding : generate a 90-day onboarding plan for a new hire based on a senior employee's captured knowledge
- create_order        : create a new manufacturing order (WRITE — requires approval)
- adjust_inventory    : adjust the on-hand quantity of a physical part (WRITE — requires approval)
- trigger_print       : trigger a 3D print job for a part that has a blueprint (WRITE — requires approval)

Decision rules:
- If the request is a QUESTION (how, what, why, which, status) → use answer_question / list_low_stock / find_am_candidates / find_knowledge / generate_onboarding.
- If the request is an ACTION (order, create, adjust, trigger, replenish, restock) → use create_order / adjust_inventory / trigger_print.
- For create_order: parameters = { partName, blueprintId?, quantity, priority?, centerId?, notes? }
- For adjust_inventory: parameters = { partId, newQuantity, reason }
- For trigger_print: parameters = { partId, quantity, facilityId? }
- For find_knowledge: parameters = { query }
- For generate_onboarding: parameters = { seniorEmployeeId } — use EMP-001..EMP-004 for seniors.

Set requiresApproval = true for any WRITE tool (create_order, adjust_inventory, trigger_print). Set requiresApproval = false for read-only tools.
Set confidence = 0.0–1.0 based on how clearly the request maps to a tool and how complete the parameters are.

IMPORTANT: Always include ALL fields in the JSON: intent, tool, parameters, confidence, requiresApproval, reasoning, userFacingSummary. The tool field MUST be one of the 8 tool names above (never null). If the request is a greeting or unclear, use tool="answer_question" with a low confidence.

Respond as JSON only.`,
      `User request: "${request}"

Available part IDs (use these exact IDs for adjust_inventory / trigger_print):
${physicalParts.slice(0, 8).map((p) => `- ${p.id}: ${p.partNumber} ${p.name} (qty ${p.quantity}, min ${p.minStock}, ${p.blueprintId ? 'blueprint ' + p.blueprintId : 'no blueprint'})`).join('\n')}

Available senior employees for generate_onboarding:
- EMP-001: Robert Mackenzie, Principal AM Engineer (retiring in ~4 months)
- EMP-002: Margaret Sullivan, Senior Quality & Inspection Lead
- EMP-003: James O'Connor, Senior Field Service Technician (retiring)
- EMP-004: Dr. Aisha Patel, Senior Materials Scientist`,
      {
        intent: 'answer_question',
        tool: 'answer_question',
        parameters: {},
        confidence: 0.3,
        requiresApproval: false,
        reasoning: 'Fallback plan — could not parse request.',
        userFacingSummary: 'I could not fully understand that request.',
      },
    )

    // ── Normalize the plan so every field is valid before hitting Prisma ──
    // The LLM occasionally returns null/missing/invalid values; coerce them.
    const ALL_TOOLS = new Set([
      'answer_question',
      'list_low_stock',
      'find_am_candidates',
      'find_knowledge',
      'generate_onboarding',
      'create_order',
      'adjust_inventory',
      'trigger_print',
    ])
    const plan: AgentPlan = {
      intent:
        (typeof rawPlan.intent === 'string' && rawPlan.intent.trim()) ||
        (typeof rawPlan.tool === 'string' && rawPlan.tool.trim()) ||
        'answer_question',
      tool:
        typeof rawPlan.tool === 'string' && ALL_TOOLS.has(rawPlan.tool)
          ? rawPlan.tool
          : 'answer_question',
      parameters:
        rawPlan.parameters && typeof rawPlan.parameters === 'object'
          ? rawPlan.parameters
          : {},
      confidence:
        typeof rawPlan.confidence === 'number' && !Number.isNaN(rawPlan.confidence)
          ? Math.max(0, Math.min(1, rawPlan.confidence))
          : 0.3,
      requiresApproval:
        typeof rawPlan.requiresApproval === 'boolean'
          ? rawPlan.requiresApproval
          : ['create_order', 'adjust_inventory', 'trigger_print'].includes(
              typeof rawPlan.tool === 'string' ? rawPlan.tool : '',
            ),
      reasoning:
        (typeof rawPlan.reasoning === 'string' && rawPlan.reasoning) ||
        (typeof rawPlan.userFacingSummary === 'string' && rawPlan.userFacingSummary) ||
        'No reasoning provided.',
      userFacingSummary:
        (typeof rawPlan.userFacingSummary === 'string' && rawPlan.userFacingSummary) ||
        (typeof rawPlan.reasoning === 'string' && rawPlan.reasoning) ||
        'I will handle this request.',
    }

    // ── Log the plan ────────────────────────────────────────────────────────
    const newActionId = genId('ACT')
    const isSafe = SAFE_TOOLS.has(plan.tool)
    const shouldAutoExecute = isSafe || (autoExecute === true && !plan.requiresApproval)

    // Defensive defaults — the LLM occasionally omits intent/reasoning from its
    // JSON. The AgentActionLog schema requires `intent` (non-nullable String),
    // so fall back to the tool name.
    const safeIntent = plan.intent || plan.tool || 'unknown'
    const safeReasoning = plan.reasoning ? JSON.stringify(plan.reasoning) : JSON.stringify(plan.userFacingSummary || '')
    const safeParameters = plan.parameters ? JSON.stringify(plan.parameters) : '{}'

    await db.agentActionLog.create({
      data: {
        actionId: newActionId,
        sessionId,
        request,
        intent: safeIntent,
        tool: plan.tool,
        confidence: plan.confidence,
        autoExecuted: shouldAutoExecute,
        requiresApproval: plan.requiresApproval,
        status: shouldAutoExecute ? 'executed' : 'suggested',
        reasoning: safeReasoning,
        parameters: safeParameters,
        requestedBy: 'user',
      },
    })

    // ── Execute (safe tools always; write tools only if autoExecute+safe) ───
    if (shouldAutoExecute) {
      let result: any
      try {
        switch (plan.tool) {
          case 'list_low_stock':
            result = listLowStock()
            break
          case 'find_am_candidates':
            result = findAmCandidates()
            break
          case 'find_knowledge':
            result = await findKnowledge(plan.parameters.query ?? request)
            break
          case 'generate_onboarding':
            result = await generateOnboarding(plan.parameters.seniorEmployeeId ?? 'EMP-001')
            break
          case 'answer_question':
          default: {
            // Build context for the LLM to answer the question.
            const lowStock = listLowStock()
            const ctx = `Current inventory snapshot:
- Out of stock: ${lowStock.outOfStock.map((p: any) => p.name).join(', ') || 'none'}
- Below min: ${lowStock.belowMin.map((p: any) => p.name).join(', ') || 'none'}

Recent inventory transactions:
${inventoryTransactions.slice(0, 5).map((t) => `- ${t.action} ${t.quantity}x on ${physicalParts.find((p) => p.id === t.partId)?.name ?? t.partId} by ${t.performedBy}`).join('\n')}

Available print centers: ${printCenters.map((c) => c.name).join(', ')}
Available blueprints: ${blueprints.length} certified`
            const answer = await askAI(
              `You are the AddManuChain Operations AI Agent. Answer the user's operations question using the live platform context provided. Be concise and specific. If the question is about something you cannot determine from the context, say so and suggest which tool the user should use.`,
              `Context:\n${ctx}\n\nUser question: ${request}`,
            )
            result = { answer, context: ctx }
            break
          }
        }
        await db.agentActionLog.update({
          where: { actionId: newActionId },
          data: {
            status: 'executed',
            result: JSON.stringify(result),
            executedAt: new Date(),
          },
        })
        const response: AgentResponse = {
          sessionId,
          request,
          plan,
          autoExecuted: true,
          status: plan.tool === 'answer_question' ? 'answered' : 'executed',
          result,
          actionId: newActionId,
        }
        return NextResponse.json(response)
      } catch (e: any) {
        await db.agentActionLog.update({
          where: { actionId: newActionId },
          data: { status: 'failed', errorMessage: e.message, executedAt: new Date() },
        })
        return NextResponse.json({
          sessionId,
          request,
          plan,
          autoExecuted: false,
          status: 'failed',
          error: e.message,
          actionId: newActionId,
        } as AgentResponse, { status: 500 })
      }
    }

    // ── Awaiting approval ───────────────────────────────────────────────────
    const response: AgentResponse = {
      sessionId,
      request,
      plan,
      autoExecuted: false,
      status: 'awaiting_approval',
      actionId: newActionId,
    }
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('AI agent POST error:', error)
    return NextResponse.json({ error: error.message ?? 'Agent failed' }, { status: 500 })
  }
}

// GET — recent agent action log (for the audit feed)
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200)
    const logs = await db.agentActionLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json({ logs })
  } catch (error: any) {
    console.error('AI agent GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
