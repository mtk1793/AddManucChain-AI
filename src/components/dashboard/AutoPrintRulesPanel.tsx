'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Zap, RefreshCw, AlertCircle, CheckCircle, Clock, Printer,
  Activity, Shield, ChevronRight, Loader2, X, Power, Send,
} from 'lucide-react'
import { toast } from 'sonner'

// ── Types ──
interface AutoPrintRule {
  id: string; partId: string; partName: string; partNumber: string
  siteName: string; threshold: number; targetQuantity: number
  targetFacilityId: string; targetFacilityName: string
  autoTrigger: boolean; approvalRequired: boolean; enabled: boolean
  createdAt: string; lastTriggered: string | null; triggerCount: number
}
interface SuggestedJob {
  ruleId: string; partId: string; partName: string; partNumber: string
  siteName: string; currentStock: number; threshold: number; targetQuantity: number
  facilityName: string; facilityId: string; material: string; blueprintId: string | null
  autoTrigger: boolean; status: 'auto_triggered' | 'approval_required' | 'info_only'
  severity: 'critical' | 'warning' | 'info'
  estimatedPrintHours: number; estimatedCost: number
}
interface EvaluateResponse {
  suggestions: SuggestedJob[]
  summary: {
    totalSuggestions: number; critical: number; warning: number
    autoTriggered: number; approvalRequired: number; totalEstimatedCost: number
  }
}

