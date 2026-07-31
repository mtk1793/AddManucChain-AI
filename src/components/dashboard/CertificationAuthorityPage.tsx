'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Award, ShieldCheck, Building2, FileText, Scale, AlertTriangle,
  CheckCircle2, XCircle, Clock, ChevronRight, Eye, Search,
  FileBox, TrendingUp, Download, Upload, ClipboardCheck,
  UserCheck, Timer, Ban, MessageSquare, Filter, ArrowDownUp,
  Layers, Gavel, ScrollText, CalendarDays, HardDrive,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
} from 'recharts'
import { orders as initialOrders, type Order, blueprints, printCenters, certifications } from '@/lib/static-data'
import { toast } from 'sonner'

const STORAGE_KEY = 'addmanuchain-orders'

const CERT_AUDIT_LOG = [
  { id: 'ca-1', action: 'FACILITY_CERT_VERIFIED', detail: 'Atlantic XL (PC-001) — Lloyd\'s Register Type Approval valid until Jun 14, 2026', timestamp: '2026-03-18T09:30:00Z', user: 'Cert Authority (Lloyd\'s Register)', icon: ShieldCheck },
  { id: 'ca-2', action: 'MATERIAL_CERT_APPROVED', detail: 'Titanium Ti-6Al-4V — Material test certificate MTR-2026-0891 verified', timestamp: '2026-03-18T09:15:00Z', user: 'Cert Authority (Lloyd\'s Register)', icon: FileBox },
  { id: 'ca-3', action: 'BLUEPRINT_CERT_REVIEWED', detail: 'BP-1024 (Thruster Bearing Housing) — Design review passed, material spec compliant', timestamp: '2026-03-18T08:45:00Z', user: 'Cert Authority (Lloyd\'s Register)', icon: FileText },
  { id: 'ca-4', action: 'PRINT_PERMISSION_GRANTED', detail: 'ORD-2852 (Bearing Housing Cap) — All checks passed. Print authorized at LR Montreal.', timestamp: '2026-03-18T08:30:00Z', user: 'Cert Authority (Lloyd\'s Register)', icon: CheckCircle2 },
  { id: 'ca-5', action: 'FACILITY_AUDIT_COMPLETED', detail: 'DNV Calgary (PC-002) — Annual surveillance audit passed. AS9100D recertification in progress.', timestamp: '2026-03-17T14:00:00Z', user: 'Cert Authority (DNV GL)', icon: Building2 },
  { id: 'ca-6', action: 'PRINT_PERMISSION_DENIED', detail: 'ORD-2844 (Impeller Shaft) — Material cert for Inconel 718 at PC-002 missing CoC traceability.', timestamp: '2026-03-17T11:20:00Z', user: 'Cert Authority (Lloyd\'s Register)', icon: XCircle },
  { id: 'ca-7', action: 'MATERIAL_CERT_FLAGGED', detail: 'H13 Tool Steel batch at DNV Calgary — Tensile test results approaching lower bound. Review requested.', timestamp: '2026-03-16T16:45:00Z', user: 'Cert Authority (DNV GL)', icon: AlertTriangle },
  { id: 'ca-8', action: 'ORDER_CERT_UPDATED', detail: 'ORD-2847 (Thruster Bearing Housing) — Post-print inspection report reviewed and accepted.', timestamp: '2026-03-16T09:00:00Z', user: 'Cert Authority (Lloyd\'s Register)', icon: ClipboardCheck },
]

const MONTHLY_CERT_DATA = [
  { month: 'Oct', approved: 18, denied: 2, oemApproved: 22 },
  { month: 'Nov', approved: 24, denied: 3, oemApproved: 28 },
  { month: 'Dec', approved: 21, denied: 1, oemApproved: 25 },
  { month: 'Jan', approved: 29, denied: 4, oemApproved: 32 },
  { month: 'Feb', approved: 33, denied: 2, oemApproved: 35 },
  { month: 'Mar', approved: 15, denied: 1, oemApproved: 20 },
]

