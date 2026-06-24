'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    KeyRound,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    Clock,
    Lock,
    Unlock,
    Building2,
    Award,
    Package,
    Zap,
    AlertTriangle,
    Eye,
    Filter,
    X,
} from 'lucide-react'
import { toast } from 'sonner'
import { orders as initialOrders, blueprints, printCenters, Order, getOrderFinancials } from '@/lib/static-data'

// Denial reason codes
const DENIAL_REASONS = [
    { code: 'material_untested', label: '🧪 Material Untested', description: 'This material-facility combination has not been qualified' },
    { code: 'facility_uncertified', label: '🏭 Facility Uncertified', description: 'Print center does not hold required certification' },
    { code: 'qualification_expired', label: '⏰ Qualification Expired', description: 'Material certification has expired' },
    { code: 'safety_concern', label: '⚠️ Safety Concern', description: 'Potential safety or compliance issue identified' },
    { code: 'incomplete_documentation', label: '📄 Incomplete Documentation', description: 'Missing required technical documentation' },
]

// Approval pipeline steps
const PIPELINE_STEPS = [
    { id: 'submitted', label: 'Request Submitted', icon: Package, description: 'Customer submitted a print request' },
    { id: 'oem', label: 'OEM Approved', icon: Building2, description: 'OEM grants IP license for blueprint' },
    { id: 'cert', label: 'Cert Verified', icon: Award, description: 'Certification authority clears print center' },
    { id: 'token', label: 'Print Token Issued', icon: KeyRound, description: 'Secure one-time decryption key issued' },
]

function getPipelineStep(order: Order): number {
    if (order.printAuthToken) return 4
    if (order.certApproval.approved && order.oemApproval.approved) return 2
    if (order.certApproval.approved || order.oemApproval.approved) return 1
    return 0
}

// Calculate risk level for certification authority
function calculateRiskLevel(order: Order): 'low' | 'medium' | 'high' {
    let riskScore = 0
    
    // Quantity risk
    if (order.quantity > 5) riskScore += 2
    else if (order.quantity > 2) riskScore += 1
    
    // Priority risk
    if (order.priority === 'high') riskScore += 2
    
    // Material untested with facility combo (arbitrary: don't approve orders missing OEM approval yet)
    if (!order.oemApproval.approved) riskScore += 3
    
    if (riskScore >= 5) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
}

