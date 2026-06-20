'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Package, Clock, CheckCircle, DollarSign, Factory, FileBox,
  AlertTriangle, KeyRound, Boxes, ShieldCheck, Lock, Zap, Activity,
  Building2, Award, Flame, Anchor, Ship, Warehouse,
  FlaskConical, TestTubeDiagonal, Download,
} from 'lucide-react'
import {
  orders, printCenters, blueprints, dashboardStats,
  physicalParts, physicalSites, inventoryTransactions,
} from '@/lib/static-data'

// ── tiny viz helpers ─────────────────────────────────────────────────────────

function Sparkline({ values, color = '#0EA5E9', height = 20 }: { values: number[]; color?: string; height?: number }) {
  if (values.length < 2) return null
  const max = Math.max(...values) || 1
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 80},${height - (v / max) * height}`).join(' ')
  return (
    <svg width={80} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RingChart({ pct, color, size = 48, stroke = 5 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
    </svg>
  )
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total ? (count / total) * 100 : 0
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold" style={{ color }}>{count}</span>
      <div className="relative w-6 h-20 bg-slate-100 rounded-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ height: `${pct}%`, background: color }} />
      </div>
      <span className="text-[9px] text-slate-400 text-center leading-tight w-10">{label}</span>
    </div>
  )
}

// ── derived data ─────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  pending: '#94a3b8', printing: '#0EA5E9', quality_check: '#F59E0B', shipped: '#14B8A6', delivered: '#10B981',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', printing: 'Printing', quality_check: 'QC', shipped: 'Shipped', delivered: 'Done',
}
const SITE_ICON: Record<string, React.ElementType> = {
  offshore_rig: Anchor, vessel: Ship, onshore_yard: Building2, warehouse: Warehouse,
}

const statusBreakdown = (['pending', 'printing', 'quality_check', 'shipped', 'delivered'] as const).map(s => ({
  status: s, count: orders.filter(o => o.status === s).length,
}))

const drmLocked = orders.filter(o => !o.oemApproval.approved && !o.certApproval.approved && !['delivered'].includes(o.status)).length
const drmPartial = orders.filter(o => (o.oemApproval.approved !== o.certApproval.approved) && !['delivered'].includes(o.status)).length
const drmReady = orders.filter(o => o.oemApproval.approved && o.certApproval.approved && ['pending', 'printing'].includes(o.status)).length
const nowPrinting = orders.filter(o => o.status === 'printing').length
const tokensIssued = orders.filter(o => o.printAuthToken).length

const physOutOfStock = physicalParts.filter(p => p.quantity === 0).length
const physLowStock = physicalParts.filter(p => p.quantity > 0 && p.quantity < p.minStock).length
const physCondemned = physicalParts.filter(p => p.condition === 'condemned').length
const physTotalValue = physicalParts.reduce((s, p) => s + p.quantity * p.unitCost, 0)

const recentActivity = [...inventoryTransactions]
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 8)
  .map(tx => ({
    ...tx,
    partName: physicalParts.find(p => p.id === tx.partId)?.name ?? '—',
    siteName: physicalSites.find(s => s.id === tx.siteId)?.name ?? '—',
  }))

const TX_COLOR: Record<string, string> = {
  received: '#10B981', consumed: '#94a3b8', condemned: '#ef4444',
  transferred_in: '#0EA5E9', transferred_out: '#8B5CF6', inspected: '#F59E0B',
}
const TX_LABEL: Record<string, string> = {
  received: 'Received', consumed: 'Consumed', condemned: 'Condemned',
  transferred_in: '↓ Transfer In', transferred_out: '↑ Transfer Out', inspected: 'Inspected',
}

const bpBreakdown = [
  { label: 'Active', count: blueprints.filter(b => b.status === 'active').length, color: '#10B981' },
  { label: 'Pending', count: blueprints.filter(b => b.status === 'pending_review').length, color: '#F59E0B' },
  { label: 'Archived', count: blueprints.filter(b => b.status === 'archived').length, color: '#64748b' },
]

const weeklyVelocity = [2, 3, 4, 3, 5, 4, orders.filter(o => o.status !== 'delivered').length]

// ── component ────────────────────────────────────────────────────────────────

export function OverviewPage() {
  const kpis = [
    { title: 'Active Orders', value: dashboardStats.activeOrders, suffix: '', sub: `${dashboardStats.totalOrders} total`, icon: Package, color: '#0EA5E9', ring: Math.round((dashboardStats.activeOrders / (dashboardStats.totalOrders || 1)) * 100) },
    { title: 'Parts Delivered', value: dashboardStats.deliveredParts, suffix: '', sub: 'Certified deliveries', icon: CheckCircle, color: '#10B981', ring: 75 },
    { title: 'Avg Lead Time', value: dashboardStats.avgLeadTime, suffix: 'd', sub: '−33% vs traditional', icon: Clock, color: '#F59E0B', ring: 33 },
    { title: 'Cost Savings', value: `$${Math.round(dashboardStats.costSavings / 1000)}K`, suffix: '', sub: 'YTD vs. traditional', icon: DollarSign, color: '#8B5CF6', ring: 68 },
  ]

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">

      {/* Alert banners */}
      {(drmReady > 0 || physOutOfStock > 0 || physLowStock > 0) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {drmReady > 0 && <div className="w-full sm:flex-1 flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold"><ShieldCheck className="w-4 h-4 shrink-0" />{drmReady} order{drmReady > 1 ? 's' : ''} cleared — ready for Secure Print</div>}
          {physOutOfStock > 0 && <div className="w-full sm:flex-1 flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold"><AlertTriangle className="w-4 h-4 shrink-0" />{physOutOfStock} physical part{physOutOfStock > 1 ? 's' : ''} out of stock</div>}
          {physLowStock > 0 && <div className="w-full sm:flex-1 flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold"><Package className="w-4 h-4 shrink-0" />{physLowStock} part{physLowStock > 1 ? 's' : ''} below minimum stock</div>}
        </div>
      )}

      {/* Emergency Alert Panel */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            Emergency Alerts
          </p>
          <span className="text-xs text-slate-400">3 active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-red-800">Production Stopped</p>
              <p className="text-[10px] text-red-700 truncate">Pump Impeller — Hibernia Platform</p>
              <p className="text-[10px] text-red-500">No digital file found · 4h window</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-amber-400 mt-1 flex-shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-800">Degraded Operations</p>
              <p className="text-[10px] text-amber-700 truncate">Valve Seat DN80 — FPSO Atlantic</p>
              <p className="text-[10px] text-amber-500">Blueprint found · Printing · 18h window</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-800">Resolved ✓</p>
              <p className="text-[10px] text-green-700 truncate">Bearing Housing — Suncor Upgrader</p>
              <p className="text-[10px] text-green-500">Delivered in 7.2 hrs · Within SLA</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[10px] text-slate-500">{kpi.title}</p>
                  <p className="text-2xl font-bold text-[#0F172A]">{kpi.value}{kpi.suffix}</p>
                  <p className="text-[10px] text-slate-400">{kpi.sub}</p>
                </div>
                <div className="relative flex-shrink-0">
                  <RingChart pct={kpi.ring} color={kpi.color} size={44} stroke={4} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkline values={weeklyVelocity} color={kpi.color} height={18} />
                <span className="text-[9px] text-slate-400">7-day trend</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid xl:grid-cols-3 gap-5">

        {/* LEFT 2/3 */}
        <div className="xl:col-span-2 space-y-5">

          {/* Order Pipeline Breakdown */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#0EA5E9]" />Order Pipeline Breakdown
                </CardTitle>
                <span className="text-[10px] text-slate-400">{orders.length} orders total</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Bar chart */}
                <div className="flex items-end gap-3 shrink-0">
                  {statusBreakdown.map(s => (
                    <StatusBar key={s.status} label={STATUS_LABELS[s.status]} count={s.count} total={orders.length} color={STATUS_COLOR[s.status]} />
                  ))}
                </div>
                {/* Order list */}
                <div className="flex-1 space-y-2 border-l border-slate-100 pl-5">
                  {orders.slice(0, 5).map(order => {
                    const center = printCenters.find(c => c.id === order.centerId)
                    return (
                      <div key={order.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[order.status] }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#0F172A] truncate">{order.partName}</p>
                          <p className="text-[9px] text-slate-400">{order.orderId} · {center?.name ?? 'Pending'}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[order.oemApproval.approved, order.certApproval.approved].map((ap, j) => (
                            <span key={j} className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${ap ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-200'}`}>{ap ? '✓' : '○'}</span>
                          ))}
                        </div>
                        <Badge className="text-[9px] px-1.5" style={{ background: `${STATUS_COLOR[order.status]}20`, color: STATUS_COLOR[order.status] }}>
                          {STATUS_LABELS[order.status]}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DRM Funnel */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />DRM Approval Funnel
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex items-center gap-2">
                {[
                  { label: 'Pending', val: drmLocked, color: '#94a3b8', Icon: Lock },
                  { label: 'Partial', val: drmPartial, color: '#F59E0B', Icon: Clock },
                  { label: 'Ready', val: drmReady, color: '#10B981', Icon: Zap },
                  { label: 'Printing', val: nowPrinting, color: '#0EA5E9', Icon: Activity },
                  { label: 'Tokens', val: tokensIssued, color: '#8B5CF6', Icon: ShieldCheck },
                ].map((step, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="h-14 w-full rounded-t-lg flex items-end justify-center pb-2"
                      style={{ background: `${step.color}15` }}>
                      <step.Icon className="w-4 h-4" style={{ color: step.color }} />
                    </div>
                    <span className="text-base font-bold" style={{ color: step.color }}>{step.val}</span>
                    <span className="text-[9px] text-slate-400">{step.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-3">Lock → OEM sign-off → Cert Authority → Secure token → Encrypted G-code stream</p>
            </CardContent>
          </Card>

          {/* Physical Site Health */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#0EA5E9]" />Physical Site Health
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {physicalSites.map(site => {
                  const sp = physicalParts.filter(p => p.siteId === site.id)
                  const alerts = sp.filter(p => p.quantity === 0 || p.quantity < p.minStock).length
                  const value = sp.reduce((s, p) => s + p.quantity * p.unitCost, 0)
                  const health = sp.length ? Math.round(((sp.length - alerts) / sp.length) * 100) : 100
                  const SIcon = SITE_ICON[site.type] || Building2
                  return (
                    <div key={site.id} className={`p-3 rounded-xl border ${alerts > 0 ? 'border-amber-200 bg-amber-50/40' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <SIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <p className="text-xs font-semibold text-[#0F172A] truncate">{site.name}</p>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full mb-2">
                        <div className="h-full rounded-full" style={{ width: `${health}%`, background: health > 70 ? '#10B981' : health > 40 ? '#F59E0B' : '#ef4444' }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>{sp.length} SKUs</span>
                        {alerts > 0 && <span className="text-amber-600 font-semibold">⚠ {alerts}</span>}
                        <span>${(value / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT 1/3 */}
        <div className="space-y-5">

          {/* Print Centers */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Factory className="w-4 h-4 text-[#14B8A6]" />Print Centers
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-3">
              {printCenters.map(c => {
                const color = c.status === 'online' ? '#14B8A6' : c.status === 'busy' ? '#F59E0B' : '#94a3b8'
                const load = c.status === 'online' ? 35 : c.status === 'busy' ? 80 : 0
                return (
                  <div key={c.id}>
                    <div className="flex justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
                        <span className="text-xs font-medium text-[#0F172A]">{c.name}</span>
                      </div>
                      <span className="text-[9px]" style={{ color }}>{c.status}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${load}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Blueprint Vault */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <FileBox className="w-4 h-4 text-indigo-500" />Blueprint Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 flex items-center gap-4">
              <div className="relative">
                <RingChart pct={Math.round((bpBreakdown[0].count / blueprints.length) * 100)} color="#10B981" size={60} stroke={6} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-[#0F172A]">{blueprints.length}</span>
                  <span className="text-[8px] text-slate-400">total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {bpBreakdown.map(b => (
                  <div key={b.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                      <span className="text-xs text-slate-600">{b.label}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0F172A]">{b.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Physical Inventory */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#0EA5E9]" />Physical Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {[
                { label: 'Out of Stock', val: physOutOfStock, color: '#ef4444', Icon: AlertTriangle },
                { label: 'Low Stock', val: physLowStock, color: '#F59E0B', Icon: Package },
                { label: 'Condemned', val: physCondemned, color: '#94a3b8', Icon: Flame },
                { label: 'Total Value', val: `$${(physTotalValue / 1000).toFixed(0)}k`, color: '#10B981', Icon: DollarSign },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.val}</span>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                {physicalSites.filter(s => s.status === 'active').length} active sites · {physicalParts.length} total SKUs
              </p>
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />Live Activity
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                {recentActivity.map(tx => (
                  <div key={tx.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: TX_COLOR[tx.action] }} />
                    <div>
                      <p className="text-[10px] text-[#0F172A] font-medium leading-tight">
                        <span style={{ color: TX_COLOR[tx.action] }}>{TX_LABEL[tx.action]}</span>
                        {' · '}{tx.quantity}× {tx.partName}
                      </p>
                      <p className="text-[9px] text-slate-400">{tx.siteName} · {format(new Date(tx.timestamp), 'yyyy-MM-dd')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Platform Trust Layer */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Trusted By
          </p>
          <span className="text-xs text-slate-400">6 organisations</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { name: "Lloyd's Register", type: 'Regulatory Partner', color: '#0EA5E9' },
            { name: 'DNV GL', type: 'Regulatory Partner', color: '#0EA5E9' },
            { name: 'ExxonMobil', type: 'Pilot Participant', color: '#8B5CF6' },
            { name: 'Suncor Energy', type: 'Active Customer', color: '#10B981' },
            { name: 'Dalhousie University', type: 'Research Partner', color: '#F59E0B' },
            { name: 'NRC Canada', type: 'Research Partner', color: '#F59E0B' },
          ].map(e => (
            <div key={e.name} className="flex flex-col items-center gap-1.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${e.color}15` }}>
                <ShieldCheck className="w-4 h-4" style={{ color: e.color }} />
              </div>
              <p className="text-[10px] font-semibold text-slate-700 text-center leading-tight">{e.name}</p>
              <span className="text-[9px] text-slate-400 text-center">{e.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Testing & Certification Services */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            Lab Testing & Certification Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grid of service cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Available Tests */}
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                Available Tests
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Mechanical Testing', desc: 'Tensile, compression, flexure tests' },
                  { name: 'Non-Destructive Testing (NDT)', desc: 'X-ray, CT scanning, ultrasonic' },
                  { name: 'Chemical Analysis', desc: 'ICPOES composition analysis' },
                  { name: 'Dimensional Verification', desc: 'CMM measurement, SPC tracking' },
                  { name: 'Fatigue Testing', desc: 'High-cycle fatigue analysis' },
                  { name: 'Thermal Analysis', desc: 'Differential scanning calorimetry' },
                ].map((test, i) => (
                  <div key={i} className="flex gap-2">
                    <TestTubeDiagonal className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">{test.name}</p>
                      <p className="text-xs text-slate-600">{test.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Turnaround */}
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Certifications & Turnaround
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { cert: 'DNV GL', time: '5-7 business days' },
                  { cert: "Lloyd's Register", time: '5-7 business days' },
                  { cert: 'Bureau Veritas', time: '7-10 business days' },
                  { cert: 'ABS', time: '7-10 business days' },
                  { cert: 'ISO 9001:2015', time: '3-5 business days' },
                  { cert: 'NADCAP Accredited', time: '10-14 business days' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                    <p className="font-medium text-slate-900">{item.cert}</p>
                    <span className="text-xs text-slate-500 font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Requirements */}
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Sample Requirements
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900 mb-1">What to Provide:</p>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                    <li>Printed samples (3-5 required per test)</li>
                    <li>Design specification documentation</li>
                    <li>CAD drawings or build files</li>
                    <li>Material certificates (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">Shipping:</p>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside text-xs">
                    <li>Secure packaging required for delicate parts</li>
                    <li>Insured/tracked shipping recommended</li>
                    <li>Lab covers return shipping for parts ≤500g</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Lab Contact & Results */}
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                Lab Contact & Results Portal
              </h4>
              <div className="space-y-2 text-sm text-slate-700">
                <p><span className="font-semibold">Dalhousie AM Lab</span></p>
                <p className="text-xs">📞 +1 (902) 485-4280</p>
                <p className="text-xs">✉️ amlab@dal.ca</p>
                <p className="text-xs">🌐 www.dal.ca/manufacturing/lab</p>
                <p className="text-xs">⏰ Mon–Fri, 8am–6pm Atlantic</p>
                <Button
                  size="sm"
                  className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Access Results Portal
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
