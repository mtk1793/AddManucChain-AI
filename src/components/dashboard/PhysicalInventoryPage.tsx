'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
    Boxes,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    Package,
    ArrowRight,
    Edit,
    Eye,
    Printer,
    ArrowLeftRight,
    Flame,
    Wrench,
    Plus,
    ShieldCheck,
    Clock,
    Building2,
    Anchor,
    Warehouse,
    Ship,
    Search,
    Activity,
} from 'lucide-react'
import { toast } from 'sonner'
import {
    physicalSites,
    physicalParts,
    inventoryTransactions,
    blueprints,
    PhysicalPart,
    PhysicalSite,
    InventoryTransaction,
} from '@/lib/static-data'

// ─── Types & Helpers ──────────────────────────────────────────────────────────

const conditionColors: Record<string, string> = {
    new: 'bg-emerald-100 text-emerald-700',
    serviceable: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
    used: 'bg-amber-100 text-amber-700',
    condemned: 'bg-red-100 text-red-600',
}

const conditionIcons: Record<string, any> = {
    new: CheckCircle2,
    serviceable: Wrench,
    used: Clock,
    condemned: Flame,
}

const siteTypeIcons: Record<string, any> = {
    offshore_rig: Anchor,
    vessel: Ship,
    onshore_yard: Building2,
    warehouse: Warehouse,
}

const siteTypeLabels: Record<string, string> = {
    offshore_rig: 'Offshore Rig',
    vessel: 'Vessel',
    onshore_yard: 'Onshore Yard',
    warehouse: 'Warehouse',
}

const txActionColors: Record<string, string> = {
    received: 'bg-emerald-100 text-emerald-700',
    consumed: 'bg-slate-100 text-slate-600',
    condemned: 'bg-red-100 text-red-600',
    transferred_in: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
    transferred_out: 'bg-purple-100 text-purple-700',
    inspected: 'bg-amber-100 text-amber-700',
}

const txActionLabels: Record<string, string> = {
    received: 'Received',
    consumed: 'Consumed',
    condemned: 'Condemned',
    transferred_in: 'Transferred In',
    transferred_out: 'Transferred Out',
    inspected: 'Inspected',
}

function getStockStatus(part: PhysicalPart): 'ok' | 'low' | 'critical' | 'out' {
    if (part.quantity === 0) return 'out'
    if (part.quantity < part.minStock) return part.quantity <= 1 ? 'critical' : 'low'
    return 'ok'
}

