'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Users, Package, ArrowDownToLine, ArrowUpFromLine, DollarSign,
  CheckCircle, Clock, Globe, Star, TrendingUp, RefreshCw,
  ShieldCheck, Printer,
} from 'lucide-react'

const POOL_PARTS = [
  { id: 'CP-001', name: 'Pump Impeller DN150 — 316L SS', contributor: 'Atlantic Operator 1', certLevel: 'DNV GL', drawFee: '$340', availability: 'available', drawCount: 47 },
  { id: 'CP-002', name: 'Valve Seat DN80 — Inconel 625', contributor: 'Arctic Drilling Co.', certLevel: 'Lloyd\'s Register', drawFee: '$520', availability: 'available', drawCount: 28 },
  { id: 'CP-003', name: 'Bearing Housing — H13 Tool Steel', contributor: 'Horizon Maritime', certLevel: 'Bureau Veritas', drawFee: '$180', availability: 'printing', drawCount: 83 },
  { id: 'CP-004', name: 'Nozzle Insert — Ti-6Al-4V', contributor: 'NL Energy Ltd.', certLevel: 'ABS', drawFee: '$740', availability: 'available', drawCount: 15 },
  { id: 'CP-005', name: 'Flange Adapter — 304 SS', contributor: 'Seabed Solutions', certLevel: 'DNV GL', drawFee: '$90', availability: 'available', drawCount: 124 },
  { id: 'CP-006', name: 'Heat Exchanger Plate — Hastelloy C', contributor: 'Arctic Drilling Co.', certLevel: 'TÜV SÜD', drawFee: '$1,200', availability: 'needs_revalidation', drawCount: 9 },
  { id: 'CP-007', name: 'Impeller Shroud — 17-4PH SS', contributor: 'Atlantic Operator 2', certLevel: 'ClassNK', drawFee: '$410', availability: 'available', drawCount: 34 },
  { id: 'CP-008', name: 'Manifold Block — Duplex 2205', contributor: 'Horizon Maritime', certLevel: 'Bureau Veritas', drawFee: '$680', availability: 'available', drawCount: 21 },
  { id: 'CP-009', name: 'Elbow Fitting — 2205 Duplex', contributor: 'NL Energy Ltd.', certLevel: 'DNV GL', drawFee: '$120', availability: 'available', drawCount: 61 },
  { id: 'CP-010', name: 'Piston Rod — 17-4PH SS', contributor: 'Seabed Solutions', certLevel: 'Lloyd\'s Register', drawFee: '$950', availability: 'available', drawCount: 7 },
]

const MY_CONTRIBUTIONS = [
  { id: 'MY-001', name: 'Valve Body — 316L SS', certLevel: 'DNV GL', drawFee: '$280', draws: 38, earned: 10640 },
  { id: 'MY-002', name: 'Pump Housing — Inconel 718', certLevel: 'Lloyd\'s Register', drawFee: '$620', draws: 14, earned: 8680 },
  { id: 'MY-003', name: 'Bracket Assembly — 304 SS', certLevel: 'ABS', drawFee: '$85', draws: 67, earned: 5695 },
]

const DRAW_HISTORY = [
  { date: 'Mar 14, 2026', part: 'Pump Impeller DN150', facility: 'Atlantic XL Centre', status: 'delivered', fee: '$340' },
  { date: 'Mar 11, 2026', part: 'Valve Seat DN80', facility: 'PolyUnity NL', status: 'delivered', fee: '$520' },
  { date: 'Mar 8, 2026',  part: 'Flange Adapter', facility: 'Atlantic XL Centre', status: 'delivered', fee: '$90' },
  { date: 'Mar 3, 2026',  part: 'Nozzle Insert Ti64', facility: 'Halifax AM Lab', status: 'delivered', fee: '$740' },
  { date: 'Feb 28, 2026', part: 'Elbow Fitting', facility: 'PolyUnity NL', status: 'delivered', fee: '$120' },
  { date: 'Feb 22, 2026', part: 'Impeller Shroud', facility: 'Atlantic XL Centre', status: 'delivered', fee: '$410' },
  { date: 'Feb 18, 2026', part: 'Manifold Block', facility: 'Halifax AM Lab', status: 'printing', fee: '$680' },
  { date: 'Feb 14, 2026', part: 'Bearing Housing', facility: 'PolyUnity NL', status: 'delivered', fee: '$180' },
]

const MEMBERS = [
  { name: 'Atlantic Operator 1', joined: 'Jan 2025', contributions: 12, draws: 47, tier: 'Gold' },
  { name: 'Arctic Drilling Co.', joined: 'Mar 2025', contributions: 8, draws: 32, tier: 'Silver' },
  { name: 'Horizon Maritime', joined: 'Jun 2025', contributions: 15, draws: 28, tier: 'Gold' },
  { name: 'NL Energy Ltd.', joined: 'Sep 2025', contributions: 5, draws: 19, tier: 'Bronze' },
  { name: 'Seabed Solutions', joined: 'Nov 2025', contributions: 9, draws: 41, tier: 'Silver' },
  { name: 'Atlantic Operator 2', joined: 'Jan 2026', contributions: 3, draws: 8, tier: 'Bronze' },
]

