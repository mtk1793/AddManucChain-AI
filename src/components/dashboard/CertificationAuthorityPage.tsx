'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Award, ShieldCheck, Building2, FileText, Scale, AlertTriangle,
  CheckCircle2, XCircle, Clock, ChevronRight, Eye, Search,
  FileBox, TrendingUp, Printer, Users,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { orders as initialOrders, type Order, blueprints, printCenters, certifications } from '@/lib/static-data'
import { toast } from 'sonner'

const STORAGE_KEY = 'addmanuchain-orders'

const CERT_AUDIT_LOG = [
  { id: 'ca-1', action: 'FACILITY_CERT_VERIFIED', detail: 'Atlantic XL (PC-001) — Lloyd\'s Register Type Approval valid until Jun 14, 2026', timestamp: '2026-03-18T09:30:00Z', user: 'Cert Authority (Lloyd\'s Register)' },
  { id: 'ca-2', action: 'MATERIAL_CERT_APPROVED', detail: 'Titanium Ti-6Al-4V — Material test certificate MTR-2026-0891 verified', timestamp: '2026-03-18T09:15:00Z', user: 'Cert Authority (Lloyd\'s Register)' },
  { id: 'ca-3', action: 'BLUEPRINT_CERT_REVIEWED', detail: 'BP-1024 (Thruster Bearing Housing) — Design review passed, material spec compliant', timestamp: '2026-03-18T08:45:00Z', user: 'Cert Authority (Lloyd\'s Register)' },
  { id: 'ca-4', action: 'PRINT_PERMISSION_GRANTED', detail: 'ORD-2852 (Bearing Housing Cap) — All checks passed. Print authorized at LR Montreal.', timestamp: '2026-03-18T08:30:00Z', user: 'Cert Authority (Lloyd\'s Register)' },
  { id: 'ca-5', action: 'FACILITY_AUDIT_COMPLETED', detail: 'DNV Calgary (PC-002) — Annual surveillance audit passed. AS9100D recertification in progress.', timestamp: '2026-03-17T14:00:00Z', user: 'Cert Authority (DNV GL)' },
  { id: 'ca-6', action: 'PRINT_PERMISSION_DENIED', detail: 'ORD-2844 (Impeller Shaft) — Material cert for Inconel 718 at PC-002 missing CoC traceability.', timestamp: '2026-03-17T11:20:00Z', user: 'Cert Authority (Lloyd\'s Register)' },
]

const CERTIFICATION_STATS = [
  { label: 'Pending Reviews', value: '7', icon: Clock, color: '#F59E0B' },
  { label: 'Active Certifications', value: '12', icon: Award, color: '#10B981' },
  { label: 'Facilities Certified', value: '4', icon: Building2, color: '#0EA5E9' },
  { label: 'Blueprints Verified', value: '23', icon: FileText, color: '#8B5CF6' },
]

const MONTHLY_CERT_DATA = [
  { month: 'Oct', approvals: 18, denials: 2 },
  { month: 'Nov', approvals: 24, denials: 3 },
  { month: 'Dec', approvals: 21, denials: 1 },
  { month: 'Jan', approvals: 29, denials: 4 },
  { month: 'Feb', approvals: 33, denials: 2 },
  { month: 'Mar', approvals: 15, denials: 1 },
]

function calculateRiskLevel(order: Order): 'high' | 'medium' | 'low' {
  const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 }
  const p = priorityMap[order.priority] || 2
  if (p >= 3 && order.quantity > 5) return 'high'
  if (p >= 2 && order.quantity > 3) return 'medium'
  return 'low'
}

function getBlueprintCert(blueprintId: string | null): { level: string; issuer: string; status: string } | null {
  if (!blueprintId) return null
  const bp = blueprints.find(b => b.id === blueprintId)
  if (!bp) return null
  return { level: bp.certification, issuer: bp.certification, status: bp.status }
}

function findFacilityCert(centerId: string | null): { status: string; issuer: string; scope: string; expiry: string } | null {
  if (!centerId) return null
  const center = printCenters.find(c => c.id === centerId)
  if (!center) return null
  const cert = certifications.find(c => c.holder === center.name && c.status === 'active')
  if (!cert) return { status: 'not_found', issuer: '—', scope: '—', expiry: '—' }
  return { status: cert.status, issuer: cert.issuer, scope: cert.scope, expiry: cert.expiryDate }
}

const DOC_CHECKLIST = [
  { id: 'oem_license', label: 'OEM IP License Granted', icon: Building2 },
  { id: 'blueprint_cert', label: 'Blueprint Certification Valid', icon: FileText },
  { id: 'material_cert', label: 'Material Certificate on File', icon: FileBox },
  { id: 'facility_cert', label: 'Print Center Certification Active', icon: Building2 },
  { id: 'quality_plan', label: 'Quality Plan Submitted', icon: FileText },
  { id: 'traceability', label: 'Chain of Custody Documented', icon: Scale },
]

