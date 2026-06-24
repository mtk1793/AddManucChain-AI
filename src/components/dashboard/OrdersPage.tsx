'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Package,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  KeyRound,
  Lock,
  CheckCircle2,
  Clock,
  Building2,
  Award,
  Zap,
  ShieldCheck,
  MapPin,
  Printer,
  AlertTriangle,
  Users,
  FlaskConical,
  TestTubeDiagonal,
  Download,

} from 'lucide-react'
import { toast } from 'sonner'
import { orders as initialOrders, blueprints, printCenters, users, Order, getOrderFinancials } from '@/lib/static-data'

const statusColors: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  printing: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
  quality_check: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  shipped: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  delivered: 'bg-green-100 text-green-600',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  printing: 'Printing',
  quality_check: 'Quality Check',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-500',
  medium: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  high: 'bg-red-100 text-red-600',
}

const statusFlow = ['pending', 'printing', 'quality_check', 'shipped', 'delivered']

// Map order state → pipeline stage (1-8)
const PIPELINE_STAGE_INFO: Record<string, { num: number; label: string; emoji: string; color: string }> = {
  'stage2': { num: 2, label: 'Order Placed',    emoji: '📋', color: '#94a3b8' },
  'stage3': { num: 3, label: 'DRM Approval',    emoji: '🔐', color: '#8b5cf6' },
  'stage4': { num: 4, label: 'Printing',         emoji: '🖨️', color: '#0ea5e9' },
  'stage5': { num: 5, label: 'Lab Testing',      emoji: '🔬', color: '#f97316' },
  'stage7': { num: 7, label: 'Shipment',         emoji: '🚚', color: '#14b8a6' },
  'stage8': { num: 8, label: 'Delivered',        emoji: '✅', color: '#10b981' },
}

function getPipelineStage(order: Order) {
  if (order.status === 'delivered')     return PIPELINE_STAGE_INFO['stage8']
  if (order.status === 'shipped')       return PIPELINE_STAGE_INFO['stage7']
  if (order.status === 'quality_check') return PIPELINE_STAGE_INFO['stage5']
  if (order.status === 'printing')      return PIPELINE_STAGE_INFO['stage4']
  if (order.oemApproval.approved || order.certApproval.approved) return PIPELINE_STAGE_INFO['stage3']
  return PIPELINE_STAGE_INFO['stage2']
}

// Generate a mock secure print token
function generatePrintToken(): string {
  const hex = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')
  return `drm-${hex()}${hex()}-${hex()}-${hex()}-${hex()}-${hex()}${hex()}${hex()}`
}