const DOC_REQUIREMENTS = [
  { id: 'oem_license', label: 'OEM IP License', desc: 'Confirms OEM has authorized this blueprint for production', icon: Building2 },
  { id: 'blueprint_cert', label: 'Blueprints / CAD', desc: 'Technical drawings with certification marks', icon: FileText },
  { id: 'material_cert', label: 'Material Certificate', desc: 'CoC / MTR for the selected material batch', icon: FileBox },
  { id: 'facility_cert', label: 'Facility Certification', desc: 'Print center\'s active certification status', icon: Building2 },
  { id: 'quality_plan', label: 'Quality Plan', desc: 'Inspection protocol, tolerances, and acceptance criteria', icon: ClipboardCheck },
  { id: 'traceability', label: 'Chain of Custody', desc: 'Full traceability from powder to part', icon: Scale },
]

type TabFilter = 'needs-review' | 'approved' | 'denied' | 'all'

function calculateRisk(order: Order): { level: 'high' | 'medium' | 'low'; label: string; color: string } {
  if (!order.oemApproval.approved) return { level: 'low', label: 'Awaiting OEM', color: 'slate' }
  if (order.priority === 'high' && order.quantity >= 5) return { level: 'high', label: 'High Risk', color: 'red' }
  if (order.priority === 'high' || order.quantity >= 3) return { level: 'medium', label: 'Medium Risk', color: 'amber' }
  return { level: 'low', label: 'Low Risk', color: 'emerald' }
}

function getBlueprintCert(blueprintId: string | null) {
  if (!blueprintId) return null
  const bp = blueprints.find(b => b.id === blueprintId)
  if (!bp) return null
  return { level: bp.certification, issuer: bp.certification, status: bp.status }
}

function getFacilityCert(centerId: string | null) {
  if (!centerId) return null
  const center = printCenters.find(c => c.id === centerId)
  if (!center) return null
  const cert = certifications.find(c => c.holder === center.name && c.status === 'active')
  if (!cert) return { name: '—', issuer: '—', scope: '—', expiry: '—', status: 'not_found' }
  return { name: cert.name, issuer: cert.issuer, scope: cert.scope, expiry: cert.expiryDate, status: cert.status }
}

const SIMULATED_DOCS: Record<string, string[]> = {
  'ord-2': ['/docs/mtr-ti64-batch-2026-0891.pdf', '/docs/qp-hydraulic-valve-body-rev3.pdf', '/docs/coc-stainless-316l.pdf'],
  'ord-4': ['/docs/design-impeller-shaft-dnv.pdf', '/docs/mtr-inconel-718-batch-2026-1022.pdf'],
  'ord-9': ['/docs/bp-gasket-seal-ring-rev2.pdf', '/docs/qp-gasket-ring.pdf', '/docs/coc-epdm-compound.pdf'],
}

