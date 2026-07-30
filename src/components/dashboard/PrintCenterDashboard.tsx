'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Printer, Package, KeyRound, Gauge, AlertTriangle, Zap, Shield, Lock,
  CheckCircle2, Clock, Plus, Play, Pause, Archive, Boxes, Hash,
} from 'lucide-react'
import { orders as initialOrders, type Order, printCenters } from '@/lib/static-data'
import { toast } from 'sonner'

const STORAGE_KEY = 'addmanuchain-orders'

const FACILITY_PRINTERS = [
  { id: 'osp-01', model: 'Markforged X7', location: 'Engine Room — Deck 3', status: 'online', currentJob: 'Bearing Cap Std (DRM-7738)', certBody: 'DNV GL', materials: ['Onyx FR', 'Onyx', 'Carbon Fiber', 'Kevlar', 'HSHT Fiberglass'], tech: 'FFF + Continuous Fiber' },
  { id: 'osp-02', model: 'HP Jet Fusion 580', location: 'Workshop Bay A', status: 'busy', currentJob: 'Valve Seat DN50', certBody: 'DNV GL', materials: ['HP 3D HR PA12', 'HP 3D HR PA12 GB', 'HP 3D HR TPA'], tech: 'Multi Jet Fusion' },
  { id: 'osp-03', model: 'Ultimaker S5', location: 'Maintenance Storage', status: 'online', currentJob: null, certBody: null, materials: ['PLA', 'ABS', 'PETG', 'TPU 95A', 'Nylon'], tech: 'FFF (Dual Extrusion)' },
  { id: 'osp-04', model: 'Formlabs Form 3', location: 'Lab / QC Station', status: 'offline', currentJob: null, certBody: 'Bureau Veritas', materials: ['Standard Resin', 'Tough 1500', 'Durable Resin'], tech: 'SLA (LFS)' },
]

function sha256Mock(input: string): string {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    h = ((h << 5) - h + ch) | 0
  }
  return 'SHA256:' + Math.abs(h).toString(16).padStart(16, '0')
}

