'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  FlaskConical, Database, Download, Upload, GitCompare,
  CheckCircle, AlertTriangle, Search, ChevronDown, ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend,
} from 'recharts'

const MATERIALS = [
  {
    id: 'MP-001', alloy: 'Ti-6Al-4V', process: 'LPBF', form: 'Powder',
    yield: 1100, tensile: 1180, elongation: 8.2, fatigue: 550, hardness: 36, density: 4.42,
    samples: 48, contributor: 'Halifax AM Lab', validation: 'DNV GL', date: 'Nov 2025',
    details: 'Hot isostatic pressing (HIP) applied. Tested per ASTM E8. HV measured at 10kg load.',
  },
  {
    id: 'MP-002', alloy: 'Inconel 625', process: 'LPBF', form: 'Powder',
    yield: 758, tensile: 986, elongation: 38, fatigue: 310, hardness: 28, density: 8.44,
    samples: 36, contributor: 'Atlantic XL Centre', validation: 'Lloyd\'s Register', date: 'Jan 2026',
    details: 'Solution annealed post-build. Tested to ASTM B637. Corrosion resistance verified per ASTM G28.',
  },
  {
    id: 'MP-003', alloy: '316L Stainless', process: 'LPBF', form: 'Powder',
    yield: 546, tensile: 672, elongation: 42, fatigue: 220, hardness: 23, density: 7.99,
    samples: 62, contributor: 'Dalhousie AM Lab', validation: 'DNV GL', date: 'Sep 2025',
    details: 'As-built condition. Tested to ASTM A276. Salt spray tested 500h per ASTM B117.',
  },
  {
    id: 'MP-004', alloy: 'Inconel 718', process: 'DED', form: 'Wire',
    yield: 1034, tensile: 1241, elongation: 12, fatigue: 480, hardness: 40, density: 8.19,
    samples: 24, contributor: 'NRC Halifax', validation: 'Pending', date: 'Feb 2026',
    details: 'Direct energy deposition — wire feed. Requires validation by class society before offshore use.',
  },
  {
    id: 'MP-005', alloy: 'H13 Tool Steel', process: 'LPBF', form: 'Powder',
    yield: 1380, tensile: 1520, elongation: 5.8, fatigue: 620, hardness: 52, density: 7.80,
    samples: 18, contributor: 'Halifax AM Lab', validation: 'Bureau Veritas', date: 'Oct 2025',
    details: 'Tempered at 550°C post-build. High cycle fatigue per ASTM E466. Wear resistance verified.',
  },
  {
    id: 'MP-006', alloy: 'Hastelloy C-276', process: 'DED', form: 'Powder',
    yield: 690, tensile: 860, elongation: 35, fatigue: 270, hardness: 25, density: 8.89,
    samples: 12, contributor: 'Atlantic XL Centre', validation: 'TÜV SÜD', date: 'Dec 2025',
    details: 'Superior corrosion resistance in seawater environments. Tested per NACE TM0177.',
  },
  {
    id: 'MP-007', alloy: '17-4PH Stainless', process: 'LPBF', form: 'Powder',
    yield: 1170, tensile: 1310, elongation: 10, fatigue: 490, hardness: 42, density: 7.78,
    samples: 31, contributor: 'Dalhousie AM Lab', validation: 'ABS', date: 'Nov 2025',
    details: 'H900 condition. Precipitation hardened. Tested to AMS 5643. High strength-to-weight ratio.',
  },
  {
    id: 'MP-008', alloy: 'Duplex 2205', process: 'LPBF', form: 'Powder',
    yield: 620, tensile: 790, elongation: 25, fatigue: 295, hardness: 27, density: 7.80,
    samples: 22, contributor: 'NRC Halifax', validation: 'DNV GL', date: 'Jan 2026',
    details: 'Excellent pitting resistance. Phase balance (ferrite/austenite) verified by EBSD analysis.',
  },
  {
    id: 'MP-009', alloy: 'AlSi10Mg', process: 'LPBF', form: 'Powder',
    yield: 240, tensile: 320, elongation: 8, fatigue: 95, hardness: 18, density: 2.68,
    samples: 55, contributor: 'Halifax AM Lab', validation: 'ClassNK', date: 'Aug 2025',
    details: 'T6 heat treatment applied. Tested per EN 1706. Good thermal conductivity for heat exchangers.',
  },
  {
    id: 'MP-010', alloy: 'CuCrZr', process: 'LPBF', form: 'Powder',
    yield: 330, tensile: 400, elongation: 20, fatigue: 140, hardness: 19, density: 8.90,
    samples: 9, contributor: 'Atlantic XL Centre', validation: 'Pending', date: 'Mar 2026',
    details: 'Copper alloy for high thermal conductivity applications. Requires additional validation.',
  },
  {
    id: 'MP-011', alloy: 'SS 304', process: 'FFF', form: 'Filament',
    yield: 380, tensile: 510, elongation: 30, fatigue: 170, hardness: 21, density: 7.90,
    samples: 15, contributor: 'Dalhousie AM Lab', validation: 'Pending', date: 'Feb 2026',
    details: 'Binder jetting + sintered. Lower density due to residual porosity (~2%). Research use.',
  },
  {
    id: 'MP-012', alloy: 'GRCop-84', process: 'LPBF', form: 'Powder',
    yield: 295, tensile: 380, elongation: 18, fatigue: 120, hardness: 17, density: 8.65,
    samples: 6, contributor: 'NRC Halifax', validation: 'Pending', date: 'Mar 2026',
    details: 'Copper alloy for combustion chamber applications. Early-stage data — not yet offshore-validated.',
  },
]

