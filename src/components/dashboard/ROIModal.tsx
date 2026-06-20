'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, DollarSign, Clock, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Loader2, FileText, Building2, Truck, PiggyBank, Zap,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface PartAssessment {
  partId: string; partNumber: string; name: string
}

interface RoiResult {
  part: { partNumber: string; name: string; category: string; material: string; siteName: string; unitCost: number }
  inputs: {
    annualDemand: number; downtimeCostPerDay: number; traditionalLeadTimeDays: number
    amLeadTimeDays: number; traditionalUnitCost: number; amUnitCost: number
  }
  costs: { traditionalAnnual: number; amAnnual: number; amSetupCost: number; amSetupDescription: string }
  savings: {
    downtimeAvoidedPerYear: number; downtimeSavings: number; hotShotFreightSavings: number
    workingCapitalFreed: number; totalAnnualSavings: number
  }
  roi: { netBenefitYear1: number; roiPercent: number; paybackMonths: number; meetsThreshold: boolean }
  crossBudget: {
    pays: { department: string; amount: number; rationale: string }[]
    saves: { department: string; amount: number; rationale: string }[]
  }
  recommendation: 'Proceed' | 'Pilot First' | 'Not Viable'
  narrative: { summary: string; keyAssumptions: string[]; riskFactors: string[] }
}