export function PrintCenterDashboard({ role = 'admin' }: { role?: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'approvals' | 'printing' | 'completed' | 'create' | 'fleet'>('approvals')
  const [selectedPrinter, setSelectedPrinter] = useState<string>('')
  const [confirmingOrder, setConfirmingOrder] = useState<string | null>(null)
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    partName: '',
    priority: 'medium' as string,
    quantity: 1,
    notes: '',
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setOrders(JSON.parse(saved))
      }
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    }
  }, [orders, loaded])

  const ordersForMyFacility = orders.filter(
    o => o.centerId === 'pc-1' || o.centerId === 'pc-2'
  )

  const pendingApproval = ordersForMyFacility.filter(
    o => o.oemApproval.approved && o.certApproval.approved && !o.printAuthToken
      && !['printing', 'quality_check', 'shipped', 'delivered', 'completed', 'archived'].includes(o.status)
  )

  const activePrints = ordersForMyFacility.filter(
    o => o.status === 'printing' && o.printAuthToken
  )

  const completedOrders = ordersForMyFacility.filter(
    o => o.status === 'completed'
  )

  const archivedOrders = ordersForMyFacility.filter(
    o => o.status === 'archived'
  )

  const totalCompleted = completedOrders.length + archivedOrders.length + ordersForMyFacility.filter(o => ['shipped', 'delivered'].includes(o.status)).length

  const totalPending = pendingApproval.length + ordersForMyFacility.filter(
    o => o.status === 'pending' && !o.printAuthToken
  ).length

  const handleApproveForPrint = useCallback((orderId: string, printerId: string) => {
    if (!printerId) {
      toast.error('Please select a printer')
      return
    }
    const now = new Date().toISOString()
    const token = `drm-${cryptoRandomId()}`
    const tokenHash = sha256Mock(token)
    const printer = FACILITY_PRINTERS.find(p => p.id === printerId)
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return { ...o, status: 'printing', printAuthToken: token }
    }))
    toast.success(`Print token issued`, {
      description: `Assigned to ${printer?.model || 'printer'}. Token hash: ${tokenHash}`,
    })
    setConfirmingOrder(null)
    setSelectedPrinter('')
  }, [])

  const handleCompletePrint = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return { ...o, status: 'completed' }
    }))
    const order = orders.find(o => o.id === orderId)
    const completedHash = sha256Mock(`${order?.orderId}-${order?.printAuthToken}-${Date.now()}`)
    toast.success(`Print completed: ${order?.orderId}`, {
      description: `Completion hash: ${completedHash}. Ready to archive.`,
    })
  }, [orders])

  const handleArchive = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      return { ...o, status: 'archived' }
    }))
    const order = orders.find(o => o.id === orderId)
    toast.success(`Order archived: ${order?.orderId}`, {
      description: 'Order lifecycle complete. Immutable audit record sealed.',
    })
    setArchiveConfirm(null)
  }, [orders])

  const handleCreateOrder = useCallback(() => {
    if (!formData.partName) {
      toast.error('Part name is required')
      return
    }
    const nums = orders.map(o => parseInt(o.orderId.split('-')[1]) || 0).filter(n => !isNaN(n))
    const nextNum = Math.max(...nums, 2800) + 1
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId: `ORD-${nextNum}`,
      partName: formData.partName,
      status: 'pending',
      priority: formData.priority,
      quantity: formData.quantity,
      eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      requesterId: 'user-1',
      blueprintId: null,
      centerId: 'pc-1',
      notes: formData.notes || null,
      createdAt: new Date().toISOString(),
      oemApproval: { approved: false, approvedAt: null, approvedBy: null },
      certApproval: { approved: false, approvedAt: null, approvedBy: null },
      printAuthToken: null,
    }
    const orderHash = sha256Mock(`${newOrder.orderId}-${newOrder.partName}-${Date.now()}`)
    setOrders(prev => [newOrder, ...prev])
    setFormData({ partName: '', priority: 'medium', quantity: 1, notes: '' })
    toast.success(`Order ${newOrder.orderId} created`, {
      description: `Order hash: ${orderHash}. Awaiting OEM and cert approvals.`,
    })
  }, [formData, orders])

  const isTab = (tab: string) => activeTab === tab
  const onlinePrinters = FACILITY_PRINTERS.filter(p => p.status !== 'offline').length

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Printer className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Print Facility Dashboard</h1>
            <p className="text-sm text-slate-500">Authorize prints, run jobs, archive completed orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-800 text-slate-200 px-3 py-1.5 text-xs font-mono">
            <Lock className="w-3 h-3 mr-1" /> SHA-256 Audit Chain
          </Badge>
          <Badge className="bg-teal-100 text-teal-700 px-3 py-1.5 text-xs font-semibold">
            {onlinePrinters} Printers Online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Package, label: 'Awaiting Approval', value: pendingApproval.length, color: '#F59E0B' },
          { icon: Zap, label: 'Printing Now', value: activePrints.length, color: '#0EA5E9' },
          { icon: CheckCircle2, label: 'Completed', value: completedOrders.length, color: '#10B981' },
          { icon: Archive, label: 'Archived', value: archivedOrders.length, color: '#64748B' },
          { icon: Boxes, label: 'Materials OK', value: '3/4', color: '#6366F1' },
        ].map(stat => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'approvals', label: 'Approve Prints', count: pendingApproval.length, icon: KeyRound, color: 'amber' },
          { key: 'printing', label: 'Printing', count: activePrints.length, icon: Zap, color: 'sky' },
          { key: 'completed', label: 'Complete & Archive', count: completedOrders.length, icon: Archive, color: 'emerald' },
          { key: 'create', label: 'New Order', icon: Plus, color: 'slate' },
          { key: 'fleet', label: 'Fleet', count: 4, icon: Printer, color: 'slate' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as typeof activeTab)
              setConfirmingOrder(null)
              setArchiveConfirm(null)
              setSelectedPrinter('')
            }}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              isTab(tab.key)
                ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200`
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-1.5" />
            {tab.label}
            {tab.count !== undefined && (
              <Badge className={`ml-2 text-[10px] ${
                tab.count > 0
                  ? `bg-${tab.color}-100 text-${tab.color}-700`
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* ───── APPROVE PRINTS ───── */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {/* Pipeline Visualization */}
          <Card className="border-0 shadow-sm bg-slate-50">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-slate-700 mb-3">Order Pipeline — Your Facility ({ordersForMyFacility.filter(o => o.printAuthToken).length} of {ordersForMyFacility.length} orders cleared)</p>
              <div className="flex items-center gap-1 flex-wrap text-[10px] font-medium">
                {[
                  { label: 'Submitted', count: ordersForMyFacility.filter(o => !o.oemApproval.approved && !o.certApproval.approved && !['printing','completed','archived','shipped','delivered'].includes(o.status)).length, color: '#94a3b8' },
                  { label: 'OEM Pending', count: ordersForMyFacility.filter(o => !o.oemApproval.approved && !['printing','completed','archived','shipped','delivered'].includes(o.status) && !(o.oemApproval.approved && !o.certApproval.approved)).length, color: '#a78bfa' },
                  { label: 'Cert Pending', count: ordersForMyFacility.filter(o => o.oemApproval.approved && !o.certApproval.approved && !['printing','completed','archived','shipped','delivered'].includes(o.status)).length, color: '#34d399' },
                  { label: 'Ready for Print', count: pendingApproval.length, color: '#0ea5e9' },
                  { label: 'Printing', count: activePrints.length, color: '#f59e0b' },
                  { label: 'Done', count: completedOrders.length + archivedOrders.length, color: '#10b981' },
                ].map((stage, i) => (
                  <div key={stage.label} className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded border" style={{ borderColor: stage.color, color: stage.color, backgroundColor: `${stage.color}15` }}>
                      {stage.label} ({stage.count})
                    </span>
                    {i < 5 && <span className="text-slate-300">→</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {ordersForMyFacility.filter(o => !['shipped','delivered','archived'].includes(o.status)).length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-teal-300" />
              <p className="font-medium">No active orders at your facility</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ordersForMyFacility
                .filter(o => !['shipped','delivered','archived'].includes(o.status))
                .map(order => {
                  const bothApproved = order.oemApproval.approved && order.certApproval.approved
                  const isReady = bothApproved && !order.printAuthToken && order.status !== 'printing' && order.status !== 'completed'
                  const isConfirming = confirmingOrder === order.id
                  const stageIdx = bothApproved ? 3 : order.oemApproval.approved ? 2 : order.certApproval.approved ? 1 : 0

                  return (
                    <Card key={order.id} className={`border shadow-sm overflow-hidden ${isReady ? 'border-teal-300 ring-1 ring-teal-100' : 'border-slate-200'}`}>
                      <div className="p-4 grid grid-cols-[1fr_auto] gap-4 items-start">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-800">{order.partName}</p>
                            {isReady && <Badge className="text-[10px] bg-teal-100 text-teal-700 font-bold">READY</Badge>}
                            {order.status === 'printing' && <Badge className="text-[10px] bg-sky-100 text-sky-700">Printing</Badge>}
                            {order.status === 'completed' && <Badge className="text-[10px] bg-green-100 text-green-700">Completed</Badge>}
                            <Badge className={`text-[10px] ${
                              order.priority === 'high' ? 'bg-red-100 text-red-700' :
                              order.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {order.priority}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>{order.orderId}</span>
                            <span>Qty: {order.quantity}</span>
                            <span>{printCenters.find(c => c.id === order.centerId)?.name || 'Facility'}</span>
                          </div>

                          {/* Mini Pipeline */}
                          <div className="flex items-center gap-1 mt-2 text-[10px]">
                            {[
                              { label: 'OEM', done: order.oemApproval.approved, color: '#a78bfa' },
                              { label: 'Cert', done: order.certApproval.approved, color: '#34d399' },
                              { label: 'Print', done: !!order.printAuthToken, color: '#0ea5e9' },
                            ].map((step, i) => (
                              <div key={step.label} className="flex items-center gap-1">
                                <span className={`px-1.5 py-0.5 rounded border ${step.done ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                                  {step.done ? <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> : <Clock className="w-3 h-3 inline mr-0.5" />}
                                  {step.label}
                                </span>
                                {i < 2 && <span className="text-slate-300">→</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          {order.status === 'printing' || order.status === 'completed' ? (
                            <span className="text-[10px] text-slate-400">—</span>
                          ) : !isReady ? (
                            <div className="text-right">
                              <p className="text-[10px] font-semibold text-amber-700 mb-1">
                                {!order.oemApproval.approved && !order.certApproval.approved
                                  ? 'Waiting for OEM + Cert'
                                  : !order.oemApproval.approved
                                  ? 'Waiting for OEM Approval'
                                  : 'Waiting for Certification'}
                              </p>
                              <Badge className="text-[9px] bg-amber-100 text-amber-600">
                                <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                                In Pipeline
                              </Badge>
                            </div>
                          ) : !isConfirming ? (
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700 text-white text-xs whitespace-nowrap animate-pulse"
                              onClick={() => setConfirmingOrder(order.id)}
                            >
                              <KeyRound className="w-3 h-3 mr-1" /> Authorize Print
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex flex-col gap-1.5">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                                  <Printer className="w-3 h-3" /> Assign Printer
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {FACILITY_PRINTERS.filter(p => p.status !== 'offline' && p.certBody).map(printer => (
                                    <button
                                      key={printer.id}
                                      onClick={() => setSelectedPrinter(printer.id)}
                                      className={`px-2 py-1 rounded text-[10px] border transition-all ${
                                        selectedPrinter === printer.id
                                          ? 'border-teal-400 bg-teal-50 text-teal-700 font-semibold'
                                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                      }`}
                                    >
                                      <div>{printer.model}</div>
                                      <div className="text-[9px] opacity-60">{printer.certBody}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-slate-900 rounded-lg px-2 py-1.5">
                                <p className="text-[9px] text-slate-500 font-mono uppercase mb-0.5">One-Time Token</p>
                                <p className="text-[10px] text-emerald-400 font-mono">
                                  {selectedPrinter ? `drm-****-****-****-${'*'.repeat(12)}` : 'Select a printer...'}
                                </p>
                              </div>
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] h-7"
                                  onClick={() => handleApproveForPrint(order.id, selectedPrinter)}
                                >
                                  <Lock className="w-3 h-3 mr-1" /> Issue Token
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-[10px] h-7"
                                  onClick={() => { setConfirmingOrder(null); setSelectedPrinter('') }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* ───── PRINTING ───── */}
      {activeTab === 'printing' && (
        <div className="space-y-4">
          {activePrints.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Printer className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="font-medium text-lg">No active print jobs</p>
              <p className="text-sm mt-1">Authorize orders from the Approval tab</p>
            </div>
          ) : (
            activePrints.map(order => (
              <Card key={order.id} className="border-slate-200 shadow-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{order.partName}</p>
                        <Badge className="text-[10px] bg-sky-100 text-sky-700">
                          <Zap className="w-3 h-3 mr-0.5" /> Printing
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span>{order.orderId}</span>
                        <span>Qty: {order.quantity}</span>
                        <span className="font-mono text-[10px] text-teal-600">
                          <Lock className="w-3 h-3 inline mr-0.5" />
                          Token: {order.printAuthToken?.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <Pause className="w-3 h-3 mr-1" /> Pause
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleCompletePrint(order.id)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Print Progress</span>
                      <span className="font-semibold text-slate-700">72%</span>
                    </div>
                    <Progress value={72} className="h-2 bg-slate-100 [&>div]:bg-teal-500" />
                  </div>
                  <div className="mt-2 p-2 bg-slate-900 rounded-lg">
                    <p className="text-[9px] text-slate-500 font-mono uppercase">Encrypted G-code Stream</p>
                    <p className="text-[10px] text-emerald-400 font-mono truncate">
                      {sha256Mock(`${order.orderId}-${order.printAuthToken}`)} · One-time use · Auto-expire
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ───── COMPLETE & ARCHIVE ───── */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">End of Order Lifecycle</p>
                <p className="text-xs text-emerald-600">Archive completed orders to seal the immutable audit chain. Once archived, records are permanently stored.</p>
              </div>
            </CardContent>
          </Card>

          {completedOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Archive className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="font-medium text-lg">No completed orders to archive</p>
              <p className="text-sm mt-1">Mark active prints as complete</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedOrders.map(order => {
                const isConfirming = archiveConfirm === order.id
                return (
                  <Card key={order.id} className="border-slate-200 shadow-sm">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-800">{order.partName}</p>
                            <Badge className="text-[10px] bg-green-100 text-green-700">Completed</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{order.orderId}</span>
                            <span>Qty: {order.quantity}</span>
                            <span className="font-mono text-[10px]">
                              <Shield className="w-3 h-3 inline mr-0.5" />
                              {sha256Mock(`${order.orderId}-${order.printAuthToken}-${order.createdAt}`)}
                            </span>
                          </div>
                        </div>
                        {!isConfirming ? (
                          <Button
                            size="sm"
                            className="text-xs bg-slate-600 hover:bg-slate-700 text-white"
                            onClick={() => setArchiveConfirm(order.id)}
                          >
                            <Archive className="w-3 h-3 mr-1" /> Archive
                          </Button>
                        ) : (
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              className="text-xs bg-slate-800 hover:bg-slate-900 text-white"
                              onClick={() => handleArchive(order.id)}
                            >
                              <Shield className="w-3 h-3 mr-1" /> Seal & Archive
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => setArchiveConfirm(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Archived Orders Summary */}
          {archivedOrders.length > 0 && (
            <Card className="border-slate-200 shadow-sm bg-slate-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  Sealed Archives ({archivedOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {archivedOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between text-xs p-2 rounded bg-white border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-slate-600">{order.orderId}</span>
                        <span className="text-slate-400">{order.partName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {sha256Mock(`${order.orderId}-${order.printAuthToken}-${order.createdAt}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ───── CREATE ORDER ───── */}
      {activeTab === 'create' && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Create New Print Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Part Name *</label>
              <input
                type="text"
                value={formData.partName}
                onChange={e => setFormData(prev => ({ ...prev, partName: e.target.value }))}
                placeholder="e.g. Pump Impeller DN150"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.quantity}
                  onChange={e => setFormData(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Special instructions..."
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300 resize-none"
              />
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <p className="text-[9px] text-slate-500 font-mono uppercase mb-1">Order Hash (SHA-256 Auditable)</p>
              <p className="text-[10px] text-emerald-400 font-mono">
                {formData.partName
                  ? sha256Mock(`${formData.partName}-${formData.quantity}-${Date.now()}`)
                  : 'Enter a part name to generate order hash...'}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800">New orders enter the DRM pipeline</p>
                <p className="text-xs text-amber-600 mt-0.5">Orders need OEM IP approval and certification body sign-off before printing.</p>
              </div>
            </div>
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleCreateOrder}
            >
              <Lock className="w-4 h-4 mr-1" /> Create Encrypted Order
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ───── FLEET ───── */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FACILITY_PRINTERS.map(printer => (
              <Card key={printer.id} className={`border shadow-sm ${
                printer.status === 'offline' ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
              }`}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{printer.model}</p>
                      <p className="text-xs text-slate-500">{printer.location}</p>
                    </div>
                    <Badge className={`text-[10px] ${
                      printer.status === 'online' ? 'bg-emerald-100 text-emerald-700' :
                      printer.status === 'busy' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {printer.status === 'online' ? 'Ready' : printer.status === 'busy' ? 'Printing' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{printer.tech}</span>
                    {printer.certBody && (
                      <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded flex items-center gap-1">
                        <Shield className="w-3 h-3" />{printer.certBody}
                      </span>
                    )}
                  </div>
                  {printer.currentJob && (
                    <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded mb-2">
                      Current job: {printer.currentJob}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {printer.materials.slice(0, 4).map(m => (
                      <span key={m} className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">{m}</span>
                    ))}
                    {printer.materials.length > 4 && (
                      <span className="text-[10px] text-slate-400">+{printer.materials.length - 4} more</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function cryptoRandomId(): string {
  const chars = 'abcdef0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${result.slice(0, 8)}-${result.slice(8, 12)}-${result.slice(12, 16)}-${result.slice(16, 20)}-${result.slice(20)}`
}
