'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DollarSign, TrendingUp, FileBox, Upload, Settings2,
  CheckCircle, Clock, BarChart3, Users, Shield, ChevronRight,
  Eye, Edit, ToggleLeft,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const ROYALTY_DATA = [
  { month: 'Oct', royalty: 21400 },
  { month: 'Nov', royalty: 34200 },
  { month: 'Dec', royalty: 28900 },
  { month: 'Jan', royalty: 41300 },
  { month: 'Feb', royalty: 38700 },
  { month: 'Mar', royalty: 47000 },
]

const IP_ASSETS = [
  { id: 'IP-001', name: 'Pump Impeller DN150 — 316L', license: 'Pay-Per-Print', royalty: 8.5, prints: 134, earnings: 24700, status: 'active', certLevel: 'DNV GL' },
  { id: 'IP-002', name: 'Valve Seat DN80 — Inconel 625', license: 'Restricted', royalty: 12.0, prints: 89, earnings: 31200, status: 'active', certLevel: 'Lloyd\'s' },
  { id: 'IP-003', name: 'Bearing Housing — H13 Tool Steel', license: 'Consortium', royalty: 6.0, prints: 210, earnings: 18900, status: 'active', certLevel: 'Bureau Veritas' },
  { id: 'IP-004', name: 'Nozzle Insert — Ti-6Al-4V', license: 'Pay-Per-Print', royalty: 10.0, prints: 45, earnings: 9800, status: 'active', certLevel: 'ABS' },
  { id: 'IP-005', name: 'Flange Adapter — 304 SS', license: 'Open', royalty: 0, prints: 312, earnings: 0, status: 'active', certLevel: 'DNV GL' },
  { id: 'IP-006', name: 'Heat Exchanger Plate — Hastelloy C', license: 'Restricted', royalty: 15.0, prints: 22, earnings: 14400, status: 'pending_review', certLevel: 'TÜV SÜD' },
  { id: 'IP-007', name: 'Impeller Shroud — 17-4PH SS', license: 'Pay-Per-Print', royalty: 9.5, prints: 67, earnings: 11200, status: 'active', certLevel: 'ClassNK' },
  { id: 'IP-008', name: 'Manifold Block — Duplex 2205', license: 'Consortium', royalty: 7.5, prints: 18, earnings: 3800, status: 'active', certLevel: 'Bureau Veritas' },
]

const LICENSE_MODELS = [
  { key: 'pay_per_print', label: 'Pay-Per-Print', desc: 'Earn a royalty % every time a print token is issued' },
  { key: 'restricted', label: 'Restricted', desc: 'Pre-approved printers only — flat fee per print' },
  { key: 'open', label: 'Open', desc: 'No royalty — any certified facility may print' },
  { key: 'consortium', label: 'Consortium', desc: 'Members-only access with pooled royalty split' },
  { key: 'isolated', label: 'Isolated', desc: 'Single named facility — encrypted, time-limited token' },
]

