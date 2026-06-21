'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Clock,
  FileText,
  Boxes,
  BookOpen,
  GraduationCap,
  ShoppingCart,
  Wrench,
  Printer,
  ChevronRight,
  Activity,
  CircleDot,
  History,
  Quote,
  ScanLine,
  Brain,
  Zap,
  Database,
  Link2,
  ArrowUpRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

// ─── Types (mirror the /api/ai/agent contract) ───────────────────────────────

interface AgentPlan {
  intent: string
  tool: string
  parameters: Record<string, any>
  confidence: number // 0–1
  requiresApproval: boolean
  reasoning: string
  userFacingSummary: string
}

type AgentStatus = 'executed' | 'answered' | 'awaiting_approval' | 'failed' | 'thinking'

interface AgentResponse {
  sessionId: string
  request: string
  plan: AgentPlan
  autoExecuted: boolean
  status: AgentStatus
  result?: any
  actionId?: string
  error?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  // For user messages
  text?: string
  // For agent messages
  response?: AgentResponse
  thinking?: boolean
}

interface AuditLog {
  actionId: string
  sessionId: string
  request: string
  intent: string
  tool: string
  confidence: number
  autoExecuted: boolean
  requiresApproval: boolean
  status: string
  reasoning: string | null
  parameters: string | null
  result: string | null
  errorMessage: string | null
  createdAt: string
  executedAt: string | null
}

// ─── Color families by tool family ────────────────────────────────────────────
//   read-only  = emerald
//   write      = amber
//   knowledge  = violet

const READ_TOOLS = new Set([
  'list_low_stock',
  'find_am_candidates',
  'answer_question',
])
const WRITE_TOOLS = new Set(['create_order', 'adjust_inventory', 'trigger_print'])
const KNOWLEDGE_TOOLS = new Set(['find_knowledge', 'generate_onboarding'])

type ToolFamily = 'read' | 'write' | 'knowledge' | 'unknown'

function toolFamily(tool: string): ToolFamily {
  if (READ_TOOLS.has(tool)) return 'read'
  if (WRITE_TOOLS.has(tool)) return 'write'
  if (KNOWLEDGE_TOOLS.has(tool)) return 'knowledge'
  return 'unknown'
}

const FAMILY_STYLES: Record<
  ToolFamily,
  { label: string; badge: string; dot: string }
