'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Zap, CheckCircle, AlertTriangle, XCircle, MapPin, Shield,
  DollarSign, Clock, ChevronRight, BarChart3, Download, Printer,
} from 'lucide-react'

const SAVED_ASSESSMENTS = [
  { date: 'Mar 14, 2026', part: 'Pump Impeller DN150 — 316L SS', score: 92, verdict: 'Highly Suitable', ordered: true },
  { date: 'Mar 10, 2026', part: 'Valve Housing — Cast Iron', score: 22, verdict: 'Not Recommended', ordered: false },
  { date: 'Mar 7, 2026',  part: 'Nozzle Insert — Ti-6Al-4V', score: 87, verdict: 'Highly Suitable', ordered: true },
  { date: 'Mar 2, 2026',  part: 'Elbow Fitting — 316L SS', score: 74, verdict: 'Suitable', ordered: true },
  { date: 'Feb 25, 2026', part: 'Solid Shaft — 4140 Steel', score: 38, verdict: 'Marginal — Review', ordered: false },
]

const GEOMETRY_TYPES = ['Simple planar / flat', 'Hollow / thin-wall', 'Complex internal geometry', 'Lattice / porous structure', 'Solid block / billet', 'Rotational / axisymmetric']
const MATERIALS_LIST = ['Ti-6Al-4V', 'Inconel 625', '316L Stainless', 'Inconel 718', 'H13 Tool Steel', 'Hastelloy C-276', '17-4PH SS', 'Duplex 2205', 'AlSi10Mg', 'Other']
const INDUSTRIES = ['Marine / Offshore O&G', 'Defense / Naval', 'Mining / Heavy Industry', 'Utilities / Power', 'Aerospace', 'Chemical Processing']
const FUNCTIONS = ['Structural / Load-bearing', 'Non-structural / housing', 'Rotating / dynamic', 'Static / fixed', 'Pressure-bearing', 'Wear surface']
const URGENCY_OPTIONS = [
  { key: 'emergency', label: 'Emergency', desc: 'Production stopped or at risk', color: '#EF4444' },
  { key: 'planned', label: 'Planned', desc: 'Scheduled maintenance window', color: '#0EA5E9' },
  { key: 'exploratory', label: 'Exploratory', desc: 'Feasibility research only', color: '#94a3b8' },
]

function ScoreBand({ score }: { score: number }) {
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'
  const label = score >= 70 ? 'Highly Suitable' : score >= 40 ? 'Marginal — Review' : 'Not Recommended'
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center border-4 flex-col"
        style={{ borderColor: color }}
      >
        <span className="text-3xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-slate-400">/100</span>
      </div>
      <span className="text-sm font-bold" style={{ color }}>{label}</span>
    </div>
  )
}

function SubScore({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold" style={{ color }}>{value}/100</span>
      </div>
      <Progress value={value} className="h-1.5" style={{ ['--progress-color' as string]: color }} />
    </div>
  )
}