const GAP_MATERIALS = [
  { alloy: 'Titanium Grade 5 (wire-DED)', gap: 'No fatigue data', impact: 'Blocks offshore structural use' },
  { alloy: 'Nickel Alloy 625 (FFF)', gap: 'No tensile or fatigue data', impact: 'Cannot certify for pressure-bearing parts' },
  { alloy: 'Duplex 2507 Super Duplex', gap: 'Only 4 samples — insufficient', impact: 'Cannot validate for subsea' },
  { alloy: 'Stellite 6 (DED)', gap: 'No elongation or fatigue data', impact: 'Limited to non-structural applications' },
  { alloy: 'Haynes 282', gap: 'No AM dataset exists at all', impact: 'High-temperature turbine applications blocked' },
]

const VALIDATION_COLOR: Record<string, { color: string; bg: string }> = {
  'DNV GL':           { color: '#0EA5E9', bg: 'bg-sky-100' },
  'Lloyd\'s Register': { color: '#8B5CF6', bg: 'bg-violet-100' },
  'Bureau Veritas':   { color: '#10B981', bg: 'bg-green-100' },
  'TÜV SÜD':         { color: '#F59E0B', bg: 'bg-amber-100' },
  'ABS':              { color: '#14B8A6', bg: 'bg-teal-100' },
  'ClassNK':          { color: '#EF4444', bg: 'bg-red-100' },
  Pending:            { color: '#94a3b8', bg: 'bg-slate-100' },
}

const PROCESS_COLOR: Record<string, string> = {
  LPBF: '#0EA5E9', DED: '#8B5CF6', FFF: '#14B8A6',
}