function ApprovalPip({ label, approved, icon: Icon }: { label: string; approved: boolean; icon: any }) {
  return (
    <div title={`${label}: ${approved ? 'Approved' : 'Pending'}`}>
      <div className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors ${approved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
        }`}>
        <Icon className="w-2.5 h-2.5" />
        {approved ? '✓' : '⏳'}
      </div>
    </div>
  )
}

function ApprovalStepperMini({ order }: { order: Order }) {
  const steps = [
    { label: 'OEM', done: order.oemApproval.approved, icon: Building2 },
    { label: 'Cert', done: order.certApproval.approved, icon: Award },
    { label: 'Token', done: !!order.printAuthToken, icon: KeyRound },
  ]
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center gap-0.5">
          <ApprovalPip label={step.label} approved={step.done} icon={step.icon} />
          {idx < steps.length - 1 && (
            <div className={`w-2 h-0.5 ${step.done ? 'bg-emerald-300' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function ApprovalTimeline({ order }: { order: Order }) {
  const steps = [
    { label: 'Request Submitted', done: true, by: 'Customer', time: order.createdAt, icon: Package },
    { label: 'OEM IP License', done: order.oemApproval.approved, by: order.oemApproval.approvedBy, time: order.oemApproval.approvedAt, icon: Building2 },
    { label: 'Cert Verified', done: order.certApproval.approved, by: order.certApproval.approvedBy, time: order.certApproval.approvedAt, icon: Award },
    { label: 'Print Token', done: !!order.printAuthToken, by: order.printAuthToken ? `${order.printAuthToken.substring(0, 20)}...` : null, time: null, icon: KeyRound },
  ]
  return (
    <div className="space-y-2">
      {steps.map((step, idx) => {
        const Icon = step.icon
        return (
          <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${step.done ? 'bg-emerald-50' : 'bg-slate-50'
            }`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${step.done ? 'text-[#0F172A]' : 'text-slate-400'}`}>{step.label}</p>
              {step.done && step.by && <p className="text-[10px] text-slate-500 truncate">{step.by}</p>}
              {step.done && step.time && <p className="text-[10px] text-slate-400">{new Date(step.time).toLocaleString('en-US')}</p>}
            </div>
            {step.done
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              : <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
            }
          </div>
        )
      })}
    </div>
  )
}

// ── On-site printers (registered to this operator / end user) ─────────────────
const ON_SITE_PRINTERS = [
  {
    id: 'OSP-01', model: 'Markforged X7', location: 'Engine Room — Deck 3',
    certified: true, certBody: 'DNV GL', certNumber: 'DNV-GL-2024-0041',
    status: 'online' as const, currentJob: 'Bearing Cap Std (DRM-7738)',
    tech: 'FFF + Continuous Fiber', printVolume: '330 × 270 × 200 mm',
    materials: ['Onyx FR', 'Onyx', 'Carbon Fiber', 'Kevlar', 'HSHT Fiberglass'],
  },
  {
    id: 'OSP-02', model: 'HP Jet Fusion 580', location: 'Workshop Bay A',
    certified: true, certBody: 'DNV GL', certNumber: 'DNV-GL-2023-0089',
    status: 'busy' as const, currentJob: 'Valve Seat DN50',
    tech: 'Multi Jet Fusion', printVolume: '332 × 190 × 248 mm',
    materials: ['HP 3D HR PA12', 'HP 3D HR PA12 GB', 'HP 3D HR TPA'],
  },
  {
    id: 'OSP-03', model: 'Ultimaker S5', location: 'Maintenance Storage',
    certified: false, certBody: null, certNumber: null,
    status: 'online' as const, currentJob: null,
    tech: 'FFF (Dual Extrusion)', printVolume: '330 × 240 × 300 mm',
    materials: ['PLA', 'ABS', 'PETG', 'TPU 95A', 'Nylon', 'CPE'],
  },
  {
    id: 'OSP-04', model: 'Formlabs Form 3', location: 'Lab / QC Station',
    certified: true, certBody: 'Bureau Veritas', certNumber: 'BV-AM-2024-0012',
    status: 'offline' as const, currentJob: null,
    tech: 'SLA (LFS)', printVolume: '145 × 145 × 185 mm',
    materials: ['Standard Resin', 'Tough 1500', 'Durable Resin', 'Flexible 80A', 'Grey Pro'],
  },
]

// ── On-site printer picker card ───────────────────────────────────────────────
function OnSitePrinterCard({
  printer,
  selected,
  onSelect,
}: {
  printer: typeof ON_SITE_PRINTERS[0]
  selected: boolean
  onSelect: (id: string) => void
}) {
  const statusColor = printer.status === 'online' ? '#10b981' : printer.status === 'busy' ? '#f59e0b' : '#94a3b8'
  return (
    <div
      onClick={() => printer.status !== 'offline' && onSelect(printer.id)}
      className={`rounded-xl p-3 cursor-pointer transition-all border-2 ${
        printer.status === 'offline' ? 'opacity-40 cursor-not-allowed' : ''
      } ${selected ? 'border-[#0EA5E9] bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Printer className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#0F172A] leading-tight">{printer.model}</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />{printer.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
          <span className="text-[10px] capitalize font-medium" style={{ color: statusColor }}>{printer.status}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        {printer.certified ? (
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-medium text-emerald-700">{printer.certBody}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-medium text-amber-600">Uncertified</span>
          </div>
        )}
        <span className="text-[9px] text-slate-400">{printer.tech}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {printer.materials.slice(0, 3).map(m => (
          <span key={m} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{m}</span>
        ))}
        {printer.materials.length > 3 && (
          <span className="text-[9px] text-slate-400">+{printer.materials.length - 3} more</span>
        )}
      </div>
    </div>
  )
}

// ── Printer Picker Card ───────────────────────────────────────────────────────
function PrinterPickerCard({
  center,
  selected,
  onSelect,
  blueprintCert,
}: {
  center: typeof printCenters[0] & { isOnsite?: boolean }
  selected: boolean
  onSelect: (id: string) => void
  blueprintCert?: string | null
}) {
  const statusColor = center.status === 'online' ? '#10b981' : center.status === 'busy' ? '#f59e0b' : '#94a3b8'
  const certMatch = blueprintCert ? center.certification === blueprintCert : null
  const isOnsite = (center as any).isOnsite

  return (
    <div
      onClick={() => center.status !== 'offline' && onSelect(center.id)}
      className={`rounded-xl p-3 cursor-pointer transition-all border-2 ${
        center.status === 'offline' ? 'opacity-40 cursor-not-allowed' : ''
      } ${
        selected
          ? 'border-[#0EA5E9] bg-sky-50'
          : isOnsite
          ? 'border-dashed border-amber-300 bg-amber-50/40 hover:border-amber-400'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {isOnsite
            ? <Printer className="w-4 h-4 text-amber-500 shrink-0" />
            : <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
          }
          <div>
            <p className="text-xs font-bold text-[#0F172A] leading-tight">{center.name}</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />{center.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
          <span className="text-[10px] capitalize font-medium" style={{ color: statusColor }}>{center.status}</span>
        </div>
      </div>

      {/* Certification */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#8b5cf6]" />
          <span className="text-[10px] font-medium text-slate-700">{center.certification}</span>
        </div>
        {certMatch === true && <span className="text-[10px] font-bold text-emerald-600">✓ Match</span>}
        {certMatch === false && <span className="text-[10px] font-bold text-red-500">✗ Mismatch</span>}
      </div>

      {/* Capacity bar (platform centers only) */}
      {!isOnsite && (
        <div className="mb-2">
          <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
            <span>{center.currentJobs} active jobs</span>
            <span>{center.capacity}% capacity</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${center.capacity}%`,
                background: center.capacity > 90 ? '#ef4444' : center.capacity > 70 ? '#f59e0b' : '#10b981',
              }}
            />
          </div>
        </div>
      )}

      {/* On-site warning */}
      {isOnsite && (
        <div className="flex items-center gap-1 mb-2 text-[10px] text-amber-600">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          Parts require independent validation
        </div>
      )}

      {/* Materials */}
      <div className="flex flex-wrap gap-1">
        {center.materials.slice(0, 2).map(m => (
          <span key={m} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{m}</span>
        ))}
        {center.materials.length > 2 && (
          <span className="text-[9px] text-slate-400">+{center.materials.length - 2} more</span>
        )}
      </div>
    </div>
  )
}

// ── Role-specific context config ──────────────────────────────────────────────
const ROLE_CONTEXT = {
  end_user:    { banner: '🧑‍💼 Showing your orders only — submitted by your account', color: 'bg-sky-50 border-sky-200 text-sky-800', canCreate: true,  canAdmin: false },
  print_center:{ banner: '🏭 Showing orders assigned to your print facility', color: 'bg-teal-50 border-teal-200 text-teal-800', canCreate: true,  canAdmin: false },
  oem_partner: { banner: '🔑 Showing all orders — grant or deny OEM IP approvals from the Print Queue tab', color: 'bg-purple-50 border-purple-200 text-purple-800', canCreate: false, canAdmin: false },
  manager:     { banner: '📊 Full order management view — all accounts and facilities', color: 'bg-amber-50 border-amber-200 text-amber-800', canCreate: true,  canAdmin: true  },
  admin:       { banner: '⚙️ Admin view — all orders, full control', color: 'bg-slate-50 border-slate-200 text-slate-700', canCreate: true,  canAdmin: true  },
}

export function OrdersPage({ role = 'admin', onNavigate }: { role?: string; onNavigate?: (tab: string) => void }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPrintConfirmOpen, setIsPrintConfirmOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [tokenVisible, setTokenVisible] = useState<string | null>(null)
  // Print center facility control toggles
  const [showPrinting, setShowPrinting] = useState(true)
  const [showNotPrinting, setShowNotPrinting] = useState(true)

  const [formData, setFormData] = useState({
    partName: '',
    status: 'pending',
    priority: 'medium',
    quantity: 1,
    notes: '',
    blueprintId: '',
    centerId: '',
    printerType: '' as 'platform' | 'onsite' | '',
    onsitePrinterId: '',
    material: '',
  })

  // Lab test request state
  const [isTestRequestOpen, setIsTestRequestOpen] = useState(false)
  const [testRequests, setTestRequests] = useState<Array<{
    id: string
    orderId: string
    testType: string
    partName: string
    samplesCount: number
    notes: string
    status: 'pending' | 'submitted' | 'in_progress' | 'completed'
    submittedAt: string
  }>>([])
  const [testRequestData, setTestRequestData] = useState({
    orderId: '',
    testType: '',
    samplesCount: 3,
    notes: '',
  })

  // Scope data to what this role should see
  const ctx = ROLE_CONTEXT[role as keyof typeof ROLE_CONTEXT] ?? ROLE_CONTEXT.admin
  const scopedOrders = role === 'end_user'
    ? orders.filter(o => o.requesterId === 'user-1')
    : role === 'print_center'
    ? orders.filter(o => o.centerId === 'pc-1' || o.centerId === 'pc-2')
    : orders  // admin / manager / oem_partner see everything

  const filteredOrders = scopedOrders.filter(order => {
    const matchesSearch = order.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: scopedOrders.length,
    pending: scopedOrders.filter(o => o.status === 'pending').length,
    printing: scopedOrders.filter(o => o.status === 'printing').length,
    qualityCheck: scopedOrders.filter(o => o.status === 'quality_check').length,
    shipped: scopedOrders.filter(o => o.status === 'shipped').length,
    delivered: scopedOrders.filter(o => o.status === 'delivered').length,
  }

  const readyToPrint = scopedOrders.filter(o =>
    o.oemApproval.approved && o.certApproval.approved && !o.printAuthToken &&
    !['printing', 'quality_check', 'shipped', 'delivered'].includes(o.status)
  ).length

  const handleCreateOrder = () => {
    if (!formData.partName) {
      toast.error('Part name is required')
      return
    }
    const newOrderNum = Math.max(...orders.map(o => parseInt(o.orderId.split('-')[1]))) + 1
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId: `ORD-${newOrderNum}`,
      partName: formData.partName,
      status: formData.status,
      priority: formData.priority,
      quantity: formData.quantity,
      eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      requesterId: 'user-1',
      blueprintId: formData.blueprintId || null,
      centerId: formData.centerId || null,
      notes: formData.notes || null,
      createdAt: new Date().toISOString(),
      oemApproval: { approved: false, approvedAt: null, approvedBy: null },
      certApproval: { approved: false, approvedAt: null, approvedBy: null },
      printAuthToken: null,
    }
    setOrders([newOrder, ...orders])
    toast.success(`Order ${newOrder.orderId} created — awaiting DRM approvals`)
    setIsCreateOpen(false)
    setFormData({ partName: '', status: 'pending', priority: 'medium', quantity: 1, notes: '', blueprintId: '', centerId: '', printerType: '', onsitePrinterId: '', material: '' })
  }

  const handleDeleteOrder = (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    setOrders(orders.filter(o => o.id !== orderId))
    toast.success('Order deleted')
  }

  const handleSecurePrint = (order: Order) => {
    setSelectedOrder(order)
    setIsPrintConfirmOpen(true)
  }

  const confirmSecurePrint = () => {
    if (!selectedOrder) return
    const token = generatePrintToken()
    setOrders(orders.map(o => {
      if (o.id !== selectedOrder.id) return o
      return { ...o, status: 'printing', printAuthToken: token }
    }))
    setTokenVisible(token)
    setIsPrintConfirmOpen(false)
    toast.success(`Secure Print token issued for ${selectedOrder.orderId}`, {
      description: 'Encrypted G-code streaming to print center. Action logged.',
      duration: 6000,
    })
    // Hide token after 30 seconds
    setTimeout(() => setTokenVisible(null), 30000)
  }

  const handleUpdateOrder = () => {
    if (!selectedOrder) return
    setOrders(orders.map(o => o.id === selectedOrder.id ? selectedOrder : o))
    toast.success(`Order ${selectedOrder.orderId} updated`)
    setIsEditOpen(false)
  }

  const handleSubmitLabTestRequest = () => {
    if (!testRequestData.orderId || !testRequestData.testType) {
      toast.error('Please select an order and test type')
      return
    }
    const order = orders.find(o => o.id === testRequestData.orderId)
    if (!order) return

    const newRequest = {
      id: `test-req-${Date.now()}`,
      orderId: testRequestData.orderId,
      testType: testRequestData.testType,
      partName: order.partName,
      samplesCount: testRequestData.samplesCount,
      notes: testRequestData.notes,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
    }
    setTestRequests([newRequest, ...testRequests])
    toast.success(`Test request submitted for ${order.partName}`, {
      description: `${testRequestData.testType} · Dalhousie AM Lab will contact you within 2 hours`,
      duration: 6000,
    })
    setIsTestRequestOpen(false)
    setTestRequestData({ orderId: '', testType: '', samplesCount: 3, notes: '' })
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Role Context Banner */}
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium ${ctx.color}`}>
        <span>{ctx.banner}</span>
        <span className="ml-auto text-xs opacity-70">{scopedOrders.length} orders in scope</span>
      </div>

      {/* Token Display Banner */}
      {tokenVisible && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl animate-pulse">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-indigo-900">🔑 Secure Print Token Active</p>
            <p className="font-mono text-xs text-indigo-700 mt-0.5">{tokenVisible}</p>
            <p className="text-[10px] text-indigo-400 mt-1">Token auto-expires in 30s · Single-use only · Logged to audit chain</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-indigo-300 text-indigo-700 text-xs"
            onClick={() => setTokenVisible(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Ready to Print Alert */}
      {readyToPrint > 0 && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            {readyToPrint} order{readyToPrint > 1 ? 's' : ''} cleared by OEM & Cert Authority — ready for Secure Print
          </p>
        </div>
      )}

      {/* ── Available Print Centres (end user view) ── */}
      {(role === 'end_user' || role === 'admin') && (
        <div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <Printer className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Available Print Centres
            <span className="ml-auto text-[10px] font-normal text-slate-400 normal-case tracking-normal">
              Select when creating an order — or use your own on-site printer
            </span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
            {printCenters.map(c => {
              const statusColor = c.status === 'online' ? '#10b981' : c.status === 'busy' ? '#f59e0b' : '#94a3b8'
              return (
                <div key={c.id} className={`bg-white rounded-xl border p-3 ${c.status === 'offline' ? 'opacity-50' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-[#0F172A]">{c.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusColor }} />
                      <span className="text-[9px] font-medium" style={{ color: statusColor }}>{c.status}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-0.5 mb-1.5">
                    <MapPin className="w-2.5 h-2.5" />{c.location}
                  </p>
                  <div className="flex items-center gap-1 mb-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#8b5cf6]" />
                    <span className="text-[10px] text-slate-600">{c.certification}</span>
                  </div>
                  {c.status !== 'offline' && (
                    <div>
                      <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
                        <span>{c.activePrinters}/{c.totalPrinters} printers active</span>
                        <span>{c.capacity}%</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.capacity}%`, background: c.capacity > 90 ? '#ef4444' : c.capacity > 70 ? '#f59e0b' : '#10b981' }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Users className="w-2.5 h-2.5 text-slate-400" />
                    <span className="text-[9px] text-slate-400">{c.contactName}</span>
                  </div>
                </div>
              )
            })}
            {/* On-site option */}
            <div className="bg-amber-50/60 rounded-xl border-2 border-dashed border-amber-300 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-amber-800">On-Site Printer</p>
                <span className="text-[9px] font-medium text-emerald-600">● Available</span>
              </div>
              <p className="text-[10px] text-amber-700 mb-1.5">Use your own facility printer for on-demand parts</p>
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] text-amber-600">Cert validation may apply</span>
              </div>
              <p className="text-[9px] text-amber-500">DRM token routed to your machine</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
            <p className="text-xs text-slate-500">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-600">{stats.pending}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#0EA5E9]">{stats.printing}</p>
            <p className="text-xs text-slate-500">Printing</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#F59E0B]">{stats.qualityCheck}</p>
            <p className="text-xs text-slate-500">Quality Check</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#14B8A6]">{stats.shipped}</p>
            <p className="text-xs text-slate-500">Shipped</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            <p className="text-xs text-slate-500">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusFlow.map((status) => (
              <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36 bg-white border-slate-200">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        {ctx.canCreate && (
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
        )}
      </div>

      {/* ── Financial Summary Bar ── */}
      {(() => {
        const totals = filteredOrders.reduce((acc, o) => {
          const f = getOrderFinancials(o)
          return { value: acc.value + f.orderValue, oem: acc.oem + f.oemRoyalty, fee: acc.fee + f.platformFee, print: acc.print + f.printCost }
        }, { value: 0, oem: 0, fee: 0, print: 0 })
        return (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
            <div className="flex flex-wrap items-center gap-4 px-5 py-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>💰 Revenue ({filteredOrders.length} orders)</span>
              {[
                { label: 'Total Value',    val: totals.value, color: '#06b6d4' },
                { label: 'Print Centres',  val: totals.print, color: '#10b981' },
                { label: 'OEM Royalties',  val: totals.oem,   color: '#8b5cf6' },
                { label: 'Platform Fees',  val: totals.fee,   color: '#0ea5e9' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[10px] font-semibold text-white">${item.val.toLocaleString('en-US')}</span>
                  <span className="text-[9px]" style={{ color: '#64748b' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Orders Table / Sections */}
      {role === 'print_center' && (
        <>
          {/* Printing Control Buttons — Print Facility Only */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setShowPrinting(!showPrinting)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                showPrinting
                  ? 'bg-[#0EA5E9] text-white shadow-lg'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <Printer className="w-4 h-4" />
              {showPrinting ? '✓ Printing' : '○ Printing'}
            </Button>
            <Button
              onClick={() => setShowNotPrinting(!showNotPrinting)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                showNotPrinting
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <Package className="w-4 h-4" />
              {showNotPrinting ? '✓ Not Printing' : '○ Not Printing'}
            </Button>
          </div>

          {/* Printing Orders Section */}
          {showPrinting && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#0EA5E9] rounded" />
                <h3 className="text-lg font-bold text-[#0F172A]">Currently Printing</h3>
                <Badge className="bg-[#0EA5E9] text-white">{filteredOrders.filter(o => o.status === 'printing').length}</Badge>
              </div>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold text-[#0F172A]">Order</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Part Name</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Priority</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Qty</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">ETA</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.filter(o => o.status === 'printing').map((order) => {
                        const blueprint = blueprints.find(b => b.id === order.blueprintId)
                        return (
                          <TableRow key={order.id} className="hover:bg-slate-50">
                            <TableCell>
                              <span className="font-mono text-sm font-medium text-[#0EA5E9]">{order.orderId}</span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-[#0F172A]">{order.partName}</p>
                                {blueprint && <p className="text-xs text-slate-500">{blueprint.blueprintId}</p>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[order.status]}>
                                {statusLabels[order.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={priorityColors[order.priority]}>
                                {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[#0F172A]">{order.quantity}</TableCell>
                            <TableCell className="text-slate-500">
                              {order.eta ? new Date(order.eta).toLocaleDateString() : 'TBD'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedOrder({ ...order, blueprint })
                                    setIsViewOpen(true)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Not Printing Orders Section */}
          {showNotPrinting && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-amber-500 rounded" />
                <h3 className="text-lg font-bold text-[#0F172A]">Awaiting Print / Pending</h3>
                <Badge className="bg-amber-500 text-white">{filteredOrders.filter(o => o.status !== 'printing' && !['shipped', 'delivered'].includes(o.status)).length}</Badge>
              </div>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold text-[#0F172A]">Order</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Part Name</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Priority</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Qty</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">DRM Approvals</TableHead>
                        <TableHead className="font-semibold text-[#0F172A]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.filter(o => o.status !== 'printing' && !['shipped', 'delivered'].includes(o.status)).map((order) => {
                        const blueprint = blueprints.find(b => b.id === order.blueprintId)
                        return (
                          <TableRow key={order.id} className="hover:bg-slate-50">
                            <TableCell>
                              <span className="font-mono text-sm font-medium text-[#0EA5E9]">{order.orderId}</span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-[#0F172A]">{order.partName}</p>
                                {blueprint && <p className="text-xs text-slate-500">{blueprint.blueprintId}</p>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[order.status]}>
                                {statusLabels[order.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={priorityColors[order.priority]}>
                                {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[#0F172A]">{order.quantity}</TableCell>
                            <TableCell>
                              <ApprovalStepperMini order={order} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedOrder({ ...order, blueprint })
                                    setIsViewOpen(true)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Standard Orders Table — For non-print-center roles */}
      {role !== 'print_center' && (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-[#0F172A]">Order</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Part Name</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Pipeline Stage</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Priority</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Qty</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Value</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">DRM Approvals</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">ETA</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const blueprint = blueprints.find(b => b.id === order.blueprintId)
                const center = printCenters.find(c => c.id === order.centerId)
                const requester = users.find(u => u.id === order.requesterId)
                const fullyApproved = order.oemApproval.approved && order.certApproval.approved
                const canSecurePrint = fullyApproved && !order.printAuthToken &&
                  !['printing', 'quality_check', 'shipped', 'delivered'].includes(order.status)

                const pipelineStage = getPipelineStage(order)
                const fin = getOrderFinancials(order)
                return (
                  <TableRow key={order.id} className="hover:bg-slate-50">
                    <TableCell>
                      <span className="font-mono text-sm font-medium text-[#0EA5E9]">{order.orderId}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#0F172A]">{order.partName}</p>
                        {blueprint && (
                          <p className="text-xs text-slate-500">{blueprint.blueprintId}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: `${pipelineStage.color}15`,
                          border: `1px solid ${pipelineStage.color}40`,
                          color: pipelineStage.color,
                        }}
                      >
                        <span>{pipelineStage.emoji}</span>
                        <span>Stage {pipelineStage.num}</span>
                        <span className="font-normal opacity-75">· {pipelineStage.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[order.priority]}>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#0F172A]">{order.quantity}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">${fin.orderValue.toLocaleString('en-US')}</p>
                        <p className="text-[9px] text-slate-400">
                          OEM ${fin.oemRoyalty.toLocaleString('en-US')} · Fee ${fin.platformFee.toLocaleString('en-US')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ApprovalStepperMini order={order} />
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {order.status === 'delivered' ? 'Delivered' : order.eta ? new Date(order.eta).toLocaleDateString() : 'TBD'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedOrder({ ...order, blueprint, center, requester })
                            setIsViewOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedOrder({ ...order, blueprint, center, requester })
                            setIsEditOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* Secure Print Button */}
                        {canSecurePrint ? (
                          <Button
                            size="icon"
                            className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => handleSecurePrint(order)}
                            title="Issue Secure Print Token"
                          >
                            <KeyRound className="w-4 h-4" />
                          </Button>
                        ) : order.printAuthToken ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-500 cursor-default"
                            title="Print token already issued"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        ) : !fullyApproved ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-300 cursor-not-allowed"
                            title="Awaiting OEM & Cert Authority approvals"
                            disabled
                          >
                            <Lock className="w-4 h-4" />
                          </Button>
                        ) : null}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lab Testing & Certification Services */}
      {(role === 'end_user' || role === 'admin') && (
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
      )}

      {/* Request Lab Test Section */}
      {(role === 'end_user' || role === 'admin') && (
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              Request Lab Testing for Your Parts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-3">
                  Submit your printed parts for professional lab testing. Select an order and choose which test you need.
                </p>
                <Button
                  onClick={() => setIsTestRequestOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Request a Test
                </Button>
              </div>

              {/* Test Requests List */}
              {testRequests.length > 0 && (
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">Recent Requests</h4>
                  <div className="space-y-2">
                    {testRequests.slice(0, 3).map((req) => (
                      <div key={req.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{req.partName}</p>
                            <p className="text-xs text-slate-600">{req.testType}</p>
                          </div>
                          <Badge
                            className={`text-xs shrink-0 ${
                              req.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : req.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {req.status === 'completed'
                              ? '✓ Done'
                              : req.status === 'in_progress'
                              ? '⏳ Testing'
                              : req.status === 'submitted'
                              ? '📤 Sent'
                              : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Order Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create and Submit Order</DialogTitle>
            <DialogDescription>Define your part, configure approvals, assign to a printer, and print.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-2">

            {/* ─ PART DETAILS ─ */}
            <div className="space-y-3 pb-4 border-b border-slate-200">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                📋 Part Details
              </h3>
              <div className="space-y-2">
                <Label>Part Name *</Label>
                <Input
                  placeholder="e.g., Hydraulic Valve Body"
                  value={formData.partName}
                  onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number" min={1} value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Blueprint (Optional)</Label>
                <Select value={formData.blueprintId} onValueChange={(v) => setFormData({ ...formData, blueprintId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select blueprint" /></SelectTrigger>
                  <SelectContent>
                    {blueprints.filter(b => b.status === 'active').map((bp) => (
                      <SelectItem key={bp.id} value={bp.id}>
                        {bp.blueprintId} — {bp.name} · {bp.certification}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.blueprintId && (() => {
                  const bp = blueprints.find(b => b.id === formData.blueprintId)
                  return bp ? (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#8b5cf6]" />
                      Requires <span className="font-semibold">{bp.certification}</span> certified print facility
                    </p>
                  ) : null
                })()}
              </div>
            </div>


            {/* ─ PRINTER ASSIGNMENT ─ */}
            <div>
              {role === 'print_center' ? (
                // Print Center: Select from their own facility printers
                <>
                  <h3 className="font-semibold text-[#0F172A] flex items-center gap-2 mb-3">
                    <Printer className="w-4 h-4" /> Assign to Printer
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">Choose which printer at your facility will handle this job</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {ON_SITE_PRINTERS.map(printer => (
                      <OnSitePrinterCard
                        key={printer.id}
                        printer={printer}
                        selected={formData.onsitePrinterId === printer.id}
                        onSelect={(id) => setFormData({ ...formData, onsitePrinterId: id, material: '' })}
                      />
                    ))}
                  </div>
                  {formData.onsitePrinterId && (() => {
                    const p = ON_SITE_PRINTERS.find(x => x.id === formData.onsitePrinterId)
                    if (!p) return null
                    return !p.certified ? (
                      <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-xs text-amber-800 flex items-start gap-1.5 mb-4">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        This printer is uncertified — parts will require independent lab validation before use.
                      </div>
                    ) : null
                  })()}

                  {/* Material selector for print center */}
                  {formData.onsitePrinterId && (() => {
                    const p = ON_SITE_PRINTERS.find(x => x.id === formData.onsitePrinterId)
                    if (!p) return null
                    return (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5 mb-2">
                          🧪 Select Material
                        </Label>
                        <Select value={formData.material} onValueChange={(v) => setFormData({ ...formData, material: v })}>
                          <SelectTrigger className="bg-white"><SelectValue placeholder="Choose material..." /></SelectTrigger>
                          <SelectContent>
                            {p.materials.map(m => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!formData.material && <p className="text-[10px] text-amber-600">Select a material to continue</p>}
                      </div>
                    )
                  })()}
                </>
              ) : (
                // End user / Admin: Toggle between platform and on-site
                <>
                  <h3 className="font-semibold text-[#0F172A] flex items-center gap-2 mb-3">
                    <Printer className="w-4 h-4" /> Assign to Printer
                  </h3>

                  {/* Toggle: Platform / On-site */}
                  <div className="flex gap-2 mb-3">
                    {(['platform', 'onsite'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, printerType: type, centerId: '' })}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-2 transition-all ${
                          formData.printerType === type
                            ? type === 'platform'
                              ? 'border-[#0EA5E9] bg-sky-50 text-[#0EA5E9]'
                              : 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {type === 'platform' ? '🏭 Platform Print Centres' : '🏠 Use On-Site Printer'}
                      </button>
                    ))}
                  </div>

                  {/* Platform centres card grid */}
                  {formData.printerType === 'platform' && (() => {
                    const selectedBp = blueprints.find(b => b.id === formData.blueprintId)
                    return (
                      <div className="grid grid-cols-2 gap-2">
                        {printCenters.map(center => (
                          <PrinterPickerCard
                            key={center.id}
                            center={center}
                            selected={formData.centerId === center.id}
                            onSelect={(id) => setFormData({ ...formData, centerId: id, material: '' })}
                            blueprintCert={selectedBp?.certification}
                          />
                        ))}
                      </div>
                    )
                  })()}

                  {/* On-site printer picker */}
                  {formData.printerType === 'onsite' && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500">Select one of your registered on-site printers — DRM token will be routed to that machine.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {ON_SITE_PRINTERS.map(p => (
                          <OnSitePrinterCard
                            key={p.id}
                            printer={p}
                            selected={formData.onsitePrinterId === p.id}
                            onSelect={(id) => setFormData({ ...formData, onsitePrinterId: id, material: '' })}
                          />
                        ))}
                      </div>
                      {formData.onsitePrinterId && (() => {
                        const p = ON_SITE_PRINTERS.find(x => x.id === formData.onsitePrinterId)
                        if (!p) return null
                        return !p.certified ? (
                          <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-xs text-amber-800 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            This printer is uncertified — parts will require independent lab validation before use.
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}

                  {/* No selection yet hint */}
                  {!formData.printerType && (
                    <p className="text-xs text-slate-400 text-center py-3">
                      Select a printing location above to continue
                    </p>
                  )}

                  {/* ── Material selector — shown after any printer is chosen ── */}
                  {(() => {
                    const materials =
                      formData.printerType === 'platform'
                        ? printCenters.find(c => c.id === formData.centerId)?.materials ?? []
                        : formData.printerType === 'onsite'
                        ? ON_SITE_PRINTERS.find(p => p.id === formData.onsitePrinterId)?.materials ?? []
                        : []
                    if (materials.length === 0) return null
                    return (
                      <div className="space-y-2 pt-3">
                        <Label className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
                          🧪 Print Material
                        </Label>
                        <p className="text-[10px] text-slate-400 -mt-1">
                          {formData.printerType === 'platform'
                            ? `Available at ${printCenters.find(c => c.id === formData.centerId)?.name}`
                            : `Compatible with ${ON_SITE_PRINTERS.find(p => p.id === formData.onsitePrinterId)?.model}`
                          }
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {materials.map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setFormData({ ...formData, material: m })}
                              className={`text-xs px-3 py-1.5 rounded-lg border-2 font-medium transition-all ${
                                formData.material === m
                                  ? 'border-[#0EA5E9] bg-sky-50 text-[#0EA5E9]'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                        {!formData.material && (
                          <p className="text-[10px] text-amber-600">Select a material to continue</p>
                        )}
                      </div>
                    )
                  })()}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg text-xs text-indigo-700 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              Once printed, order enters the DRM pipeline. OEM IP license and Cert Authority approvals will be reviewed.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrder} className="bg-[#10B981] text-white hover:bg-emerald-600">
              <Printer className="w-4 h-4 mr-2" /> Order Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-mono text-lg font-bold text-[#0EA5E9]">{selectedOrder.orderId}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.partName}</p>
                </div>
                <Badge className={statusColors[selectedOrder.status]}>
                  {statusLabels[selectedOrder.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Priority</Label>
                  <p><Badge className={priorityColors[selectedOrder.priority]}>{selectedOrder.priority}</Badge></p>
                </div>
                <div>
                  <Label className="text-slate-500">Quantity</Label>
                  <p className="font-medium">{selectedOrder.quantity}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Requester</Label>
                  <p className="font-medium">{selectedOrder.requester?.name || 'Unknown'}</p>
                </div>
                <div>
                  <Label className="text-slate-500">ETA</Label>
                  <p className="font-medium">{selectedOrder.eta ? new Date(selectedOrder.eta).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
              {selectedOrder.blueprint && (
                <div>
                  <Label className="text-slate-500">Blueprint</Label>
                  <p className="font-medium">{selectedOrder.blueprint.blueprintId} - {selectedOrder.blueprint.name}</p>
                </div>
              )}
              {selectedOrder.center && (
                <div>
                  <Label className="text-slate-500">Print Center</Label>
                  <p className="font-medium">{selectedOrder.center.name} ({selectedOrder.center.location})</p>
                </div>
              )}

              {/* Financial Breakdown */}
              {(() => {
                const f = getOrderFinancials(selectedOrder)
                return (
                  <div className="rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest px-4 pt-3 pb-2" style={{ color: '#64748b' }}>
                      💰 Transaction Breakdown
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 px-4 pb-3">
                      {[
                        { label: 'Order Value',    val: f.orderValue,   color: '#06b6d4', sub: '100% — total paid by customer' },
                        { label: 'Print Centre',   val: f.printCost,    color: '#10b981', sub: '75% — manufacturing cost' },
                        { label: 'OEM IP Royalty', val: f.oemRoyalty,   color: '#8b5cf6', sub: '15% — IP licence fee' },
                        { label: 'Platform Fee',   val: f.platformFee,  color: '#0ea5e9', sub: '10% — AddManuChain' },
                      ].map((row, i) => (
                        <div key={i} className="rounded-lg px-3 py-2" style={{ background: `${row.color}10`, border: `1px solid ${row.color}20` }}>
                          <p className="text-sm font-bold" style={{ color: row.color }}>${row.val.toLocaleString('en-US')}</p>
                          <p className="text-[10px] font-semibold text-white leading-tight">{row.label}</p>
                          <p className="text-[9px]" style={{ color: '#64748b' }}>{row.sub}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 pb-3">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div style={{ width: '75%', background: '#10b981' }} />
                        <div style={{ width: '15%', background: '#8b5cf6' }} />
                        <div style={{ width: '10%', background: '#0ea5e9' }} />
                      </div>
                      <div className="flex justify-between text-[8px] mt-1" style={{ color: '#64748b' }}>
                        <span>Print Centre 75%</span><span>OEM 15%</span><span>Platform 10%</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* DRM Pipeline */}
              <div>
                <Label className="text-slate-500 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  DRM Approval Pipeline
                </Label>
                <ApprovalTimeline order={selectedOrder} />
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label className="text-slate-500">Notes</Label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(v) => setSelectedOrder({ ...selectedOrder, status: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusFlow.map((status) => (
                      <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={selectedOrder.priority}
                  onValueChange={(v) => setSelectedOrder({ ...selectedOrder, priority: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={selectedOrder.notes || ''}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateOrder} className="bg-[#0EA5E9]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secure Print Confirmation Dialog */}
      <Dialog open={isPrintConfirmOpen} onOpenChange={setIsPrintConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              Issue Secure Print Token
            </DialogTitle>
            <DialogDescription>
              This action is irreversible and will be permanently logged in the audit chain.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Order</span>
                  <span className="font-mono font-bold text-[#0EA5E9]">{selectedOrder.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Part</span>
                  <span className="font-medium">{selectedOrder.partName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Quantity</span>
                  <span className="font-medium">{selectedOrder.quantity} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Print Center</span>
                  <span className="font-medium">{selectedOrder.center?.name || 'TBD'}</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> OEM IP License: {selectedOrder.oemApproval?.approvedBy}
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cert Verified: {selectedOrder.certApproval?.approvedBy}
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-xs text-indigo-800">
                <p className="font-semibold mb-1">⚡ What happens next:</p>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>A one-time decryption token is generated</li>
                  <li>Encrypted G-code streams directly to the printer</li>
                  <li>Token invalidates after single print job</li>
                  <li>Event logged to immutable audit chain</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmSecurePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Issue Token & Start Secure Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lab Test Request Dialog */}
      <Dialog open={isTestRequestOpen} onOpenChange={setIsTestRequestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600" />
              Request Lab Test
            </DialogTitle>
            <DialogDescription>
              Submit your printed parts for professional testing at Dalhousie AM Lab
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Order Selection */}
            <div className="space-y-2">
              <Label className="font-semibold">Select Order *</Label>
              <Select
                value={testRequestData.orderId}
                onValueChange={(v) => setTestRequestData({ ...testRequestData, orderId: v })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Choose an order..." />
                </SelectTrigger>
                <SelectContent>
                  {scopedOrders
                    .filter(o => ['delivered', 'shipped', 'quality_check', 'printing'].includes(o.status))
                    .map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.orderId} · {order.partName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Only orders in printing, testing, or shipping stages
              </p>
            </div>

            {/* Test Type Selection */}
            <div className="space-y-2">
              <Label className="font-semibold">Test Type *</Label>
              <Select
                value={testRequestData.testType}
                onValueChange={(v) => setTestRequestData({ ...testRequestData, testType: v })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Choose test type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mechanical Testing">Mechanical Testing</SelectItem>
                  <SelectItem value="Non-Destructive Testing (NDT)">Non-Destructive Testing (NDT)</SelectItem>
                  <SelectItem value="Chemical Analysis">Chemical Analysis</SelectItem>
                  <SelectItem value="Dimensional Verification">Dimensional Verification</SelectItem>
                  <SelectItem value="Fatigue Testing">Fatigue Testing</SelectItem>
                  <SelectItem value="Thermal Analysis">Thermal Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sample Count */}
            <div className="space-y-2">
              <Label className="font-semibold">Number of Samples</Label>
              <Select
                value={testRequestData.samplesCount.toString()}
                onValueChange={(v) => setTestRequestData({ ...testRequestData, samplesCount: parseInt(v) })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 sample</SelectItem>
                  <SelectItem value="2">2 samples</SelectItem>
                  <SelectItem value="3">3 samples</SelectItem>
                  <SelectItem value="4">4 samples</SelectItem>
                  <SelectItem value="5">5 samples</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                3-5 samples recommended for reliable results
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="font-semibold">Additional Notes</Label>
              <Textarea
                placeholder="e.g., Material cert attached, specific tolerances to verify, etc."
                rows={3}
                value={testRequestData.notes}
                onChange={(e) => setTestRequestData({ ...testRequestData, notes: e.target.value })}
                className="border-slate-200"
              />
            </div>

            {/* Info Box */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-medium text-purple-900 mb-1">📋 Next Steps:</p>
              <ul className="text-xs text-purple-700 space-y-0.5 list-disc list-inside">
                <li>Lab contacts you within 2 hours</li>
                <li>Arrange sample shipping</li>
                <li>Testing begins upon receipt</li>
                <li>Report delivered in 5-7 business days</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsTestRequestOpen(false)
              setTestRequestData({ orderId: '', testType: '', samplesCount: 3, notes: '' })
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitLabTestRequest}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Submit Test Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
