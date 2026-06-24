'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Globe, TrendingDown, DollarSign, AlertTriangle, ShieldCheck,
  BarChart3, Download, CheckCircle, Boxes, Layers,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const SOVEREIGNTY_DATA = [
  { name: 'Domestic — AM', value: 42, color: '#10B981' },
  { name: 'Domestic — Traditional', value: 31, color: '#0EA5E9' },
  { name: 'Foreign Supply', value: 27, color: '#EF4444' },
]

const GEOPOLITICAL_RISKS = [
  { country: 'China', parts: 18, riskScore: 87, trend: 'worsening', amAlternative: 14 },
  { country: 'Germany', parts: 9, riskScore: 32, trend: 'stable', amAlternative: 9 },
  { country: 'South Korea', parts: 6, riskScore: 44, trend: 'stable', amAlternative: 5 },
  { country: 'USA', parts: 12, riskScore: 28, trend: 'stable', amAlternative: 12 },
  { country: 'India', parts: 4, riskScore: 61, trend: 'increasing', amAlternative: 2 },
]

const LEAN_PARTS = [
  { part: 'Pump Impeller DN150', site: 'Hibernia', physQty: 8, minQty: 2, confidence: 96, savings: 42000 },
  { part: 'Valve Seat DN80', site: 'FPSO Atlantic', physQty: 12, minQty: 3, confidence: 91, savings: 28000 },
  { part: 'Bearing Housing H13', site: 'Suncor Upgrader', physQty: 6, minQty: 1, confidence: 88, savings: 56000 },
  { part: 'Nozzle Insert Ti-6Al-4V', site: 'Terra Nova', physQty: 4, minQty: 1, confidence: 94, savings: 31000 },
  { part: 'Flange Adapter 304', site: 'All Sites', physQty: 34, minQty: 5, confidence: 82, savings: 19000 },
  { part: 'Heat Ex. Plate Hastelloy', site: 'Hibernia', physQty: 3, minQty: 1, confidence: 76, savings: 84000 },
  { part: 'Impeller Shroud 17-4PH', site: 'FPSO Atlantic', physQty: 5, minQty: 1, confidence: 89, savings: 38000 },
  { part: 'Manifold Block Duplex', site: 'Terra Nova', physQty: 4, minQty: 1, confidence: 73, savings: 67000 },
  { part: 'Elbow Fitting DN80', site: 'All Sites', physQty: 28, minQty: 4, confidence: 85, savings: 12000 },
  { part: 'Piston Rod 17-4PH', site: 'Suncor Upgrader', physQty: 2, minQty: 1, confidence: 71, savings: 48000 },
]

const PARETO_DATA = [
  { name: 'Heat Ex. Plate', value: 252000, am: 84 },
  { name: 'Manifold Block', value: 201000, am: 73 },
  { name: 'Pump Impeller', value: 168000, am: 96 },
  { name: 'Bearing Housing', value: 148000, am: 88 },
  { name: 'Piston Rod', value: 120000, am: 71 },
  { name: 'Valve Seat', value: 89000, am: 91 },
  { name: 'Impeller Shroud', value: 76000, am: 89 },
  { name: 'Nozzle Insert', value: 62000, am: 94 },
  { name: 'Flange Adapter', value: 41000, am: 82 },
  { name: 'Elbow Fitting', value: 28000, am: 85 },
]