export function MaterialPropertiesPage({ role = 'admin' }: { role?: string }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const filtered = MATERIALS.filter(m =>
    m.alloy.toLowerCase().includes(search.toLowerCase()) ||
    m.process.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id))
    } else if (selected.length < 4) {
      setSelected(s => [...s, id])
    }
  }

  const selectedMaterials = MATERIALS.filter(m => selected.includes(m.id))
  const radarData = ['Yield', 'Tensile', 'Elongation', 'Fatigue', 'Hardness'].map(key => {
    const row: Record<string, string | number> = { metric: key }
    selectedMaterials.forEach(m => {
      const val = key === 'Yield' ? m.yield / 15
        : key === 'Tensile' ? m.tensile / 15
        : key === 'Elongation' ? m.elongation * 2
        : key === 'Fatigue' ? m.fatigue / 7
        : m.hardness * 2
      row[m.alloy] = Math.min(100, val)
    })
    return row
  })

  const RADAR_COLORS = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B']

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Material Properties Library</h1>
            <p className="text-sm text-slate-500">Tested AM material mechanical data — the MMPDS equivalent for additive manufacturing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export CSV
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
            <Upload className="w-4 h-4 mr-2" />
            Contribute Data
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Alloys in Database', value: '12', sub: 'Offshore-relevant', color: '#0EA5E9' },
          { label: 'Validated Datasets', value: '9', sub: 'Class society reviewed', color: '#10B981' },
          { label: 'Total Test Coupons', value: '339', sub: 'Across all alloys', color: '#8B5CF6' },
          { label: 'Data Gaps Identified', value: '5', sub: 'Contributions needed', color: '#F59E0B' },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: s.color }}>{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search by alloy name or process..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={compareMode ? 'default' : 'outline'}
          size="sm"
          className={`text-xs ${compareMode ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}`}
          onClick={() => { setCompareMode(v => !v); setSelected([]) }}
        >
          <GitCompare className="w-3 h-3 mr-1" />
          {compareMode ? `Compare (${selected.length}/4)` : 'Compare Mode'}
        </Button>
      </div>

      {/* Comparison Chart */}
      {compareMode && selected.length >= 2 && (
        <Card className="border-0 shadow-sm border-2 border-violet-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Material Property Comparison — {selected.length} alloys selected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
                {selectedMaterials.map((m, i) => (
                  <Radar key={m.id} name={m.alloy} dataKey={m.alloy}
                    stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.15}
                    dot={{ fill: RADAR_COLORS[i], r: 3 }} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Values normalised for comparison. See table for absolute numbers.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Materials Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {compareMode && <TableHead className="w-8 pl-4"></TableHead>}
                <TableHead className="text-xs pl-4">Alloy</TableHead>
                <TableHead className="text-xs">Process</TableHead>
                <TableHead className="text-xs">Yield (MPa)</TableHead>
                <TableHead className="text-xs">Tensile (MPa)</TableHead>
                <TableHead className="text-xs">Elong. (%)</TableHead>
                <TableHead className="text-xs">Fatigue (MPa)</TableHead>
                <TableHead className="text-xs">Samples</TableHead>
                <TableHead className="text-xs">Validated By</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => {
                const isExpanded = expanded === m.id
                const isSelected = selected.includes(m.id)
                const vc = VALIDATION_COLOR[m.validation] ?? VALIDATION_COLOR.Pending
                return (
                  <>
                    <TableRow
                      key={m.id}
                      className={`hover:bg-slate-50 cursor-pointer ${isSelected ? 'bg-violet-50' : ''}`}
                      onClick={() => compareMode ? toggleSelect(m.id) : setExpanded(isExpanded ? null : m.id)}
                    >
                      {compareMode && (
                        <TableCell className="py-2 pl-4">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="py-2 pl-4">
                        <p className="text-xs font-semibold text-slate-800">{m.alloy}</p>
                        <p className="text-[10px] text-slate-400">{m.form} · {m.date}</p>
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: PROCESS_COLOR[m.process] }}>
                          {m.process}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-xs font-medium text-slate-700">{m.yield}</TableCell>
                      <TableCell className="py-2 text-xs font-medium text-slate-700">{m.tensile}</TableCell>
                      <TableCell className="py-2 text-xs text-slate-600">{m.elongation}</TableCell>
                      <TableCell className="py-2 text-xs text-slate-600">{m.fatigue}</TableCell>
                      <TableCell className="py-2 text-xs text-slate-600">{m.samples}</TableCell>
                      <TableCell className="py-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${vc.bg}`}
                          style={{ color: vc.color }}>
                          {m.validation === 'Pending'
                            ? <><AlertTriangle className="w-3 h-3 inline mr-0.5" />Pending</>
                            : <><ShieldCheck className="w-3 h-3 inline mr-0.5" />{m.validation}</>
                          }
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        {!compareMode && (
                          isExpanded
                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                            : <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && !compareMode && (
                      <TableRow key={`${m.id}-detail`} className="bg-slate-50 hover:bg-slate-50">
                        <TableCell colSpan={10} className="py-3 px-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <p className="text-xs font-semibold text-slate-600 mb-1">Test Methodology</p>
                              <p className="text-xs text-slate-600">{m.details}</p>
                              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                <span><strong>Contributor:</strong> {m.contributor}</span>
                                <span><strong>Hardness:</strong> {m.hardness} HRC</span>
                                <span><strong>Density:</strong> {m.density} g/cm³</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs flex-1">
                                <Download className="w-3 h-3 mr-1" />
                                Export Data
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs flex-1">
                                Link to Blueprint
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gap Map */}
      <Card className="border-0 shadow-sm border-2 border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Data Gap Map — Contributions Needed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {GAP_MATERIALS.map(g => (
            <div key={g.alloy} className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">{g.alloy}</p>
                <p className="text-xs text-amber-700 font-medium">{g.gap}</p>
                <p className="text-[10px] text-slate-500">{g.impact}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs border-amber-400 text-amber-700 hover:bg-amber-100">
                <Upload className="w-3 h-3 mr-1" />
                Contribute
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