> = {
  read: {
    label: 'Read-only',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  write: {
    label: 'Write action',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  knowledge: {
    label: 'Knowledge',
    badge: 'border-violet-200 bg-violet-50 text-violet-700',
    dot: 'bg-violet-500',
  },
  unknown: {
    label: 'Other',
    badge: 'border-slate-200 bg-slate-50 text-slate-700',
    dot: 'bg-slate-500',
  },
}

const TOOL_META: Record<
  string,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  answer_question: { label: 'Answer Question', Icon: Sparkles },
  list_low_stock: { label: 'List Low Stock', Icon: AlertTriangle },
  find_am_candidates: { label: 'Find AM Candidates', Icon: ScanLine },
  find_knowledge: { label: 'Search Knowledge', Icon: BookOpen },
  generate_onboarding: { label: 'Generate Onboarding', Icon: GraduationCap },
  create_order: { label: 'Create Order', Icon: ShoppingCart },
  adjust_inventory: { label: 'Adjust Inventory', Icon: Wrench },
  trigger_print: { label: 'Trigger Print', Icon: Printer },
}

// ─── Suggested prompt chips ───────────────────────────────────────────────────

interface Suggestion {
  text: string
  family: ToolFamily
  hint: string
}

const SUGGESTIONS: Suggestion[] = [
  {
    text: 'Which parts are out of stock?',
    family: 'read',
    hint: 'Safe · reads inventory',
  },
  {
    text: 'Find all AM candidates in my inventory',
    family: 'read',
    hint: 'Safe · read-only scan',
  },
  {
    text: 'Order 5 more thruster bearing housings',
    family: 'write',
    hint: 'Write · needs approval',
  },
  {
    text: "Generate an onboarding plan based on Robert's knowledge",
    family: 'knowledge',
    hint: 'Safe · LLM generation',
  },
  {
    text: 'Search knowledge base for heat exchanger crack diagnosis',
    family: 'knowledge',
    hint: 'Safe · knowledge search',
  },
  {
    text: 'Trigger a print for the impeller shaft',
    family: 'write',
    hint: 'Write · needs approval',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`
}

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const s = Math.floor(diff / 1000)
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    return `${d}d ago`
  } catch {
    return '—'
  }
}

function fmtTime(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  autoExecuted,
}: {
  status: AgentStatus
  autoExecuted: boolean
}) {
  if (status === 'thinking') {
    return (
      <Badge className="border-slate-200 bg-slate-50 text-slate-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        Thinking
      </Badge>
    )
  }
  if (status === 'executed' || status === 'answered') {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        {autoExecuted ? 'Auto-executed' : 'Executed'}
      </Badge>
    )
  }
  if (status === 'awaiting_approval') {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700">
        <ShieldCheck className="h-3 w-3" />
        Needs approval
      </Badge>
    )
  }
  if (status === 'failed') {
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700">
        <XCircle className="h-3 w-3" />
        Failed
      </Badge>
    )
  }
  return null
}

// ─── Confidence badge ─────────────────────────────────────────────────────────

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round((confidence ?? 0) * 100)
  const color =
    pct >= 80
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : pct >= 50
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-red-200 bg-red-50 text-red-700'
  return (
    <Badge variant="outline" className={color}>
      <CircleDot className="h-3 w-3" />
      {pct}% confidence
    </Badge>
  )
}

// ─── Intent badge ─────────────────────────────────────────────────────────────

function IntentBadge({ tool }: { tool: string }) {
  const family = toolFamily(tool)
  const meta = TOOL_META[tool]
  const Icon = meta?.Icon ?? Activity
  return (
    <Badge variant="outline" className={FAMILY_STYLES[family].badge}>
      <Icon className="h-3 w-3" />
      {meta?.label ?? tool}
    </Badge>
  )
}

// ─── Section heading used inside result renderers ─────────────────────────────

function ResultSection({
  title,
  icon: Icon,
  children,
  accent = 'text-slate-700',
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  accent?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${accent}`}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Per-tool result renderers ────────────────────────────────────────────────

function AnswerQuestionResult({ result }: { result: any }) {
  const answer: string = result?.answer ?? ''
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
      {answer || 'No answer returned.'}
    </div>
  )
}

function LowStockRow({ p, kind }: { p: any; kind: 'out' | 'low' }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-800 truncate">
          {p.name}
          <span className="ml-1.5 text-slate-400">· {p.partNumber}</span>
        </div>
        <div className="text-slate-500 truncate">{p.site}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-slate-700">
          {p.quantity}/{p.minStock}
        </span>
        {p.hasBlueprint && (
          <Badge className="border-violet-200 bg-violet-50 text-violet-700">
            <FileText className="h-3 w-3" />
            Blueprint
          </Badge>
        )}
        {kind === 'out' ? (
          <Badge className="border-red-200 bg-red-50 text-red-700">Out</Badge>
        ) : (
          <Badge className="border-amber-200 bg-amber-50 text-amber-700">Low</Badge>
        )}
      </div>
    </div>
  )
}

function ListLowStockResult({ result }: { result: any }) {
  const out: any[] = result?.outOfStock ?? []
  const low: any[] = result?.belowMin ?? []
  const summary: string = result?.summary ?? ''
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{summary}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <ResultSection title={`Out of Stock (${out.length})`} icon={XCircle} accent="text-red-700">
          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 thin-scroll">
            {out.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-1">None — all parts in stock.</p>
            ) : (
              out.map((p, i) => <LowStockRow key={i} p={p} kind="out" />)
            )}
          </div>
        </ResultSection>
        <ResultSection title={`Below Min (${low.length})`} icon={AlertTriangle} accent="text-amber-700">
          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 thin-scroll">
            {low.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-1">None — all parts above minimum.</p>
            ) : (
              low.map((p, i) => <LowStockRow key={i} p={p} kind="low" />)
            )}
          </div>
        </ResultSection>
      </div>
    </div>
  )
}