const DISRUPTION_SCENARIOS: Record<string, { affected: number; amReady: number; fallback: string }> = {
  China:    { affected: 18, amReady: 14, fallback: '4 parts require traditional emergency procurement' },
  Germany:  { affected: 9,  amReady: 9,  fallback: 'Full AM coverage — no gap' },
  'South Korea': { affected: 6, amReady: 5, fallback: '1 part requires OEM re-qualification' },
  USA:      { affected: 12, amReady: 12, fallback: 'Full AM coverage — no gap' },
  India:    { affected: 4,  amReady: 2,  fallback: '2 parts have no digital file — critical gap' },
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
          {sub && <p className="text-xs font-medium" style={{ color }}>{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

const RISK_COLOR = (score: number) =>
  score >= 70 ? '#EF4444' : score >= 45 ? '#F59E0B' : '#10B981'

export function SupplyChainIntelligencePage({ role = 'admin' }: { role?: string }) {
  const [scenarioCountry, setScenarioCountry] = useState('China')
  const [threshold, setThreshold] = useState(30)
  const [accepted, setAccepted] = useState<string[]>([])

  const scenario = DISRUPTION_SCENARIOS[scenarioCountry]
  const totalSavings = LEAN_PARTS.reduce((s, p) => s + p.savings, 0)
  const acceptedSavings = LEAN_PARTS.filter(p => accepted.includes(p.part)).reduce((s, p) => s + p.savings, 0)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Supply Chain Intelligence</h1>
            <p className="text-sm text-slate-500">Sovereignty dashboard, LEAN analysis, and Pareto working capital optimiser</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Globe} label="Foreign Dependency" value="27%" sub="12 parts at risk" color="#EF4444" />
        <StatCard icon={ShieldCheck} label="Domestic AM Coverage" value="42%" sub="↑ 8% vs last quarter" color="#10B981" />
        <StatCard icon={DollarSign} label="Total Inventory Value" value="$4.2M" sub="Across all sites" color="#0EA5E9" />
        <StatCard icon={TrendingDown} label="Convertible to Digital" value="34 parts" sub="$1.1M potential savings" color="#8B5CF6" />
      </div>

      {/* ── SECTION 1: Sovereignty ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          Supply Chain Sovereignty Dashboard
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Donut */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Parts by Supply Origin</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={SOVEREIGNTY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {SOVEREIGNTY_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Sovereignty alert threshold */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Foreign dependency alert threshold</span>
                  <span className="font-bold text-red-600">{threshold}%</span>
                </div>
                <input
                  type="range" min={10} max={60} step={5}
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10%</span><span>60%</span>
                </div>
                {27 > threshold ? (
                  <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Alert! Current 27% foreign dependency exceeds threshold
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Within acceptable threshold
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Geopolitical risk table */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Geopolitical Risk by Supplier Country</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {GEOPOLITICAL_RISKS.map(r => (
                <div key={r.country} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium text-slate-700">{r.country}</span>
                      <span className="text-slate-400">{r.parts} parts</span>
                    </div>
                    <Progress value={r.riskScore} className="h-1.5" />
                  </div>
                  <span
                    className="text-xs font-bold w-8 text-right flex-shrink-0"
                    style={{ color: RISK_COLOR(r.riskScore) }}
                  >
                    {r.riskScore}
                  </span>
                  <Badge className={`text-[10px] flex-shrink-0 ${
                    r.trend === 'worsening' ? 'bg-red-100 text-red-700'
                    : r.trend === 'increasing' ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                  }`}>
                    {r.trend}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* What If Scenario */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                &ldquo;What If&rdquo; Disruption Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">If supply from... is disrupted:</p>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={scenarioCountry}
                  onChange={e => setScenarioCountry(e.target.value)}
                >
                  {Object.keys(DISRUPTION_SCENARIOS).map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between text-xs">
                  <span className="text-slate-600">Parts affected</span>
                  <span className="font-bold text-slate-800">{scenario.affected}</span>
                </div>
                <div className="p-2 bg-green-50 rounded-lg flex justify-between text-xs">
                  <span className="text-slate-600">AM alternative available</span>
                  <span className="font-bold text-green-700">{scenario.amReady} / {scenario.affected}</span>
                </div>
                <div className={`p-2 rounded-lg text-xs ${
                  scenario.affected === scenario.amReady ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {scenario.fallback}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── SECTION 2: LEAN Analysis ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          LEAN Conversion Analysis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total Carrying Cost', value: '$4.2M', sub: 'All sites, all parts', color: '#64748b' },
            { label: 'Safe to Convert to Digital', value: '34 parts', sub: 'Confidence ≥ 70%', color: '#8B5CF6' },
            { label: 'Projected Savings', value: '$1.1M', sub: 'If all 34 converted', color: '#10B981' },
            { label: 'Currently Converted', value: '12%', sub: '↑ from 4% last year', color: '#0EA5E9' },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: s.color }}>{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700">LEAN Conversion Candidates</CardTitle>
              {accepted.length > 0 && (
                <span className="text-xs font-medium text-green-700">
                  ${acceptedSavings.toLocaleString()} freed by accepting {accepted.length} recommendations
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {LEAN_PARTS.map(p => {
              const isAccepted = accepted.includes(p.part)
              const color = p.confidence >= 90 ? '#10B981' : p.confidence >= 80 ? '#0EA5E9' : '#F59E0B'
              return (
                <div key={p.part} className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                  isAccepted ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-medium text-slate-800">{p.part}</p>
                      <span className="text-[10px] text-slate-400">{p.site}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1">
                        <Progress value={p.confidence} className="h-1" />
                      </div>
                      <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>
                        {p.confidence}% confident
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-green-700">${p.savings.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">potential savings</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isAccepted ? 'default' : 'outline'}
                    className={`text-xs h-7 flex-shrink-0 ${isAccepted ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    onClick={() => setAccepted(a => isAccepted ? a.filter(x => x !== p.part) : [...a, p.part])}
                  >
                    {isAccepted ? <><CheckCircle className="w-3 h-3 mr-1" />Accepted</> : 'Accept'}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── SECTION 3: Pareto Optimiser ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          Pareto Working Capital Optimiser
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Top 10 Parts by Inventory Value vs AM Conversion Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={PARETO_DATA} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip formatter={(v: number, name: string) =>
                    name === 'value' ? [`$${v.toLocaleString()}`, 'Inventory Value'] : [`${v}%`, 'AM Suitability']
                  } />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Conversion Roadmap — Maximum Capital Release
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PARETO_DATA.slice(0, 5).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 p-2 border border-slate-200 rounded-lg">
                    <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">${p.value.toLocaleString()} · {p.am}% AM-ready</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-6 px-2 flex-shrink-0">
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs font-semibold text-indigo-800">
                  If top 5 parts are converted to digital:
                </p>
                <p className="text-xl font-black text-indigo-700 mt-1">
                  ${ PARETO_DATA.slice(0, 5).reduce((s, p) => s + Math.round(p.value * 0.75), 0).toLocaleString() }
                </p>
                <p className="text-xs text-indigo-600">estimated working capital freed (75% reduction in physical stock)</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Accept All Top 5
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
