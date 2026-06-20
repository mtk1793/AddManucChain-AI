'use client'

/**
 * RoleDashboard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Role-aware home panel.  Renders a completely different "Overview" for each
 * of the 6 personas in the AddManuChain platform:
 *
 *   admin          Platform Admin       (Mahmoud K.)
 *   oem_partner    OEM Partner          (Johann Weber — Wärtsilä)
 *   end_user       End User / Client    (Capt. Sarah Leblanc — Horizon Maritime)
 *   cert_authority Cert Authority       (Dr. Priya Patel — DNV)
 *   print_center   3D Print Facility    (Michael Okafor — PolyUnity NL)
 *   lab            Lab / Testing        (Prof. Ahmad Osman — Dalhousie AM Lab)
 *
 * Admin role keeps the existing full OverviewPage — no duplicate code needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity, AlertTriangle, Award, Boxes,
  CheckCircle, ChevronRight, Clock, DollarSign, Factory,
  FileBox, FileText, FlaskConical, KeyRound, Package, Play,
  Printer, ShieldCheck, ShieldAlert, Truck, Zap,
} from 'lucide-react'
import { OverviewPage } from './OverviewPage'

// ── shared types ──────────────────────────────────────────────────────────────

interface StatCard {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string      // tailwind bg class
  iconColor: string  // tailwind text class
  trend?: string
  trendUp?: boolean
}

interface AlertRow {
  type: 'warning' | 'info' | 'success' | 'error'
  title: string
  detail: string
  time: string
}

// ── reusable primitives ───────────────────────────────────────────────────────

function Stat({ s }: { s: StatCard }) {
  const Icon = s.icon
  return (
    <Card className="bg-white border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[#0F172A]">{s.value}</p>
            {s.sub && <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>}
            {s.trend && (
              <p className={`text-xs mt-1 font-medium ${s.trendUp ? 'text-teal-600' : 'text-amber-600'}`}>
                {s.trendUp ? '▲' : '▼'} {s.trend}
              </p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${s.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ALERT_STYLE: Record<AlertRow['type'], string> = {
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-sky-50 border-sky-200 text-sky-800',
  success: 'bg-teal-50 border-teal-200 text-teal-800',
  error:   'bg-red-50 border-red-200 text-red-800',
}
const ALERT_ICON: Record<AlertRow['type'], React.ElementType> = {
  warning: AlertTriangle,
  info:    Activity,
  success: CheckCircle,
  error:   AlertTriangle,
}

function Alerts({ rows }: { rows: AlertRow[] }) {
  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-[#0F172A]">Notifications &amp; Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r, i) => {
          const Icon = ALERT_ICON[r.type]
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${ALERT_STYLE[r.type]}`}>
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{r.title}</p>
                <p className="text-xs opacity-75 mt-0.5">{r.detail}</p>
              </div>
              <span className="text-xs opacity-60 whitespace-nowrap">{r.time}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── 1. OEM Partner panel ──────────────────────────────────────────────────────

function OEMPartnerPanel() {
  const stats: StatCard[] = [
    { label: 'Active Blueprints',    value: 47,      sub: 'Under DRM protection',   icon: FileBox,     color: 'bg-violet-100', iconColor: 'text-violet-600', trend: '+3 this month', trendUp: true },
    { label: 'Print Events (30d)',   value: 128,     sub: 'Across all licensees',   icon: Zap,         color: 'bg-sky-100',    iconColor: 'text-sky-600',    trend: '+12% vs last month', trendUp: true },
    { label: 'Royalties Earned',     value: '$42.6k', sub: 'Current quarter',        icon: DollarSign,  color: 'bg-teal-100',   iconColor: 'text-teal-600',   trend: '+8% vs Q3', trendUp: true },
    { label: 'Pending Approvals',    value: 6,       sub: 'DRM sign-off required',  icon: KeyRound,    color: 'bg-amber-100',  iconColor: 'text-amber-600' },
  ]

  const alerts: AlertRow[] = [
    { type: 'warning', title: '6 print jobs awaiting your DRM approval', detail: 'BP-2024-089, BP-2024-091, +4 more', time: '2h ago' },
    { type: 'success', title: 'Royalty payment processed — $14,800', detail: 'Q4 license fee from Horizon Maritime', time: 'Today' },
    { type: 'info',    title: 'New licensee onboarded: NovaDrill Solutions', detail: 'Arctic-class valve pack (14 blueprints)', time: 'Yesterday' },
    { type: 'warning', title: '2 blueprints expiring in 30 days', detail: 'BP-2024-031 · BP-2024-038 — renewal required', time: '3d ago' },
  ]

  return (
    <div className="space-y-6 p-6">
      <WelcomeBanner
        name="Johann Weber"
        role="OEM Partner"
        org="Wärtsilä Marine"
        color="#8B5CF6"
        tagline="Your IP. Protected. Every print."
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <Alerts rows={alerts} />
      <BlueprintUsageTable />
    </div>
  )
}

function BlueprintUsageTable() {
  const rows = [
    { id: 'BP-2024-089', name: 'Pump Impeller Mk3', licensee: 'Horizon Maritime', prints: 3, revenue: '$2,100', status: 'pending_approval' },
    { id: 'BP-2024-091', name: 'Valve Housing 40mm', licensee: 'Arctic Drilling Corp', prints: 1, revenue: '$450', status: 'pending_approval' },
    { id: 'BP-2024-074', name: 'Bearing Cap Std', licensee: 'GulfTech Industries', prints: 8, revenue: '$4,800', status: 'approved' },
    { id: 'BP-2024-060', name: 'Crankshaft Sleeve', licensee: 'NovaDrill Solutions', prints: 2, revenue: '$2,600', status: 'approved' },
    { id: 'BP-2024-051', name: 'Seal Ring Set', licensee: 'Veolia Marine Services', prints: 12, revenue: '$3,950', status: 'approved' },
  ]
  const statusColor: Record<string, string> = {
    approved: 'bg-teal-100 text-teal-700',
    pending_approval: 'bg-amber-100 text-amber-700',
  }
  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[#0F172A]">Recent Blueprint Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-slate-500">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="border-t border-slate-100">
            <tr className="text-left text-xs text-slate-400 uppercase">
              <th className="px-4 py-2 font-medium">Blueprint</th>
              <th className="px-4 py-2 font-medium">Licensee</th>
              <th className="px-4 py-2 font-medium">Prints</th>
              <th className="px-4 py-2 font-medium">Revenue</th>
              <th className="px-4 py-2 font-medium">DRM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="font-medium text-[#0F172A]">{r.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{r.id}</div>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{r.licensee}</td>
                <td className="px-4 py-2.5 font-semibold text-[#0F172A]">{r.prints}</td>
                <td className="px-4 py-2.5 font-medium text-teal-600">{r.revenue}</td>
                <td className="px-4 py-2.5">
                  <Badge variant="secondary" className={`text-xs ${statusColor[r.status]}`}>
                    {r.status === 'pending_approval' ? 'Pending' : 'Approved'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

// ── 2. End User / Client panel ────────────────────────────────────────────────

function EndUserPanel() {
  const stats: StatCard[] = [
    { label: 'Active Orders',       value: 4,       sub: '2 in production',        icon: Package,     color: 'bg-sky-100',    iconColor: 'text-sky-600' },
    { label: 'Parts On The Way',    value: 7,       sub: 'Dispatched this week',   icon: Truck,       color: 'bg-teal-100',   iconColor: 'text-teal-600', trend: '2–5 day ETA', trendUp: true },
    { label: 'Est. Cost Savings',   value: '$8.2k', sub: 'vs. OEM retail (YTD)',   icon: DollarSign,  color: 'bg-emerald-100', iconColor: 'text-emerald-600', trend: '34% cheaper', trendUp: true },
    { label: 'Physical Stock Items', value: 63,     sub: 'Onboard + yard',         icon: Boxes,       color: 'bg-violet-100', iconColor: 'text-violet-600' },
  ]

  const alerts: AlertRow[] = [
    { type: 'success', title: 'Order ORD-2025-041 shipped — ETA Feb 28', detail: '3× Pump Impeller Mk3 via PolyUnity NL', time: '1h ago' },
    { type: 'info',    title: '2 parts fall below minimum stock', detail: 'Bearing Cap Std (×2), Seal Ring (×5) — reorder suggested', time: '4h ago' },
    { type: 'warning', title: 'DRM pending on ORD-2025-039', detail: 'Awaiting OEM sign-off before printing can begin', time: 'Yesterday' },
    { type: 'success', title: 'Peer printer booking confirmed', detail: 'Carlos Diaz · Halifax Print Hub — Mar 3 09:00', time: '2d ago' },
  ]

  const orders = [
    { id: 'ORD-2025-041', part: 'Pump Impeller Mk3',    qty: 3, status: 'shipped',      eta: 'Feb 28' },
    { id: 'ORD-2025-039', part: 'Valve Housing 40mm',   qty: 1, status: 'drm_hold',     eta: 'Mar 3' },
    { id: 'ORD-2025-037', part: 'Bearing Cap Std',      qty: 2, status: 'printing',     eta: 'Mar 1' },
    { id: 'ORD-2025-034', part: 'Seal Ring Set (×10)',  qty: 1, status: 'delivered',    eta: 'Feb 20' },
  ]
  const orderColor: Record<string, string> = {
    shipped:   'bg-teal-100 text-teal-700',
    drm_hold:  'bg-amber-100 text-amber-700',
    printing:  'bg-sky-100 text-sky-700',
    delivered: 'bg-emerald-100 text-emerald-700',
  }

  const onSitePrinters = [
    {
      id: 'OSP-01', model: 'Markforged X7', location: 'Engine Room — Deck 3',
      certified: true, certBody: 'DNV GL', certNumber: 'DNV-GL-2024-0041',
      status: 'online', currentJob: 'Bearing Cap Std (DRM-7738)',
      tech: 'FFF + Continuous Fiber', printVolume: '330 × 270 × 200 mm',
      materials: ['Onyx FR', 'Onyx', 'Carbon Fiber', 'Kevlar', 'HSHT Fiberglass'],
      completedJobs: 47,
    },
    {
      id: 'OSP-02', model: 'HP Jet Fusion 580', location: 'Workshop Bay A',
      certified: true, certBody: 'DNV GL', certNumber: 'DNV-GL-2023-0089',
      status: 'busy', currentJob: 'Valve Seat DN50',
      tech: 'Multi Jet Fusion', printVolume: '332 × 190 × 248 mm',
      materials: ['HP 3D HR PA12', 'HP 3D HR PA12 GB', 'HP 3D HR TPA'],
      completedJobs: 112,
    },
    {
      id: 'OSP-03', model: 'Ultimaker S5', location: 'Maintenance Storage',
      certified: false, certBody: null, certNumber: null,
      status: 'online', currentJob: null,
      tech: 'FFF (Dual Extrusion)', printVolume: '330 × 240 × 300 mm',
      materials: ['PLA', 'ABS', 'PETG', 'TPU 95A', 'Nylon', 'CPE'],
      completedJobs: 23,
    },
    {
      id: 'OSP-04', model: 'Formlabs Form 3', location: 'Lab / QC Station',
      certified: true, certBody: 'Bureau Veritas', certNumber: 'BV-AM-2024-0012',
      status: 'offline', currentJob: null,
      tech: 'SLA (LFS)', printVolume: '145 × 145 × 185 mm',
      materials: ['Standard Resin', 'Tough 1500', 'Durable Resin', 'Flexible 80A', 'Grey Pro'],
      completedJobs: 8,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <WelcomeBanner
        name="Capt. Sarah Leblanc"
        role="End User / Client"
        org="Horizon Maritime"
        color="#14B8A6"
        tagline="AM on demand — any part, anywhere, certified."
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <Alerts rows={alerts} />

      {/* On-Site Printers */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#14B8A6]" />On-Site Printers
            </CardTitle>
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 text-xs">
              {onSitePrinters.filter(p => p.status !== 'offline').length} of {onSitePrinters.length} available
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 pt-0">
          {onSitePrinters.map(p => {
            const statusColor = p.status === 'online' ? '#14B8A6' : p.status === 'busy' ? '#F59E0B' : '#94a3b8'
            return (
              <div key={p.id} className={`rounded-xl border-2 p-4 space-y-3 transition-all ${
                p.status === 'offline'
                  ? 'border-slate-200 bg-slate-50 opacity-55'
                  : p.status === 'busy'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 bg-white hover:border-[#14B8A6]/40 hover:shadow-sm'
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Printer className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A] leading-tight">{p.model}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{p.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColor }} />
                      <span className="text-xs font-semibold capitalize" style={{ color: statusColor }}>{p.status}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">{p.id}</span>
                  </div>
                </div>

                {/* Tech + Volume */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">Technology</p>
                    <p className="text-xs font-medium text-[#0F172A] leading-tight">{p.tech}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">Build Volume</p>
                    <p className="text-[10px] font-medium text-[#0F172A] leading-tight">{p.printVolume}</p>
                  </div>
                </div>

                {/* Certification */}
                {p.certified ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-700">{p.certBody} Certified</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-600">{p.certNumber}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-xs font-medium text-amber-700">Uncertified — lab validation required</span>
                  </div>
                )}

                {/* Materials */}
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Compatible Materials</p>
                  <div className="flex flex-wrap gap-1">
                    {p.materials.map(m => (
                      <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Footer: active job / stats */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {p.currentJob ? (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#0EA5E9] min-w-0">
                      <Zap className="w-3 h-3 shrink-0" />
                      <span className="truncate">{p.currentJob}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">No active job</span>
                  )}
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{p.completedJobs} jobs done</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#0F172A]">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-t border-slate-100">
              <tr className="text-left text-xs text-slate-400 uppercase">
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 font-medium">Part</th>
                <th className="px-4 py-2 font-medium">Qty</th>
                <th className="px-4 py-2 font-medium">ETA</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{o.id}</td>
                  <td className="px-4 py-2.5 font-medium text-[#0F172A]">{o.part}</td>
                  <td className="px-4 py-2.5 text-slate-600">{o.qty}</td>
                  <td className="px-4 py-2.5 text-slate-600">{o.eta}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className={`text-xs ${orderColor[o.status]}`}>
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ── 3. Cert Authority panel ───────────────────────────────────────────────────

function CertAuthorityPanel() {
  const stats: StatCard[] = [
    { label: 'Pending Reviews',     value: 11,      sub: 'Print jobs awaiting cert',   icon: KeyRound,    color: 'bg-amber-100',  iconColor: 'text-amber-600' },
    { label: 'Certs Issued (YTD)',  value: 284,     sub: 'Parts & print certificates', icon: Award,       color: 'bg-teal-100',   iconColor: 'text-teal-600', trend: '+22 this month', trendUp: true },
    { label: 'Centers Monitored',   value: 9,       sub: '8 active · 1 under review',  icon: Factory,     color: 'bg-sky-100',    iconColor: 'text-sky-600' },
    { label: 'Compliance Rate',     value: '96.4%', sub: 'Across all print centers',   icon: ShieldCheck, color: 'bg-emerald-100', iconColor: 'text-emerald-600', trend: '+1.2% vs last quarter', trendUp: true },
  ]

  const alerts: AlertRow[] = [
    { type: 'warning', title: '11 print jobs pending your certification sign-off', detail: 'Oldest item: 3 days — SLA breach risk', time: 'Now' },
    { type: 'error',   title: 'PolyUnity NL — 2 non-conformances detected', detail: 'Dimensional tolerance failure on BP-2024-089', time: '6h ago' },
    { type: 'success', title: '18 certs issued this week', detail: 'Above weekly target of 15', time: 'Today' },
    { type: 'info',    title: 'Halifax Print Hub renewal due in 14 days', detail: 'ISO 52900 facility re-certification window', time: '2d ago' },
  ]

  const pipeline = [
    { id: 'DRM-7741', part: 'Pump Impeller Mk3',    center: 'PolyUnity NL',     oemOk: true,  certOk: false, priority: 'high' },
    { id: 'DRM-7738', part: 'Valve Housing 40mm',   center: 'Halifax Print Hub', oemOk: true,  certOk: false, priority: 'normal' },
    { id: 'DRM-7735', part: 'Bearing Cap Std',      center: 'PolyUnity NL',     oemOk: false, certOk: false, priority: 'normal' },
    { id: 'DRM-7729', part: 'Crankshaft Sleeve',    center: 'AM Center East',   oemOk: true,  certOk: false, priority: 'high' },
  ]

  return (
    <div className="space-y-6 p-6">
      <WelcomeBanner
        name="Dr. Priya Patel"
        role="Certification Authority"
        org="DNV — Class Society"
        color="#F59E0B"
        tagline="Upholding every standard, one certified print at a time."
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <Alerts rows={alerts} />
      {/* Certification Pipeline */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#0F172A]">DRM Certification Pipeline</CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">{pipeline.length} awaiting sign-off</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-t border-slate-100">
              <tr className="text-left text-xs text-slate-400 uppercase">
                <th className="px-4 py-2 font-medium">DRM Token</th>
                <th className="px-4 py-2 font-medium">Part</th>
                <th className="px-4 py-2 font-medium">Print Center</th>
                <th className="px-4 py-2 font-medium">OEM</th>
                <th className="px-4 py-2 font-medium">Cert</th>
                <th className="px-4 py-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map(r => (
                <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-4 py-2.5 font-medium text-[#0F172A]">{r.part}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{r.center}</td>
                  <td className="px-4 py-2.5">
                    {r.oemOk
                      ? <CheckCircle className="w-4 h-4 text-teal-500" />
                      : <Clock className="w-4 h-4 text-amber-400" />}
                  </td>
                  <td className="px-4 py-2.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className={r.priority === 'high' ? 'bg-red-100 text-red-600 text-xs' : 'bg-slate-100 text-slate-500 text-xs'}>
                      {r.priority}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ── 4. Print Center panel ─────────────────────────────────────────────────────

function PrintCenterPanel() {
  const stats: StatCard[] = [
    { label: 'Active Print Jobs',   value: 5,       sub: '3 in progress, 2 queued', icon: Zap,         color: 'bg-sky-100',    iconColor: 'text-sky-600' },
    { label: 'Machine Utilisation', value: '82%',   sub: '6 of 8 machines active',  icon: Activity,    color: 'bg-teal-100',   iconColor: 'text-teal-600', trend: '+5% vs last week', trendUp: true },
    { label: 'Material Stock',      value: '64%',   sub: 'Avg across filament bays', icon: Boxes,       color: 'bg-amber-100',  iconColor: 'text-amber-600', trend: 'PA12 critical', trendUp: false },
    { label: 'Quality Pass Rate',   value: '97.1%', sub: 'Last 30 days',             icon: ShieldCheck, color: 'bg-emerald-100', iconColor: 'text-emerald-600', trend: '-0.4% vs target', trendUp: false },
  ]

  const alerts: AlertRow[] = [
    { type: 'warning', title: 'PA12 Nylon stock at 12% — reorder recommended', detail: 'Current stock: 1.4 kg · Min threshold: 5 kg', time: '1h ago' },
    { type: 'info',    title: 'Print job DRM-7741 ready to start', detail: 'OEM + Cert approvals confirmed — token issued', time: '2h ago' },
    { type: 'success', title: 'Job DRM-7720 passed QC — shipped', detail: '3× Pump Impeller Mk3 dispatched to Horizon Maritime', time: 'Today' },
    { type: 'warning', title: 'Machine #4 (MJF-3D Pro) due for calibration', detail: 'Scheduled: Mar 1 08:00 · Downtime: ~2h', time: 'Tomorrow' },
  ]

  const initialJobs = [
    { id: 'DRM-7741', part: 'Pump Impeller Mk3',  machine: '#2 HP Jet Fusion', material: 'PA12 Nylon', pct: 68, status: 'printing' },
    { id: 'DRM-7739', part: 'Valve Housing 40mm', machine: '#5 EOS M290',      material: '316L SS',    pct: 31, status: 'printing' },
    { id: 'DRM-7738', part: 'Bearing Cap Std',    machine: '#7 Markforged X7', material: 'Onyx FR',    pct: 5,  status: 'printing' },
    { id: 'DRM-7736', part: 'Crankshaft Sleeve',  machine: '#1 HP Jet Fusion', material: 'PA12 GF',    pct: 0,  status: 'queued' },
    { id: 'DRM-7735', part: 'Seal Ring Set',       machine: 'Pending assign',   material: 'TPU 95A',    pct: 0,  status: 'awaiting_drm' },
  ]
  const [jobs, setJobs] = useState(initialJobs)

  const startPrint = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'printing', pct: 1 } : j))
  }

  return (
    <div className="space-y-6 p-6">
      <WelcomeBanner
        name="Michael Okafor"
        role="3D Print Facility"
        org="PolyUnity NL"
        color="#EF4444"
        tagline="Production hub — certified AM manufacturing."
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <Alerts rows={alerts} />
      {/* Job Queue */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#0F172A]">Current Job Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-t border-slate-100">
              <tr className="text-left text-xs text-slate-400 uppercase">
                <th className="px-4 py-2 font-medium">Job</th>
                <th className="px-4 py-2 font-medium">Part</th>
                <th className="px-4 py-2 font-medium">Machine</th>
                <th className="px-4 py-2 font-medium">Material</th>
                <th className="px-4 py-2 font-medium">Progress</th>
                <th className="px-4 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{j.id}</td>
                  <td className="px-4 py-2.5 font-medium text-[#0F172A]">{j.part}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{j.machine}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{j.material}</td>
                  <td className="px-4 py-2.5">
                    {j.status === 'printing' ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                          <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: `${j.pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{j.pct}%</span>
                      </div>
                    ) : (
                      <Badge variant="secondary" className={
                        j.status === 'queued' ? 'bg-slate-100 text-slate-500 text-xs' : 'bg-amber-100 text-amber-700 text-xs'
                      }>
                        {j.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {j.status === 'queued' ? (
                      <Button
                        size="sm"
                        onClick={() => startPrint(j.id)}
                        className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white text-xs h-7 px-3 gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        Print
                      </Button>
                    ) : j.status === 'printing' ? (
                      <span className="text-xs text-[#0EA5E9] font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" />In progress
                      </span>
                    ) : (
                      <span className="text-xs text-amber-500 font-medium">Awaiting DRM</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ── 5. Lab / Testing panel ────────────────────────────────────────────────────

function LabPanel() {
  const stats: StatCard[] = [
    { label: 'Active Test Requests',  value: 8,       sub: '3 urgent',                  icon: FlaskConical, color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Equipment Booked',      value: '6 / 12', sub: 'This week',                 icon: Activity,     color: 'bg-sky-100',     iconColor: 'text-sky-600' },
    { label: 'Reports Issued (MTD)',  value: 31,      sub: 'Avg turnaround 2.1 days',   icon: FileText,     color: 'bg-violet-100',  iconColor: 'text-violet-600', trend: 'On target', trendUp: true },
    { label: 'Pending Cert Sign-offs', value: 4,      sub: 'Awaiting authority review', icon: Award,        color: 'bg-amber-100',   iconColor: 'text-amber-600' },
  ]

  const alerts: AlertRow[] = [
    { type: 'warning', title: '3 urgent test requests overdue for assignment', detail: 'TR-0441, TR-0438, TR-0434 — >48h without response', time: '30m ago' },
    { type: 'success', title: 'Test Report TR-0435 issued — tensile fracture analysis', detail: 'PA12 Nylon lot B-2024-112 · Passed DNV requirements', time: '2h ago' },
    { type: 'info',    title: 'SEM-EDX booked for Mar 3 14:00 by PolyUnity NL', detail: 'Corrosion analysis on 316L SS sample', time: '4h ago' },
    { type: 'info',    title: 'New blueprint access request: BP-2024-091', detail: 'Requested by Arctic Drilling Corp (test reference)', time: 'Yesterday' },
  ]

  const testQueue = [
    { id: 'TR-0441', type: 'Tensile / Fatigue',    material: 'PA12 Nylon',  requestor: 'Horizon Maritime',   urgent: true,  status: 'unassigned' },
    { id: 'TR-0439', type: 'Dimensional / CT Scan', material: '316L SS',    requestor: 'PolyUnity NL',       urgent: false, status: 'in_progress' },
    { id: 'TR-0438', type: 'Corrosion / Salt Fog',  material: 'Inconel 625', requestor: 'Arctic Drilling',   urgent: true,  status: 'unassigned' },
    { id: 'TR-0436', type: 'Hardness / Micro',      material: 'Onyx FR',    requestor: 'GulfTech Ind.',      urgent: false, status: 'in_progress' },
    { id: 'TR-0435', type: 'Tensile Fracture',       material: 'PA12 Nylon', requestor: 'DNV (quality check)', urgent: false, status: 'complete' },
  ]

  const trColor: Record<string, string> = {
    unassigned:  'bg-red-100 text-red-600',
    in_progress: 'bg-sky-100 text-sky-700',
    complete:    'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className="space-y-6 p-6">
      <WelcomeBanner
        name="Prof. Ahmad Osman"
        role="Lab / Testing"
        org="Dalhousie AM Lab"
        color="#10B981"
        tagline="Science-backed assurance for every certified part."
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <Alerts rows={alerts} />
      {/* Test Queue */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#0F172A]">Test Request Queue</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-slate-500">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-t border-slate-100">
              <tr className="text-left text-xs text-slate-400 uppercase">
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Test Type</th>
                <th className="px-4 py-2 font-medium">Material</th>
                <th className="px-4 py-2 font-medium">Requestor</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {testQueue.map(t => (
                <tr key={t.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                    {t.id}
                    {t.urgent && <span className="ml-1.5 text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-medium">URGENT</span>}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-[#0F172A]">{t.type}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{t.material}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{t.requestor}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className={`text-xs ${trColor[t.status]}`}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Welcome Banner ────────────────────────────────────────────────────────────

interface WelcomeBannerProps {
  name: string
  role: string
  org: string
  color: string
  tagline: string
}

function WelcomeBanner({ name, role, org, color, tagline }: WelcomeBannerProps) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
        style={{ background: color }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#0F172A] truncate">Welcome, {name}</h2>
          <Badge variant="secondary" className="text-xs" style={{ background: `${color}20`, color }}>
            {role}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 truncate">{org}</p>
        <p className="text-xs text-slate-400 mt-0.5 italic">{tagline}</p>
      </div>
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────

interface RoleDashboardProps {
  role: string
}

export function RoleDashboard({ role }: RoleDashboardProps) {
  switch (role) {
    case 'oem_partner':    return <OEMPartnerPanel />
    case 'end_user':       return <EndUserPanel />
    case 'cert_authority': return <CertAuthorityPanel />
    case 'print_center':   return <PrintCenterPanel />
    case 'lab':            return <LabPanel />
    default:               return <OverviewPage />   // admin → existing full overview
  }
}