const SEVERITY_STYLES = {
  critical: { color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: 'Critical' },
  warning: { color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Warning' },
  info: { color: '#0EA5E9', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500', label: 'Info' },
}
const STATUS_STYLES = {
  auto_triggered: { label: 'Auto-Triggered', color: '#10B981', Icon: Zap },
  approval_required: { label: 'Approval Required', color: '#F59E0B', Icon: Shield },
  info_only: { label: 'Suggestion', color: '#64748B', Icon: Activity },
}

export function AutoPrintRulesPanel({
  onNavigate,
}: {
  onNavigate?: (pageId: string) => void
} = {}) {
  const [rules, setRules] = useState<AutoPrintRule[]>([])
  const [evalData, setEvalData] = useState<EvaluateResponse | null>(null)
  const [loadingRules, setLoadingRules] = useState(true)
  const [loadingEval, setLoadingEval] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)

  const fetchRules = useCallback(async () => {
    setLoadingRules(true)
    try {
      const res = await fetch('/api/ai/auto-print-rules', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setRules(json.rules ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingRules(false)
    }
  }, [])

  const fetchEval = useCallback(async () => {
    setLoadingEval(true)
    try {
      const res = await fetch('/api/ai/auto-print-evaluate', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setEvalData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingEval(false)
    }
  }, [])

  useEffect(() => {
    fetchRules()
    fetchEval()
  }, [fetchRules, fetchEval])

  const approveJob = async (job: SuggestedJob) => {
    setApproving(job.ruleId)
    try {
      const res = await fetch('/api/ai/auto-print-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleId: job.ruleId,
          partId: job.partId,
          targetQuantity: job.targetQuantity,
          facilityId: job.facilityId,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      toast.success(data.message || `Print job created for ${job.partName}`)
      // Re-evaluate after approval
      fetchEval()
    } catch (e) {
      toast.error('Failed to create print job')
      console.error(e)
    } finally {
      setApproving(null)
    }
  }

  const toggleRule = async (rule: AutoPrintRule) => {
    // Optimistic update
    setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
    try {
      await fetch('/api/ai/auto-print-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: rule.id, enabled: !rule.enabled }),
      })
      toast.success(`Rule ${rule.enabled ? 'disabled' : 'enabled'}`)
    } catch (e) {
      // Revert on error
      setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, enabled: rule.enabled } : r))
      toast.error('Failed to update rule')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Smart Replenishment & Auto-Print</h2>
            <p className="text-sm text-slate-500">
              When inventory drops, the printer kicks in automatically
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchEval} disabled={loadingEval}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loadingEval ? 'animate-spin' : ''}`} />
            Re-evaluate
          </Button>
        </div>
      </div>

      {/* Interview grounding banner */}
      <div className="flex items-start gap-3 p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">From customer interviews.</span> David Bursey (Cenovus #75):
          <em>&ldquo;If we could print components offshore in a way of just being an automatic process, and when
          inventory drops, the printer kicks in and produces more… that would be fantastic.&rdquo;</em>
          Rules monitor safety-stock thresholds and trigger print jobs at the nearest qualified facility.
        </p>
      </div>

      {/* Live evaluation summary */}
      {evalData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <EvalStat label="Active Suggestions" value={evalData.summary.totalSuggestions} icon={AlertCircle} color="#F59E0B" />
          <EvalStat label="Critical (Out of Stock)" value={evalData.summary.critical} icon={Zap} color="#EF4444" />
          <EvalStat label="Auto-Triggered" value={evalData.summary.autoTriggered} icon={CheckCircle} color="#10B981" />
          <EvalStat label="Est. Total Cost" value={`$${evalData.summary.totalEstimatedCost.toLocaleString()}`} icon={Printer} color="#0EA5E9" />
        </div>
      )}

      {/* Suggested print jobs */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            Suggested Print Jobs
            {evalData && evalData.summary.totalSuggestions > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold">
                {evalData.summary.totalSuggestions} pending
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          {loadingEval ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              <span className="ml-2 text-sm text-slate-500">Evaluating inventory against rules…</span>
            </div>
          ) : !evalData || evalData.suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-slate-700">All inventory above thresholds</p>
              <p className="text-xs text-slate-400 mt-0.5">No print jobs needed right now. Monitoring continues automatically.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {evalData.suggestions.map((job) => {
                const sev = SEVERITY_STYLES[job.severity]
                const status = STATUS_STYLES[job.status]
                return (
                  <motion.div
                    key={job.ruleId}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${sev.border} ${sev.bg}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${sev.dot} mt-1.5 shrink-0 ${job.severity === 'critical' ? 'animate-pulse' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{job.partName}</p>
                        <Badge className={`${sev.bg} ${sev.text} ${sev.border} border text-[9px]`}>{sev.label}</Badge>
                        <Badge variant="outline" className="text-[9px] gap-1">
                          <status.Icon className="w-2.5 h-2.5" style={{ color: status.color }} />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {job.partNumber} · {job.siteName} · {job.material}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <span className="text-red-500 font-semibold">Stock: {job.currentStock}</span>
                          <span className="text-slate-400">/ threshold {job.threshold}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Printer className="w-3 h-3 text-slate-400" />
                          Print {job.targetQuantity}× @ {job.facilityName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          ~{job.estimatedPrintHours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-slate-400">Est.</span>
                          <span className="font-semibold text-slate-700">${job.estimatedCost.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {job.status === 'approval_required' ? (
                        <Button
                          size="sm"
                          onClick={() => approveJob(job)}
                          disabled={approving === job.ruleId}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {approving === job.ruleId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve & Print
                            </>
                          )}
                        </Button>
                      ) : job.status === 'auto_triggered' ? (
                        <Button size="sm" variant="outline" disabled className="text-emerald-600 border-emerald-200 bg-emerald-50">
                          <Zap className="w-3.5 h-3.5 mr-1" /> Auto-Opened
                        </Button>
                      ) : null}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active rules */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-2 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Auto-Print Rules
              <span className="text-[10px] text-slate-400 font-normal">({rules.filter(r => r.enabled).length} active)</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          {loadingRules ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : rules.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No rules configured.</p>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-opacity ${
                    rule.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50/50 opacity-60'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-800 truncate">{rule.partName}</p>
                      {rule.autoTrigger ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[9px] gap-1">
                          <Zap className="w-2.5 h-2.5" /> AUTO
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[9px] gap-1">
                          <Shield className="w-2.5 h-2.5" /> APPROVAL
                        </Badge>
                      )}
                      {rule.triggerCount > 0 && (
                        <Badge variant="outline" className="text-[9px] text-slate-500">
                          Triggered {rule.triggerCount}×
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {rule.partNumber} · {rule.siteName} · Trigger ≤ {rule.threshold} → print {rule.targetQuantity}× @ {rule.targetFacilityName}
                    </p>
                    {rule.lastTriggered && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Last triggered {new Date(rule.lastTriggered).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleRule(rule)}
                    title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.enabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EvalStat({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: typeof Zap; color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-[10px] text-slate-500 mt-1 truncate">{label}</p>
      </div>
    </div>
  )
}