export function CertificationAuthorityPage({ role = 'admin' }: { role?: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [loaded, setLoaded] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'queue' | 'facilities' | 'audit'>('queue')

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

  const pendingCert = orders.filter(
    o => o.oemApproval.approved && !o.certApproval.approved && !['printing', 'quality_check', 'shipped', 'delivered', 'completed', 'archived'].includes(o.status)
  )

  const readyToPrint = orders.filter(
    o => o.oemApproval.approved && o.certApproval.approved && !o.printAuthToken
      && !['printing', 'quality_check', 'shipped', 'delivered', 'completed', 'archived'].includes(o.status)
  )

  const handleApprove = useCallback((orderId: string) => {
    setApprovingId(orderId)
    setIsConfirmOpen(true)
  }, [])

  const confirmApproval = useCallback(() => {
    if (!approvingId) return
    const now = new Date().toISOString()
    setOrders(prev => prev.map(o => {
      if (o.id !== approvingId) return o
      return {
        ...o,
        certApproval: { approved: true, approvedAt: now, approvedBy: "Cert Authority (Lloyd's Register)" },
      }
    }))
    toast.success(`Certification granted for ${orders.find(o => o.id === approvingId)?.orderId}`, {
      description: 'Print center authorized. All documentation checks passed.',
    })
    setIsConfirmOpen(false)
    setApprovingId(null)
  }, [approvingId, orders])

  const isTab = (tab: string) => activeTab === tab

  const certCount = certifications.filter(c => c.status === 'active').length
  const facilitiesCertified = printCenters.filter(c => c.status === 'online').length

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Certification Authority Portal</h1>
            <p className="text-sm text-slate-500">Verify documentation, approve prints, and manage compliance across the ecosystem</p>
          </div>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-semibold">
          {certCount} Active Certifications
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {CERTIFICATION_STATS.map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { key: 'queue', label: 'Certification Queue', count: pendingCert.length, color: 'emerald' },
          { key: 'facilities', label: 'Facility Certifications', count: facilitiesCertified, color: 'blue' },
          { key: 'audit', label: 'Audit Trail', color: 'slate' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isTab(tab.key)
                ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200`
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <Badge className={`ml-2 ${isTab(tab.key) ? `bg-${tab.color}-100 text-${tab.color}-700` : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* ───── CERTIFICATION QUEUE ───── */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* DRM Pipeline */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3" style={{ borderBottom: '1px solid #1e2d45' }}>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                🔐 Certification Pipeline
              </p>
              <span className="text-[10px]" style={{ color: '#64748b' }}>
                Documentation verification · Facility audit · Compliance check
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap px-5 py-4">
              {[
                { emoji: '📥', label: 'Submitted', count: orders.length, state: 'done' },
                { emoji: '🏭', label: 'OEM Licence', count: 0, state: 'done' },
                { emoji: '📋', label: 'Docs Verified', count: 0, state: pendingCert.length > 0 ? 'active' : 'done' },
                { emoji: '🔐', label: 'Permission Granted', count: readyToPrint.length, state: readyToPrint.length > 0 ? 'active' : 'pending' },
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                    style={{
                      background: node.state === 'done' ? 'rgba(16,185,129,0.1)' : node.state === 'active' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${node.state === 'done' ? 'rgba(16,185,129,0.4)' : node.state === 'active' ? 'rgba(59,130,246,0.4)' : '#1e2d45'}`,
                      color: node.state === 'done' ? '#6ee7b7' : node.state === 'active' ? '#93c5fd' : '#64748b',
                      boxShadow: node.state === 'active' ? '0 0 12px rgba(59,130,246,0.2)' : 'none',
                    }}
                  >
                    <span>{node.emoji}</span>
                    <span>{node.label}</span>
                    {node.count > 0 && <span className="font-bold ml-1">({node.count})</span>}
                  </div>
                  {i < 3 && <span className="text-base" style={{ color: '#475569' }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Certification Activity (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={MONTHLY_CERT_DATA} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="approvals" name="Approved" radius={[4, 4, 0, 0]} fill="#10B981" />
                    <Bar dataKey="denials" name="Denied" radius={[4, 4, 0, 0]} fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Documentation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DOC_CHECKLIST.map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <item.icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600 flex-1">{item.label}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Pending Certification Reviews */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-500" />
                  Orders Pending Certification Review
                </CardTitle>
                <Badge className="bg-emerald-100 text-emerald-700">{pendingCert.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingCert.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                  <p className="font-medium">All orders certified and cleared for print</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingCert.map(order => {
                    const riskLevel = calculateRiskLevel(order)
                    const blueprintCert = getBlueprintCert(order.blueprintId)
                    const facilityCert = findFacilityCert(order.centerId)
                    const expanded = expandedOrder === order.id
                    const docsComplete = !!(
                      order.oemApproval.approved &&
                      blueprintCert &&
                      facilityCert &&
                      facilityCert.status === 'active'
                    )

                    return (
                      <div key={order.id}>
                        <div
                          className="px-4 py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setExpandedOrder(expanded ? null : order.id)}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800 truncate">{order.partName}</p>
                              <Badge className={`text-[10px] ${
                                riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                                riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                {riskLevel === 'high' ? '🔴 High' : riskLevel === 'medium' ? '🟡 Medium' : '🟢 Low'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-slate-400">{order.orderId}</span>
                              <span className="text-xs text-slate-400">Qty: {order.quantity}</span>
                              <span className="text-xs text-slate-400">{printCenters.find(c => c.id === order.centerId)?.name || '—'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {docsComplete ? (
                              <Badge className="bg-green-100 text-green-700 text-[10px]">Docs OK</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 text-[10px]">Docs Pending</Badge>
                            )}
                          </div>
                          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                        </div>

                        {expanded && (
                          <div className="px-4 pb-4 pt-0 bg-slate-50/50 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              {/* Documentation Checklist */}
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Documentation Checklist</p>
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-600 flex-1">OEM IP License</span>
                                    {order.oemApproval.approved
                                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      : <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                    }
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-600 flex-1">Blueprint Certification</span>
                                    {blueprintCert
                                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      : <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                    }
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-600 flex-1">Facility Certification</span>
                                    {facilityCert && facilityCert.status === 'active'
                                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      : <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                    }
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <FileBox className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-600 flex-1">Material Certificate</span>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-slate-600 flex-1">Chain of Custody</span>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  </div>
                                </div>
                              </div>

                              {/* Cert Details */}
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Certification Details</p>
                                {blueprintCert && (
                                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <p className="text-[10px] text-slate-400">Blueprint Cert Level</p>
                                    <p className="text-xs font-medium text-slate-700">{blueprintCert.level}</p>
                                  </div>
                                )}
                                {facilityCert && (
                                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <p className="text-[10px] text-slate-400">Facility Certification</p>
                                    <p className="text-xs font-medium text-slate-700">{facilityCert.issuer}</p>
                                    <p className="text-[10px] text-slate-400">{facilityCert.scope}</p>
                                    {facilityCert.expiry !== '—' && (
                                      <p className="text-[10px] text-amber-600">Expires: {facilityCert.expiry}</p>
                                    )}
                                  </div>
                                )}
                                {order.oemApproval.approved && (
                                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                                    <p className="text-[10px] text-slate-400">OEM License Granted By</p>
                                    <p className="text-xs font-medium text-slate-700">{order.oemApproval.approvedBy}</p>
                                    <p className="text-[10px] text-slate-400">
                                      {order.oemApproval.approvedAt ? new Date(order.oemApproval.approvedAt).toLocaleString() : '—'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Approve Button */}
                            <div className="flex justify-end mt-4 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  toast.error(`Certification denied for ${order.orderId}`, {
                                    description: 'Documentation requirements not met. Notification sent to requester.',
                                  })
                                }}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Deny
                              </Button>
                              <Button
                                size="sm"
                                disabled={!docsComplete}
                                className={`text-xs ${
                                  docsComplete
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                                onClick={() => handleApprove(order.id)}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Grant Print Permission
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ───── FACILITY CERTIFICATIONS ───── */}
      {activeTab === 'facilities' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              Print Center Certification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Facility</TableHead>
                  <TableHead className="text-xs">Location</TableHead>
                  <TableHead className="text-xs">Certification</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Scope</TableHead>
                  <TableHead className="text-xs">Expiry</TableHead>
                  <TableHead className="text-xs"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {printCenters.map(center => {
                  const cert = certifications.find(c => c.holder === center.name)
                  return (
                    <TableRow key={center.id} className="hover:bg-slate-50">
                      <TableCell className="py-2">
                        <p className="text-xs font-medium text-slate-800">{center.name}</p>
                      </TableCell>
                      <TableCell className="py-2 text-xs text-slate-500">{center.location}</TableCell>
                      <TableCell className="py-2 text-xs font-medium text-slate-700">
                        {cert?.name || center.certification}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className={`text-[10px] ${
                          center.status === 'online' ? 'bg-green-100 text-green-700' :
                          center.status === 'busy' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {center.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-xs text-slate-500 max-w-[200px] truncate">
                        {cert?.scope || '—'}
                      </TableCell>
                      <TableCell className="py-2">
                        {cert ? (
                          <span className={`text-xs ${
                            new Date(cert.expiryDate) < new Date() ? 'text-red-600' :
                            new Date(cert.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'text-amber-600' :
                            'text-slate-500'
                          }`}>
                            {cert.expiryDate}
                          </span>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="py-2">
                        <Button size="sm" variant="ghost" className="text-xs text-slate-400 hover:text-slate-600">
                          <Eye className="w-3 h-3 mr-1" /> View
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

      {/* ───── AUDIT TRAIL ───── */}
      {activeTab === 'audit' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Recent Certification Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {CERT_AUDIT_LOG.map(entry => (
                <div key={entry.id} className="px-4 py-3 flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge className="text-[10px] bg-emerald-100 text-emerald-700">{entry.action}</Badge>
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
      )}

      {/* Confirm Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsConfirmOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <Award className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">Grant Print Permission?</h3>
              <p className="text-sm text-slate-500 mt-1">
                All documentation checks passed. Once approved, the print center can issue a secure print token.
              </p>
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => { setIsConfirmOpen(false); setApprovingId(null) }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApproval}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Confirm & Grant Permission
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
