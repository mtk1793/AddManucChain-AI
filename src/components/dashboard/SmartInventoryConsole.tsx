'use client'

import { useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import {
  Boxes,
  Brain,
  Hand,
  TrendingUp,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Package,
  Warehouse,
  Clock,
  DollarSign,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Loader2,
  Zap,
  Sparkles,
  History,
  Plus,
  Minus,
  Settings2,
  Ban,
  Anchor,
  Ship,
  Building2,
  Wrench,
  Quote,
  ShieldCheck,
  MapPin,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ActionType =
  | 'reorder'
  | 'transfer_surplus'
  | 'flag_slow_mover'
  | 'condemn'
  | 'digitize_for_am'
  | 'safety_stock_adjust'
type DecisionStatus = 'suggested' | 'executed' | 'rejected'
type DecisionSource = 'ai' | 'manual'

interface Transaction {
  action: string
  quantity: number
  performedBy: string
  timestamp: string
  notes: string | null
}

interface Part {
  id: string
  partNumber: string
  name: string
  category: string
  site: string
  siteType: string
  quantity: number
  minStock: number
  unit: string
  condition: string
  unitCost: number
  hasBlueprint: boolean
  blueprintId: string | null
  material: string | null
  lastUsed: string | null
  lastInspected: string | null
  notes: string | null
  siteName: string
  recentTransactions: Transaction[]
}

interface AiDecision {
  partId: string
  partName: string
  siteName: string
  action: ActionType
  currentQty: number
  suggestedQty: number | null
  reasoning: string
  confidence: number
  estImpact: string
  targetFacilityId?: string | null
  targetFacilityName?: string | null
  sourcePartId?: string | null
}

interface AuditEntry {
  id: string
  decisionId: string
  partId: string
  partName: string
  siteName: string
  action: ActionType
  currentQty: number
  suggestedQty: number | null
  reasoning: string
  confidence: number
  estImpact: string | null
  status: DecisionStatus
  source: DecisionSource
  approvedBy: string | null
  executedAt: string | null
  createdAt: string
}

interface Analysis {
  decisions: AiDecision[]
  narrative: string
  summary: {
    total: number
    byAction: Record<string, number>
    avgConfidence: number
    highConfidence: number
  }
}

interface StockHealth {
  totalParts: number
  outOfStock: number
  belowMin: number
  healthy: number
  totalValue: number
  condemnedOnBooks: number
}

interface ApiResponse {
  analysis: Analysis | null
  auditLog: AuditEntry[]
  parts: Part[]
  stockHealth: StockHealth
  sites: Array<{ id: string; name: string; type: string }>
}

// ─── Style maps ──────────────────────────────────────────────────────────────

const ACTION_META: Record<
  ActionType,
  { label: string; short: string; icon: any; bg: string; text: string; border: string }
> = {
  digitize_for_am: {
    label: 'Digitize for AM',
    short: 'Digitize',
    icon: Sparkles,
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  reorder: {
    label: 'Reorder',
    short: 'Reorder',
    icon: Package,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  transfer_surplus: {
    label: 'Transfer Surplus',
    short: 'Transfer',
    icon: ArrowRight,
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  flag_slow_mover: {
    label: 'Flag Slow Mover',
    short: 'Slow Mover',
    icon: Clock,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  condemn: {
    label: 'Condemn',
    short: 'Condemn',
    icon: Ban,
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  safety_stock_adjust: {
    label: 'Safety Stock Adj.',
    short: 'Stock Adj.',
    icon: Settings2,
    bg: 'bg-slate-200',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
}

const CONDITION_META: Record<
  string,
  { label: string; bg: string; text: string; icon: any }
> = {
  new: { label: 'New', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Check },
  serviceable: { label: 'Serviceable', bg: 'bg-sky-100', text: 'text-sky-700', icon: Wrench },
  used: { label: 'Used', bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  condemned: { label: 'Condemned', bg: 'bg-red-100', text: 'text-red-700', icon: Ban },
}

const STATUS_META: Record<DecisionStatus, { label: string; bg: string; text: string }> = {
  executed: { label: 'Executed', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  suggested: { label: 'Suggested', bg: 'bg-amber-100', text: 'text-amber-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700' },
}

const SOURCE_META: Record<
  DecisionSource,
  { label: string; bg: string; text: string; icon: any }
> = {
  ai: { label: 'AI', bg: 'bg-violet-100', text: 'text-violet-700', icon: Brain },
  manual: { label: 'Manual', bg: 'bg-slate-200', text: 'text-slate-700', icon: Hand },
}

const SITE_TYPE_ICON: Record<string, any> = {
  offshore_rig: Anchor,
  vessel: Ship,
  onshore_yard: Building2,
  warehouse: Warehouse,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const diff = Date.now() - then
  const sec = Math.floor(diff / 1000)
  if (sec < 0) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  return new Date(iso).toLocaleDateString()
}

function qtyClass(qty: number, min: number): string {
  if (qty === 0) return 'text-red-600 font-bold'
  if (qty <= min) return 'text-amber-600 font-bold'
  return 'text-emerald-700 font-semibold'
}

function ActionBadge({ action, short = false }: { action: ActionType; short?: boolean }) {
  const m = ACTION_META[action] ?? ACTION_META.safety_stock_adjust
  const Icon = m.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text} border ${m.border}`}
    >
      <Icon className="h-3 w-3" /> {short ? m.short : m.label}
    </span>
  )
}

function SourceBadge({ source }: { source: DecisionSource }) {
  const m = SOURCE_META[source]
  const Icon = m.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}
    >
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  )
}

function StatusBadge({ status }: { status: DecisionStatus }) {
  const m = STATUS_META[status]
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}
    >
      {m.label}
    </span>
  )
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const cls =
    confidence >= 0.85
      ? 'bg-emerald-100 text-emerald-700'
      : confidence >= 0.7
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-200 text-slate-700'
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${cls}`}
    >
      {pct}%
    </span>
  )
}

function ConditionBadge({ condition }: { condition: string }) {
  const m = CONDITION_META[condition] ?? {
    label: condition,
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    icon: Package,
  }
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  )
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  icon: any
  accent: 'slate' | 'red' | 'amber' | 'emerald'
}) {
  const accents = {
    slate: { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200', iconBg: 'bg-slate-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', iconBg: 'bg-red-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', iconBg: 'bg-amber-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', iconBg: 'bg-emerald-100' },
  }
  const a = accents[accent]
  return (
    <Card className={`${a.bg} ring-1 ${a.ring} border-0`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${a.text}`}>{value}</p>
          </div>
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.iconBg} ${a.text}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Smart Inventory Console
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Manage physical spare parts manually or let the AI handle it — every action is audit-logged.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Quote className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div className="space-y-1">
              <p className="text-sm italic text-slate-700">
                “Apply AI to inventory management so there can be notifications or forewarning that
                this set of parts is going to be problematic.”
              </p>
              <p className="text-xs font-medium text-slate-500">
                — Cameron Munro, Defence Scientist, DRDC #81
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── KPI Row ─────────────────────────────────────────────────────────────────

function KpiRow({
  health,
  loading,
  onRefresh,
}: {
  health: StockHealth | undefined
  loading: boolean
  onRefresh: () => void
}) {
  const h = health
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Stock Health
        </h2>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Total Parts"
          value={h ? String(h.totalParts) : '—'}
          icon={Boxes}
          accent="slate"
        />
        <KpiCard
          label="Out of Stock"
          value={h ? String(h.outOfStock) : '—'}
          icon={AlertTriangle}
          accent="red"
        />
        <KpiCard
          label="Below Min"
          value={h ? String(h.belowMin) : '—'}
          icon={TrendingUp}
          accent="amber"
        />
        <KpiCard
          label="Healthy"
          value={h ? String(h.healthy) : '—'}
          icon={Check}
          accent="emerald"
        />
        <KpiCard
          label="Total Inventory Value"
          value={h ? formatCurrency(h.totalValue) : '—'}
          icon={DollarSign}
          accent="slate"
        />
        <KpiCard
          label="Condemned Still On Books"
          value={h ? String(h.condemnedOnBooks) : '—'}
          icon={Ban}
          accent={h && h.condemnedOnBooks > 0 ? 'red' : 'slate'}
        />
      </div>
    </div>
  )
}

// ─── Mode Toggle ─────────────────────────────────────────────────────────────

function ModeToggle({
  mode,
  setMode,
  analyzing,
}: {
  mode: 'manual' | 'ai'
  setMode: (m: 'manual' | 'ai') => void
  analyzing: boolean
}) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
              mode === 'manual'
                ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                mode === 'manual' ? 'bg-white/15' : 'bg-slate-100'
              }`}
            >
              <Hand className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">Manual Mode</span>
                {mode === 'manual' && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`mt-0.5 text-xs ${
                  mode === 'manual' ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Operator adjusts stock by hand. Quick +1/−1 and full adjust dialog.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('ai')}
            disabled={analyzing}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all disabled:opacity-60 ${
              mode === 'ai'
                ? 'border-violet-600 bg-violet-600 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                mode === 'ai' ? 'bg-white/15' : 'bg-violet-100'
              }`}
            >
              {analyzing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Brain className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold">AI Assist Mode</span>
                {mode === 'ai' && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`mt-0.5 text-xs ${
                  mode === 'ai' ? 'text-violet-100' : 'text-slate-500'
                }`}
              >
                AI analyzes inventory, suggests decisions, executes with full audit trail.
              </p>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Parts Table (shared) ────────────────────────────────────────────────────

function PartsTable({
  parts,
  mode,
  expandedPart,
  setExpandedPart,
  onAdjust,
  onConsume,
  onReceive,
}: {
  parts: Part[]
  mode: 'manual' | 'ai'
  expandedPart: string | null
  setExpandedPart: (id: string | null) => void
  onAdjust: (p: Part) => void
  onConsume: (p: Part) => void
  onReceive: (p: Part) => void
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-slate-500" />
            <CardTitle className="text-base">Parts Inventory</CardTitle>
            <Badge variant="secondary" className="ml-1">
              {parts.length} parts
            </Badge>
          </div>
          <span className="text-xs text-slate-500">
            {mode === 'manual'
              ? 'Use row actions to adjust stock'
              : 'Read-only — AI suggests actions below'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-8" />
                <TableHead className="min-w-[120px]">Part #</TableHead>
                <TableHead className="min-w-[180px]">Name</TableHead>
                <TableHead className="min-w-[160px]">Site</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-center">Min</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Blueprint</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead>Last Used</TableHead>
                {mode === 'manual' && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((p) => {
                const expanded = expandedPart === p.id
                const SiteIcon = SITE_TYPE_ICON[p.siteType] ?? Warehouse
                return (
                  <Fragment key={p.id}>
                    <TableRow className="group">
                      <TableCell className="p-2">
                        <button
                          type="button"
                          onClick={() => setExpandedPart(expanded ? null : p.id)}
                          className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label={expanded ? 'Collapse' : 'Expand'}
                        >
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {p.partNumber}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.category}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <SiteIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">{p.siteName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={qtyClass(p.quantity, p.minStock)}>{p.quantity}</span>
                        <span className="text-xs text-slate-400"> {p.unit}</span>
                      </TableCell>
                      <TableCell className="text-center text-slate-500">{p.minStock}</TableCell>
                      <TableCell>
                        <ConditionBadge condition={p.condition} />
                      </TableCell>
                      <TableCell>
                        {p.hasBlueprint ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                                  <FileText className="h-3 w-3" />
                                  {p.blueprintId}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Material: {p.material ?? '—'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-slate-600">
                        {formatCurrency(p.unitCost)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {p.lastUsed ? relativeTime(p.lastUsed) : '—'}
                      </TableCell>
                      {mode === 'manual' && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50"
                                    onClick={() => onReceive(p)}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Receive +1</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                    onClick={() => onConsume(p)}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Consume -1</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 px-2 text-xs"
                              onClick={() => onAdjust(p)}
                            >
                              <Settings2 className="h-3 w-3" /> Adjust…
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    {expanded && (
                      <TableRow className="bg-slate-50/60">
                        <TableCell colSpan={mode === 'manual' ? 11 : 10} className="p-4">
                          <PartDetail p={p} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
              {parts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No parts loaded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile stacked cards */}
        <div className="space-y-3 p-3 md:hidden">
          {parts.map((p) => {
            const SiteIcon = SITE_TYPE_ICON[p.siteType] ?? Warehouse
            const expanded = expandedPart === p.id
            return (
              <Card key={p.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="font-mono text-xs text-slate-500">{p.partNumber}</div>
                    </div>
                    <span className={`text-lg ${qtyClass(p.quantity, p.minStock)}`}>
                      {p.quantity}
                      <span className="text-xs font-normal text-slate-400"> / {p.minStock} min</span>
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <ConditionBadge condition={p.condition} />
                    {p.hasBlueprint && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                        <FileText className="h-3 w-3" /> {p.blueprintId}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      <SiteIcon className="h-3 w-3" /> {p.siteName}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatCurrency(p.unitCost)} / {p.unit}</span>
                    <span>Last used: {p.lastUsed ? relativeTime(p.lastUsed) : '—'}</span>
                  </div>
                  {mode === 'manual' && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-emerald-700"
                        onClick={() => onReceive(p)}
                      >
                        <Plus className="h-3.5 w-3.5" /> Receive
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-red-700"
                        onClick={() => onConsume(p)}
                      >
                        <Minus className="h-3.5 w-3.5" /> Consume
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1"
                        onClick={() => onAdjust(p)}
                      >
                        <Settings2 className="h-3.5 w-3.5" /> Adjust
                      </Button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedPart(expanded ? null : p.id)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500"
                  >
                    {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    {expanded ? 'Hide details' : 'Show details'}
                  </button>
                  {expanded && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <PartDetail p={p} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function PartDetail({ p }: { p: Part }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Part Info
        </h4>
        <dl className="space-y-1 text-xs">
          <div className="flex justify-between">
            <dt className="text-slate-400">Material</dt>
            <dd className="font-medium text-slate-700">{p.material ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Category</dt>
            <dd className="font-medium text-slate-700">{p.category}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Last Inspected</dt>
            <dd className="font-medium text-slate-700">
              {p.lastInspected ? relativeTime(p.lastInspected) : '—'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Unit Cost</dt>
            <dd className="font-medium text-slate-700">{formatCurrency(p.unitCost)}</dd>
          </div>
        </dl>
        {p.notes && (
          <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-800">
            <span className="font-semibold">Note: </span>
            {p.notes}
          </div>
        )}
      </div>
      <div className="lg:col-span-2">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recent Transactions
        </h4>
        {p.recentTransactions && p.recentTransactions.length > 0 ? (
          <div className="max-h-40 overflow-y-auto pr-1">
            <ul className="space-y-1.5">
              {p.recentTransactions.map((t, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md bg-white px-3 py-1.5 text-xs ring-1 ring-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        t.action === 'received'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : t.action === 'consumed'
                            ? 'border-slate-200 bg-slate-50 text-slate-600'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                      }
                    >
                      {t.action}
                    </Badge>
                    <span className="font-medium text-slate-700">
                      {t.action === 'consumed' ? '−' : '+'}
                      {t.quantity}
                    </span>
                    <span className="text-slate-400">by {t.performedBy}</span>
                  </div>
                  <span className="text-slate-400">{relativeTime(t.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No recent transactions.</p>
        )}
      </div>
    </div>
  )
}

// ─── Manual Panel ────────────────────────────────────────────────────────────

function ManualPanel({
  parts,
  openAdjust,
}: {
  parts: Part[]
  openAdjust: (p: Part) => void
}) {
  const lowStock = parts.filter((p) => p.quantity <= p.minStock)
  return (
    <Card className="border-slate-900/10 bg-slate-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Hand className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Manual Operations</CardTitle>
            <CardDescription className="text-xs">
              Operator-driven stock adjustments. Every change is written to the audit trail.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lowStock.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="text-xs text-amber-800">
              <span className="font-semibold">{lowStock.length} part(s)</span> are at or below
              minimum stock. Use the row “Adjust…” button to receive new units, or switch to AI
              Assist Mode to let the AI recommend replenishment.
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Quick guide:</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
            <Plus className="h-3 w-3 text-emerald-600" /> Receive +1
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
            <Minus className="h-3 w-3 text-red-600" /> Consume −1 (confirm)
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
            <Settings2 className="h-3 w-3" /> Adjust… (full dialog)
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lowStock.slice(0, 6).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg bg-white p-3 ring-1 ring-slate-200"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-800">{p.name}</div>
                <div className="text-xs text-slate-400">
                  {p.quantity} / {p.minStock} min · {p.siteName}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
                onClick={() => openAdjust(p)}
              >
                <Settings2 className="h-3 w-3" /> Adjust
              </Button>
            </div>
          ))}
        </div>
        {lowStock.length === 0 && (
          <p className="text-xs text-slate-500">
            All parts are above minimum stock. Use the table above to make adjustments.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── AI Panel ────────────────────────────────────────────────────────────────

function AiPanel({
  analysis,
  analyzing,
  onRun,
  decisions,
  auditLog,
  onApprove,
  onReject,
  executingId,
  onAutoAll,
  highConfCount,
}: {
  analysis: Analysis | null
  analyzing: boolean
  onRun: () => void
  decisions: AiDecision[]
  auditLog: AuditEntry[]
  onApprove: (d: AiDecision) => void
  onReject: (d: AiDecision) => void
  executingId: string | null
  onAutoAll: () => void
  highConfCount: number
}) {
  const suggestedEntries = auditLog.filter((a) => a.source === 'ai' && a.status === 'suggested')

  return (
    <div className="space-y-4">
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">AI Inventory Analysis</CardTitle>
                <CardDescription className="text-xs">
                  LLM analyzes the full inventory and produces prioritized, audited decisions.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={onRun}
                disabled={analyzing}
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Run AI Analysis
                  </>
                )}
              </Button>
              {analysis && highConfCount > 0 && (
                <Button
                  onClick={onAutoAll}
                  variant="outline"
                  className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Auto-Execute {highConfCount} High-Conf
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {analyzing && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 ring-1 ring-violet-100">
              <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  AI is analyzing the inventory…
                </p>
                <p className="text-xs text-slate-500">
                  Scanning every part, matching blueprints & facilities, scoring confidence.
                  This can take 5–15 seconds.
                </p>
              </div>
            </div>
          )}

          {!analyzing && !analysis && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 text-center ring-1 ring-slate-100">
              <Brain className="h-8 w-8 text-slate-300" />
              <div>
                <p className="text-sm font-medium text-slate-700">No analysis yet</p>
                <p className="text-xs text-slate-500">
                  Click <span className="font-semibold">Run AI Analysis</span> to let the LLM
                  evaluate every part and produce suggested decisions.
                </p>
              </div>
            </div>
          )}

          {!analyzing && analysis && (
            <>
              {/* Narrative */}
              <div className="rounded-lg bg-white p-4 ring-1 ring-violet-100">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                      AI Narrative
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{analysis.narrative}</p>
                  </div>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs text-slate-500">Total Decisions</p>
                  <p className="mt-0.5 text-xl font-bold text-slate-900">
                    {analysis.summary.total}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs text-slate-500">Avg Confidence</p>
                  <p className="mt-0.5 text-xl font-bold text-slate-900">
                    {Math.round(analysis.summary.avgConfidence * 100)}%
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs text-slate-500">High-Confidence</p>
                  <p className="mt-0.5 text-xl font-bold text-emerald-700">
                    {analysis.summary.highConfidence}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs text-slate-500">By Action</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Object.entries(analysis.summary.byAction).map(([k, v]) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200"
                      >
                        {k.replace(/_/g, ' ')}: {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Suggested decisions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Suggested Decisions
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      ({decisions.length} pending · {suggestedEntries.length} in audit queue)
                    </span>
                  </h3>
                </div>
                {decisions.length === 0 ? (
                  <div className="rounded-lg bg-white p-6 text-center ring-1 ring-slate-100">
                    <Check className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                    <p className="text-sm text-slate-600">
                      No pending decisions — all suggestions have been approved or rejected.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <AnimatePresence>
                      {decisions.map((d) => (
                        <DecisionCard
                          key={`${d.partId}-${d.action}`}
                          d={d}
                          onApprove={onApprove}
                          onReject={onReject}
                          executing={!!executingId && executingId === d.partId + d.action}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DecisionCard({
  d,
  onApprove,
  onReject,
  executing,
}: {
  d: AiDecision
  onApprove: (d: AiDecision) => void
  onReject: (d: AiDecision) => void
  executing: boolean
}) {
  const m = ACTION_META[d.action] ?? ACTION_META.safety_stock_adjust
  const ActionIcon = m.icon
  const impactIsRisk = /downtime|risk|fail|stockout/i.test(d.estImpact)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="rounded-lg bg-white p-4 ring-1 ring-slate-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{d.partName}</div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3" /> {d.siteName}
          </div>
        </div>
        <ActionBadge action={d.action} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <ConfidenceBadge confidence={d.confidence} />
        <span className="text-xs text-slate-400">confidence</span>
        {d.targetFacilityName && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-xs text-violet-700">
            <Building2 className="h-3 w-3" /> {d.targetFacilityName}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-600">{d.reasoning}</p>

      {d.estImpact && (
        <div
          className={`mt-2 flex items-start gap-1.5 rounded-md p-2 text-xs ${
            impactIsRisk
              ? 'bg-amber-50 text-amber-800'
              : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          {impactIsRisk ? (
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          ) : (
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          <span>{d.estImpact}</span>
        </div>
      )}

      {d.suggestedQty !== null && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="rounded-md bg-red-50 px-2 py-1 font-mono font-semibold text-red-700">
            {d.currentQty}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="rounded-md bg-emerald-50 px-2 py-1 font-mono font-semibold text-emerald-700">
            {d.suggestedQty}
          </span>
          <span className="text-slate-400">target qty</span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => onApprove(d)}
          disabled={executing}
          className="h-8 flex-1 gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {executing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(d)}
          disabled={executing}
          className="h-8 gap-1 border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          <X className="h-3.5 w-3.5" /> Reject
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Audit Trail ─────────────────────────────────────────────────────────────

type AuditFilter = 'all' | 'ai' | 'manual' | 'executed' | 'suggested'

function AuditTrail({
  entries,
  filter,
  setFilter,
  onRefresh,
  loading,
}: {
  entries: AuditEntry[]
  filter: AuditFilter
  setFilter: (f: AuditFilter) => void
  onRefresh: () => void
  loading: boolean
}) {
  const filters: { key: AuditFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI only' },
    { key: 'manual', label: 'Manual only' },
    { key: 'executed', label: 'Executed' },
    { key: 'suggested', label: 'Suggested' },
  ]
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <History className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Audit Trail</CardTitle>
              <CardDescription className="text-xs">
                Every decision — AI or manual — logged with timestamp, source, and status.
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No audit entries match this filter.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {entries.map((a) => {
                const isExpanded = expanded.has(a.id)
                return (
                  <li key={a.id} className="px-4 py-3 hover:bg-slate-50/60">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-medium text-slate-400">
                            {relativeTime(a.createdAt)}
                          </span>
                          <ActionBadge action={a.action} short />
                          <SourceBadge source={a.source} />
                          <StatusBadge status={a.status} />
                        </div>
                        <div className="mt-1 truncate text-sm font-medium text-slate-800">
                          {a.partName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" /> {a.siteName}
                          <span className="mx-1 text-slate-300">·</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {a.decisionId}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {a.status === 'executed' && a.approvedBy && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            <ShieldCheck className="h-3 w-3" /> by {a.approvedBy}
                          </span>
                        )}
                        {a.executedAt && (
                          <span className="text-[10px] text-slate-400">
                            {relativeTime(a.executedAt)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggle(a.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-700"
                        >
                          {isExpanded ? 'less' : 'more'}
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 rounded-md bg-slate-50 p-2.5 text-xs">
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Reasoning: </span>
                          {a.reasoning}
                        </p>
                        {a.estImpact && (
                          <p className="text-slate-600">
                            <span className="font-semibold text-slate-700">Impact: </span>
                            {a.estImpact}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                          <span>
                            Qty: <span className="font-mono">{a.currentQty}</span>
                            {a.suggestedQty !== null && (
                              <>
                                {' → '}
                                <span className="font-mono">{a.suggestedQty}</span>
                              </>
                            )}
                          </span>
                          {a.source === 'ai' && (
                            <span>Confidence: {Math.round(a.confidence * 100)}%</span>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Adjust Dialog ───────────────────────────────────────────────────────────

function AdjustDialog({
  open,
  onOpenChange,
  part,
  qty,
  setQty,
  reason,
  setReason,
  performedBy,
  setPerformedBy,
  onSubmit,
  submitting,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  part: Part | null
  qty: string
  setQty: (s: string) => void
  reason: string
  setReason: (s: string) => void
  performedBy: string
  setPerformedBy: (s: string) => void
  onSubmit: () => void
  submitting: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-slate-600" />
            Adjust Stock
          </DialogTitle>
          <DialogDescription>
            {part
              ? `Manually adjust quantity for ${part.name} (${part.partNumber}).`
              : 'Select a part from the table to adjust.'}
          </DialogDescription>
        </DialogHeader>
        {part && (
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-slate-50 p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Qty</span>
                <span className={qtyClass(part.quantity, part.minStock)}>
                  {part.quantity} {part.unit}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-slate-500">Min Stock</span>
                <span className="font-medium text-slate-700">
                  {part.minStock} {part.unit}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-slate-500">Site</span>
                <span className="font-medium text-slate-700">{part.siteName}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adj-qty">New Quantity</Label>
              <Input
                id="adj-qty"
                type="number"
                min={0}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adj-reason">Reason</Label>
              <Textarea
                id="adj-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Received 7 new units from supplier PO-1234"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adj-by">Performed By</Label>
              <Input
                id="adj-by"
                value={performedBy}
                onChange={(e) => setPerformedBy(e.target.value)}
                placeholder="operator"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting || !part}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Check className="mr-2 h-3.5 w-3.5" /> Log Adjustment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function SmartInventoryConsole() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [executingKey, setExecutingKey] = useState<string | null>(null)
  const [autoAllOpen, setAutoAllOpen] = useState(false)
  const [autoAllRunning, setAutoAllRunning] = useState(false)
  const [expandedPart, setExpandedPart] = useState<string | null>(null)

  // Manual adjust dialog state
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustPart, setAdjustPart] = useState<Part | null>(null)
  const [adjustQty, setAdjustQty] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [adjustBy, setAdjustBy] = useState('operator')
  const [adjusting, setAdjusting] = useState(false)

  // Quick action confirm dialogs
  const [consumePart, setConsumePart] = useState<Part | null>(null)
  const [receivePart, setReceivePart] = useState<Part | null>(null)

  const [auditFilter, setAuditFilter] = useState<AuditFilter>('all')
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set())
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())

  // ── Data fetch ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async (fresh = false) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/inventory/smart-manage?fresh=${fresh}`, {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: ApiResponse = await res.json()
      setData(json)
      setRejectedIds(new Set())
      setApprovedIds(new Set())
    } catch (e: any) {
      console.error(e)
      toast.error('Failed to load inventory data', { description: e.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(false)
  }, [fetchData])

  // ── Run AI analysis (fresh=true) ────────────────────────────────────────
  const runAiAnalysis = useCallback(async () => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/inventory/smart-manage?fresh=true', {
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: ApiResponse = await res.json()
      setData(json)
      setRejectedIds(new Set())
      setApprovedIds(new Set())
      toast.success('AI analysis complete', {
        description: json.analysis
          ? `${json.analysis.summary.total} decisions · ${json.analysis.summary.highConfidence} high-confidence`
          : 'No decisions',
      })
    } catch (e: any) {
      console.error(e)
      toast.error('AI analysis failed', { description: e.message })
    } finally {
      setAnalyzing(false)
    }
  }, [])

  // ── Approve (execute) one AI decision ───────────────────────────────────
  const approveDecision = useCallback(
    async (d: AiDecision) => {
      const entry = data?.auditLog.find(
        (a) =>
          a.partId === d.partId &&
          a.action === d.action &&
          a.status === 'suggested' &&
          a.source === 'ai',
      )
      if (!entry) {
        toast.error('Audit row not found', {
          description: 'Refresh the analysis and try again.',
        })
        return
      }
      const key = d.partId + d.action
      setExecutingKey(key)
      try {
        const res = await fetch('/api/inventory/smart-manage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'ai_execute',
            decisionId: entry.decisionId,
            approvedBy: 'operator',
          }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (json.outcome?.error) {
          toast.error(json.outcome.error)
        } else {
          toast.success(`Approved: ${d.partName}`, {
            description: json.outcome?.message,
          })
          setApprovedIds((prev) => new Set(prev).add(entry.decisionId))
        }
        await fetchData(false)
      } catch (e: any) {
        toast.error('Failed to execute decision', { description: e.message })
      } finally {
        setExecutingKey(null)
      }
    },
    [data, fetchData],
  )

  // ── Reject (client-side removal from suggested queue) ───────────────────
  const rejectDecision = useCallback(
    (d: AiDecision) => {
      const entry = data?.auditLog.find(
        (a) =>
          a.partId === d.partId &&
          a.action === d.action &&
          a.status === 'suggested' &&
          a.source === 'ai',
      )
      if (entry) {
        setRejectedIds((prev) => new Set(prev).add(entry.decisionId))
      }
      toast(`Rejected: ${d.partName}`, {
        description: 'Removed from the suggested queue.',
      })
    },
    [data],
  )

  // ── Auto-execute all high-confidence ────────────────────────────────────
  const autoExecuteAll = useCallback(async () => {
    setAutoAllRunning(true)
    try {
      const res = await fetch('/api/inventory/smart-manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ai_auto_all', threshold: 0.8 }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      toast.success(`${json.executedCount} actions executed`, {
        description: json.message ?? 'Auto-executed with confidence ≥ 0.8',
      })
      await fetchData(false)
      setAutoAllOpen(false)
    } catch (e: any) {
      toast.error('Auto-execute failed', { description: e.message })
    } finally {
      setAutoAllRunning(false)
    }
  }, [fetchData])

  // ── Quick action: receive +1 ────────────────────────────────────────────
  const doReceive = useCallback(async () => {
    if (!receivePart) return
    const newQty = receivePart.quantity + 1
    try {
      const res = await fetch('/api/inventory/smart-manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'manual_adjust',
          partId: receivePart.id,
          newQuantity: newQty,
          reason: 'Received 1 unit (quick action)',
          performedBy: 'operator',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success(`Received +1: ${receivePart.name}`, {
        description: `${receivePart.quantity} → ${newQty} pcs`,
      })
      await fetchData(false)
    } catch (e: any) {
      toast.error('Adjustment failed', { description: e.message })
    } finally {
      setReceivePart(null)
    }
  }, [receivePart, fetchData])

  // ── Quick action: consume -1 ────────────────────────────────────────────
  const doConsume = useCallback(async () => {
    if (!consumePart) return
    const newQty = Math.max(0, consumePart.quantity - 1)
    try {
      const res = await fetch('/api/inventory/smart-manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'manual_adjust',
          partId: consumePart.id,
          newQuantity: newQty,
          reason: 'Consumed 1 unit (quick action)',
          performedBy: 'operator',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success(`Consumed -1: ${consumePart.name}`, {
        description: `${consumePart.quantity} → ${newQty} pcs`,
      })
      await fetchData(false)
    } catch (e: any) {
      toast.error('Adjustment failed', { description: e.message })
    } finally {
      setConsumePart(null)
    }
  }, [consumePart, fetchData])

  // ── Open the Adjust dialog for a specific part ──────────────────────────
  const openAdjust = useCallback((p: Part) => {
    setAdjustPart(p)
    setAdjustQty(String(p.quantity))
    setAdjustReason('')
    setAdjustBy('operator')
    setAdjustOpen(true)
  }, [])

  // ── Submit the manual adjust dialog ─────────────────────────────────────
  const submitAdjust = useCallback(async () => {
    if (!adjustPart) return
    const newQty = parseInt(adjustQty, 10)
    if (Number.isNaN(newQty) || newQty < 0) {
      toast.error('Enter a valid quantity (≥ 0)')
      return
    }
    setAdjusting(true)
    try {
      const res = await fetch('/api/inventory/smart-manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'manual_adjust',
          partId: adjustPart.id,
          newQuantity: newQty,
          reason: adjustReason || 'Manual adjustment',
          performedBy: adjustBy || 'operator',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success(`Adjusted: ${adjustPart.name}`, {
        description: `${adjustPart.quantity} → ${newQty} pcs — ${adjustReason || 'no reason given'}`,
      })
      setAdjustOpen(false)
      await fetchData(false)
    } catch (e: any) {
      toast.error('Adjustment failed', { description: e.message })
    } finally {
      setAdjusting(false)
    }
  }, [adjustPart, adjustQty, adjustReason, adjustBy, fetchData])

  // ── Filtered audit log ──────────────────────────────────────────────────
  const filteredAudit = useMemo(() => {
    if (!data?.auditLog) return []
    return data.auditLog.filter((a) => {
      if (auditFilter === 'ai') return a.source === 'ai'
      if (auditFilter === 'manual') return a.source === 'manual'
      if (auditFilter === 'executed') return a.status === 'executed'
      if (auditFilter === 'suggested') return a.status === 'suggested'
      return true
    })
  }, [data, auditFilter])

  // ── Visible AI suggested decisions (exclude client-side approved/rejected) ─
  const visibleDecisions = useMemo(() => {
    if (!data?.analysis?.decisions) return []
    return data.analysis.decisions.filter((d) => {
      const entry = data.auditLog.find(
        (a) =>
          a.partId === d.partId &&
          a.action === d.action &&
          a.status === 'suggested' &&
          a.source === 'ai',
      )
      if (!entry) return false
      if (approvedIds.has(entry.decisionId)) return false
      if (rejectedIds.has(entry.decisionId)) return false
      return true
    })
  }, [data, approvedIds, rejectedIds])

  const highConfCount = data?.analysis?.summary.highConfidence ?? 0

  // ── Loading state ───────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-sm">Loading Smart Inventory Console…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Header />

      <KpiRow
        health={data?.stockHealth}
        loading={loading}
        onRefresh={() => fetchData(false)}
      />

      <ModeToggle mode={mode} setMode={setMode} analyzing={analyzing} />

      <PartsTable
        parts={data?.parts ?? []}
        mode={mode}
        expandedPart={expandedPart}
        setExpandedPart={setExpandedPart}
        onAdjust={openAdjust}
        onConsume={setConsumePart}
        onReceive={setReceivePart}
      />

      {mode === 'manual' ? (
        <ManualPanel parts={data?.parts ?? []} openAdjust={openAdjust} />
      ) : (
        <AiPanel
          analysis={data?.analysis ?? null}
          analyzing={analyzing}
          onRun={runAiAnalysis}
          decisions={visibleDecisions}
          auditLog={data?.auditLog ?? []}
          onApprove={approveDecision}
          onReject={rejectDecision}
          executingId={executingKey}
          onAutoAll={() => setAutoAllOpen(true)}
          highConfCount={highConfCount}
        />
      )}

      <AuditTrail
        entries={filteredAudit}
        filter={auditFilter}
        setFilter={setAuditFilter}
        onRefresh={() => fetchData(false)}
        loading={loading}
      />

      {/* Adjust dialog */}
      <AdjustDialog
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        part={adjustPart}
        qty={adjustQty}
        setQty={setAdjustQty}
        reason={adjustReason}
        setReason={setAdjustReason}
        performedBy={adjustBy}
        setPerformedBy={setAdjustBy}
        onSubmit={submitAdjust}
        submitting={adjusting}
      />

      {/* Receive +1 confirm */}
      <AlertDialog open={!!receivePart} onOpenChange={(o) => !o && setReceivePart(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-600" /> Receive +1 unit
            </AlertDialogTitle>
            <AlertDialogDescription>
              {receivePart && (
                <>
                  Increase <span className="font-medium">{receivePart.name}</span> from{' '}
                  <span className="font-mono">{receivePart.quantity}</span> to{' '}
                  <span className="font-mono">{receivePart.quantity + 1}</span>? This will be
                  logged to the audit trail as a manual adjustment.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doReceive}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Confirm Receive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Consume -1 confirm */}
      <AlertDialog open={!!consumePart} onOpenChange={(o) => !o && setConsumePart(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-red-600" /> Consume -1 unit
            </AlertDialogTitle>
            <AlertDialogDescription>
              {consumePart && (
                <>
                  Decrease <span className="font-medium">{consumePart.name}</span> from{' '}
                  <span className="font-mono">{consumePart.quantity}</span> to{' '}
                  <span className="font-mono">{Math.max(0, consumePart.quantity - 1)}</span>?
                  {consumePart.quantity <= consumePart.minStock && (
                    <span className="mt-1 block font-medium text-amber-700">
                      ⚠ This part is already at or below minimum stock.
                    </span>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doConsume}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Minus className="mr-1 h-3.5 w-3.5" /> Confirm Consume
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auto-execute all confirm */}
      <AlertDialog open={autoAllOpen} onOpenChange={setAutoAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" /> Auto-Execute High-Confidence Decisions
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will execute{' '}
              <span className="font-semibold text-slate-800">{highConfCount} AI decision(s)</span>{' '}
              with confidence ≥ 80% in a single batch. Each action will be audit-logged with
              source = AI and approvedBy = ai_auto. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={autoAllRunning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={autoExecuteAll}
              disabled={autoAllRunning}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              {autoAllRunning ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Executing…
                </>
              ) : (
                <>
                  <Zap className="mr-1 h-3.5 w-3.5" /> Execute {highConfCount} Decision(s)
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SmartInventoryConsole
