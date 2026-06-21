'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Zap, Scan, TrendingUp, Shield, Clock, Activity, Boxes, KeyRound,
  CheckCircle, AlertTriangle, XCircle, Sparkles, RefreshCw, ChevronRight,
  FileText, DollarSign, ArrowRight, Target, AlertCircle, Loader2,
} from 'lucide-react'
import { ROIModal } from './ROIModal'

// ── Types (mirror the API) ──
interface AxisScore { score: number; rationale: string }
interface PartAssessment {
  partId: string; partNumber: string; name: string; category: string
  siteName: string; quantity: number; minStock: number; unitCost: number
  hasBlueprint: boolean; material?: string; oem?: string
  axes: {
    geometryFeasibility: AxisScore; leadTimePain: AxisScore; criticality: AxisScore
    certificationPathway: AxisScore; demandFrequency: AxisScore; ipStatus: AxisScore
  }
  compositeScore: number
  verdict: 'Highly Suitable' | 'Suitable' | 'Marginal — Review' | 'Not Recommended'
  recommendedAction: string
}
interface SuitabilityResponse {
  assessments: PartAssessment[]
  topCandidates: PartAssessment[]
  summary: {
    totalParts: number; highlySuitable: number; suitable: number
    marginal: number; notRecommended: number; outOfStockCandidates: number
    averageScore: number; topCandidatesCount: number
  }
}
interface Narrative {
  summary: string
  keyRisks: string[]
  nextSteps: string[]
}