const LICENSE_COLOR: Record<string, string> = {
  'Pay-Per-Print': '#0EA5E9', Restricted: '#8B5CF6', Open: '#10B981',
  Consortium: '#F59E0B', Isolated: '#EF4444',
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

export function OEMPortalPage({ role = 'admin' }: { role?: string }) {
  const [selectedLicense, setSelectedLicense] = useState('pay_per_print')
  const [royaltyPct, setRoyaltyPct] = useState(8.5)
  const [uploadStep, setUploadStep] = useState(0)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">OEM Self-Service Portal</h1>
            <p className="text-sm text-slate-500">Manage your IP assets, set licensing terms, and earn passive royalty revenue</p>
          </div>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload New Blueprint
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Royalties Earned" value="$284K" sub="Since platform launch" color="#10B981" />
        <StatCard icon={Clock} label="Pending Disbursement" value="$47K" sub="Processing this week" color="#F59E0B" />
        <StatCard icon={TrendingUp} label="Projected This Month" value="$31K" sub="↑ 21% vs last month" color="#0EA5E9" />
        <StatCard icon={FileBox} label="Active IP Assets" value="8" sub="6 certified, 2 pending" color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Royalty Chart */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-500" />
              Monthly Royalty Earnings (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ROYALTY_DATA} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Royalties']} />
                <Bar dataKey="royalty" radius={[4, 4, 0, 0]}>
                  {ROYALTY_DATA.map((_, i) => (
                    <Cell key={i} fill={i === ROYALTY_DATA.length - 1 ? '#8B5CF6' : '#c4b5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Royalty Distribution Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-violet-500" />
              Distribution Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Disbursement Schedule</p>
              <div className="flex gap-2">
                {['Weekly', 'Monthly'].map(s => (
                  <button key={s}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      s === 'Weekly' ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-500'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Payment Method</p>
              <div className="p-2 border border-slate-200 rounded-lg text-xs text-slate-600 bg-slate-50 flex items-center justify-between">
                <span>Bank Transfer — TD Business ****4821</span>
                <Edit className="w-3 h-3 text-slate-400" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Auto-Distribution</p>
              <div className="flex items-center justify-between p-2 border border-slate-200 rounded-lg">
                <span className="text-xs text-slate-600">Distribute automatically</span>
                <div className="w-8 h-4 bg-violet-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-800">Next Disbursement</p>
              <p className="text-lg font-bold text-green-700 mt-1">$47,200</p>
              <p className="text-xs text-green-600">Scheduled: March 21, 2026</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* IP Assets Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileBox className="w-4 h-4 text-violet-500" />
              IP Asset Registry
            </CardTitle>
            <Button size="sm" variant="outline" className="text-xs">
              <Upload className="w-3 h-3 mr-1" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Part Name</TableHead>
                <TableHead className="text-xs">License</TableHead>
                <TableHead className="text-xs">Royalty %</TableHead>
                <TableHead className="text-xs">Prints</TableHead>
                <TableHead className="text-xs">Earned</TableHead>
                <TableHead className="text-xs">Cert Level</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {IP_ASSETS.map(asset => (
                <TableRow key={asset.id} className="hover:bg-slate-50">
                  <TableCell className="py-2">
                    <div>
                      <p className="text-xs font-medium text-slate-800">{asset.name}</p>
                      <p className="text-[10px] text-slate-400">{asset.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: LICENSE_COLOR[asset.license] ?? '#64748b' }}
                    >
                      {asset.license}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-xs text-slate-600">
                    {asset.royalty > 0 ? `${asset.royalty}%` : '—'}
                  </TableCell>
                  <TableCell className="py-2 text-xs text-slate-700 font-medium">{asset.prints}</TableCell>
                  <TableCell className="py-2 text-xs font-semibold text-green-700">
                    {asset.earnings > 0 ? `$${asset.earnings.toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-xs text-slate-500">{asset.certLevel}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge className={`text-xs ${
                      asset.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {asset.status === 'active' ? 'Active' : 'Pending Review'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* License Terms Builder */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-violet-500" />
            License Terms Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Select License Model</p>
              {LICENSE_MODELS.map(lm => (
                <button
                  key={lm.key}
                  onClick={() => setSelectedLicense(lm.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    selectedLicense === lm.key
                      ? 'border-violet-400 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">{lm.label}</p>
                    {selectedLicense === lm.key && (
                      <CheckCircle className="w-4 h-4 text-violet-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{lm.desc}</p>
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Configure Terms</p>
              {(selectedLicense === 'pay_per_print' || selectedLicense === 'restricted' || selectedLicense === 'consortium') && (
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-xs font-medium text-slate-600">Royalty Rate</p>
                    <p className="text-sm font-bold text-violet-700">{royaltyPct.toFixed(1)}%</p>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={0.5}
                    value={royaltyPct}
                    onChange={e => setRoyaltyPct(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0%</span><span>25%</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Minimum Printer Certification</p>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
                  <option>Any certified printer</option>
                  <option>DNV GL certified only</option>
                  <option>Lloyd's Register certified only</option>
                  <option>DNV GL or Lloyd's</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Authorised Regions</p>
                <div className="flex flex-wrap gap-2">
                  {['Canada', 'Norway', 'UK', 'UAE', 'Global'].map(r => (
                    <button key={r} className="px-3 py-1 text-xs border border-slate-200 rounded-full text-slate-600 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50 transition-all">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-xs font-semibold text-violet-800">Estimated Monthly Revenue</p>
                <p className="text-lg font-bold text-violet-700 mt-1">
                  ~${(royaltyPct * 3200).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className="text-xs text-violet-600">Based on current print volume (~3,200 prints/mo)</p>
              </div>
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                Save License Terms <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