export function CertificationAuthorityPage({ role = 'admin' }: { role?: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [loaded, setLoaded] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabFilter>('needs-review')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [denyOpen, setDenyOpen] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'part'>('priority')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setOrders(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders, loaded])

  const pendingReview = orders.filter(
    o => o.oemApproval.approved && !o.certApproval.approved && o.status !== 'archived'
  )
  const myApproved = orders.filter(
    o => o.certApproval.approved
  )

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const approvedThisWeek = orders.filter(
    o => o.certApproval.approved && o.certApproval.approvedAt && new Date(o.certApproval.approvedAt) >= weekStart
  ).length

  let filtered = orders
  if (activeTab === 'needs-review') filtered = pendingReview
  else if (activeTab === 'approved') filtered = myApproved
  else if (activeTab === 'denied') filtered = []

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(o =>
      o.partName.toLowerCase().includes(q) || o.orderId.toLowerCase().includes(q)
    )
  }

  if (sortBy === 'priority') {
    const prio = { high: 0, medium: 1, low: 2 }
    filtered = [...filtered].sort((a, b) => (prio[a.priority] || 1) - (prio[b.priority] || 1))
  } else if (sortBy === 'date') {
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else {
    filtered = [...filtered].sort((a, b) => a.partName.localeCompare(b.partName))
  }

  const handleApprove = useCallback((orderId: string) => {
    setActionId(orderId)
    setReviewNote('')
    setConfirmOpen(true)
  }, [])

  const confirmApproval = useCallback(() => {
    if (!actionId) return
    const now = new Date().toISOString()
    setOrders(prev => prev.map(o => {
      if (o.id !== actionId) return o
      return {
        ...o,
        certApproval: { approved: true, approvedAt: now, approvedBy: 'Cert Authority (Lloyd\'s Register)' },
      }
    }))
    const ord = orders.find(o => o.id === actionId)
    toast.success(`Certification granted for ${ord?.orderId || actionId}`, {
      description: reviewNote ? `Note: ${reviewNote}` : 'All documentation checks passed. Print center authorized.',
    })
    setConfirmOpen(false)
    setActionId(null)
    setReviewNote('')
    setExpandedId(null)
  }, [actionId, orders, reviewNote])

  const handleDeny = useCallback((orderId: string) => {
    setActionId(orderId)
    setReviewNote('')
    setDenyOpen(true)
  }, [])

  const confirmDeny = useCallback(() => {
    if (!actionId) return
    setOrders(prev => prev.map(o => {
      if (o.id !== actionId) return o
      return {
        ...o,
        certApproval: { approved: false, approvedAt: null, approvedBy: null },
      }
    }))
    const ord = orders.find(o => o.id === actionId)
    toast.error(`Certification denied for ${ord?.orderId || actionId}`, {
      description: reviewNote || 'Documentation requirements not met. Requester notified.',
    })
    setDenyOpen(false)
    setActionId(null)
    setReviewNote('')
    setExpandedId(null)
  }, [actionId, orders, reviewNote])

  const centerName = (centerId: string | null) => printCenters.find(c => c.id === centerId)?.name || 'Unassigned'
  const blueprintName = (bpId: string | null) => blueprints.find(b => b.id === bpId)?.name || '—'

  const tabs: { key: TabFilter; label: string; count: number; color: string }[] = [
    { key: 'needs-review', label: 'Needs My Review', count: pendingReview.length, color: 'amber' },
    { key: 'approved', label: 'Approved', count: myApproved.length, color: 'emerald' },
    { key: 'denied', label: 'Denied', count: 0, color: 'red' },
    { key: 'all', label: 'All Orders', count: orders.length, color: 'slate' },
  ]

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* ───── HEADER ───── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Certification Body Dashboard</h1>
            <p className="text-sm text-slate-500">Review OEM-approved work, inspect documents, and grant print permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold border border-emerald-200">
            <Award className="w-3 h-3 mr-1" />
            Lloyd&apos;s Register — DNV GL — CSA
          </Badge>
        </div>
      </div>

      {/* ───── STATS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending My Review', value: pendingReview.length, sub: 'OEM-approved, awaiting cert', icon: Timer, color: '#F59E0B' },
          { label: 'Approved This Week', value: approvedThisWeek, sub: 'Print permissions granted', icon: CheckCircle2, color: '#10B981' },
          { label: 'Active Certifications', value: certifications.filter(c => c.status === 'active').length, sub: 'Across all print centers', icon: Award, color: '#0EA5E9' },
          { label: 'Compliance Rate', value: '97.8%', sub: '↑ 1.2% vs last month', icon: ShieldCheck, color: '#8B5CF6' },
        ].map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 truncate">{stat.label}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: stat.color }}>{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ───── TAB BAR + SEARCH / SORT ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpandedId(null) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key
                    ? tab.key === 'needs-review' ? 'bg-amber-100 text-amber-700' :
                      tab.key === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-200 text-slate-600'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by part or order ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white w-56 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            {(['priority', 'date', 'part'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  sortBy === s ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <ArrowDownUp className="w-3 h-3 inline mr-1" />
                {s === 'priority' ? 'Priority' : s === 'date' ? 'Date' : 'Name'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───── CERTIFICATION PIPELINE BAR ───── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid #1e2d45' }}>
          <HardDrive className="w-3.5 h-3.5" style={{ color: '#6ee7b7' }} />
          <p className="text-xs font-bold text-white">Certification Pipeline</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap px-5 py-4">
          {[
            { label: 'OEM Approved', count: orders.filter(o => o.oemApproval.approved).length, state: 'done', emoji: '🏭' },
            { label: 'Docs Under Review', count: pendingReview.length, state: pendingReview.length > 0 ? 'active' : 'pending', emoji: '📋' },
            { label: 'Cert Granted', count: myApproved.length, state: myApproved.length > 0 ? 'done' : 'pending', emoji: '🔐' },
            { label: 'Print Token Issued', count: orders.filter(o => o.printAuthToken).length, state: 'pending', emoji: '🖨️' },
          ].map((node, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                style={{
                  background: node.state === 'done' ? 'rgba(16,185,129,0.1)' : node.state === 'active' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${node.state === 'done' ? 'rgba(16,185,129,0.4)' : node.state === 'active' ? 'rgba(245,158,11,0.5)' : '#1e2d45'}`,
                  color: node.state === 'done' ? '#6ee7b7' : node.state === 'active' ? '#fbbf24' : '#64748b',
                  boxShadow: node.state === 'active' ? '0 0 12px rgba(245,158,11,0.25)' : 'none',
                }}
              >
                <span>{node.emoji}</span>
                <span>{node.label}</span>
                <span className="font-bold ml-1">({node.count})</span>
              </div>
              {i < 3 && <span className="text-base" style={{ color: '#475569' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ───── CHARTS + DOC CHECKLIST ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Certification Activity — Last 6 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MONTHLY_CERT_DATA} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <ReTooltip />
                <Bar dataKey="oemApproved" name="OEM Approved" radius={[4, 4, 0, 0]} fill="#94a3b8" />
                <Bar dataKey="approved" name="Cert Granted" radius={[4, 4, 0, 0]} fill="#10B981" />
                <Bar dataKey="denied" name="Cert Denied" radius={[4, 4, 0, 0]} fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-500" />
              Documentation Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DOC_REQUIREMENTS.map(item => (
              <div key={item.id} className="flex items-start gap-2.5">
                <item.icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700">{item.label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ───── ORDER REVIEW QUEUE ───── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              {activeTab === 'needs-review' && 'Orders Awaiting Your Certification'}
              {activeTab === 'approved' && 'Certification-Approved Orders'}
              {activeTab === 'denied' && 'Denied Certification Requests'}
              {activeTab === 'all' && 'All Orders'}
            </CardTitle>
            <Badge className={`${
              activeTab === 'needs-review' ? 'bg-amber-100 text-amber-700' :
              activeTab === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              'bg-slate-100 text-slate-600'
            }`}>
              {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Award className="w-14 h-14 mx-auto mb-4 text-slate-200" />
              <p className="font-semibold text-slate-500">No orders found</p>
              <p className="text-xs mt-1">
                {activeTab === 'needs-review' && 'All OEM-approved orders have been certified. Great work!'}
                {activeTab === 'approved' && 'No certification approvals yet.'}
                {activeTab === 'all' && 'No orders match your search.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(order => {
                const risk = calculateRisk(order)
                const bpCert = getBlueprintCert(order.blueprintId)
                const facCert = getFacilityCert(order.centerId)
                const expanded = expandedId === order.id
                const docsComplete = !!(order.oemApproval.approved && bpCert && facCert?.status === 'active')
                const simDocs = SIMULATED_DOCS[order.id] || []

                return (
                  <div key={order.id}>
                    <div
                      className="px-4 py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800 truncate">{order.partName}</p>
                          <Badge className={`text-[10px] font-bold uppercase ${
                            risk.color === 'red' ? 'bg-red-100 text-red-700' :
                            risk.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            risk.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {risk.label}
                          </Badge>
                          {order.oemApproval.approved && !order.certApproval.approved && (
                            <Badge className="bg-amber-100 text-amber-700 text-[10px] font-bold animate-pulse">
                              AWAITING YOU
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-slate-400 font-mono">{order.orderId}</span>
                          <span className="text-xs text-slate-400">Qty: {order.quantity}</span>
                          <span className="text-xs text-slate-500 font-medium">{centerName(order.centerId)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">OEM</span>
                          {order.oemApproval.approved
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <Clock className="w-4 h-4 text-slate-300" />
                          }
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">CERT</span>
                          {order.certApproval.approved
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : <Clock className="w-4 h-4 text-amber-400" />
                          }
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </div>

                    {/* ───── EXPANDED DETAIL ───── */}
                    {expanded && (
                      <div className="px-4 pb-5 pt-0 bg-slate-50/60 border-t border-slate-100">
                        {/* Order Meta */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 mb-4">
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Priority</p>
                            <p className="text-xs font-bold text-slate-700 capitalize">{order.priority}</p>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Blueprint</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{blueprintName(order.blueprintId)}</p>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Print Center</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{centerName(order.centerId)}</p>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Submitted</p>
                            <p className="text-xs font-bold text-slate-700">
                              {new Date(order.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* LEFT: OEM Status + Documentation */}
                          <div className="space-y-3">
                            {/* OEM Approval Status */}
                            <div className={`p-3 rounded-lg border ${order.oemApproval.approved ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <Building2 className={`w-4 h-4 ${order.oemApproval.approved ? 'text-emerald-600' : 'text-amber-500'}`} />
                                <p className="text-xs font-bold text-slate-700">OEM IP License Approval</p>
                                {order.oemApproval.approved
                                  ? <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">APPROVED</Badge>
                                  : <Badge className="bg-amber-100 text-amber-700 text-[10px]">PENDING</Badge>
                                }
                              </div>
                              {order.oemApproval.approved && order.oemApproval.approvedBy && (
                                <>
                                  <p className="text-xs text-slate-600">Approved by: <span className="font-semibold">{order.oemApproval.approvedBy}</span></p>
                                  {order.oemApproval.approvedAt && (
                                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                      <CalendarDays className="w-3 h-3" />
                                      {new Date(order.oemApproval.approvedAt).toLocaleString()}
                                    </p>
                                  )}
                                </>
                              )}
                              {!order.oemApproval.approved && (
                                <p className="text-xs text-amber-600">This order is still awaiting OEM partner review. Certification review is on hold.</p>
                              )}
                            </div>

                            {/* Documentation Checklist */}
                            <div className="p-3 bg-white rounded-lg border border-slate-200">
                              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <ScrollText className="w-3.5 h-3.5 text-slate-400" />
                                Document Checklist
                              </p>
                              <div className="space-y-1.5">
                                {[
                                  { id: 'oem', label: 'OEM IP License', ok: order.oemApproval.approved, icon: Building2 },
                                  { id: 'bp', label: 'Blueprint Certification', ok: !!bpCert, icon: FileText },
                                  { id: 'fac', label: 'Facility Certification', ok: facCert?.status === 'active', icon: Building2 },
                                  { id: 'mat', label: 'Material Certificate', ok: true, icon: FileBox },
                                  { id: 'qp', label: 'Quality Plan', ok: simDocs.length > 0, icon: ClipboardCheck },
                                  { id: 'coc', label: 'Chain of Custody', ok: true, icon: Scale },
                                ].map(item => (
                                  <div key={item.id} className="flex items-center gap-2 text-xs">
                                    <item.icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-600 flex-1">{item.label}</span>
                                    {item.ok
                                      ? <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                      : <XCircle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                    }
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-100">
                                <p className={`text-xs font-semibold ${docsComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {docsComplete ? 'All required documentation verified' : `${order.oemApproval.approved ? 'Some' : 'Multiple'} documents still pending — review before certifying`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT: Cert Details + Attached Files */}
                          <div className="space-y-3">
                            {/* Blueprint & Facility Cert Details */}
                            {(bpCert || facCert) && (
                              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                                <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                                  Certification Records
                                </p>
                                {bpCert && (
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-slate-400">Blueprint Cert Level</p>
                                    <p className="text-xs font-medium text-slate-700">{bpCert.level}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Issuer: {bpCert.issuer}</p>
                                  </div>
                                )}
                                {facCert && facCert.status !== 'not_found' && (
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-[10px] text-slate-400">Facility Certification</p>
                                    <p className="text-xs font-medium text-slate-700">{facCert.name}</p>
                                    <p className="text-[10px] text-slate-400">Issuer: {facCert.issuer} · Scope: {facCert.scope}</p>
                                    {facCert.expiry !== '—' && (
                                      <p className="text-[10px] text-amber-600 mt-0.5">Expiry: {facCert.expiry}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Attached Documents */}
                            <div className="p-3 bg-white rounded-lg border border-slate-200">
                              <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                                Attached Documents ({simDocs.length})
                              </p>
                              {simDocs.length > 0 ? (
                                <div className="space-y-1.5">
                                  {simDocs.map((doc, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                      <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                      <span className="text-xs text-slate-600 flex-1 truncate">{doc.split('/').pop()}</span>
                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-slate-400 hover:text-slate-600">
                                        <Eye className="w-3 h-3 mr-1" /> View
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-slate-400 hover:text-slate-600">
                                        <Download className="w-3 h-3 mr-1" /> DL
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-slate-400">
                                  <Upload className="w-6 h-6 mx-auto mb-1" />
                                  <p className="text-[11px]">No documents uploaded yet</p>
                                </div>
                              )}
                            </div>

                            {/* Cert Approval Status (if already approved) */}
                            {order.certApproval.approved && (
                              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <Gavel className="w-4 h-4 text-emerald-600" />
                                  <p className="text-xs font-bold text-slate-700">Certification Approved</p>
                                </div>
                                <p className="text-xs text-slate-600">Approved by: <span className="font-semibold">{order.certApproval.approvedBy}</span></p>
                                {order.certApproval.approvedAt && (
                                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {new Date(order.certApproval.approvedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ───── ACTION BUTTONS ───── */}
                        {!order.certApproval.approved && (
                          <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-200 gap-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Add review note (optional)..."
                                value={expanded ? '' : ''}
                                onChange={() => {}}
                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={(e) => { e.stopPropagation(); handleDeny(order.id) }}
                            >
                              <Ban className="w-3 h-3 mr-1" />
                              Deny Certification
                            </Button>
                            <Button
                              size="sm"
                              disabled={!order.oemApproval.approved}
                              className={`text-xs ${
                                order.oemApproval.approved
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                              onClick={(e) => { e.stopPropagation(); handleApprove(order.id) }}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Grant Certification
                            </Button>
                          </div>
                        )}

                        {!order.oemApproval.approved && (
                          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                            OEM partner approval is required before certification can be granted.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ───── RECENT ACTIVITY ───── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            Recent Certification Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {CERT_AUDIT_LOG.slice(0, 5).map(entry => (
              <div key={entry.id} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#10B98115' }}>
                  <entry.icon className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className="text-[10px] bg-emerald-100 text-emerald-700 font-medium">{entry.action}</Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{entry.detail}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{entry.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ───── APPROVE CONFIRMATION MODAL ───── */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setConfirmOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Gavel className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Grant Certification?</h3>
              <p className="text-sm text-slate-500 mt-1">
                You are about to certify the print order and authorize the print center to produce this part.
              </p>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-700 space-y-1">
                <p><span className="font-bold">Order:</span> {orders.find(o => o.id === actionId)?.orderId}</p>
                <p><span className="font-bold">Part:</span> {orders.find(o => o.id === actionId)?.partName}</p>
                <p><span className="font-bold">OEM Status:</span> Approved by {orders.find(o => o.id === actionId)?.oemApproval.approvedBy}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Review Note (optional)</label>
                <Textarea
                  placeholder="e.g. All documents verified, material certs match spec..."
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  className="resize-none text-xs"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-5">
              <Button variant="outline" onClick={() => { setConfirmOpen(false); setActionId(null) }} className="text-xs">
                Cancel
              </Button>
              <Button onClick={confirmApproval} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Confirm Certification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ───── DENY CONFIRMATION MODAL ───── */}
      {denyOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDenyOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Deny Certification?</h3>
              <p className="text-sm text-slate-500 mt-1">
                This will reject the certification request. The requester will be notified to address the issues.
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700">
              <p><span className="font-bold">Order:</span> {orders.find(o => o.id === actionId)?.orderId}</p>
              <p><span className="font-bold">Part:</span> {orders.find(o => o.id === actionId)?.partName}</p>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 block mb-1">Reason for denial</label>
              <Textarea
                placeholder="e.g. Material certificate missing, blueprint not certified..."
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                className="resize-none text-xs"
                rows={2}
              />
            </div>
            <div className="flex justify-center gap-3 mt-5">
              <Button variant="outline" onClick={() => { setDenyOpen(false); setActionId(null) }} className="text-xs">
                Cancel
              </Button>
              <Button onClick={confirmDeny} className="bg-red-600 hover:bg-red-700 text-white text-xs">
                <Ban className="w-3.5 h-3.5 mr-1" />
                Deny Certification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