const AVAILABILITY: Record<string, { label: string; color: string }> = {
  available: { label: 'Available', color: '#10B981' },
  printing:  { label: 'Printing Now', color: '#0EA5E9' },
  needs_revalidation: { label: 'Needs Re-validation', color: '#F59E0B' },
}

const TIER_COLOR: Record<string, string> = {
  Gold: '#F59E0B', Silver: '#94a3b8', Bronze: '#cd7c3f',
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

export function DigitalCooperativePage({ role = 'admin' }: { role?: string }) {
  const [activeTab, setActiveTab] = useState<'pool' | 'contributions' | 'history'>('pool')
  const tabs = [
    { key: 'pool', label: 'Available in Pool' },
    { key: 'contributions', label: 'My Contributions' },
    { key: 'history', label: 'Draw History' },
  ]

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Digital Cooperative</h1>
            <p className="text-sm text-slate-500">Shared certified blueprint pool — draw any part, print at any member facility</p>
          </div>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <ArrowUpFromLine className="w-4 h-4 mr-2" />
          Contribute Blueprint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Digital Assets in Pool" value="847" sub="Across 12 members" color="#14B8A6" />
        <StatCard icon={Users} label="Member Organisations" value="12" sub="Atlantic Canada / Arctic" color="#0EA5E9" />
        <StatCard icon={ArrowDownToLine} label="Draws This Month" value="234" sub="↑ 31% vs last month" color="#10B981" />
        <StatCard icon={TrendingUp} label="Replenishment Rate" value="98.2%" sub="Pool health: excellent" color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Content — Tabbed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Bar */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg w-fit">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === t.key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'pool' && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs pl-4">Part Name</TableHead>
                      <TableHead className="text-xs">Contributor</TableHead>
                      <TableHead className="text-xs">Cert Level</TableHead>
                      <TableHead className="text-xs">Draw Fee</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {POOL_PARTS.map(p => {
                      const avail = AVAILABILITY[p.availability]
                      return (
                        <TableRow key={p.id} className="hover:bg-slate-50">
                          <TableCell className="py-2 pl-4">
                            <p className="text-xs font-medium text-slate-800">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.id} · {p.drawCount} draws</p>
                          </TableCell>
                          <TableCell className="py-2 text-xs text-slate-600">{p.contributor}</TableCell>
                          <TableCell className="py-2">
                            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-sky-500" />
                              {p.certLevel}
                            </span>
                          </TableCell>
                          <TableCell className="py-2 text-xs font-semibold text-teal-700">{p.drawFee}</TableCell>
                          <TableCell className="py-2">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: avail.color }}>
                              {avail.label}
                            </span>
                          </TableCell>
                          <TableCell className="py-2">
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2"
                              disabled={p.availability === 'needs_revalidation'}>
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Draw
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === 'contributions' && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-700">My Contributed Assets</CardTitle>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total earned from pool</p>
                    <p className="text-lg font-bold text-teal-700">$25,015</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MY_CONTRIBUTIONS.map(c => (
                    <div key={c.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.certLevel} · {c.draws} draws · {c.drawFee}/draw</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-green-700">${c.earned.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">earned</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-xs text-teal-800">
                    <strong>18 assets</strong> contributed to the pool • <strong>$12,400</strong> earned from other members&apos; draws this year
                  </p>
                </div>
                <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Contribute New Asset
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs pl-4">Date</TableHead>
                      <TableHead className="text-xs">Part</TableHead>
                      <TableHead className="text-xs">Facility</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Fee Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DRAW_HISTORY.map((d, i) => (
                      <TableRow key={i} className="hover:bg-slate-50">
                        <TableCell className="py-2 pl-4 text-xs text-slate-500">{d.date}</TableCell>
                        <TableCell className="py-2 text-xs font-medium text-slate-800">{d.part}</TableCell>
                        <TableCell className="py-2 text-xs text-slate-600">{d.facility}</TableCell>
                        <TableCell className="py-2">
                          <Badge className={`text-xs ${
                            d.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'
                          }`}>
                            {d.status === 'delivered' ? 'Delivered' : 'Printing'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 text-xs font-semibold text-teal-700">{d.fee}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar — Members + Join CTA */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                Member Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MEMBERS.map(m => (
                <div key={m.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: TIER_COLOR[m.tier] }}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400">Since {m.joined} · {m.contributions} assets</p>
                  </div>
                  <Star className="w-3 h-3 flex-shrink-0" style={{ color: TIER_COLOR[m.tier] }} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Join Cooperative CTA */}
          <Card className="border-0 shadow-sm border-2 border-dashed border-teal-200 bg-teal-50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <p className="text-sm font-semibold text-teal-800">Invite Your Partners</p>
              </div>
              <p className="text-xs text-teal-700">
                Every new member adds assets to the pool. More members = more parts available for you to draw.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-teal-200">
                  <span className="text-xs text-slate-700 font-medium">Bronze Membership</span>
                  <span className="text-sm font-bold text-teal-700">$4,800/yr</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-teal-300">
                  <span className="text-xs text-slate-700 font-medium">Silver Membership</span>
                  <span className="text-sm font-bold text-teal-700">$9,600/yr</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border-2 border-amber-400">
                  <span className="text-xs text-slate-700 font-medium">Gold Membership</span>
                  <span className="text-sm font-bold text-amber-600">$18,000/yr</span>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs">
                Send Invite Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