const REC_STYLES = {
  Proceed: { color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', Icon: CheckCircle },
  'Pilot First': { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', Icon: AlertTriangle },
  'Not Viable': { color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', Icon: X },
}

const fmt = (n: number) => `$${n.toLocaleString()}`

export function ROIModal({ part, onClose }: { part: PartAssessment | null; onClose: () => void }) {
  const [result, setResult] = useState<RoiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!part) {
      setResult(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch('/api/ai/roi-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partId: part.partId }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: RoiResult) => {
        if (!cancelled) setResult(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to compute ROI')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [part])

  return (
    <AnimatePresence>
      {part && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70]"
          />
          {/* Modal */}
          <div className="fixed inset-0 z-[71] flex items-start justify-center pt-[4vh] px-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-800 truncate">ROI Business Case</h3>
                    <p className="text-xs text-slate-500 truncate">{part.name} · {part.partNumber}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[75vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    <p className="text-sm text-slate-500">Computing cross-budget ROI & generating narrative…</p>
                  </div>
                )}

                {error && !loading && (
                  <div className="m-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                {result && !loading && (
                  <div className="p-5 space-y-5">
                    {/* Recommendation banner */}
                    {(() => {
                      const rec = REC_STYLES[result.recommendation]
                      return (
                        <div className={`flex items-center gap-3 p-4 rounded-xl ${rec.bg} border ${rec.border}`}>
                          <rec.Icon className="w-6 h-6 shrink-0" style={{ color: rec.color }} />
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${rec.text}`}>Recommendation: {result.recommendation}</p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {result.recommendation === 'Proceed' && 'Strong ROI — proceed with digitization & pre-certification.'}
                              {result.recommendation === 'Pilot First' && 'Positive ROI but moderate — run a pilot before full investment.'}
                              {result.recommendation === 'Not Viable' && 'ROI below threshold — keep traditional procurement for now.'}
                            </p>
                          </div>
                          {result.roi.meetsThreshold && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                              ≥15% threshold met
                            </span>
                          )}
                        </div>
                      )
                    })()}

                    {/* Headline metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <MetricCard label="Annual Savings" value={fmt(result.savings.totalAnnualSavings)} icon={PiggyBank} color="#10B981" />
                      <MetricCard label="Year-1 Net Benefit" value={fmt(result.roi.netBenefitYear1)} icon={TrendingUp} color="#0EA5E9" />
                      <MetricCard label="ROI" value={`${result.roi.roiPercent}%`} icon={Zap} color="#8B5CF6" />
                      <MetricCard label="Payback" value={`${result.roi.paybackMonths} mo`} icon={Clock} color="#F59E0B" />
                    </div>

                    {/* AI Narrative */}
                    <div className="p-4 bg-gradient-to-br from-indigo-50/60 to-white rounded-xl border border-indigo-100">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" /> AI Executive Summary
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{result.narrative.summary}</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-500 mb-1">Key Assumptions</p>
                          <ul className="space-y-0.5">
                            {result.narrative.keyAssumptions.map((a, i) => (
                              <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                <span className="text-slate-300 mt-0.5">•</span> {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-amber-600 mb-1">Risk Factors</p>
                          <ul className="space-y-0.5">
                            {result.narrative.riskFactors.map((r, i) => (
                              <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-400 mt-0.5 shrink-0" /> {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Cost comparison */}
                    <div>
                      <p className="text-xs font-bold text-slate-700 mb-2">Cost Comparison (Annual)</p>
                      <div className="grid grid-cols-2 gap-3">
                        <CostBar
                          label="Traditional Procurement"
                          amount={result.costs.traditionalAnnual}
                          max={Math.max(result.costs.traditionalAnnual, result.costs.amAnnual + result.costs.amSetupCost)}
                          color="#94A3B8"
                          icon={TrendingDown}
                          subtext={`${result.inputs.annualDemand} × ${fmt(result.inputs.traditionalUnitCost)}`}
                        />
                        <CostBar
                          label="Additive (Yr 1)"
                          amount={result.costs.amAnnual + result.costs.amSetupCost}
                          max={Math.max(result.costs.traditionalAnnual, result.costs.amAnnual + result.costs.amSetupCost)}
                          color="#10B981"
                          icon={TrendingUp}
                          subtext={`${result.inputs.annualDemand} × ${fmt(result.inputs.amUnitCost)} + ${fmt(result.costs.amSetupCost)} setup`}
                        />
                      </div>
                    </div>

                    {/* Savings breakdown */}
                    <div>
                      <p className="text-xs font-bold text-slate-700 mb-2">Annual Savings Breakdown</p>
                      <div className="space-y-2">
                        <SavingsRow icon={Clock} color="#EF4444" label={`Downtime avoided (${result.savings.downtimeAvoidedPerYear} days)`} value={result.savings.downtimeSavings} max={result.savings.totalAnnualSavings} />
                        <SavingsRow icon={Truck} color="#F59E0B" label="Hot-shot freight avoided" value={result.savings.hotShotFreightSavings} max={result.savings.totalAnnualSavings} />
                        <SavingsRow icon={PiggyBank} color="#0EA5E9" label="Working capital freed" value={result.savings.workingCapitalFreed} max={result.savings.totalAnnualSavings} />
                        <SavingsRow icon={DollarSign} color="#8B5CF6" label="Per-unit cost reduction" value={result.costs.traditionalAnnual - result.costs.amAnnual} max={result.savings.totalAnnualSavings} />
                      </div>
                    </div>

                    {/* Cross-budget attribution (Mark Kirby #9) */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-red-600 mb-2 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" /> Who Pays
                        </p>
                        <ul className="space-y-1.5">
                          {result.crossBudget.pays.map((p, i) => (
                            <li key={i} className="text-xs">
                              <span className="font-medium text-slate-700">{p.department}</span>
                              <span className="text-red-600 font-semibold"> — {fmt(p.amount)}</span>
                              <p className="text-[10px] text-slate-400">{p.rationale}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 mb-2 flex items-center gap-1.5">
                          <PiggyBank className="w-3 h-3" /> Who Saves
                        </p>
                        <ul className="space-y-1.5">
                          {result.crossBudget.saves.map((s, i) => (
                            <li key={i} className="text-xs">
                              <span className="font-medium text-slate-700">{s.department}</span>
                              <span className="text-emerald-600 font-semibold"> + {fmt(s.amount)}</span>
                              <p className="text-[10px] text-slate-400">{s.rationale}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Inputs / assumptions */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Inputs & Assumptions</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <KV label="Annual demand" value={`${result.inputs.annualDemand} units`} />
                        <KV label="Downtime cost" value={`${fmt(result.inputs.downtimeCostPerDay)}/day`} />
                        <KV label="Traditional lead time" value={`${result.inputs.traditionalLeadTimeDays} days`} />
                        <KV label="AM lead time" value={`${result.inputs.amLeadTimeDays} days`} />
                        <KV label="Traditional unit cost" value={fmt(result.inputs.traditionalUnitCost)} />
                        <KV label="AM unit cost" value={fmt(result.inputs.amUnitCost)} />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{result.costs.amSetupDescription}</p>
                    </div>

                    {/* Footer note */}
                    <p className="text-[10px] text-slate-400 text-center pt-1">
                      Downtime cost defaults to $100K/day (offshore O&G, per Bursey #75). ROI threshold ≥15% per Mahmoudi #47.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof DollarSign; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-[10px] text-slate-500 font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function CostBar({ label, amount, max, color, icon: Icon, subtext }: {
  label: string; amount: number; max: number; color: string; icon: typeof DollarSign; subtext: string
}) {
  const pct = max > 0 ? (amount / max) * 100 : 0
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
          <Icon className="w-3 h-3" style={{ color }} /> {label}
        </span>
        <span className="text-sm font-bold" style={{ color }}>{fmt(amount)}</span>
      </div>
      <Progress value={pct} className="h-2 mb-1" style={{ ['--progress-color' as string]: color }} />
      <p className="text-[10px] text-slate-400">{subtext}</p>
    </div>
  )
}

function SavingsRow({ icon: Icon, color, label, value, max }: {
  icon: typeof DollarSign; color: string; label: string; value: number; max: number
}) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 shrink-0" style={{ color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs text-slate-600 truncate">{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{fmt(value)}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="text-xs font-medium text-slate-700">{value}</p>
    </div>
  )
}