function ApprovalStepper({ order }: { order: Order }) {
    const step = getPipelineStep(order)
    return (
        <div className="flex items-center gap-0 w-full">
            {PIPELINE_STEPS.map((s, idx) => {
                const Icon = s.icon
                const done = idx < step || (idx === 3 && order.printAuthToken)
                const active = idx === step && idx < 3
                return (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                    active ? 'bg-[#0EA5E9] text-white animate-pulse' :
                                        'bg-slate-200 text-slate-400'
                                }`}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span className={`text-[10px] font-medium text-center w-16 leading-tight ${done ? 'text-emerald-600' : active ? 'text-[#0EA5E9]' : 'text-slate-400'
                                }`}>{s.label}</span>
                        </div>
                        {idx < 3 && (
                            <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${idx < step ? 'bg-emerald-400' : 'bg-slate-200'
                                }`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

interface ApprovalCardProps {
    order: Order
    type: 'oem' | 'cert'
    onApprove: (orderId: string, type: 'oem' | 'cert') => void
    onDeny?: (orderId: string, type: 'oem' | 'cert') => void
    riskLevel?: 'low' | 'medium' | 'high'
}

function ApprovalCard({ order, type, onApprove, onDeny, riskLevel }: ApprovalCardProps) {
    const blueprint = blueprints.find(b => b.id === order.blueprintId)
    const center = printCenters.find(c => c.id === order.centerId)
    const approval = type === 'oem' ? order.oemApproval : order.certApproval

    const certMatch = center && blueprint && center.certification === blueprint.certification
    const canApprove = type === 'cert' ? certMatch !== false : true

    return (
        <Card className={`border-2 transition-all duration-300 ${approval.approved
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-slate-200 bg-white hover:border-[#0EA5E9]/30 hover:shadow-md'
            }`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-bold text-[#0EA5E9]">{order.orderId}</span>
                            <Badge className={
                                order.priority === 'high' ? 'bg-red-100 text-red-600 text-xs' :
                                    order.priority === 'medium' ? 'bg-amber-100 text-amber-600 text-xs' :
                                        'bg-slate-100 text-slate-500 text-xs'
                            }>
                                {order.priority}
                            </Badge>
                            {riskLevel && (
                                <Badge className={
                                    riskLevel === 'high' ? 'bg-red-100 text-red-600 text-xs' :
                                    riskLevel === 'medium' ? 'bg-amber-100 text-amber-600 text-xs' :
                                    'bg-emerald-100 text-emerald-600 text-xs'
                                }>
                                    {riskLevel === 'high' ? 'High Risk' : riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
                                </Badge>
                            )}
                        </div>
                        <p className="font-semibold text-[#0F172A] text-sm">{order.partName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Qty: {order.quantity} · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${approval.approved ? 'bg-emerald-500' : 'bg-slate-100'
                        }`}>
                        {approval.approved
                            ? <ShieldCheck className="w-5 h-5 text-white" />
                            : <Lock className="w-5 h-5 text-slate-400" />
                        }
                    </div>
                </div>

                {/* Blueprint & Center info */}
                <div className="space-y-1.5 mb-3">
                    {blueprint && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                            <KeyRound className="w-3 h-3 text-[#0EA5E9]" />
                            <span className="font-medium">{blueprint.blueprintId}</span>
                            <span className="text-slate-400">·</span>
                            <span>{blueprint.name}</span>
                            {type === 'oem' && (
                                <Badge className="ml-auto bg-purple-100 text-purple-700 text-[10px]">{blueprint.oem}</Badge>
                            )}
                        </div>
                    )}
                    {center && (
                        <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${type === 'cert'
                                ? certMatch
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-red-50 text-red-600'
                                : 'bg-slate-50 text-slate-600'
                            }`}>
                            <Building2 className="w-3 h-3" />
                            <span className="font-medium">{center.name}</span>
                            <span className="text-slate-400">·</span>
                            <span>{center.certification}</span>
                            {type === 'cert' && (
                                <Badge className={`ml-auto text-[10px] ${certMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {certMatch ? '✓ Match' : '✗ Mismatch'}
                                </Badge>
                            )}
                        </div>
                    )}
                    {/* OEM-specific expanded IP details */}
                    {type === 'oem' && blueprint && (
                        <div className="rounded-lg border border-purple-100 bg-purple-50/40 px-3 py-2.5 space-y-2">
                            <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">IP License Details</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div className="text-slate-500">Material</div>
                                <div className="font-medium text-[#0F172A]">{blueprint.material}</div>
                                <div className="text-slate-500">Tolerance</div>
                                <div className="font-medium text-[#0F172A]">{blueprint.tolerance ?? '±0.2 mm'}</div>
                                <div className="text-slate-500">Cert Required</div>
                                <div className="font-medium text-[#0F172A]">{blueprint.certification}</div>
                                <div className="text-slate-500">License Type</div>
                                <div className="font-medium text-[#0F172A]">Single-use token</div>
                                <div className="text-slate-500">Royalty Rate</div>
                                <div className="font-medium text-purple-700">15% of order value</div>
                                <div className="text-slate-500">Print Qty</div>
                                <div className="font-medium text-[#0F172A]">{order.quantity} unit{order.quantity > 1 ? 's' : ''}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Financial stake */}
                {(() => {
                  const f = getOrderFinancials(order)
                  return (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg mb-2"
                      style={{ background: type === 'oem' ? 'rgba(139,92,246,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${type === 'oem' ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                      <span className="text-xs font-medium" style={{ color: type === 'oem' ? '#8b5cf6' : '#10b981' }}>
                        {type === 'oem' ? '💰 OEM Royalty Earned' : '🏭 Print Centre Revenue'}
                      </span>
                      <span className="text-sm font-bold" style={{ color: type === 'oem' ? '#8b5cf6' : '#10b981' }}>
                        ${(type === 'oem' ? f.oemRoyalty : f.printCost).toLocaleString('en-US')}
                      </span>
                    </div>
                  )
                })()}

                {/* Other approval status */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    {type === 'cert' ? (
                        <>
                            <Building2 className="w-3 h-3" />
                            <span>OEM:</span>
                            {order.oemApproval.approved
                                ? <span className="text-emerald-600 font-medium">✓ {order.oemApproval.approvedBy?.split('(')[0].trim()}</span>
                                : <span className="text-amber-500 font-medium">⏳ Awaiting OEM</span>
                            }
                        </>
                    ) : (
                        <>
                            <Award className="w-3 h-3" />
                            <span>Cert Auth:</span>
                            {order.certApproval.approved
                                ? <span className="text-emerald-600 font-medium">✓ {order.certApproval.approvedBy?.split('(')[0].trim()}</span>
                                : <span className="text-amber-500 font-medium">⏳ Awaiting</span>
                            }
                        </>
                    )}
                </div>

                {/* Action */}
                {approval.approved ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved by <strong>{approval.approvedBy}</strong></span>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onApprove(order.id, type)}
                            disabled={!canApprove}
                            className={`flex-1 text-sm ${canApprove
                                    ? type === 'oem'
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {!canApprove ? (
                                <><AlertTriangle className="w-4 h-4 mr-2" />Cert Mismatch</>
                            ) : type === 'oem' ? (
                                <><Building2 className="w-4 h-4 mr-2" />Approve</>
                            ) : (
                                <><Award className="w-4 h-4 mr-2" />Approve</>
                            )}
                        </Button>
                        {onDeny && (
                            <Button
                                onClick={() => onDeny(order.id, type)}
                                variant="outline"
                                className="text-sm text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function PrintApprovalPage({ role = 'admin' }: { role?: string }) {
    const [orders, setOrders] = useState(initialOrders)
    const [viewOrder, setViewOrder] = useState<Order | null>(null)
    const [approvingOrder, setApprovingOrder] = useState<{ id: string; type: 'oem' | 'cert'; denyReason?: string } | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isDenyOpen, setIsDenyOpen] = useState(false)
    const [denyReason, setDenyReason] = useState<string>('')
    const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
    const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(new Set())

    // Role-specific queue scoping:
    // oem_partner sees only items needing OEM sign-off
    // cert_authority sees only items needing cert sign-off
    // print_center sees items at their facility ready for token issuance
    const scopedForOEM  = orders.filter(o => !o.oemApproval.approved && !['delivered'].includes(o.status))
    const scopedForCert = orders.filter(o => !o.certApproval.approved && !['delivered'].includes(o.status))

    const pendingOEM  = role === 'oem_partner'    ? scopedForOEM  : orders.filter(o => !o.oemApproval.approved && !['delivered'].includes(o.status))
    let pendingCert = role === 'cert_authority' ? scopedForCert : orders.filter(o => !o.certApproval.approved && !['delivered'].includes(o.status))
    
    // Apply risk filter to cert authority queue
    if (role === 'cert_authority' && riskFilter !== 'all') {
        pendingCert = pendingCert.filter(o => calculateRiskLevel(o) === riskFilter)
    }
    
    const readyToPrint = orders.filter(o => o.oemApproval.approved && o.certApproval.approved && !o.printAuthToken && !['printing','quality_check','shipped','delivered'].includes(o.status))

    const handleApproveClick = (orderId: string, type: 'oem' | 'cert') => {
        setApprovingOrder({ id: orderId, type })
        setIsConfirmOpen(true)
    }

    const handleDenyClick = (orderId: string, type: 'oem' | 'cert') => {
        setApprovingOrder({ id: orderId, type })
        setDenyReason('')
        setIsDenyOpen(true)
    }

    const handleConfirmDenial = () => {
        if (!approvingOrder || !denyReason) {
            toast.error('Please select a reason for denial')
            return
        }
        
        const reason = DENIAL_REASONS.find(r => r.code === denyReason)
        toast.error(`Order denied: ${reason?.label}`, { description: 'Recorded in audit log.' })
        setIsDenyOpen(false)
        setApprovingOrder(null)
        setDenyReason('')
    }

    const handleBulkApprove = () => {
        if (selectedForBulk.size === 0) return
        
        setOrders(prev => prev.map(o => {
            if (!selectedForBulk.has(o.id)) return o
            const now = new Date().toISOString()
            if (approvingOrder?.type === 'oem') {
                return { ...o, oemApproval: { approved: true, approvedAt: now, approvedBy: 'OEM Partner (Baker Hughes)' } }
            } else {
                return { ...o, certApproval: { approved: true, approvedAt: now, approvedBy: "Cert Authority (Lloyd's Register)" } }
            }
        }))
        
        toast.success(`Bulk approved ${selectedForBulk.size} orders`, { description: 'All changes recorded in audit log.' })
        setSelectedForBulk(new Set())
    }

    const handleConfirmApproval = () => {
        if (!approvingOrder) return
        const { id, type } = approvingOrder
        const now = new Date().toISOString()

        setOrders(prev => prev.map(o => {
            if (o.id !== id) return o
            if (type === 'oem') {
                return { ...o, oemApproval: { approved: true, approvedAt: now, approvedBy: 'OEM Partner (Baker Hughes)' } }
            } else {
                return { ...o, certApproval: { approved: true, approvedAt: now, approvedBy: "Cert Authority (Lloyd's Register)" } }
            }
        }))

        const order = orders.find(o => o.id === id)
        if (type === 'oem') {
            toast.success(`IP License granted for ${order?.orderId}`, { description: 'OEM approval recorded in audit log.' })
        } else {
            toast.success(`Print Center authorized for ${order?.orderId}`, { description: 'Certification check passed. Recorded in audit log.' })
        }

        setIsConfirmOpen(false)
        setApprovingOrder(null)
    }

    const approvingOrderData = approvingOrder ? orders.find(o => o.id === approvingOrder.id) : null

    return (
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Role Context Banner */}
            {role === 'oem_partner' && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-purple-50 border-purple-200 text-purple-800 text-sm font-medium">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span>IP License Queue — {scopedForOEM.length} orders awaiting your OEM approval. Review and grant IP licenses below.</span>
                </div>
            )}
            {role === 'cert_authority' && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-sm font-medium">
                    <Award className="w-4 h-4 flex-shrink-0" />
                    <span>Certification Queue — {scopedForCert.length} orders awaiting your facility authorization.</span>
                </div>
            )}
            {role === 'print_center' && (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-teal-50 border-teal-200 text-teal-800 text-sm font-medium">
                    <KeyRound className="w-4 h-4 flex-shrink-0" />
                    <span>Your Print Queue — {readyToPrint.length} orders fully approved and ready to issue secure print tokens.</span>
                </div>
            )}

            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-xs font-medium">OEM Pending</p>
                                <p className="text-3xl font-bold">{pendingOEM.length}</p>
                            </div>
                            <Building2 className="w-8 h-8 text-purple-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-none text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-200 text-xs font-medium">Cert Pending</p>
                                <p className="text-3xl font-bold">{pendingCert.length}</p>
                            </div>
                            <Award className="w-8 h-8 text-emerald-300" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#0EA5E9] to-[#14B8A6] border-none text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sky-200 text-xs font-medium">Ready to Print</p>
                                <p className="text-3xl font-bold">{readyToPrint.length}</p>
                            </div>
                            <Zap className="w-8 h-8 text-sky-200" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-none text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-300 text-xs font-medium">Tokens Issued</p>
                                <p className="text-3xl font-bold">{orders.filter(o => o.printAuthToken).length}</p>
                            </div>
                            <KeyRound className="w-8 h-8 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

        {/* ── DRM AUTHORIZATION PIPELINE ─────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3" style={{ borderBottom: '1px solid #1e2d45' }}>
            <p className="text-xs font-bold text-white flex items-center gap-2">
              🔐 DRM Authorization Pipeline
            </p>
            <span className="text-[10px]" style={{ color: '#64748b' }}>
              One-time encrypted print tokens · SHA-256 audit chain
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap px-5 py-4">
            {[
              { emoji: '📥', label: 'Submitted',    count: orders.length,       state: 'done'    },
              { emoji: '🏭', label: 'OEM Licence',  count: pendingOEM.length,   state: pendingOEM.length > 0  ? 'active' : 'done'    },
              { emoji: '🏛️', label: 'Cert Verified', count: pendingCert.length,  state: pendingCert.length > 0 ? 'active' : 'done'    },
              { emoji: '🔐', label: 'Token Issued', count: readyToPrint.length, state: readyToPrint.length > 0 ? 'active' : 'pending' },
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
                  {node.count > 0 && (
                    <span className="font-bold ml-1">({node.count})</span>
                  )}
                </div>
                {i < 3 && <span className="text-base" style={{ color: '#475569' }}>→</span>}
              </div>
            ))}
          </div>
          {readyToPrint.length > 0 && (
            <div className="mx-5 mb-4 px-4 py-2.5 rounded-lg font-mono text-[11px]" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
              <span className="font-bold" style={{ color: '#a78bfa' }}>🔑 SECURE PRINT TOKEN READY</span>
              {' · '}{readyToPrint.length} order{readyToPrint.length > 1 ? 's' : ''} cleared
              {' · '}One-time · Auto-expire 30s · Bound to approved print centre
            </div>
          )}
        </div>

            {/* Ready to Print Alert */}
            {readyToPrint.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#0EA5E9]/10 to-[#14B8A6]/10 border border-[#0EA5E9]/30 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#0EA5E9] flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-[#0F172A] text-sm">
                            {readyToPrint.length} order{readyToPrint.length > 1 ? 's' : ''} cleared for Secure Print
                        </p>
                        <p className="text-xs text-slate-500">All digital signatures obtained. Navigate to Orders to issue print tokens.</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {readyToPrint.map(o => (
                            <Badge key={o.id} className="bg-[#0EA5E9] text-white text-xs">{o.orderId}</Badge>
                        ))}
                    </div>
                </div>
            )}

            <div className={`grid gap-6 ${role === 'oem_partner' || role === 'cert_authority' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
                {/* OEM Approval Queue — Only for OEM Partner role */}
                {role === 'oem_partner' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#0F172A]">OEM IP License Approvals</h2>
                            <p className="text-xs text-slate-500">Grant intellectual property rights per blueprint</p>
                        </div>
                        <Badge className="ml-auto bg-purple-100 text-purple-700">{pendingOEM.length} pending</Badge>
                    </div>
                    <div className="space-y-3">
                        {pendingOEM.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                                <p className="font-medium">All OEM approvals cleared</p>
                            </div>
                        ) : (
                            pendingOEM.map(order => (
                                <ApprovalCard key={order.id} order={order} type="oem" onApprove={handleApproveClick} />
                            ))
                        )}
                    </div>
                </div>
                )}

                {/* Cert Authority Queue — Only for Cert Authority role */}
                {role === 'cert_authority' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Award className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#0F172A]">Certification Authority Approvals</h2>
                            <p className="text-xs text-slate-500">Verify print center holds valid certification for material</p>
                        </div>
                        <Badge className="ml-auto bg-emerald-100 text-emerald-700">{pendingCert.length} pending</Badge>
                    </div>
                    
                    {/* Risk Filters */}
                    <div className="flex flex-wrap gap-2">
                        {(['all', 'high', 'medium', 'low'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => setRiskFilter(level)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                    riskFilter === level
                                        ? level === 'high' ? 'bg-red-100 border-red-300 text-red-700'
                                        : level === 'medium' ? 'bg-amber-100 border-amber-300 text-amber-700'
                                        : level === 'low' ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                        : 'bg-slate-100 border-slate-300 text-slate-700'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                <Filter className="w-3 h-3" />
                                {level === 'all' ? 'All Orders' : level === 'high' ? '🔴 High Risk' : level === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk'}
                            </button>
                        ))}
                    </div>

                    {/* Bulk Actions */}
                    {selectedForBulk.size > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-sm font-medium text-blue-900">{selectedForBulk.size} selected</span>
                            <Button
                                size="sm"
                                onClick={handleBulkApprove}
                                className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                            >
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Bulk Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedForBulk(new Set())}
                                className="text-xs h-8"
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                        {pendingCert.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                                <p className="font-medium">All cert authority approvals cleared</p>
                            </div>
                        ) : (
                            pendingCert.map(order => {
                                const riskLevel = calculateRiskLevel(order)
                                const riskColor = riskLevel === 'high' ? 'text-red-600' : riskLevel === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                                const isSelected = selectedForBulk.has(order.id)
                                
                                return (
                                    <div key={order.id} className={`flex gap-2 p-3 rounded-lg border transition-all ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200'}`}>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => {
                                                const newSet = new Set(selectedForBulk)
                                                if (checked) newSet.add(order.id)
                                                else newSet.delete(order.id)
                                                setSelectedForBulk(newSet)
                                            }}
                                            className="mt-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <ApprovalCard 
                                                order={order} 
                                                type="cert" 
                                                onApprove={handleApproveClick}
                                                onDeny={handleDenyClick}
                                                riskLevel={riskLevel}
                                            />
                                        </div>
                                        <span className={`text-xs font-bold shrink-0 ${riskColor}`}>
                                            {riskLevel === 'high' ? '🔴' : riskLevel === 'medium' ? '🟡' : '🟢'}
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
                )}
            </div>

            {/* Pipeline Overview */}
            <Card className="bg-white border-slate-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#0EA5E9]" />
                        DRM Approval Pipeline — All Active Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {orders.filter(o => !['delivered'].includes(o.status)).map(order => {
                            const blueprint = blueprints.find(b => b.id === order.blueprintId)
                            return (
                                <div key={order.id} className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold text-[#0EA5E9]">{order.orderId}</span>
                                            <span className="text-sm text-slate-600">{order.partName}</span>
                                            {blueprint && <Badge className="bg-slate-100 text-slate-600 text-[10px]">{blueprint.blueprintId}</Badge>}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {order.printAuthToken && (
                                                <Badge className="bg-emerald-100 text-emerald-700 text-xs flex items-center gap-1">
                                                    <KeyRound className="w-3 h-3" /> Token Issued
                                                </Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => setViewOrder(order)}
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <ApprovalStepper order={order} />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Denial Reason Dialog */}
            <Dialog open={isDenyOpen} onOpenChange={setIsDenyOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <X className="w-5 h-5 text-red-600" /> Deny Approval
                        </DialogTitle>
                        <DialogDescription>
                            Select a reason for rejecting this order. This will be recorded in the audit log.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        {DENIAL_REASONS.map(reason => (
                            <button
                                key={reason.code}
                                onClick={() => setDenyReason(reason.code)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    denyReason === reason.code
                                        ? 'border-red-400 bg-red-50'
                                        : 'border-slate-200 bg-white hover:border-red-200'
                                }`}
                            >
                                <p className="font-medium text-sm text-[#0F172A]">{reason.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{reason.description}</p>
                            </button>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDenyOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleConfirmDenial}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={!denyReason}
                        >
                            <X className="w-4 h-4 mr-2" /> Deny Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Approval Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {approvingOrder?.type === 'oem'
                                ? <><Building2 className="w-5 h-5 text-purple-600" /> Grant IP License</>
                                : <><Award className="w-5 h-5 text-emerald-600" /> Authorize Print Center</>
                            }
                        </DialogTitle>
                        <DialogDescription>
                            This action will be permanently recorded in the immutable audit log.
                        </DialogDescription>
                    </DialogHeader>
                    {approvingOrderData && (
                        <div className="py-4 space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Order</span>
                                    <span className="font-mono font-bold text-[#0EA5E9]">{approvingOrderData.orderId}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Part</span>
                                    <span className="font-medium text-[#0F172A]">{approvingOrderData.partName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">Quantity</span>
                                    <span className="font-medium text-[#0F172A]">{approvingOrderData.quantity} units</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl text-sm ${approvingOrder?.type === 'oem' ? 'bg-purple-50 text-purple-800' : 'bg-emerald-50 text-emerald-800'
                                }`}>
                                {approvingOrder?.type === 'oem'
                                    ? '⚡ You are granting a one-time IP license. This allows the designated Print Center to decrypt and execute the blueprint exactly once.'
                                    : '⚡ You are verifying that the Print Center holds valid certification. This unlocks the second digital signature required for print authorization.'
                                }
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleConfirmApproval}
                            className={approvingOrder?.type === 'oem'
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }
                        >
                            {approvingOrder?.type === 'oem' ? 'Grant IP License' : 'Authorize Print Center'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Pipeline Detail Dialog */}
            <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Approval Pipeline — {viewOrder?.orderId}</DialogTitle>
                    </DialogHeader>
                    {viewOrder && (
                        <div className="space-y-4 py-2">
                            <div className="py-4">
                                <ApprovalStepper order={viewOrder} />
                            </div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Request Submitted', done: true, timestamp: viewOrder.createdAt, by: `Requester` },
                                    { label: 'OEM Approved', done: viewOrder.oemApproval.approved, timestamp: viewOrder.oemApproval.approvedAt, by: viewOrder.oemApproval.approvedBy },
                                    { label: 'Cert Verified', done: viewOrder.certApproval.approved, timestamp: viewOrder.certApproval.approvedAt, by: viewOrder.certApproval.approvedBy },
                                    { label: 'Print Token Issued', done: !!viewOrder.printAuthToken, timestamp: null, by: viewOrder.printAuthToken ? `Token: ${viewOrder.printAuthToken.substring(0, 16)}...` : null },
                                ].map((step, idx) => (
                                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${step.done ? 'bg-emerald-50' : 'bg-slate-50'
                                        }`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-500' : 'bg-slate-300'
                                            }`}>
                                            {step.done
                                                ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                : <Clock className="w-3.5 h-3.5 text-white" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${step.done ? 'text-[#0F172A]' : 'text-slate-400'}`}>{step.label}</p>
                                            {step.done && step.by && <p className="text-xs text-slate-500">{step.by}</p>}
                                            {step.done && step.timestamp && <p className="text-xs text-slate-400">{new Date(step.timestamp).toLocaleString('en-US')}</p>}
                                        </div>
                                        {step.done
                                            ? <Unlock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            : <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