export function AMFeasibilityPage({ role = 'admin' }: { role?: string }) {
  const [form, setForm] = useState({
    part: '', geometry: '', material: '', quantity: '', urgency: '', industry: '', function: '',
  })
  const [showVerdict, setShowVerdict] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setShowVerdict(true) }, 1200)
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
          <Zap className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AM Feasibility Triage</h1>
          <p className="text-sm text-slate-500">30-second AI verdict on whether your part is suitable for additive manufacturing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Input Form */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Part Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Part Name / Description</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="e.g. Pump Impeller DN150, Valve Seat DN80"
                  value={form.part}
                  onChange={e => setForm(f => ({ ...f, part: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Geometry Type</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={form.geometry}
                    onChange={e => setForm(f => ({ ...f, geometry: e.target.value }))}
                    required
                  >
                    <option value="">Select...</option>
                    {GEOMETRY_TYPES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Required Material</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={form.material}
                    onChange={e => setForm(f => ({ ...f, material: e.target.value }))}
                    required
                  >
                    <option value="">Select...</option>
                    {MATERIALS_LIST.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Industry / Regulatory Context</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  >
                    <option value="">Select...</option>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Part Function</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={form.function}
                    onChange={e => setForm(f => ({ ...f, function: e.target.value }))}
                  >
                    <option value="">Select...</option>
                    {FUNCTIONS.map(fn => <option key={fn}>{fn}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Required Quantity</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="e.g. 1, 5, 50"
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">Urgency</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {URGENCY_OPTIONS.map(u => (
                    <button
                      key={u.key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, urgency: u.key }))}
                      className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                        form.urgency === u.key ? 'border-2 text-white' : 'border-slate-200 text-slate-600'
                      }`}
                      style={form.urgency === u.key ? { borderColor: u.color, backgroundColor: u.color } : {}}
                    >
                      <p className="font-semibold">{u.label}</p>
                      <p className="text-[10px] opacity-80">{u.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analysing...
                  </span>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" />Run Assessment</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI Verdict */}
        <div className="space-y-4">
          {!showVerdict ? (
            <Card className="border-0 shadow-sm border-2 border-dashed border-slate-200 h-full flex items-center justify-center">
              <div className="text-center p-8">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">Fill in the form and run an assessment</p>
                <p className="text-xs text-slate-300 mt-1">AI verdict appears here in ~30 seconds</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Score + Verdict */}
              <Card className="border-0 shadow-sm border-2 border-green-200 bg-green-50">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5">
                    <ScoreBand score={78} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Suitable</Badge>
                        <Badge className="bg-sky-100 text-sky-700 text-xs">Queue for Print</Badge>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        This part is <strong>well-suited for additive manufacturing</strong>. The complex internal geometry is ideal for LPBF, the material has validated AM property data, and a certified facility is available within 340 km. DNV GL certification pathway is well-established for this part category.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sub-Scores */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SubScore label="Geometry Suitability" value={88} color="#10B981" />
                  <SubScore label="Material Printability" value={92} color="#10B981" />
                  <SubScore label="Regulatory Burden" value={61} color="#F59E0B" />
                  <SubScore label="Volume Economics" value={72} color="#10B981" />
                </CardContent>
              </Card>

              {/* Cost Comparison */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Cost Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">AddManuChain (AM)</p>
                      <p className="text-2xl font-black text-green-700">$4,200</p>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 4–6 day lead time
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Traditional Procurement</p>
                      <p className="text-2xl font-black text-red-600">$18,400</p>
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 63-day lead time
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg text-center">
                    <p className="text-xs text-slate-500">Estimated savings: <strong className="text-green-700">$14,200 (77%)</strong></p>
                  </div>
                </CardContent>
              </Card>

              {/* Nearest Facility + Regulatory Path */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                      <Printer className="w-3 h-3 text-sky-500" />
                      Nearest Qualified Facility
                    </p>
                    <p className="text-sm font-semibold text-slate-800">Atlantic XL Centre</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />340 km · 4.5 hr print
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-sky-500" />DNV GL certified
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-violet-500" />
                      Regulatory Path
                    </p>
                    <p className="text-sm font-semibold text-slate-800">DNV GL</p>
                    <p className="text-xs text-slate-500 mt-0.5">6–8 weeks</p>
                    <p className="text-xs text-slate-500">~$12,000 est.</p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-sm">
                  Proceed to Order <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  PDF Report
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowVerdict(false)}>
                  New Assessment
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Saved Assessments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Saved Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {SAVED_ASSESSMENTS.map((a, i) => {
              const color = a.score >= 70 ? '#10B981' : a.score >= 40 ? '#F59E0B' : '#EF4444'
              const VerdictIcon = a.score >= 70 ? CheckCircle : a.score >= 40 ? AlertTriangle : XCircle
              return (
                <div key={i} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{ borderColor: color, color }}>
                    {a.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{a.part}</p>
                    <p className="text-[10px] text-slate-400">{a.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color }}>
                      <VerdictIcon className="w-3 h-3" />{a.verdict}
                    </span>
                    {a.ordered
                      ? <Badge className="bg-green-100 text-green-700 text-xs">Ordered</Badge>
                      : <Badge className="bg-slate-100 text-slate-500 text-xs">Not Ordered</Badge>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