function AmCandidatesResult({ result }: { result: any }) {
  const candidates: any[] = result?.candidates ?? []
  const summary: string = result?.summary ?? ''
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">{summary}</p>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1 thin-scroll">
        {candidates.length === 0 ? (
          <p className="text-xs text-slate-400 italic px-1">
            No low-stock parts with certified blueprints right now.
          </p>
        ) : (
          candidates.map((c, i) => (
            <div
              key={i}
              className="rounded-md border border-emerald-200 bg-emerald-50/40 p-2.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-slate-800 truncate">
                  {c.name}
                  <span className="ml-1.5 text-slate-400">· {c.partNumber}</span>
                </div>
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  <ScanLine className="h-3 w-3" />
                  AM candidate
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <CircleDot className="h-3 w-3 text-slate-400" />
                  {c.site}
                </span>
                <span className="font-mono">
                  qty {c.quantity}/{c.minStock}
                </span>
                {c.material && (
                  <span className="inline-flex items-center gap-1">
                    <Boxes className="h-3 w-3 text-slate-400" />
                    {c.material}
                  </span>
                )}
                {c.blueprint && (
                  <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                    <FileText className="h-3 w-3" />
                    {c.blueprint}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function KnowledgeResult({ result }: { result: any }) {
  const matches: any[] = result?.matches ?? []
  const summary: string = result?.summary ?? ''
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">{summary}</p>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1 thin-scroll">
        {matches.length === 0 ? (
          <p className="text-xs text-slate-400 italic px-1">No matches found.</p>
        ) : (
          matches.map((m, i) => {
            const rel = Math.min(100, Math.round((m.relevanceScore ?? 0) * 25))
            return (
              <div
                key={i}
                className="rounded-md border border-violet-200 bg-violet-50/40 p-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-slate-800 truncate">{m.title}</div>
                  <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                    {m.category ?? 'Knowledge'}
                  </Badge>
                </div>
                <div className="mt-0.5 text-slate-500">
                  {m.author ? `by ${m.author}` : ''}
                  {m.authorTitle ? ` · ${m.authorTitle}` : ''}
                </div>
                <p className="mt-1 text-slate-600 line-clamp-2">{m.summary}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress value={rel} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-slate-500 font-mono">
                    {rel}% match
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function OnboardingResult({ result }: { result: any }) {
  const senior = result?.senior
  const plan = result?.plan
  if (!plan) {
    return (
      <p className="text-xs text-red-600">
        {result?.error ?? 'Failed to generate onboarding plan.'}
      </p>
    )
  }
  const hasRisks = Array.isArray(plan.risksOfKnowledgeLoss) && plan.risksOfKnowledgeLoss.length > 0
  return (
    <div className="space-y-3">
      {senior && (
        <div className="rounded-md border border-violet-200 bg-violet-50/40 p-2.5 text-xs">
          <div className="font-semibold text-slate-800">
            {senior.name}
            <span className="ml-1.5 font-normal text-slate-500">· {senior.title}</span>
          </div>
          <div className="text-slate-500">
            {senior.yearsExperience} yrs experience
            {senior.retirementDate ? ` · retiring ${senior.retirementDate}` : ''}
          </div>
        </div>
      )}
      {plan.overview && (
        <p className="text-xs text-slate-600 italic">{plan.overview}</p>
      )}

      <div className="grid gap-2 md:grid-cols-3">
        {[
          { title: 'Days 1–30', items: plan.days1to30, accent: 'emerald' },
          { title: 'Days 31–60', items: plan.days31to60, accent: 'sky' },
          { title: 'Days 61–90', items: plan.days61to90, accent: 'violet' },
        ].map((col) => (
          <div
            key={col.title}
            className="rounded-md border border-slate-200 bg-white p-2.5 text-xs"
          >
            <div className="mb-1.5 font-semibold text-slate-700">{col.title}</div>
            <ul className="space-y-1">
              {(col.items ?? []).length === 0 ? (
                <li className="text-slate-400 italic">—</li>
              ) : (
                (col.items as string[]).map((it, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                    <span className="text-slate-600">{it}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <ResultSection title="Must-Read Documents" icon={BookOpen} accent="text-violet-700">
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 thin-scroll">
            {(plan.mustReadDocs ?? []).length === 0 ? (
              <p className="text-xs text-slate-400 italic px-1">No specific docs flagged.</p>
            ) : (
              (plan.mustReadDocs as string[]).map((d, i) => (
                <div
                  key={i}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                >
                  {d}
                </div>
              ))
            )}
          </div>
        </ResultSection>
        <ResultSection title="Must-Shadow Builds" icon={Boxes} accent="text-amber-700">
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 thin-scroll">
            {(plan.mustShadowBuilds ?? []).length === 0 ? (
              <p className="text-xs text-slate-400 italic px-1">No shadow builds flagged.</p>
            ) : (
              (plan.mustShadowBuilds as string[]).map((d, i) => (
                <div
                  key={i}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700"
                >
                  {d}
                </div>
              ))
            )}
          </div>
        </ResultSection>
      </div>

      {Array.isArray(plan.milestones) && plan.milestones.length > 0 && (
        <ResultSection title="Milestones" icon={Activity} accent="text-sky-700">
          <div className="space-y-1">
            {(plan.milestones as { week?: string; milestone?: string }[]).map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded border border-slate-200 bg-white px-2 py-1 text-[11px]"
              >
                <Badge className="border-sky-200 bg-sky-50 text-sky-700 shrink-0">
                  {m.week ?? `W${i + 1}`}
                </Badge>
                <span className="text-slate-700">{m.milestone ?? '—'}</span>
              </div>
            ))}
          </div>
        </ResultSection>
      )}

      <div
        className={`rounded-md border p-2.5 text-xs ${
          hasRisks
            ? 'border-red-200 bg-red-50'
            : 'border-emerald-200 bg-emerald-50/50'
        }`}
      >
        <div
          className={`flex items-center gap-1.5 font-semibold ${
            hasRisks ? 'text-red-700' : 'text-emerald-700'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Risks of Knowledge Loss
        </div>
        <ul className="mt-1.5 space-y-1">
          {(plan.risksOfKnowledgeLoss ?? []).length === 0 ? (
            <li className="text-emerald-700">
              No specific risks flagged — knowledge appears well captured.
            </li>
          ) : (
            (plan.risksOfKnowledgeLoss as string[]).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-red-700">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{r}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

function SuccessCallout({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3">
      <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="mt-1.5 text-xs text-slate-700">{children}</div>
    </div>
  )
}

function CreateOrderResult({ result }: { result: any }) {
  if (result?.error) {
    return (
      <p className="text-xs text-red-600">{result.error}</p>
    )
  }
  return (
    <SuccessCallout title="Order created" icon={ShoppingCart}>
      <div className="flex items-center gap-2">
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 font-mono">
          {result?.orderId ?? '—'}
        </Badge>
        <span>{result?.message ?? ''}</span>
      </div>
    </SuccessCallout>
  )
}

function AdjustInventoryResult({ result }: { result: any }) {
  if (result?.error) {
    return <p className="text-xs text-red-600">{result.error}</p>
  }
  return (
    <SuccessCallout title="Inventory adjusted" icon={Wrench}>
      <div className="space-y-1">
        <div className="font-mono text-slate-800">
          {result?.previousQuantity ?? 0} → {result?.newQuantity ?? 0}
          <span className="ml-2 font-sans text-slate-500">pcs</span>
        </div>
        <p>{result?.message ?? ''}</p>
      </div>
    </SuccessCallout>
  )
}

function TriggerPrintResult({ result }: { result: any }) {
  if (result?.error) {
    return <p className="text-xs text-red-600">{result.error}</p>
  }
  return (
    <SuccessCallout title="Print job triggered" icon={Printer}>
      <div className="space-y-1">
        <p>{result?.message ?? ''}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            <span className="text-slate-500">Facility:</span>{' '}
            <span className="font-medium text-slate-800">
              {result?.facility ?? '—'}
            </span>
          </span>
          {typeof result?.estimatedPrintHours === 'number' && (
            <span>
              <span className="text-slate-500">Est. print hours:</span>{' '}
              <span className="font-mono text-slate-800">
                {result.estimatedPrintHours}h
              </span>
            </span>
          )}
        </div>
      </div>
    </SuccessCallout>
  )
}

// Dispatch on tool name → render the right result component
function ResultRenderer({ tool, result }: { tool: string; result: any }) {
  if (!result) return null
  switch (tool) {
    case 'answer_question':
      return <AnswerQuestionResult result={result} />
    case 'list_low_stock':
      return <ListLowStockResult result={result} />
    case 'find_am_candidates':
      return <AmCandidatesResult result={result} />
    case 'find_knowledge':
      return <KnowledgeResult result={result} />
    case 'generate_onboarding':
      return <OnboardingResult result={result} />
    case 'create_order':
      return <CreateOrderResult result={result} />
    case 'adjust_inventory':
      return <AdjustInventoryResult result={result} />
    case 'trigger_print':
      return <TriggerPrintResult result={result} />
    default:
      return (
        <pre className="max-h-64 overflow-auto rounded border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700">
          {JSON.stringify(result, null, 2)}
        </pre>
      )
  }
}

// ─── Cross-dashboard navigation helpers ───────────────────────────────────────

interface NavTarget {
  label: string
  pageId: string
}

// Map a tool + status to the list of related dashboards worth jumping to.
// `answer_question` returns no targets (it's a pure answer).
function getToolNavTargets(tool: string, status: AgentStatus): NavTarget[] {
  const targets: NavTarget[] = []
  switch (tool) {
    case 'list_low_stock':
      targets.push({ label: 'Open Smart Inventory', pageId: 'smart_inventory' })
      break
    case 'find_am_candidates':
      targets.push({ label: 'Open Part Scanner', pageId: 'ai_part_scanner' })
      targets.push({ label: 'Open AM Feasibility', pageId: 'feasibility' })
      break
    case 'find_knowledge':
      targets.push({ label: 'Open Workforce Knowledge', pageId: 'workforce_knowledge' })
      break
    case 'generate_onboarding':
      targets.push({ label: 'Open Workforce Knowledge', pageId: 'workforce_knowledge' })
      break
    case 'create_order':
      if (status === 'awaiting_approval') {
        targets.push({ label: 'Open Orders', pageId: 'orders' })
      }
      break
    case 'adjust_inventory':
      if (status === 'awaiting_approval') {
        targets.push({ label: 'Open Smart Inventory', pageId: 'smart_inventory' })
      }
      break
    case 'trigger_print':
      if (status === 'awaiting_approval') {
        targets.push({ label: 'Open My Printers', pageId: 'my_printers' })
      }
      break
    case 'answer_question':
    default:
      break
  }
  return targets
}

// Contextual nav buttons rendered at the bottom of an agent result card.
function ResultNavButtons({
  targets,
  onNavigate,
}: {
  targets: NavTarget[]
  onNavigate?: (pageId: string) => void
}) {
  if (!onNavigate || targets.length === 0) return null
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-2.5">
      <span className="mr-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        <Link2 className="h-3 w-3" />
        Jump to
      </span>
      {targets.map((t) => (
        <Button
          key={t.pageId}
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onNavigate(t.pageId)}
          className="h-7 gap-1 px-2 text-xs text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          {t.label}
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      ))}
    </div>
  )
}

// Static catalogue of connected dashboards for the top-of-component cross-link bar.
const CONNECTED_DASHBOARDS: {
  pageId: string
  label: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
  accent: string
}[] = [
  {
    pageId: 'smart_inventory',
    label: 'Smart Inventory',
    description: 'Manage stock manually or via AI',
    Icon: Boxes,
    accent: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-300',
  },
  {
    pageId: 'workforce_knowledge',
    label: 'Workforce Knowledge',
    description: 'Senior expert knowledge base',
    Icon: GraduationCap,
    accent: 'text-violet-600 bg-violet-50 border-violet-200 hover:border-violet-300',
  },
  {
    pageId: 'ai_part_scanner',
    label: 'AI Part Scanner',
    description: 'Find AM candidates',
    Icon: Brain,
    accent: 'text-teal-600 bg-teal-50 border-teal-200 hover:border-teal-300',
  },
  {
    pageId: 'feasibility',
    label: 'AM Feasibility',
    description: '30-second AM verdict',
    Icon: Zap,
    accent: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-300',
  },
  {
    pageId: 'physical_inventory',
    label: 'Physical Inventory',
    description: 'All spare parts',
    Icon: Database,
    accent: 'text-slate-600 bg-slate-50 border-slate-200 hover:border-slate-300',
  },
  {
    pageId: 'audit',
    label: 'Audit Chain',
    description: 'Full system audit log',
    Icon: FileText,
    accent: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-300',
  },
]

function ConnectedDashboardsBar({
  onNavigate,
}: {
  onNavigate?: (pageId: string) => void
}) {
  const interactive = typeof onNavigate === 'function'
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Link2 className="h-3.5 w-3.5 text-emerald-500" />
        Connected Dashboards
        <span className="ml-1 text-[10px] font-normal normal-case text-slate-400">
          — jump straight to the related console
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {CONNECTED_DASHBOARDS.map((d) => {
          const cls = `group flex w-[180px] shrink-0 cursor-pointer flex-col gap-1 rounded-lg border bg-white p-3 text-left transition-all hover:shadow-md ${d.accent} ${
            interactive ? '' : 'opacity-50 cursor-not-allowed hover:shadow-none'
          }`
          if (!interactive) {
            return (
              <div key={d.pageId} className={cls} aria-disabled="true">
                <div className="flex items-center gap-1.5">
                  <d.Icon className="h-4 w-4" />
                  <span className="text-xs font-semibold text-slate-800">
                    {d.label}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-slate-500">
                  {d.description}
                </p>
              </div>
            )
          }
          return (
            <button
              key={d.pageId}
              type="button"
              onClick={() => onNavigate?.(d.pageId)}
              className={cls}
              title={d.description}
            >
              <div className="flex items-center gap-1.5">
                <d.Icon className="h-4 w-4" />
                <span className="text-xs font-semibold text-slate-800">
                  {d.label}
                </span>
                <ArrowUpRight className="ml-auto h-3 w-3 text-slate-300 transition-colors group-hover:text-slate-500" />
              </div>
              <p className="text-[11px] leading-snug text-slate-500">
                {d.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Agent message bubble ─────────────────────────────────────────────────────

function AgentMessage({
  message,
  onApprove,
  onDismiss,
  approving,
  onNavigate,
}: {
  message: ChatMessage
  onApprove: (msgId: string) => void
  onDismiss: (msgId: string) => void
  approving: boolean
  onNavigate?: (pageId: string) => void
}) {
  const resp = message.response
  if (!resp && !message.thinking) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-muted p-3.5">
          {/* Thinking shimmer */}
          {message.thinking && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span>Agent is thinking</span>
              <span className="inline-flex gap-1">
                <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
              </span>
            </div>
          )}

          {!message.thinking && resp && (
            <>
              <p className="text-sm font-medium text-slate-800">
                {resp.plan?.userFacingSummary ?? resp.plan?.intent ?? 'Done.'}
              </p>

              {/* Badges row */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <IntentBadge tool={resp.plan?.tool ?? ''} />
                <ConfidenceBadge confidence={resp.plan?.confidence ?? 0} />
                <StatusBadge
                  status={resp.status}
                  autoExecuted={resp.autoExecuted}
                />
              </div>

              {/* Reasoning */}
              {resp.plan?.reasoning && (
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-600">Reasoning:</span>{' '}
                  {resp.plan.reasoning}
                </p>
              )}

              {/* Error */}
              {resp.status === 'failed' && resp.error && (
                <div className="mt-2 rounded border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
                  {resp.error}
                </div>
              )}

              {/* Auto-executed result */}
              {(resp.status === 'executed' || resp.status === 'answered') &&
                resp.result && (
                  <div className="mt-3">
                    <Separator className="mb-3 bg-slate-200" />
                    <ResultRenderer tool={resp.plan?.tool ?? ''} result={resp.result} />
                  </div>
                )}

              {/* Awaiting approval */}
              {resp.status === 'awaiting_approval' && (
                <div className="mt-3 space-y-2">
                  <Separator className="bg-slate-200" />
                  <div className="rounded-md border border-amber-200 bg-amber-50/60 p-2.5 text-xs text-amber-800">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Approval required
                    </div>
                    <p className="mt-1 text-amber-700">
                      This action writes to the database. Review the plan above,
                      then approve to execute.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApprove(message.id)}
                      disabled={approving}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {approving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      Approve &amp; Execute
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDismiss(message.id)}
                      disabled={approving}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}

              {/* Cross-dashboard navigation buttons — context-aware per tool/status */}
              {(() => {
                const targets = getToolNavTargets(
                  resp.plan?.tool ?? '',
                  resp.status,
                )
                return (
                  <ResultNavButtons targets={targets} onNavigate={onNavigate} />
                )
              })()}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── User message bubble ──────────────────────────────────────────────────────

function UserMessage({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end gap-2.5"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground shadow-sm">
        {text}
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
        <User className="h-4 w-4" />
      </div>
    </motion.div>
  )
}

// ─── Audit feed sidebar ───────────────────────────────────────────────────────

function AuditFeed({
  logs,
  loading,
  onRefresh,
}: {
  logs: AuditLog[]
  loading: boolean
  onRefresh: () => void
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-slate-500" />
            Recent Agent Actions
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={loading}
            className="h-7 px-2"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Full audit trail — every request, plan, and execution the agent has
          performed.
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="max-h-[600px] overflow-y-auto px-4 pb-4 thin-scroll">
          {logs.length === 0 && !loading ? (
            <div className="rounded-md border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
              No agent actions yet. Send a request to start the trail.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const family = toolFamily(log.tool)
                const fstyle = FAMILY_STYLES[family]
                const isExec = log.status === 'executed'
                const isSug = log.status === 'suggested'
                const isFail = log.status === 'failed'
                return (
                  <div
                    key={log.actionId}
                    className="rounded-md border border-slate-200 bg-white p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${fstyle.dot}`} />
                        <span className="font-mono text-[10px] text-slate-400">
                          {log.actionId}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        {timeAgo(log.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-slate-700">{log.request}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${fstyle.badge}`}
                      >
                        {TOOL_META[log.tool]?.label ?? log.tool}
                      </Badge>
                      {isExec && (
                        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {log.autoExecuted ? 'Auto' : 'Executed'}
                        </Badge>
                      )}
                      {isSug && (
                        <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[10px]">
                          <ShieldCheck className="h-2.5 w-2.5" />
                          Awaiting
                        </Badge>
                      )}
                      {isFail && (
                        <Badge className="border-red-200 bg-red-50 text-red-700 text-[10px]">
                          <XCircle className="h-2.5 w-2.5" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    {log.confidence != null && (
                      <div className="mt-1 text-[10px] text-slate-400">
                        {Math.round((log.confidence ?? 0) * 100)}% confidence
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AIAgentConsole({
  onNavigate,
}: {
  onNavigate?: (pageId: string) => void
} = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ── Fetch audit feed ─────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true)
    try {
      const res = await fetch('/api/ai/agent?limit=20', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setLogs((json.logs as AuditLog[]) ?? [])
    } catch (e: any) {
      // Silent — the audit feed is secondary
      console.error('audit feed fetch failed', e)
    } finally {
      setLogsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // ── Auto-scroll to bottom when new messages arrive ───────────────────────
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages])

  // ── Send a new request ───────────────────────────────────────────────────
  const sendRequest = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || sending) return

      const userMsgId = genId('u')
      const agentMsgId = genId('a')
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        text: trimmed,
      }
      const thinkingMsg: ChatMessage = {
        id: agentMsgId,
        role: 'agent',
        thinking: true,
      }
      setMessages((prev) => [...prev, userMsg, thinkingMsg])
      setInput('')
      setSending(true)

      try {
        const res = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request: trimmed, autoExecute: false }),
        })
        const json = (await res.json()) as AgentResponse
        if (!res.ok) {
          throw new Error(json?.error ?? `HTTP ${res.status}`)
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMsgId
              ? {
                  ...m,
                  thinking: false,
                  response: json,
                }
              : m,
          ),
        )
        // Refresh audit feed so the new action shows up
        fetchLogs()
      } catch (e: any) {
        const errResp: AgentResponse = {
          sessionId: 'sess-error',
          request: trimmed,
          plan: {
            intent: 'unknown',
            tool: 'unknown',
            parameters: {},
            confidence: 0,
            requiresApproval: false,
            reasoning: 'The agent request failed.',
            userFacingSummary: 'Request failed.',
          },
          autoExecuted: false,
          status: 'failed',
          error: e?.message ?? 'Unknown error',
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === agentMsgId
              ? { ...m, thinking: false, response: errResp }
              : m,
          ),
        )
        toast.error('Agent request failed', {
          description: e?.message ?? 'Unknown error',
        })
      } finally {
        setSending(false)
      }
    },
    [sending, fetchLogs],
  )

  // ── Approve an awaiting-approval action ──────────────────────────────────
  const approveAction = useCallback(
    async (msgId: string) => {
      const msg = messages.find((m) => m.id === msgId)
      if (!msg?.response?.actionId) return
      const actionId = msg.response.actionId
      const originalRequest = msg.response.request
      setApprovingId(msgId)
      try {
        const res = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            request: originalRequest,
            mode: 'approve',
            actionId,
          }),
        })
        const json = (await res.json()) as AgentResponse
        if (!res.ok) {
          throw new Error(json?.error ?? `HTTP ${res.status}`)
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, response: json } : m,
          ),
        )
        fetchLogs()
        toast.success('Action approved & executed')
      } catch (e: any) {
        toast.error('Approval failed', {
          description: e?.message ?? 'Unknown error',
        })
      } finally {
        setApprovingId(null)
      }
    },
    [messages, fetchLogs],
  )

  // ── Dismiss an awaiting-approval action (local-only) ─────────────────────
  const dismissAction = useCallback((msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.response
          ? {
              ...m,
              response: {
                ...m.response,
                status: 'failed' as AgentStatus,
                error: 'Dismissed by user.',
              },
            }
          : m,
      ),
    )
  }, [])

  // ── Suggestion click → fill input ────────────────────────────────────────
  const onSuggestionClick = (text: string) => {
    setInput(text)
    inputRef.current?.focus()
  }

  // ── Enter to send, Shift+Enter for newline ───────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendRequest(input)
    }
  }

  const emptyThread = messages.length === 0

  return (
    <div className="space-y-4">
      {/* ─── Header card ─────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    AI Operations Agent
                  </h2>
                  <p className="text-sm text-slate-500">
                    Type a request in plain English. The agent will either
                    answer immediately or propose an action for your approval.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Auto-execute: safe tools
              </Badge>
              <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                <ShieldCheck className="h-3 w-3" />
                Approve: write tools
              </Badge>
            </div>
          </div>

          {/* Interview-grounding quote banner */}
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200/70 bg-gradient-to-r from-amber-50 to-emerald-50/40 p-3">
            <Quote className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="text-sm text-slate-700">
              <span className="italic text-slate-800">
                “The real power [of AI] is that lack of technical expertise.
                There is a real lack. It&apos;s not like it was 30 years ago
                where there was always one person who knew everything. Those
                guys are gone.”
              </span>
              <span className="mt-1 block text-xs font-medium text-slate-500">
                — Jim Granger, former Managing Director, MAN Energy Solutions
                Canada (Interview #23)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Connected dashboards cross-link bar ────────────────────────── */}
      <ConnectedDashboardsBar onNavigate={onNavigate} />

      {/* ─── Suggested prompt chips ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => {
          const fstyle = FAMILY_STYLES[s.family]
          return (
            <button
              key={s.text}
              type="button"
              onClick={() => onSuggestionClick(s.text)}
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-100 ${fstyle.badge}`}
              title={s.hint}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${fstyle.dot}`} />
              <span className="text-slate-800">{s.text}</span>
              <span className="hidden text-[10px] text-slate-400 sm:inline">
                · {s.hint}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── Main grid: chat (2/3) + audit feed (1/3) ───────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chat card */}
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4 text-emerald-500" />
              Agent Console
              <span className="ml-auto text-xs font-normal text-slate-400">
                {messages.length} message{messages.length === 1 ? '' : 's'}
              </span>
            </CardTitle>
          </CardHeader>

          {/* Thread */}
          <div
            ref={threadRef}
            className="max-h-[560px] min-h-[320px] flex-1 space-y-4 overflow-y-auto p-4 thin-scroll"
          >
            {emptyThread && (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Ask the agent anything
                  </p>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Try “Which parts are out of stock?” or “Generate an
                    onboarding plan based on Robert&apos;s knowledge.” The agent
                    auto-runs safe queries and asks for approval on writes.
                  </p>
                </div>
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((m) =>
                m.role === 'user' ? (
                  <UserMessage key={m.id} text={m.text ?? ''} />
                ) : (
                  <AgentMessage
                    key={m.id}
                    message={m}
                    onApprove={approveAction}
                    onDismiss={dismissAction}
                    approving={approvingId === m.id}
                    onNavigate={onNavigate}
                  />
                ),
              )}
            </AnimatePresence>
          </div>

          {/* Sticky input bar */}
          <div className="border-t border-slate-100 p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a request… (Enter to send, Shift+Enter for newline)"
                rows={2}
                disabled={sending}
                className="min-h-[44px] resize-none bg-white text-sm"
              />
              <Button
                onClick={() => sendRequest(input)}
                disabled={sending || !input.trim()}
                className="h-11 shrink-0 bg-slate-900 text-white hover:bg-slate-800"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </Button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400">
              The agent auto-executes read-only tools (list, find, generate,
              answer) and surfaces write tools (order, adjust, print) for your
              approval. Every action is logged to the audit feed.
            </p>
          </div>
        </Card>

        {/* Audit feed */}
        <div className="lg:col-span-1">
          <AuditFeed
            logs={logs}
            loading={logsLoading}
            onRefresh={fetchLogs}
          />
        </div>
      </div>

      {/* Thin custom scrollbar styling — applied via .thin-scroll */}
      <style jsx global>{`
        .thin-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .thin-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .thin-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        .thin-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  )
}