// Find sites that have surplus of a given part (same name, qty > minStock)
function findSurplusSites(part: PhysicalPart, allParts: PhysicalPart[], allSites: PhysicalSite[]) {
    return allParts
        .filter(p => p.name === part.name && p.siteId !== part.siteId && p.quantity > p.minStock)
        .map(p => ({ ...p, site: allSites.find(s => s.id === p.siteId) }))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SiteCard({ site, parts, onClick }: { site: PhysicalSite; parts: PhysicalPart[]; onClick: () => void }) {
    const SiteIcon = siteTypeIcons[site.type] || Building2
    const alertCount = parts.filter(p => getStockStatus(p) !== 'ok').length
    const total = parts.length
    const totalValue = parts.reduce((s, p) => s + p.quantity * p.unitCost, 0)

    return (
        <button
            onClick={onClick}
            className="w-full text-left group"
        >
            <Card className={`border-2 transition-all duration-200 group-hover:shadow-lg group-hover:border-[#0EA5E9]/40 ${alertCount > 0 ? 'border-amber-200' : 'border-slate-200'
                }`}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${site.status === 'active' ? 'bg-[#0EA5E9]/10' :
                            site.status === 'standby' ? 'bg-amber-100' : 'bg-slate-100'
                            }`}>
                            <SiteIcon className={`w-5 h-5 ${site.status === 'active' ? 'text-[#0EA5E9]' :
                                site.status === 'standby' ? 'text-amber-600' : 'text-slate-400'
                                }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#0F172A] text-sm leading-tight">{site.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{site.location}</p>
                        </div>
                        {alertCount > 0 && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs flex-shrink-0">
                                ⚠ {alertCount} alert{alertCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Badge className="bg-slate-100 text-slate-600 text-[10px]">{siteTypeLabels[site.type]}</Badge>
                        <span>·</span>
                        <span>{site.operator}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <p className="font-bold text-[#0F172A]">{total}</p>
                            <p className="text-[10px] text-slate-400">SKUs</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <p className={`font-bold ${alertCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{alertCount}</p>
                            <p className="text-[10px] text-slate-400">Alerts</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <p className="font-bold text-[#0F172A] text-xs">${(totalValue / 1000).toFixed(0)}k</p>
                            <p className="text-[10px] text-slate-400">Value</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </button>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PhysicalInventoryPage({ role = 'admin' }: { role?: string }) {
    const [parts, setParts] = useState<PhysicalPart[]>(physicalParts)
    const [txs, setTxs] = useState<InventoryTransaction[]>(inventoryTransactions)

    const [selectedSite, setSelectedSite] = useState<PhysicalSite | null>(null)
    const [selectedPart, setSelectedPart] = useState<PhysicalPart | null>(null)
    const [viewMode, setViewMode] = useState<'sites' | 'all'>('sites')
    const [searchQuery, setSearchQuery] = useState('')

    const [actionDialog, setActionDialog] = useState<'consume' | 'receive' | 'condemn' | 'print' | 'transfer' | null>(null)
    const [addPartOpen, setAddPartOpen] = useState(false)
    const [actionQty, setActionQty] = useState(1)
    const [actionNote, setActionNote] = useState('')

    // New part form
    const [newPart, setNewPart] = useState({
        name: '', partNumber: '', category: 'Structural',
        siteId: physicalSites[0]?.id ?? '',
        quantity: 1, minStock: 2, unit: 'pcs',
        condition: 'new' as PhysicalPart['condition'],
        blueprintId: 'none', unitCost: 0, notes: '',
    })

    // Validation errors for the add-part dialog
    const [newPartErrors, setNewPartErrors] = useState<{ name?: string; partNumber?: string }>({})

    const siteParts = (siteId: string) => parts.filter(p => p.siteId === siteId)
    const filteredParts = parts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSite = !selectedSite || p.siteId === selectedSite.id
        return matchesSearch && matchesSite
    })

    // Counters
    const outOfStock = parts.filter(p => p.quantity === 0).length
    const lowStock = parts.filter(p => { const s = getStockStatus(p); return s === 'low' || s === 'critical' }).length
    const condemned = parts.filter(p => p.condition === 'condemned').length
    const totalValue = parts.reduce((s, p) => s + p.quantity * p.unitCost, 0)

    const performAction = (action: 'consume' | 'receive' | 'condemn') => {
        if (!selectedPart) return
        const now = new Date().toISOString()

        setParts(prev => prev.map(p => {
            if (p.id !== selectedPart.id) return p
            if (action === 'consume') {
                const newQty = Math.max(0, p.quantity - actionQty)
                return { ...p, quantity: newQty, lastUsed: now }
            }
            if (action === 'receive') return { ...p, quantity: p.quantity + actionQty }
            if (action === 'condemn') return { ...p, condition: 'condemned', quantity: Math.max(0, p.quantity - actionQty) }
            return p
        }))

        setTxs(prev => [...prev, {
            id: `tx-${Date.now()}`,
            partId: selectedPart.id,
            siteId: selectedPart.siteId,
            action: action === 'consume' ? 'consumed' : action === 'receive' ? 'received' : 'condemned',
            quantity: actionQty,
            performedBy: 'Current User',
            timestamp: now,
            notes: actionNote || null,
        }])

        const labels = { consume: 'consumed', receive: 'received', condemn: 'condemned' }
        toast.success(`${actionQty} × ${selectedPart.name} ${labels[action]}`, {
            description: 'Transaction logged to audit trail.',
        })
        setActionDialog(null)
        setActionQty(1)
        setActionNote('')
    }

    const handlePrintReplacement = () => {
        if (!selectedPart) return
        toast.success(`Print order queued for ${selectedPart.name}`, {
            description: 'Entering DRM approval pipeline. OEM & Cert Authority will be notified.',
            duration: 6000,
        })
        setActionDialog(null)
    }

    const handleAddPart = () => {
        const errs: typeof newPartErrors = {}
        if (!newPart.name) errs.name = 'Required'
        if (!newPart.partNumber) errs.partNumber = 'Required'
        if (Object.keys(errs).length) {
            setNewPartErrors(errs)
            toast.error('Part name and number are required')
            return
        }
        const created: PhysicalPart = {
            id: `pp-${Date.now()}`,
            partNumber: newPart.partNumber,
            name: newPart.name,
            category: newPart.category,
            siteId: newPart.siteId,
            quantity: newPart.quantity,
            minStock: newPart.minStock,
            unit: newPart.unit,
            condition: newPart.condition,
            blueprintId: (newPart.blueprintId && newPart.blueprintId !== 'none') ? newPart.blueprintId : null,
            lastUsed: null,
            lastInspected: null,
            notes: newPart.notes || null,
            unitCost: newPart.unitCost,
        }
        setParts(prev => [...prev, created])
        toast.success(`${created.name} added to inventory at ${physicalSites.find(s => s.id === created.siteId)?.name}`)
        setAddPartOpen(false)
        setNewPart({ name: '', partNumber: '', category: 'Structural', siteId: physicalSites[0]?.id ?? '', quantity: 1, minStock: 2, unit: 'pcs', condition: 'new', blueprintId: 'none', unitCost: 0, notes: '' })
    }

    const partTxs = selectedPart ? txs.filter(t => t.partId === selectedPart.id) : []
    const surplusSites = selectedPart ? findSurplusSites(selectedPart, parts, physicalSites) : []
    const blueprint = selectedPart?.blueprintId ? blueprints.find(b => b.id === selectedPart.blueprintId) : null

    return (
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-600 to-red-700 border-none text-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div><p className="text-red-200 text-xs">Out of Stock</p><p className="text-3xl font-bold">{outOfStock}</p></div>
                        <AlertTriangle className="w-8 h-8 text-red-300" />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div><p className="text-amber-100 text-xs">Low Stock</p><p className="text-3xl font-bold">{lowStock}</p></div>
                        <Package className="w-8 h-8 text-amber-200" />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-none text-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div><p className="text-slate-300 text-xs">Condemned</p><p className="text-3xl font-bold">{condemned}</p></div>
                        <Flame className="w-8 h-8 text-slate-500" />
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#0EA5E9] to-[#14B8A6] border-none text-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div><p className="text-sky-100 text-xs">Total Value</p><p className="text-2xl font-bold">${(totalValue / 1000).toFixed(0)}k</p></div>
                        <Boxes className="w-8 h-8 text-sky-200" />
                    </CardContent>
                </Card>
            </div>

            {/* ── View Toggle + Actions ── */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                    <button
                        onClick={() => { setViewMode('sites'); setSelectedSite(null) }}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'sites' ? 'bg-[#0EA5E9] text-white' : 'text-slate-500 hover:text-[#0F172A]'
                            }`}
                    >
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />Sites
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'all' ? 'bg-[#0EA5E9] text-white' : 'text-slate-500 hover:text-[#0F172A]'
                            }`}
                    >
                        <Boxes className="w-3.5 h-3.5 inline mr-1" />All Parts
                    </button>
                </div>
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search parts..."
                            className="pl-10 bg-white border-slate-200 text-sm h-9"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    onClick={() => setAddPartOpen(true)}
                    className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white h-9"
                >
                    <Plus className="w-4 h-4 mr-2" />Add Part
                </Button>
            </div>

            {/* ── Sites View ── */}
            {viewMode === 'sites' && !selectedSite && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {physicalSites.map(site => (
                        <SiteCard
                            key={site.id}
                            site={site}
                            parts={siteParts(site.id)}
                            onClick={() => { setSelectedSite(site); setViewMode('all') }}
                        />
                    ))}
                </div>
            )}

            {/* ── Parts Table ── */}
            {(viewMode === 'all' || selectedSite) && (
                <Card className="bg-white border-slate-200">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                                <Boxes className="w-4 h-4 text-[#0EA5E9]" />
                                {selectedSite ? selectedSite.name : 'All Sites'} — Parts Cabinet
                                <Badge className="bg-slate-100 text-slate-600 ml-1">{filteredParts.length} SKUs</Badge>
                            </CardTitle>
                            {selectedSite && (
                                <Button variant="outline" size="sm" onClick={() => { setSelectedSite(null); setViewMode('sites') }}>
                                    ← All Sites
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Part</th>
                                        {!selectedSite && <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Site</th>}
                                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Condition</th>
                                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Stock</th>
                                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Status</th>
                                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Blueprint</th>
                                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredParts.map(part => {
                                        const status = getStockStatus(part)
                                        const CondIcon = conditionIcons[part.condition] || CheckCircle2
                                        const site = physicalSites.find(s => s.id === part.siteId)
                                        const bp = part.blueprintId ? blueprints.find(b => b.id === part.blueprintId) : null
                                        const stockPct = Math.min((part.quantity / Math.max(part.minStock * 2, 1)) * 100, 100)

                                        return (
                                            <tr key={part.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${status === 'out' ? 'bg-red-50/40' : status === 'critical' ? 'bg-orange-50/30' : ''
                                                }`}>
                                                {/* Part */}
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-[#0F172A] text-sm">{part.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{part.partNumber} · {part.category}</p>
                                                </td>
                                                {/* Site */}
                                                {!selectedSite && (
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs text-slate-600">{site?.name}</p>
                                                        <p className="text-[10px] text-slate-400">{site?.location}</p>
                                                    </td>
                                                )}
                                                {/* Condition */}
                                                <td className="px-4 py-3">
                                                    <Badge className={`text-[10px] flex items-center gap-1 w-fit ${conditionColors[part.condition]}`}>
                                                        <CondIcon className="w-2.5 h-2.5" />
                                                        {part.condition}
                                                    </Badge>
                                                </td>
                                                {/* Stock */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-lg font-bold ${status === 'out' ? 'text-red-600' :
                                                            status === 'critical' ? 'text-orange-600' :
                                                                status === 'low' ? 'text-amber-600' : 'text-[#0F172A]'
                                                            }`}>{part.quantity}</span>
                                                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${status === 'out' ? 'bg-red-500' :
                                                                    status === 'critical' ? 'bg-orange-500' :
                                                                        status === 'low' ? 'bg-amber-400' : 'bg-emerald-500'
                                                                    }`}
                                                                style={{ width: `${stockPct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] text-slate-400">min {part.minStock}</span>
                                                    </div>
                                                </td>
                                                {/* Status badge */}
                                                <td className="px-4 py-3">
                                                    {status === 'out' && <Badge className="bg-red-100 text-red-700 text-[10px]">🔴 Out of Stock</Badge>}
                                                    {status === 'critical' && <Badge className="bg-orange-100 text-orange-700 text-[10px]">🟠 Critical</Badge>}
                                                    {status === 'low' && <Badge className="bg-amber-100 text-amber-700 text-[10px]">🟡 Low Stock</Badge>}
                                                    {status === 'ok' && <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">✓ OK</Badge>}
                                                </td>
                                                {/* Blueprint */}
                                                <td className="px-4 py-3">
                                                    {bp ? (
                                                        <Badge className="bg-indigo-50 text-indigo-700 text-[10px]">🔑 {bp.blueprintId}</Badge>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-300">No blueprint</span>
                                                    )}
                                                </td>
                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7"
                                                            onClick={() => { setSelectedPart(part); setActionDialog(null) }}
                                                            title="View details">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-600"
                                                            onClick={() => { setSelectedPart(part); setActionDialog('consume') }}
                                                            title="Log consumption">
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600"
                                                            onClick={() => { setSelectedPart(part); setActionDialog('receive') }}
                                                            title="Receive stock">
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </Button>
                                                        {(status === 'out' || status === 'low' || status === 'critical') && bp && (
                                                            <Button
                                                                size="icon"
                                                                className="h-7 w-7 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                                onClick={() => { setSelectedPart(part); setActionDialog('print') }}
                                                                title="Print replacement"
                                                            >
                                                                <Printer className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Part Detail Side Panel (shown when selectedPart and no dialog) ── */}
            {selectedPart && !actionDialog && (
                <div className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 overflow-y-auto">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-[#0F172A]">{selectedPart.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{selectedPart.partNumber}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPart(null)}>✕</Button>
                    </div>

                    <div className="p-5 space-y-5">
                        {/* Stock overview */}
                        <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">On-Hand</span>
                                <span className={`text-2xl font-bold ${getStockStatus(selectedPart) === 'out' ? 'text-red-600' : 'text-[#0F172A]'
                                    }`}>{selectedPart.quantity} {selectedPart.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Min Stock</span>
                                <span className="font-medium">{selectedPart.minStock} {selectedPart.unit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Condition</span>
                                <Badge className={conditionColors[selectedPart.condition]}>{selectedPart.condition}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Unit Cost</span>
                                <span className="font-medium">${selectedPart.unitCost.toLocaleString()}</span>
                            </div>
                            {selectedPart.lastUsed && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Last Used</span>
                                    <span className="text-xs text-slate-600">{new Date(selectedPart.lastUsed).toLocaleDateString()}</span>
                                </div>
                            )}
                            {selectedPart.notes && (
                                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">{selectedPart.notes}</p>
                            )}
                        </div>

                        {/* Blueprint link */}
                        {blueprint && (
                            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <p className="text-xs font-semibold text-indigo-800 mb-1 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" />Digital Blueprint Available
                                </p>
                                <p className="text-xs text-indigo-700">{blueprint.blueprintId} · {blueprint.name}</p>
                                <p className="text-[10px] text-indigo-500 mt-0.5">{blueprint.oem} · {blueprint.certification}</p>
                            </div>
                        )}

                        {/* Reorder suggestions */}
                        {getStockStatus(selectedPart) !== 'ok' && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-[#0EA5E9]" />Reorder Options
                                </p>
                                {surplusSites.length > 0 && (
                                    <button
                                        onClick={() => { setActionDialog('transfer'); toast.info('Transfer request sent to ' + surplusSites[0].site?.name) }}
                                        className="w-full text-left p-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ArrowLeftRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-emerald-800">Transfer from {surplusSites[0].site?.name}</p>
                                                <p className="text-[10px] text-emerald-600">{surplusSites[0].quantity - surplusSites[0].minStock} surplus available · ~2-3 day transfer</p>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                    </button>
                                )}
                                {blueprint && (
                                    <button
                                        onClick={() => { setActionDialog('print'); }}
                                        className="w-full text-left p-3 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Printer className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-indigo-800">Print on Demand</p>
                                                <p className="text-[10px] text-indigo-600">Requires OEM + Cert Authority approval · ~4-6 day lead</p>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Transaction history */}
                        <div>
                            <p className="text-xs font-bold text-[#0F172A] mb-2">Transaction History</p>
                            {partTxs.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">No transactions logged yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {[...partTxs].reverse().map(tx => (
                                        <div key={tx.id} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg">
                                            <Badge className={`text-[9px] flex-shrink-0 ${txActionColors[tx.action]}`}>
                                                {txActionLabels[tx.action]}
                                            </Badge>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-medium text-[#0F172A]">
                                                    {tx.quantity} {selectedPart.unit} · {tx.performedBy}
                                                </p>
                                                {tx.notes && <p className="text-[10px] text-slate-500 truncate">{tx.notes}</p>}
                                                <p className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick action buttons */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setActionDialog('consume')}>
                                <Edit className="w-3 h-3 mr-1" />Consume
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => setActionDialog('receive')}>
                                <Plus className="w-3 h-3 mr-1" />Receive
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs text-red-600" onClick={() => setActionDialog('condemn')}>
                                <Flame className="w-3 h-3 mr-1" />Condemn
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Action Dialogs ── */}
            {['consume', 'receive', 'condemn'].includes(actionDialog ?? '') && (
                <Dialog open onOpenChange={() => setActionDialog(null)}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>
                                {actionDialog === 'consume' ? '📤 Log Consumption' :
                                    actionDialog === 'receive' ? '📦 Receive Stock' : '🔥 Condemn Parts'}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedPart?.name} · {selectedPart?.partNumber}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number" min={1}
                                    value={actionQty}
                                    onChange={e => setActionQty(parseInt(e.target.value) || 1)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Notes (optional)</Label>
                                <Textarea
                                    placeholder="Reason, location, job number..."
                                    value={actionNote}
                                    onChange={e => setActionNote(e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
                            <Button
                                onClick={() => performAction(actionDialog as any)}
                                className={
                                    actionDialog === 'condemn' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                        actionDialog === 'receive' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                                            'bg-[#0EA5E9] text-white'
                                }
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Print Replacement Dialog */}
            <Dialog open={actionDialog === 'print'} onOpenChange={() => setActionDialog(null)}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Printer className="w-5 h-5 text-indigo-600" />
                            Print Replacement — {selectedPart?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Creates a print order that enters the DRM approval pipeline.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPart && blueprint && (
                        <div className="py-4 space-y-3">
                            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Blueprint</span><span className="font-mono font-bold text-indigo-700">{blueprint.blueprintId}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Material</span><span className="font-medium">{blueprint.material}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">OEM</span><span className="font-medium">{blueprint.oem}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Certification</span><span className="font-medium">{blueprint.certification}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500">Current Stock</span><span className={`font-bold ${getStockStatus(selectedPart) === 'out' ? 'text-red-600' : 'text-amber-600'}`}>{selectedPart.quantity} {selectedPart.unit}</span></div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-xl text-xs text-indigo-800 space-y-0.5">
                                <p className="font-semibold mb-1">Pipeline:</p>
                                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />OEM signs off IP license</div>
                                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />Cert Authority verifies print center</div>
                                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" />Secure token issued → encrypted G-code streams to printer</div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
                        <Button onClick={handlePrintReplacement} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Printer className="w-4 h-4 mr-2" />Submit Print Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Part Dialog */}
            <Dialog open={addPartOpen} onOpenChange={setAddPartOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Physical Part</DialogTitle>
                        <DialogDescription>Register a physical part in your inventory cabinet.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Part Name *</Label>
                                <Input
                                  placeholder="e.g., Valve Body"
                                  value={newPart.name}
                                  onChange={e => {
                                    setNewPart({ ...newPart, name: e.target.value })
                                    if (newPartErrors.name) setNewPartErrors(e => ({ ...e, name: undefined }))
                                  }}
                                  className={`h-8 text-sm ${newPartErrors.name ? 'border-red-500' : ''}`}
                                />
                                {newPartErrors.name && <p className="text-xs text-red-500 mt-1">{newPartErrors.name}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Part Number *</Label>
                                <Input
                                  placeholder="PHY-XXXX"
                                  value={newPart.partNumber}
                                  onChange={e => {
                                    setNewPart({ ...newPart, partNumber: e.target.value })
                                    if (newPartErrors.partNumber) setNewPartErrors(e => ({ ...e, partNumber: undefined }))
                                  }}
                                  className={`h-8 text-sm ${newPartErrors.partNumber ? 'border-red-500' : ''}`}
                                />
                                {newPartErrors.partNumber && <p className="text-xs text-red-500 mt-1">{newPartErrors.partNumber}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Category</Label>
                                <Select value={newPart.category} onValueChange={v => setNewPart({ ...newPart, category: v })}>
                                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['Structural', 'Hydraulic', 'Rotating', 'Seals', 'Thermal', 'Electrical', 'Coupling'].map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Condition</Label>
                                <Select value={newPart.condition} onValueChange={v => setNewPart({ ...newPart, condition: v as any })}>
                                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="serviceable">Serviceable</SelectItem>
                                        <SelectItem value="used">Used</SelectItem>
                                        <SelectItem value="condemned">Condemned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Site</Label>
                            <Select value={newPart.siteId} onValueChange={v => setNewPart({ ...newPart, siteId: v })}>
                                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {physicalSites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Qty on Hand</Label>
                                <Input type="number" min={0} value={newPart.quantity} onChange={e => setNewPart({ ...newPart, quantity: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Min Stock</Label>
                                <Input type="number" min={1} value={newPart.minStock} onChange={e => setNewPart({ ...newPart, minStock: parseInt(e.target.value) || 1 })} className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Unit Cost ($)</Label>
                                <Input type="number" min={0} value={newPart.unitCost} onChange={e => setNewPart({ ...newPart, unitCost: parseInt(e.target.value) || 0 })} className="h-8 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Link Blueprint (optional)</Label>
                            <Select value={newPart.blueprintId} onValueChange={v => setNewPart({ ...newPart, blueprintId: v })}>
                                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="No blueprint linked" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No blueprint linked</SelectItem>
                                    {blueprints.filter(b => b.status === 'active').map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.blueprintId} — {b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddPartOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddPart} className="bg-[#0EA5E9] text-white">Add to Inventory</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
