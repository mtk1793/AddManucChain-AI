'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Users,
  BookOpen,
  MessageCircleQuestion,
  GraduationCap,
  AlertTriangle,
  Calendar,
  Award,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  ThumbsUp,
  ChevronRight,
  Sparkles,
  UserCircle2,
  Clock,
  CheckCircle2,
  FileText,
  Lightbulb,
  Wrench,
  ShieldAlert,
  BookMarked,
  UserCheck,
  Quote,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Types (mirror the API contracts) ────────────────────────────────────────

type Seniority = 'retiring' | 'senior' | 'mid' | 'junior'
type EmployeeStatus = 'active' | 'departing' | 'retired'
type DocCategory =
  | 'sop'
  | 'lesson_learned'
  | 'troubleshooting'
  | 'procedure'
  | 'safety_bulletin'
  | 'case_study'
type Criticality = 'standard' | 'important' | 'critical'

interface MentorRef {
  employeeId: string
  name: string
  title: string
}
interface MenteeRef {
  employeeId: string
  name: string
  title: string
}
interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  title: string
  department: string
  seniority: Seniority
  hireDate: string
  retirementDate: string | null
  yearsExperience: number
  status: EmployeeStatus
  specialties: string[]
  certifications: string[]
  bio: string
  mentorId: string | null
  mentor: MentorRef | null
  mentees: MenteeRef[]
  knowledgeDocCount: number
  activeTransfersFrom: number
  activeTransfersTo: number
  avatarColor: string
}
interface EmployeeSummary {
  total: number
  retiring: number
  senior: number
  junior: number
  atRiskDocs: number
}
interface EmployeesResponse {
  employees: Employee[]
  departments: string[]
  summary: EmployeeSummary
}

interface DocAuthor {
  employeeId: string
  name: string
  title: string
  seniority: Seniority
  department: string
  yearsExperience: number
  retirementDate: string | null
  avatarColor: string
}
interface KnowledgeDoc {
  id: string
  documentId: string
  title: string
  category: DocCategory
  criticality: Criticality
  summary: string
  content: string
  tags: string[]
  equipmentTags: string[]
  viewCount: number
  helpfulCount: number
  status: string
  publishedAt: string
  author: DocAuthor | null
}
interface KnowledgeDocsResponse {
  documents: KnowledgeDoc[]
  summary: {
    total: number
    critical: number
    byAuthor: Record<string, number>
  }
}
interface KnowledgeDocSingleResponse {
  document: KnowledgeDoc
}

interface CitedDoc {
  documentId: string
  title: string
  author: string
  authorTitle: string
  category: DocCategory
  criticality: Criticality
  relevanceScore: number
}
interface AskSeniorResponse {
  answer: string
  citedDocs: CitedDoc[]
  question: string
  seniorScope: string
}

interface OnboardingMilestone {
  week: string
  milestone: string
}
interface OnboardingPlan {
  newHireTitle: string
  overview: string
  days1to30: string[]
  days31to60: string[]
  days61to90: string[]
  mustReadDocs: string[]
  mustShadowBuilds: string[]
  milestones: OnboardingMilestone[]
  risksOfKnowledgeLoss: string[]
  recommendedMentor: string
}
interface OnboardingSenior {
  employeeId: string
  name: string
  title: string
  department: string
  yearsExperience: number
  retirementDate: string | null
  specialties: string[]
}
interface OnboardingResponse {
  senior: OnboardingSenior
  plan: OnboardingPlan
  docCount: number
  transferCount: number
  generatedAt: string
}

// ─── Style maps (NO indigo/blue — emerald/amber/violet/slate/red/teal only) ──

const SENIORITY_STYLE: Record<
  Seniority,
  { label: string; badge: string; dot: string }
> = {
  retiring: {
    label: 'Retiring',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  senior: {
    label: 'Senior',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  mid: {
    label: 'Mid-level',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
  },
  junior: {
    label: 'Junior',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
}

const CRITICALITY_STYLE: Record<
  Criticality,
  { badge: string; dot: string; label: string }
> = {
  critical: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    label: 'Critical',
  },
  important: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Important',
  },
  standard: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Standard',
  },
}

const CATEGORY_META: Record<
  DocCategory,
  { label: string; icon: typeof BookOpen }