const VERDICT_STYLES = {
  'Highly Suitable': { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', Icon: CheckCircle },
  'Suitable': { color: '#0EA5E9', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', Icon: TrendingUp },
  'Marginal — Review': { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', Icon: AlertTriangle },
  'Not Recommended': { color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', Icon: XCircle },
}

const AXIS_META = [
  { key: 'geometryFeasibility' as const, label: 'Geometry', icon: Boxes, color: '#0EA5E9', desc: 'AM-friendly geometry' },
  { key: 'leadTimePain' as const, label: 'Lead-Time Pain', icon: Clock, color: '#F59E0B', desc: 'Current supply gap urgency' },
  { key: 'criticality' as const, label: 'Criticality', icon: Shield, color: '#EF4444', desc: 'Safety / operational impact' },
  { key: 'certificationPathway' as const, label: 'Cert Pathway', icon: KeyRound, color: '#8B5CF6', desc: 'Qualification effort needed' },
  { key: 'demandFrequency' as const, label: 'Demand', icon: Activity, color: '#14B8A6', desc: 'Recurring need frequency' },
  { key: 'ipStatus' as const, label: 'IP Status', icon: FileText, color: '#6366F1', desc: 'OEM / IP clearance path' },
]

export function PartSuitabilityScannerPage({
  onNavigate,
}: {
  onNavigate?: (pageId: string) => void
} = {}) {
  const [data, setData] = useState<SuitabilityResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [narrative, setNarrative] = useState<Narrative | null>(null)
  const [narrativeLoading, setNarrativeLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [roiPart, setRoiPart] = useState<PartAssessment | null>(null)
  const [filter, setFilter] = useState<'all' | 'top' | 'suitable'>('all')

  const fetchAssessments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/part-suitability', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const generateNarrative = useCallback(async () => {
    if (!data) return
    setNarrativeLoading(true)
    try {
      const res = await fetch('/api/ai/part-suitability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topCandidates: data.topCandidates }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setNarrative(json.narrative)
    } catch (e) {
      console.error(e)
      setNarrative({
        summary: 'Unable to generate AI narrative. See the ranked candidate list below.',
        keyRisks: ['AI service unavailable'],
        nextSteps: ['Review candidates manually', 'Run ROI analysis'],
      })
    } finally {
      setNarrativeLoading(false)
    }
  }, [data])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  const filtered = (() => {
    if (!data) return []
    if (filter === 'top') return data.topCandidates
    if (filter === 'suitable') return data.assessments.filter((a) => a.compositeScore >= 55)
    return data.assessments
  })()

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">AI Part Suitability Scanner</h2>
            <p className="text-sm text-slate-500">
              Identifies which inventory parts are worth digitizing for additive manufacturing
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAssessments} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Re-scan
        </Button>
      </div>

      {/* Interview grounding banner */}
      <div className="flex items-start gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
        <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-xs text-indigo-800 leading-relaxed">
          <span className="font-semibold">Grounded in 70+ customer interviews.</span> Scoring model uses
          Heather Davis (Aker Solutions) suitability checklist: geometry feasibility, lead-time pain,
          criticality, certification pathway, demand frequency, and IP status. Targets the top ~5% of
          parts — per Cassidy Silbernagel (Exergy): <em>&ldquo;be really good at what is the right 5%.&rdquo;</em>
        </p>
      </div>

      {/* Summary KPIs */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <SummaryCard label="Parts Scanned" value={data.summary.totalParts} icon={Boxes} color="#64748B" />
          <SummaryCard label="Avg Score" value={data.summary.averageScore} icon={Activity} color="#0EA5E9" suffix="/100" />
          <SummaryCard label="Highly Suitable" value={data.summary.highlySuitable} icon={CheckCircle} color="#10B981" />
          <SummaryCard label="Suitable" value={data.summary.suitable} icon={TrendingUp} color="#0EA5E9" />
          <SummaryCard label="Marginal" value={data.summary.marginal} icon={AlertTriangle} color="#F59E0B" />
          <SummaryCard label="Out-of-Stock Candidates" value={data.summary.outOfStockCandidates} icon={AlertCircle} color="#EF4444" />
        </div>
      )}

      {/* AI Executive Narrative */}
      {data && (
        <Card className="bg-gradient-to-br from-white to-indigo-50/40 border-indigo-100">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI Executive Summary — Top {data.summary.topCandidatesCount} Candidates
              </CardTitle>
              {!narrative && !narrativeLoading && (
                <Button size="sm" variant="outline" onClick={generateNarrative}>
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            {narrativeLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing top candidates…
              </div>
            )}
            {narrative && !narrativeLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed">{narrative.summary}</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 mb-1.5">Key Risks</p>
                    <ul className="space-y-1">
                      {narrative.keyRisks.map((r, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 mb-1.5">Next Steps</p>
                    <ul className="space-y-1">
                      {narrative.nextSteps.map((s, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
            {!narrative && !narrativeLoading && (
              <p className="text-sm text-slate-400 py-1">
                Click <span className="font-medium text-indigo-600">Generate</span> for an AI-written board summary of your top candidates.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {([
          { key: 'all', label: 'All Parts' },
          { key: 'suitable', label: 'Suitable+' },
          { key: 'top', label: 'Top Candidates' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === t.key
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ranked table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">Scanning {physicalPartsCount} parts…</span>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((part, idx) => {
            const style = VERDICT_STYLES[part.verdict]
            const isExpanded = expanded === part.partId
            const isTop = data?.topCandidates.some((c) => c.partId === part.partId)
            return (
              <Card
                key={part.partId}
                className={`bg-white border-slate-200 overflow-hidden transition-all ${
                  isTop ? 'ring-1 ring-indigo-200' : ''
                }`}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : part.partId)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank + score ring */}
                      <div className="flex flex-col items-center gap-1 shrink-0 w-16">
                        <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center border-[3px]"
                          style={{ borderColor: style.color }}
                        >
                          <span className="text-sm font-black" style={{ color: style.color }}>{part.compositeScore}</span>
                        </div>
                      </div>

                      {/* Part info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800 truncate">{part.name}</p>
                          {isTop && (
                            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 text-[9px] gap-1">
                              <Target className="w-2.5 h-2.5" /> TOP CANDIDATE
                            </Badge>
                          )}
                          {part.quantity === 0 && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[9px]">OUT OF STOCK</Badge>
                          )}
                          {part.quantity < part.minStock && part.quantity > 0 && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[9px]">LOW STOCK</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {part.partNumber} · {part.category} · {part.siteName}
                          {part.material && <> · <span className="text-slate-600">{part.material}</span></>}
                        </p>

                        {/* Mini axis bars */}
                        <div className="flex items-center gap-3 mt-2">
                          {AXIS_META.map((axis) => {
                            const val = part.axes[axis.key].score
                            return (
                              <div key={axis.key} className="flex items-center gap-1" title={`${axis.label}: ${val}/100 — ${part.axes[axis.key].rationale}`}>
                                <axis.icon className="w-3 h-3" style={{ color: axis.color }} />
                                <div className="w-8 h-1 rounded-full bg-slate-100 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${val}%`, background: axis.color }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Verdict + action */}
                      <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                        <Badge className={`${style.bg} ${style.text} ${style.border} border hover:opacity-90`}>
                          <style.Icon className="w-3 h-3 mr-1" /> {part.verdict}
                        </Badge>
                        <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </CardContent>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-4 bg-slate-50/50 space-y-4">
                        {/* Axis details */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {AXIS_META.map((axis) => {
                            const val = part.axes[axis.key].score
                            return (
                              <div key={axis.key} className="bg-white rounded-lg border border-slate-100 p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <axis.icon className="w-3.5 h-3.5" style={{ color: axis.color }} />
                                    <span className="text-xs font-semibold text-slate-700">{axis.label}</span>
                                  </div>
                                  <span className="text-sm font-bold" style={{ color: axis.color }}>{val}</span>
                                </div>
                                <Progress value={val} className="h-1.5 mb-1.5" style={{ ['--progress-color' as string]: axis.color }} />
                                <p className="text-[10px] text-slate-500 leading-snug">{part.axes[axis.key].rationale}</p>
                              </div>
                            )
                          })}
                        </div>

                        {/* Recommendation */}
                        <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-100">
                          <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">Recommended Action</p>
                            <p className="text-xs text-slate-700">{part.recommendedAction}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => setRoiPart(part)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                            Generate ROI Business Case
                          </Button>
                          {part.hasBlueprint && (
                            <Button size="sm" variant="outline">
                              <FileText className="w-3.5 h-3.5 mr-1.5" />
                              View Blueprint
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>
      )}

      {/* ROI Modal */}
      <ROIModal part={roiPart} onClose={() => setRoiPart(null)} />
    </div>
  )
}

const physicalPartsCount = 16 // matches seeded data

function SummaryCard({ label, value, icon: Icon, color, suffix }: {
  label: string; value: number; icon: typeof Boxes; color: string; suffix?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-slate-800 leading-none">
          {value}{suffix}
        </p>
        <p className="text-[10px] text-slate-500 mt-1 truncate">{label}</p>
      </div>
    </div>
  )
}