> = {
  sop: { label: 'SOP', icon: FileText },
  lesson_learned: { label: 'Lesson Learned', icon: Lightbulb },
  troubleshooting: { label: 'Troubleshooting', icon: Wrench },
  procedure: { label: 'Procedure', icon: BookOpen },
  safety_bulletin: { label: 'Safety Bulletin', icon: ShieldAlert },
  case_study: { label: 'Case Study', icon: BookMarked },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const target = new Date(iso).getTime()
  if (Number.isNaN(target)) return null
  const diff = target - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Render answer text: line breaks + [KD-xxx] citations as small badges.
function renderAnswer(answer: string) {
  const lines = answer.split(/\n/)
  return lines.map((line, li) => {
    const parts: React.ReactNode[] = []
    const re = /\[(KD-[A-Za-z0-9-]+)\]/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) {
        parts.push(line.slice(last, m.index))
      }
      parts.push(
        <Badge
          key={`${li}-${m.index}`}
          variant="outline"
          className="mx-0.5 px-1.5 py-0 h-4 text-[10px] font-mono bg-emerald-50 text-emerald-700 border-emerald-200 align-middle"
        >
          {m[1]}
        </Badge>,
      )
      last = m.index + m[0].length
    }
    if (last < line.length) parts.push(line.slice(last))
    return (
      <span key={li} className="block">
        {parts.length ? parts : line || '\u00A0'}
      </span>
    )
  })
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon: Icon,
  tint,
  hint,
}: {
  label: string
  value: number | string
  icon: typeof Users
  tint: string
  hint?: string
}) {
  return (
    <Card className="border-slate-200/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
            {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
          </div>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${tint}1A`, color: tint }}
          >
            <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Employee Card ───────────────────────────────────────────────────────────

function EmployeeCard({
  emp,
  onViewProfile,
}: {
  emp: Employee
  onViewProfile: (emp: Employee) => void
}) {
  const sStyle = SENIORITY_STYLE[emp.seniority] ?? SENIORITY_STYLE.junior
  const daysToRet = daysUntil(emp.retirementDate)
  const noDocsWarning =
    emp.seniority === 'retiring' && emp.knowledgeDocCount === 0

  return (
    <Card className="border-slate-200/70 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        {/* Top: avatar + name + title */}
        <div className="flex items-start gap-3">
          <Avatar
            className="w-11 h-11 border-2 border-white shadow-sm shrink-0"
            style={{ backgroundColor: emp.avatarColor }}
          >
            <AvatarFallback
              className="text-white font-semibold text-sm"
              style={{ backgroundColor: emp.avatarColor }}
            >
              {initials(emp.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-800 truncate">{emp.name}</p>
            <p className="text-xs text-slate-500 truncate">{emp.title}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {emp.department} · {emp.employeeId}
            </p>
          </div>
        </div>

        {/* Seniority badge row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 h-5 ${sStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${sStyle.dot}`} />
            {sStyle.label}
          </Badge>
          {emp.seniority === 'retiring' && daysToRet !== null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 bg-amber-50 text-amber-700 border-amber-200"
                >
                  <Clock className="w-2.5 h-2.5 mr-1" />
                  {daysToRet > 0
                    ? `Retiring in ${daysToRet}d`
                    : daysToRet === 0
                      ? 'Retiring today'
                      : 'Past retirement'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Retirement date: {formatDate(emp.retirementDate)}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Years */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Award className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">{emp.yearsExperience}</span>
          <span className="text-slate-400">years experience</span>
        </div>

        {/* Specialties */}
        {emp.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {emp.specialties.slice(0, 3).map((s, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 bg-slate-100 text-slate-600 font-normal"
              >
                {s}
              </Badge>
            ))}
            {emp.specialties.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 bg-white text-slate-500"
                  >
                    +{emp.specialties.length - 3} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-[240px]">
                  {emp.specialties.slice(3).join(', ')}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        <Separator className="bg-slate-100" />

        {/* Doc count + mentor info */}
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              <span className="font-semibold">{emp.knowledgeDocCount}</span>{' '}
              document{emp.knowledgeDocCount === 1 ? '' : 's'} authored
            </span>
          </div>
          {emp.mentor && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <UserCheck className="w-3.5 h-3.5 text-violet-500" />
              <span className="truncate">
                Mentor: <span className="text-slate-700">{emp.mentor.name}</span>
              </span>
            </div>
          )}
          {emp.mentees.length > 0 && (
            <div className="flex items-start gap-1.5 text-slate-500">
              <Users className="w-3.5 h-3.5 text-teal-500 mt-0.5" />
              <span className="truncate">
                Mentoring:{' '}
                <span className="text-slate-700">
                  {emp.mentees.map((m) => m.name).join(', ')}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* No-knowledge warning */}
        {noDocsWarning && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            No knowledge captured yet
          </div>
        )}

        <div className="mt-auto pt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => onViewProfile(emp)}
          >
            <UserCircle2 className="w-3.5 h-3.5 mr-1" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Employee Profile Dialog ─────────────────────────────────────────────────

function EmployeeProfileDialog({
  emp,
  open,
  onOpenChange,
}: {
  emp: Employee | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  useEffect(() => {
    if (!emp || !open) {
      setDocs([])
      return
    }
    let cancelled = false
    setLoadingDocs(true)
    fetch(`/api/knowledge/documents?authorId=${encodeURIComponent(emp.id)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const json: KnowledgeDocsResponse = await r.json()
        if (!cancelled) setDocs(json.documents)
      })
      .catch((e) => {
        console.error(e)
        if (!cancelled) toast.error('Failed to load knowledge docs')
      })
      .finally(() => {
        if (!cancelled) setLoadingDocs(false)
      })
    return () => {
      cancelled = true
    }
  }, [emp, open])

  if (!emp) return null
  const sStyle = SENIORITY_STYLE[emp.seniority] ?? SENIORITY_STYLE.junior

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Avatar
              className="w-14 h-14 border-2 border-white shadow shrink-0"
              style={{ backgroundColor: emp.avatarColor }}
            >
              <AvatarFallback
                className="text-white font-bold"
                style={{ backgroundColor: emp.avatarColor }}
              >
                {initials(emp.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg">{emp.name}</DialogTitle>
              <DialogDescription className="text-sm">
                {emp.title} · {emp.department} · {emp.employeeId}
              </DialogDescription>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-5 ${sStyle.badge}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${sStyle.dot}`}
                  />
                  {sStyle.label}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 bg-slate-50 text-slate-600 border-slate-200"
                >
                  <Award className="w-2.5 h-2.5 mr-1" />
                  {emp.yearsExperience} yrs
                </Badge>
                {emp.retirementDate && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5 bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <Calendar className="w-2.5 h-2.5 mr-1" />
                    Retires {formatDate(emp.retirementDate)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh] pr-2">
          <div className="space-y-4 pr-2">
            {/* Bio */}
            {emp.bio && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Biography
                </p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {emp.bio}
                </p>
              </div>
            )}

            {/* Specialties */}
            {emp.specialties.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                  Specialties
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.specialties.map((s, i) => (
                    <Badge
                      key={i}
                      className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-normal"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {emp.certifications.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.certifications.map((c, i) => (
                    <Badge
                      key={i}
                      className="text-[11px] bg-violet-50 text-violet-700 border border-violet-200 font-normal"
                    >
                      <Award className="w-2.5 h-2.5 mr-1" />
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Mentor / Mentees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emp.mentor && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                    Mentor
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {emp.mentor.name}
                  </p>
                  <p className="text-xs text-slate-500">{emp.mentor.title}</p>
                </div>
              )}
              {emp.mentees.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                    Mentoring ({emp.mentees.length})
                  </p>
                  <ul className="space-y-0.5">
                    {emp.mentees.map((m) => (
                      <li key={m.employeeId} className="text-xs">
                        <span className="font-medium text-slate-700">
                          {m.name}
                        </span>
                        <span className="text-slate-400"> · {m.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Knowledge docs */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Authored Knowledge Documents ({emp.knowledgeDocCount})
              </p>
              {loadingDocs ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
                </div>
              ) : docs.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-3 px-3 bg-slate-50 rounded-md border border-slate-100">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  No published documents authored.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {docs.map((d) => {
                    const cMeta = CATEGORY_META[d.category] ?? CATEGORY_META.procedure
                    const crit = CRITICALITY_STYLE[d.criticality] ?? CRITICALITY_STYLE.standard
                    return (
                      <li
                        key={d.id}
                        className="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
                      >
                        <cMeta.icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 leading-snug">
                            {d.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 h-4 ${crit.badge}`}
                            >
                              {d.documentId}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 bg-slate-50 text-slate-600 border-slate-200"
                            >
                              {cMeta.label}
                            </Badge>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// ─── Document Row (Library tab) ──────────────────────────────────────────────

function DocumentRow({ doc, onOpen }: { doc: KnowledgeDoc; onOpen: () => void }) {
  const cMeta = CATEGORY_META[doc.category] ?? CATEGORY_META.procedure
  const crit = CRITICALITY_STYLE[doc.criticality] ?? CRITICALITY_STYLE.standard
  const author = doc.author
  const authorRetiring =
    author?.seniority === 'retiring' ||
    (author?.retirementDate && daysUntil(author.retirementDate) !== null && (daysUntil(author.retirementDate) ?? 0) < 365)

  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm transition-all p-3.5 group"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${crit.dot}1A`, color: crit.dot.replace('bg-', '').includes('red') ? '#EF4444' : crit.dot.includes('amber') ? '#F59E0B' : '#64748B' }}
        >
          <cMeta.icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 leading-snug">
              {doc.title}
            </p>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 mt-0.5" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-5 ${crit.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${crit.dot}`} />
              {crit.label}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 bg-slate-50 text-slate-600 border-slate-200 font-normal"
            >
              {cMeta.label}
            </Badge>
            <span className="text-[11px] text-slate-400 font-mono">{doc.documentId}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {doc.summary}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            {author && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Avatar
                  className="w-4 h-4"
                  style={{ backgroundColor: author.avatarColor }}
                >
                  <AvatarFallback
                    className="text-[8px] text-white font-semibold"
                    style={{ backgroundColor: author.avatarColor }}
                  >
                    {initials(author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-slate-700">{author.name}</span>
                <span className="text-slate-400">· {author.title}</span>
                {authorRetiring && (
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 ml-0.5"
                  >
                    Author retiring
                  </Badge>
                )}
              </div>
            )}
          </div>
          {/* Tags */}
          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {doc.tags.slice(0, 5).map((t, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500 font-normal"
                >
                  {t}
                </Badge>
              ))}
              {doc.tags.length > 5 && (
                <span className="text-[10px] text-slate-400">
                  +{doc.tags.length - 5}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {doc.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" /> {doc.helpfulCount} helpful
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(doc.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Document Content Dialog ─────────────────────────────────────────────────

function DocumentDialog({
  doc,
  open,
  onOpenChange,
}: {
  doc: KnowledgeDoc | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  if (!doc) return null
  const cMeta = CATEGORY_META[doc.category] ?? CATEGORY_META.procedure
  const crit = CRITICALITY_STYLE[doc.criticality] ?? CRITICALITY_STYLE.standard
  const author = doc.author
  const authorRetiring =
    author?.seniority === 'retiring' ||
    (author?.retirementDate && daysUntil(author.retirementDate) !== null && (daysUntil(author.retirementDate) ?? 0) < 365)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-5 ${crit.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${crit.dot}`} />
              {crit.label}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 bg-slate-50 text-slate-600 border-slate-200 font-normal"
            >
              <cMeta.icon className="w-2.5 h-2.5 mr-1" />
              {cMeta.label}
            </Badge>
            <span className="text-[11px] text-slate-400 font-mono">{doc.documentId}</span>
          </div>
          <DialogTitle className="text-lg leading-tight pr-6">{doc.title}</DialogTitle>
          <DialogDescription className="text-sm mt-1">{doc.summary}</DialogDescription>
          {author && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Avatar
                className="w-6 h-6"
                style={{ backgroundColor: author.avatarColor }}
              >
                <AvatarFallback
                  className="text-[10px] text-white font-semibold"
                  style={{ backgroundColor: author.avatarColor }}
                >
                  {initials(author.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{author.name}</span>
                <span className="text-slate-400"> · {author.title}</span>
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 h-5 ${SENIORITY_STYLE[author.seniority]?.badge ?? SENIORITY_STYLE.junior.badge}`}
              >
                {SENIORITY_STYLE[author.seniority]?.label ?? author.seniority}
              </Badge>
              {authorRetiring && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 bg-amber-50 text-amber-700 border-amber-200"
                >
                  <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                  Author retiring
                </Badge>
              )}
              <span className="text-[11px] text-slate-400 ml-auto">
                {author.yearsExperience} yrs experience · {author.department}
              </span>
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh] pr-2">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {doc.content}
          </pre>
        </ScrollArea>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {doc.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" /> {doc.helpfulCount} helpful
            </span>
          </div>
          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
              {doc.tags.slice(0, 6).map((t, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500 font-normal"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function WorkforceKnowledgePage() {
  const [tab, setTab] = useState('directory')

  // ─── Employees state (Tab 1) ───
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [empSummary, setEmpSummary] = useState<EmployeeSummary | null>(null)
  const [empLoading, setEmpLoading] = useState(true)
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [profileEmp, setProfileEmp] = useState<Employee | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  // ─── Knowledge docs state (Tab 2) ───
  const [docs, setDocs] = useState<KnowledgeDoc[]>([])
  const [docSummary, setDocSummary] = useState<{
    total: number
    critical: number
    byAuthor: Record<string, number>
  } | null>(null)
  const [docLoading, setDocLoading] = useState(true)
  const [docSearch, setDocSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [activeDoc, setActiveDoc] = useState<KnowledgeDoc | null>(null)
  const [docDialogOpen, setDocDialogOpen] = useState(false)
  const [docLoadingFull, setDocLoadingFull] = useState(false)

  // ─── Ask Senior state (Tab 3) ───
  const [question, setQuestion] = useState('')
  const [askScope, setAskScope] = useState<string>('all')
  const [askLoading, setAskLoading] = useState(false)
  const [askResult, setAskResult] = useState<AskSeniorResponse | null>(null)

  // ─── Onboarding state (Tab 4) ───
  const [onbSeniorId, setOnbSeniorId] = useState<string>('')
  const [onbLoading, setOnbLoading] = useState(false)
  const [onbResult, setOnbResult] = useState<OnboardingResponse | null>(null)

  // ─── Fetch employees ───
  const fetchEmployees = useCallback(async () => {
    setEmpLoading(true)
    try {
      const res = await fetch('/api/employees?seniority=all', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: EmployeesResponse = await res.json()
      setEmployees(json.employees)
      setDepartments(json.departments)
      setEmpSummary(json.summary)
    } catch (e) {
      console.error(e)
      toast.error('Failed to load employees')
    } finally {
      setEmpLoading(false)
    }
  }, [])

  // ─── Fetch documents ───
  const fetchDocs = useCallback(async () => {
    setDocLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
      if (docSearch.trim()) params.set('q', docSearch.trim())
      const url = `/api/knowledge/documents?${params.toString()}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: KnowledgeDocsResponse = await res.json()
      setDocs(json.documents)
      setDocSummary(json.summary)
    } catch (e) {
      console.error(e)
      toast.error('Failed to load knowledge documents')
    } finally {
      setDocLoading(false)
    }
  }, [categoryFilter, docSearch])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  // ─── Derived: filtered employees ───
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (seniorityFilter !== 'all' && e.seniority !== seniorityFilter) return false
      if (departmentFilter !== 'all' && e.department !== departmentFilter) return false
      return true
    })
  }, [employees, seniorityFilter, departmentFilter])

  // ─── Derived: senior-picker options (retiring + senior) ───
  const seniorPickerOptions = useMemo(
    () =>
      employees.filter(
        (e) => e.seniority === 'retiring' || e.seniority === 'senior',
      ),
    [employees],
  )

  // ─── Actions ───
  const openProfile = (emp: Employee) => {
    setProfileEmp(emp)
    setProfileOpen(true)
  }

  const openDoc = async (doc: KnowledgeDoc) => {
    setActiveDoc(doc)
    setDocDialogOpen(true)
    // Fetch full content (bumps viewCount)
    setDocLoadingFull(true)
    try {
      const res = await fetch(
        `/api/knowledge/documents?id=${encodeURIComponent(doc.documentId)}`,
      )
      if (res.ok) {
        const json: KnowledgeDocSingleResponse = await res.json()
        setActiveDoc(json.document)
        // Update the list view count locally
        setDocs((prev) =>
          prev.map((d) =>
            d.id === json.document.id
              ? { ...d, viewCount: json.document.viewCount }
              : d,
          ),
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setDocLoadingFull(false)
    }
  }

  const askQuestion = async (q?: string) => {
    const query = (q ?? question).trim()
    if (!query) {
      toast.error('Please enter a question')
      return
    }
    if (q) setQuestion(q)
    setAskLoading(true)
    setAskResult(null)
    try {
      const res = await fetch('/api/knowledge/ask-senior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          seniorEmployeeId: askScope === 'all' ? null : askScope,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: AskSeniorResponse = await res.json()
      setAskResult(json)
    } catch (e) {
      console.error(e)
      toast.error('Failed to get answer from senior')
    } finally {
      setAskLoading(false)
    }
  }

  const generateOnboarding = async () => {
    if (!onbSeniorId) {
      toast.error('Please select a senior employee')
      return
    }
    setOnbLoading(true)
    setOnbResult(null)
    try {
      const res = await fetch('/api/knowledge/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seniorEmployeeId: onbSeniorId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: OnboardingResponse = await res.json()
      setOnbResult(json)
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate onboarding plan')
    } finally {
      setOnbLoading(false)
    }
  }

  const suggestedQuestions = [
    'How do I qualify a thruster bearing for Lloyd\u2019s Register?',
    'What\u2019s the procedure for an emergency hydraulic valve swap?',
    'How do I diagnose a heat exchanger weld crack?',
    'What powder reuse limits should I follow?',
  ]

  return (
    <TooltipProvider delayDuration={150}>
      <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header card */}
        <Card className="border-slate-200/70 shadow-sm overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Workforce Knowledge &amp; Memory
                  </h2>
                  <p className="text-sm text-slate-500">
                    Capturing institutional knowledge from senior experts before
                    it walks out the door.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchEmployees()
                  fetchDocs()
                }}
                disabled={empLoading || docLoading}
                className="shrink-0"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1.5 ${empLoading || docLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>

            {/* Interview-grounding quote banner */}
            <div className="flex items-start gap-3 mt-4 p-3 bg-violet-50/60 border border-violet-100 rounded-lg">
              <Quote className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
              <p className="text-xs text-violet-900 leading-relaxed italic">
                &ldquo;Knowledge Capture / Workforce Memory&hellip; critical
                assembly procedures existed only in the heads of experienced
                technicians who had retired or passed away.&rdquo;
                <span className="not-italic font-semibold ml-1">
                  — Jordan Cumming, Interview #10
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="overflow-x-auto -mx-1 px-1 pb-1">
            <TabsList className="h-10">
              <TabsTrigger value="directory" className="px-3">
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Employee Directory</span>
                <span className="sm:hidden">Directory</span>
              </TabsTrigger>
              <TabsTrigger value="library" className="px-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Knowledge Library</span>
                <span className="sm:hidden">Library</span>
              </TabsTrigger>
              <TabsTrigger value="ask" className="px-3">
                <MessageCircleQuestion className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask a Senior</span>
                <span className="sm:hidden">Ask</span>
              </TabsTrigger>
              <TabsTrigger value="onboarding" className="px-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Onboarding Generator</span>
                <span className="sm:hidden">Onboarding</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── Tab 1: Employee Directory ─── */}
          <TabsContent value="directory" className="space-y-4 mt-4">
            {empSummary && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <KpiCard
                  label="Total Employees"
                  value={empSummary.total}
                  icon={Users}
                  tint="#64748B"
                />
                <KpiCard
                  label="Retiring Soon"
                  value={empSummary.retiring}
                  icon={Clock}
                  tint="#F59E0B"
                  hint="Departing within 1 year"
                />
                <KpiCard
                  label="Seniors"
                  value={empSummary.senior}
                  icon={Award}
                  tint="#10B981"
                />
                <KpiCard
                  label="Juniors"
                  value={empSummary.junior}
                  icon={GraduationCap}
                  tint="#8B5CF6"
                />
                <KpiCard
                  label="At-Risk Knowledge"
                  value={empSummary.atRiskDocs}
                  icon={AlertTriangle}
                  tint={empSummary.atRiskDocs > 0 ? '#EF4444' : '#64748B'}
                  hint={
                    empSummary.atRiskDocs > 0
                      ? 'Retiring with 0 docs'
                      : 'All retiring staff documented'
                  }
                />
              </div>
            )}

            {/* Filter row */}
            <Card className="border-slate-200/70 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      Seniority
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { v: 'all', label: 'All' },
                        { v: 'retiring', label: 'Retiring' },
                        { v: 'senior', label: 'Senior' },
                        { v: 'junior', label: 'Junior' },
                      ].map((opt) => (
                        <Button
                          key={opt.v}
                          size="sm"
                          variant={
                            seniorityFilter === opt.v ? 'default' : 'outline'
                          }
                          className={`h-7 text-xs ${
                            seniorityFilter === opt.v
                              ? 'bg-slate-800 text-white hover:bg-slate-700'
                              : ''
                          }`}
                          onClick={() => setSeniorityFilter(opt.v)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden sm:block h-6 bg-slate-200"
                  />
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      Department
                    </span>
                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger className="h-8 w-[180px] text-xs">
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All departments</SelectItem>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee grid */}
            {empLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading
                employees…
              </div>
            ) : filteredEmployees.length === 0 ? (
              <Card className="border-dashed border-slate-200">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No employees match the current filters.
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  Showing{' '}
                  <span className="font-semibold text-slate-700">
                    {filteredEmployees.length}
                  </span>{' '}
                  of {employees.length} employees
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((emp) => (
                    <EmployeeCard
                      key={emp.id}
                      emp={emp}
                      onViewProfile={openProfile}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* ─── Tab 2: Knowledge Library ─── */}
          <TabsContent value="library" className="space-y-4 mt-4">
            <Card className="border-slate-200/70 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search by title, summary, or tag…"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="h-9 w-full sm:w-[220px] text-sm">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="sop">SOP</SelectItem>
                      <SelectItem value="lesson_learned">
                        Lesson Learned
                      </SelectItem>
                      <SelectItem value="troubleshooting">
                        Troubleshooting
                      </SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="safety_bulletin">
                        Safety Bulletin
                      </SelectItem>
                      <SelectItem value="case_study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Summary line */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {docLoading ? (
                  'Loading…'
                ) : (
                  <>
                    <span className="font-semibold text-slate-700">
                      {docSummary?.total ?? 0}
                    </span>{' '}
                    documents ·{' '}
                    <span className="font-semibold text-red-600">
                      {docSummary?.critical ?? 0}
                    </span>{' '}
                    critical
                  </>
                )}
              </p>
            </div>

            {/* Document list (scrollable) */}
            {docLoading ? (
              <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading
                documents…
              </div>
            ) : docs.length === 0 ? (
              <Card className="border-dashed border-slate-200">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No documents match your search.
                </CardContent>
              </Card>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
                {docs.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    onOpen={() => openDoc(doc)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── Tab 3: Ask a Senior ─── */}
          <TabsContent value="ask" className="space-y-4 mt-4">
            <Card className="border-slate-200/70 shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircleQuestion className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Ask a question to the captured knowledge base
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  The AI answers as a senior mentor would, citing the captured
                  knowledge documents (e.g.{' '}
                  <span className="font-mono text-emerald-700">[KD-001]</span>).
                  Grounded in Dean Dalpe, Enbridge #64: smart-manuals use case
                  — data interpretation, not decision-making.
                </p>

                <Textarea
                  placeholder="e.g. How do I qualify a thruster bearing for Lloyd's Register?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[88px] text-sm resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      askQuestion()
                    }
                  }}
                />

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <Select value={askScope} onValueChange={setAskScope}>
                    <SelectTrigger className="h-9 w-full sm:w-[260px] text-sm">
                      <SelectValue placeholder="All seniors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seniors</SelectItem>
                      {seniorPickerOptions.map((s) => (
                        <SelectItem key={s.id} value={s.employeeId}>
                          {s.name} ({s.title})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => askQuestion()}
                    disabled={askLoading || !question.trim()}
                    className="h-9 sm:ml-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {askLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />{' '}
                        Thinking…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1.5" /> Ask
                      </>
                    )}
                  </Button>
                </div>

                {/* Suggested chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center mr-1">
                    Try:
                  </span>
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => askQuestion(q)}
                      disabled={askLoading}
                      className="text-[11px] px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Answer */}
            {askLoading && (
              <Card className="border-emerald-100 bg-emerald-50/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    Consulting the captured knowledge of senior experts…
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-emerald-100/60 rounded animate-pulse" />
                    <div className="h-3 bg-emerald-100/60 rounded animate-pulse w-5/6" />
                    <div className="h-3 bg-emerald-100/60 rounded animate-pulse w-4/6" />
                  </div>
                </CardContent>
              </Card>
            )}

            {askResult && !askLoading && (
              <div className="space-y-4">
                <Card className="border-emerald-200 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        Senior&apos;s Answer
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-5 bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Scope:{' '}
                        {askResult.seniorScope === 'all-seniors'
                          ? 'All Seniors'
                          : askResult.seniorScope}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <p className="text-[11px] text-slate-500 italic mb-2">
                      Q: {askResult.question}
                    </p>
                    <Separator className="bg-slate-100 mb-3" />
                    <div className="text-sm text-slate-700 leading-relaxed space-y-1">
                      {renderAnswer(askResult.answer)}
                    </div>
                  </CardContent>
                </Card>

                {/* Sources */}
                {askResult.citedDocs.length > 0 && (
                  <Card className="border-slate-200/70 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-5">
                      <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-500" />
                        Sources ({askResult.citedDocs.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 space-y-2.5">
                      {askResult.citedDocs.map((c, i) => {
                        const cMeta =
                          CATEGORY_META[c.category] ?? CATEGORY_META.procedure
                        const crit =
                          CRITICALITY_STYLE[c.criticality] ??
                          CRITICALITY_STYLE.standard
                        // Normalize relevance score to 0-100 (max observed ~ score per term)
                        const pct = Math.min(100, Math.max(8, c.relevanceScore * 12))
                        return (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-200 bg-white p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 leading-snug">
                                  {c.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {c.author} · {c.authorTitle}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-5 shrink-0 ${crit.badge}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full mr-1 ${crit.dot}`}
                                />
                                {c.documentId}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-5 bg-slate-50 text-slate-600 border-slate-200 font-normal"
                              >
                                <cMeta.icon className="w-2.5 h-2.5 mr-1" />
                                {cMeta.label}
                              </Badge>
                              <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                  Relevance
                                </span>
                                <Progress
                                  value={pct}
                                  className="h-1.5 flex-1"
                                  style={
                                    {
                                      // tint the progress bar via inline style override
                                    } as React.CSSProperties
                                  }
                                />
                                <span className="text-[10px] font-semibold text-slate-600 w-7 text-right">
                                  {c.relevanceScore}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!askResult && !askLoading && (
              <Card className="border-dashed border-slate-200">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  <MessageCircleQuestion className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Ask a question above to get a grounded answer from the
                  captured knowledge base.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── Tab 4: Onboarding Generator ─── */}
          <TabsContent value="onboarding" className="space-y-4 mt-4">
            <Card className="border-slate-200/70 shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-violet-500" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Generate a 90-day onboarding plan for a departing senior
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  The AI builds a replacement onboarding plan grounded in that
                  senior&apos;s captured knowledge documents, specialties, and
                  scheduled transfers. Grounded in Jim Granger, MAN Energy #23:
                  &ldquo;The real power [of AI] is that lack of technical
                  expertise&hellip; Those guys are gone.&rdquo;
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                  <div className="flex-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1 block">
                      Select departing senior
                    </label>
                    <Select
                      value={onbSeniorId}
                      onValueChange={setOnbSeniorId}
                    >
                      <SelectTrigger className="h-9 w-full text-sm">
                        <SelectValue placeholder="Choose a retiring or senior employee…" />
                      </SelectTrigger>
                      <SelectContent>
                        {seniorPickerOptions.length === 0 ? (
                          <SelectItem value="_none" disabled>
                            No seniors available
                          </SelectItem>
                        ) : (
                          seniorPickerOptions.map((s) => (
                            <SelectItem key={s.id} value={s.employeeId}>
                              {s.name} — {s.title} ({s.yearsExperience} yrs)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={generateOnboarding}
                    disabled={onbLoading || !onbSeniorId}
                    className="h-9 bg-violet-600 hover:bg-violet-700 text-white sm:w-auto"
                  >
                    {onbLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />{' '}
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1.5" /> Generate 90-Day
                        Plan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Loading skeleton */}
            {onbLoading && (
              <Card className="border-violet-100 bg-violet-50/30">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                    Building onboarding plan from captured knowledge…
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-violet-100/60 rounded animate-pulse" />
                    <div className="h-3 bg-violet-100/60 rounded animate-pulse w-5/6" />
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-24 bg-violet-100/40 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Result */}
            {onbResult && !onbLoading && (
              <OnboardingPlanView result={onbResult} />
            )}

            {!onbResult && !onbLoading && (
              <Card className="border-dashed border-slate-200">
                <CardContent className="p-8 text-center text-sm text-slate-500">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  Select a departing senior above to generate a 90-day
                  onboarding plan for their replacement.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <EmployeeProfileDialog
          emp={profileEmp}
          open={profileOpen}
          onOpenChange={setProfileOpen}
        />
        <DocumentDialog
          doc={activeDoc}
          open={docDialogOpen}
          onOpenChange={setDocDialogOpen}
        />
      </div>
    </TooltipProvider>
  )
}

// ─── Onboarding Plan View ────────────────────────────────────────────────────

function OnboardingPlanView({ result }: { result: OnboardingResponse }) {
  const { senior, plan, docCount, transferCount, generatedAt } = result
  const hasRisks = plan.risksOfKnowledgeLoss.length > 0

  const phases = [
    {
      title: 'Days 1–30',
      subtitle: 'Foundation & Orientation',
      items: plan.days1to30,
      tint: '#10B981',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      title: 'Days 31–60',
      subtitle: 'Shadowing & Practice',
      items: plan.days31to60,
      tint: '#F59E0B',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      title: 'Days 61–90',
      subtitle: 'Supervised Execution',
      items: plan.days61to90,
      tint: '#8B5CF6',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-violet-200 shadow-sm overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 bg-violet-50 text-violet-700 border-violet-200"
                >
                  <GraduationCap className="w-2.5 h-2.5 mr-1" />
                  Onboarding Plan
                </Badge>
                <span className="text-[11px] text-slate-400">
                  Generated {formatDate(generatedAt)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Onboarding Plan for {plan.newHireTitle}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Replacing:{' '}
                <span className="font-semibold text-slate-700">
                  {senior.name}
                </span>{' '}
                ({senior.yearsExperience} yrs experience) · {senior.title} ·{' '}
                {senior.department}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="text-center rounded-lg border border-slate-200 px-3 py-2 bg-white">
                <p className="text-xl font-bold text-emerald-600">{docCount}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  Docs
                </p>
              </div>
              <div className="text-center rounded-lg border border-slate-200 px-3 py-2 bg-white">
                <p className="text-xl font-bold text-violet-600">
                  {transferCount}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  Transfers
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card className="border-slate-200/70 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-bold text-slate-800">
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {plan.overview}
          </p>
        </CardContent>
      </Card>

      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map((phase, i) => (
          <Card
            key={i}
            className={`border ${phase.border} ${phase.bg} shadow-sm`}
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: phase.tint }}
                >
                  {i + 1}
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">
                    {phase.title}
                  </CardTitle>
                  <p className="text-[11px] text-slate-500">
                    {phase.subtitle}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {phase.items.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No specific tasks defined.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed"
                    >
                      <CheckCircle2
                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                        style={{ color: phase.tint }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Must-Read + Must-Shadow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200/70 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Must-Read Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {plan.mustReadDocs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No specific documents flagged.
              </p>
            ) : (
              <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {plan.mustReadDocs.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              Must-Shadow Builds
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {plan.mustShadowBuilds.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No specific builds flagged.
              </p>
            ) : (
              <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {plan.mustShadowBuilds.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-700"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Milestones timeline + Risks side by side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Milestones */}
        <Card className="border-slate-200/70 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {plan.milestones.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No milestones defined.
              </p>
            ) : (
              <div className="relative pl-5">
                {/* vertical line */}
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-slate-200" />
                <ul className="space-y-3">
                  {plan.milestones.map((m, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[14px] top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow-sm" />
                      <p className="text-[11px] font-bold uppercase tracking-wide text-teal-600">
                        {m.week}
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed mt-0.5">
                        {m.milestone}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risks */}
        <Card
          className={`shadow-sm ${
            hasRisks
              ? 'border-red-200 bg-red-50/30'
              : 'border-emerald-200 bg-emerald-50/20'
          }`}
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle
              className={`text-sm font-bold flex items-center gap-2 ${
                hasRisks ? 'text-red-800' : 'text-emerald-800'
              }`}
            >
              <AlertTriangle
                className={`w-4 h-4 ${hasRisks ? 'text-red-500' : 'text-emerald-500'}`}
              />
              Risks of Knowledge Loss
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {plan.risksOfKnowledgeLoss.length === 0 ? (
              <p className="text-xs text-slate-600 italic">
                No specific risks identified.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {plan.risksOfKnowledgeLoss.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-red-700 leading-relaxed"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended mentor footer */}
      <Card className="border-slate-200/70 shadow-sm bg-slate-50/50">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Recommended Co-Mentor
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {plan.recommendedMentor}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 ml-auto hidden sm:block" />
        </CardContent>
      </Card>
    </div>
  )
}
