'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  BookMarked,
  Plus,
  Search,
  Shield,
  DollarSign,
  TrendingUp,
  FileCode,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Building2,
  Printer,
  ChevronDown,
  Star,
  ArrowRight,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────────────
type LicenseType = 'restricted' | 'open' | 'pay_per_print' | 'consortium'
type AssetStatus = 'active' | 'draft' | 'revoked' | 'pending_cert'
type RequestStatus = 'pending' | 'approved' | 'rejected' | 'info_requested'

interface IPAsset {
  id: string
  partName: string
  partNumber: string
  technology: string
  material: string
  oemOwner: string
  licenseType: LicenseType
  royaltyRate: number          // % per print job
  royaltyFlat: number          // flat CAD per print
  status: AssetStatus
  authorizedPrinters: number
  totalPrints: number
  totalRoyalties: number
  certLevel: string
  uploadDate: string
  version: string
  description: string
  tags: string[]
}

interface LicenseRequest {
  id: string
  assetId: string
  assetName: string
  requesterName: string
  requesterOrg: string
  requesterType: 'print_center' | 'lab' | 'operator'
  requestDate: string
  status: RequestStatus
  intendedUse: string
  volume: string
  notes: string
}

// ── Static data ───────────────────────────────────────────────────────────────
const ipAssets: IPAsset[] = [
  {
    id: 'ip-001',
    partName: 'Marine Pump Impeller — Series 7',
    partNumber: 'WRT-IMP-7-AM',
    technology: 'SLA Resin / DMLS',
    material: 'Stainless 316L',
    oemOwner: 'Wärtsilä',
    licenseType: 'pay_per_print',
    royaltyRate: 12,
    royaltyFlat: 0,
    status: 'active',
    authorizedPrinters: 4,
    totalPrints: 83,
    totalRoyalties: 12240,
    certLevel: 'DNV Type Approved',
    uploadDate: '2025-10-01',
    version: 'v2.3',
    description: 'Certified impeller geometry for LNG carrier auxiliary cooling systems. Pay-per-print licensing with 12% royalty on each authorized print job.',
    tags: ['marine', 'pump', 'LNG', 'DNV'],
  },
  {
    id: 'ip-002',
    partName: 'Shaft Seal Housing — Offshore',
    partNumber: 'RR-SSH-AM-2024',
    technology: 'Continuous Fiber FFF',
    material: 'Onyx + Carbon Fiber',
    oemOwner: 'Rolls-Royce Marine',
    licenseType: 'restricted',
    royaltyRate: 0,
    royaltyFlat: 850,
    status: 'active',
    authorizedPrinters: 2,
    totalPrints: 17,
    totalRoyalties: 14450,
    certLevel: 'Lloyd\'s Register AM Framework',
    uploadDate: '2025-09-15',
    version: 'v1.1',
    description: 'Restricted license — pre-approved printers only. Flat-fee $850 per authorized print. Requires Lloyd\'s Register signed quality report on delivery.',
    tags: ['offshore', 'seal', 'structural', 'Lloyd\'s'],
  },
  {
    id: 'ip-003',
    partName: 'Valve Body — Subsea Grade',
    partNumber: 'CAT-VB-SS-AM',
    technology: 'Multi-Jet Printing',
    material: 'VisiJet M2 High-Impact',
    oemOwner: 'Caterpillar Marine',
    licenseType: 'consortium',
    royaltyRate: 8,
    royaltyFlat: 0,
    status: 'active',
    authorizedPrinters: 7,
    totalPrints: 142,
    totalRoyalties: 9940,
    certLevel: 'ABS + ISO 9001',
    uploadDate: '2025-11-20',
    version: 'v3.0',
    description: 'Consortium license — available to all PolyUnity network members who hold ISO 9001 certification. 8% royalty distributed back to OEM per print.',
    tags: ['subsea', 'valve', 'consortium', 'ABS'],
  },
  {
    id: 'ip-004',
    partName: 'Heat Exchanger Fin Array',
    partNumber: 'SE-HEXA-AM-26',
    technology: 'FDM (High-Temp)',
    material: 'PEEK / Ultem 9085',
    oemOwner: 'Siemens Energy',
    licenseType: 'open',
    royaltyRate: 0,
    royaltyFlat: 0,
    status: 'active',
    authorizedPrinters: 23,
    totalPrints: 341,
    totalRoyalties: 0,
    certLevel: 'ISO 9001 Self-Certified',
    uploadDate: '2026-01-08',
    version: 'v1.0',
    description: 'Open license — non-critical thermal management component. No royalty. Any registered platform user may print with standard quality attestation.',
    tags: ['thermal', 'energy', 'open-source', 'PEEK'],
  },
  {
    id: 'ip-005',
    partName: 'Rudder Bearing Insert',
    partNumber: 'MAN-RBI-AM-V4',
    technology: 'SLA Resin',
    material: 'Tough 2000 Resin',
    oemOwner: 'MAN Energy Solutions',
    licenseType: 'pay_per_print',
    royaltyRate: 15,
    royaltyFlat: 0,
    status: 'pending_cert',
    authorizedPrinters: 0,
    totalPrints: 0,
    totalRoyalties: 0,
    certLevel: 'Awaiting Bureau Veritas',
    uploadDate: '2026-02-14',
    version: 'v1.0',
    description: 'New submission — pending Bureau Veritas type approval. Will be available for authorized printing once certification is issued.',
    tags: ['navigation', 'bearing', 'BV', 'pending'],
  },
]

const licenseRequests: LicenseRequest[] = [
  {
    id: 'lr-001',
    assetId: 'ip-001',
    assetName: 'Marine Pump Impeller — Series 7',
    requesterName: 'Michael Okafor',
    requesterOrg: 'PolyUnity NL',
    requesterType: 'print_center',
    requestDate: '2026-02-25',
    status: 'pending',
    intendedUse: 'Emergency replacement for Irving Oil LNG terminal, Dartmouth NS. Need 3 units within 48hr.',
    volume: '3 units / month est.',
    notes: 'Facility holds DNV Type Approval and ISO 13485. Previous print history shared on request.',
  },
  {
    id: 'lr-002',
    assetId: 'ip-002',
    assetName: 'Shaft Seal Housing — Offshore',
    requesterName: 'Prof. Ahmad Osman',
    requesterOrg: 'Dalhousie AM Lab',
    requesterType: 'lab',
    requestDate: '2026-02-20',
    status: 'info_requested',
    intendedUse: 'Material fatigue testing for CAPSM offshore wind research — non-commercial evaluation only.',
    volume: '2 test units (one-time)',
    notes: 'Academic institution. Results to be shared with OEM under NDA.',
  },
  {
    id: 'lr-003',
    assetId: 'ip-003',
    assetName: 'Valve Body — Subsea Grade',
    requesterName: 'Nadia Kowalski',
    requesterOrg: 'Atlantic Composites Inc.',
    requesterType: 'print_center',
    requestDate: '2026-02-18',
    status: 'approved',
    intendedUse: 'Subsea valve replacement for Cenovus offshore platform maintenance contract.',
    volume: '10–15 units / quarter',
    notes: 'ISO 9001 certified facility. Consortium license application.',
  },
  {
    id: 'lr-004',
    assetId: 'ip-001',
    assetName: 'Marine Pump Impeller — Series 7',
    requesterName: 'Sarah Leblanc',
    requesterOrg: 'Dalhousie Prototyping Lab',
    requesterType: 'lab',
    requestDate: '2026-02-10',
    status: 'rejected',
    intendedUse: 'Student capstone project — reverse engineering study.',
    volume: '1 unit',
    notes: 'License not granted for reverse engineering. Directed to open IP assets.',
  },
]

// ── Config ────────────────────────────────────────────────────────────────────
const licenseConfig: Record<LicenseType, { label: string; color: string; bg: string; icon: typeof Lock }> = {
  restricted: { label: 'Restricted', color: 'text-red-600', bg: 'bg-red-100', icon: Lock },
  open: { label: 'Open', color: 'text-green-600', bg: 'bg-green-100', icon: Unlock },
  pay_per_print: { label: 'Pay-Per-Print', color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10', icon: DollarSign },
  consortium: { label: 'Consortium', color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', icon: Building2 },
}

const statusConfig: Record<AssetStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-100' },
  draft: { label: 'Draft', color: 'text-slate-600', bg: 'bg-slate-100' },
  revoked: { label: 'Revoked', color: 'text-red-600', bg: 'bg-red-100' },
  pending_cert: { label: 'Pending Cert', color: 'text-amber-600', bg: 'bg-amber-100' },
}

const requestStatusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle },
  info_requested: { label: 'Info Requested', color: 'text-blue-700', bg: 'bg-blue-100', icon: AlertTriangle },
}

// ── Component ─────────────────────────────────────────────────────────────────
export function IPLibraryPage({ role = 'admin' }: { role?: string }) {
  const [assets] = useState<IPAsset[]>(ipAssets)
  const [requests, setRequests] = useState<LicenseRequest[]>(licenseRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [licenseFilter, setLicenseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LicenseRequest | null>(null)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    partName: '', partNumber: '', technology: '', material: '',
    licenseType: 'pay_per_print', royaltyRate: '', royaltyFlat: '',
    certLevel: '', version: '', description: '', tags: '',
  })

  // Stats
  const activeAssets = assets.filter(a => a.status === 'active').length
  const totalRoyalties = assets.reduce((s, a) => s + a.totalRoyalties, 0)
  const pendingRequests = requests.filter(r => r.status === 'pending').length
  const totalPrints = assets.reduce((s, a) => s + a.totalPrints, 0)

  // Filtered
  const filtered = assets.filter(a => {
    const q = searchQuery.toLowerCase()
    const matchSearch = a.partName.toLowerCase().includes(q) ||
      a.partNumber.toLowerCase().includes(q) ||
      a.oemOwner.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    const matchLicense = licenseFilter === 'all' || a.licenseType === licenseFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchLicense && matchStatus
  })

  const handleApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' as RequestStatus } : r))
    setIsRequestDialogOpen(false)
    toast.success('License request approved. Requester notified.')
  }

  const handleReject = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' as RequestStatus } : r))
    setIsRequestDialogOpen(false)
    toast.error('License request rejected. Requester notified.')
  }

  const handleRegister = () => {
    if (!registerForm.partName || !registerForm.partNumber) {
      toast.error('Part name and part number are required')
      return
    }
    setIsRegisterOpen(false)
    setRegisterForm({ partName: '', partNumber: '', technology: '', material: '', licenseType: 'pay_per_print', royaltyRate: '', royaltyFlat: '', certLevel: '', version: '', description: '', tags: '' })
    toast.success('IP asset registered and submitted for platform review.')
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'IP Assets', value: activeAssets, sub: `${assets.length} total incl. drafts`, icon: BookMarked, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
          { label: 'Total Prints', value: totalPrints, sub: 'Across all licensed assets', icon: Printer, color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10' },
          { label: 'Pending Requests', value: pendingRequests, sub: 'Awaiting your review', icon: Clock, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
          { label: 'Royalties Earned', value: `$${totalRoyalties.toLocaleString()}`, sub: 'CAD, all time', icon: DollarSign, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── License Model Explainer ─────────────────────────────────────── */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1E1B4B] to-[#0F172A] text-white">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">4 License Models Available to OEMs</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  {Object.entries(licenseConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon
                    return (
                      <span key={key} className="flex items-center gap-1 text-xs text-slate-300">
                        <Icon className="w-3 h-3" />
                        <strong className="text-white">{cfg.label}</strong>
                        {key === 'pay_per_print' && ' — % royalty per job'}
                        {key === 'restricted' && ' — approved printers only'}
                        {key === 'open' && ' — no royalty, broad access'}
                        {key === 'consortium' && ' — network members only'}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-100 text-xs flex-shrink-0 flex items-center gap-1.5"
              onClick={() => setIsRegisterOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Register New IP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <Tabs defaultValue="assets">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="assets" className="text-xs">My IP Assets</TabsTrigger>
            <TabsTrigger value="requests" className="text-xs">
              License Requests
              {pendingRequests > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-[#F59E0B] text-white text-[10px] rounded-full leading-none">{pendingRequests}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs">Revenue & Usage</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Assets Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="assets" className="mt-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search by name, part number, OEM, tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
            <Select value={licenseFilter} onValueChange={setLicenseFilter}>
              <SelectTrigger className="w-40 h-9 text-xs"><SelectValue placeholder="All Licenses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All License Types</SelectItem>
                <SelectItem value="pay_per_print">Pay-Per-Print</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="consortium">Consortium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_cert">Pending Cert</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filtered.map(asset => {
              const lc = licenseConfig[asset.licenseType]
              const sc = statusConfig[asset.status]
              const LicIcon = lc.icon
              return (
                <Card key={asset.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Left — asset info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-slate-900">{asset.partName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.color}`}>{sc.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${lc.bg} ${lc.color}`}>
                            <LicIcon className="w-2.5 h-2.5" />{lc.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{asset.partNumber}</span>
                          <span className="mx-2">·</span>{asset.oemOwner}
                          <span className="mx-2">·</span>{asset.technology}
                          <span className="mx-2">·</span>{asset.certLevel}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">{asset.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">{t}</span>
                          ))}
                        </div>
                      </div>

                      {/* Right — stats */}
                      <div className="flex items-center gap-6 lg:flex-shrink-0">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900">{asset.totalPrints}</p>
                          <p className="text-[10px] text-slate-400">Prints</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900">{asset.authorizedPrinters}</p>
                          <p className="text-[10px] text-slate-400">Auth. Printers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-[#10B981]">${asset.totalRoyalties.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">Royalties</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                            <Eye className="w-3 h-3 mr-1" />View
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
                            <Download className="w-3 h-3 mr-1" />Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ── License Requests Tab ───────────────────────────────────────── */}
        <TabsContent value="requests" className="mt-0">
          <div className="space-y-3">
            {requests.map(req => {
              const rs = requestStatusConfig[req.status]
              const StatusIcon = rs.icon
              const asset = assets.find(a => a.id === req.assetId)
              const lc = asset ? licenseConfig[asset.licenseType] : null
              return (
                <Card key={req.id} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-slate-900">{req.assetName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${rs.bg} ${rs.color}`}>
                            <StatusIcon className="w-2.5 h-2.5" />{rs.label}
                          </span>
                          {lc && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${lc.bg} ${lc.color}`}>{lc.label}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mb-0.5">
                          <strong>{req.requesterName}</strong> · {req.requesterOrg}
                          <span className="mx-2 text-slate-300">|</span>
                          <span className="capitalize">{req.requesterType.replace('_', ' ')}</span>
                          <span className="mx-2 text-slate-300">|</span>
                          {req.requestDate}
                        </p>
                        <p className="text-xs text-slate-500 mb-1"><strong>Intended use:</strong> {req.intendedUse}</p>
                        <p className="text-xs text-slate-400"><strong>Est. volume:</strong> {req.volume}</p>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-slate-200"
                            onClick={() => { setSelectedRequest(req); setIsRequestDialogOpen(true) }}
                          >
                            Review
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 px-3 text-xs bg-[#10B981] hover:bg-[#059669] text-white"
                            onClick={() => handleApprove(req.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleReject(req.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ── Revenue & Usage Tab ────────────────────────────────────────── */}
        <TabsContent value="revenue" className="mt-0">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#10B981]" />
                  Royalty Earnings by Asset
                </p>
                <div className="space-y-3">
                  {assets.filter(a => a.totalRoyalties > 0).sort((a, b) => b.totalRoyalties - a.totalRoyalties).map(a => (
                    <div key={a.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 truncate flex-1 pr-2">{a.partName.split('—')[0].trim()}</span>
                        <span className="font-semibold text-slate-800">${a.totalRoyalties.toLocaleString()}</span>
                      </div>
                      <Progress value={(a.totalRoyalties / totalRoyalties) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between text-xs">
                  <span className="text-slate-500">Total all-time royalties</span>
                  <span className="font-bold text-[#10B981]">${totalRoyalties.toLocaleString()} CAD</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#0EA5E9]" />
                  Print Volume by Asset
                </p>
                <div className="space-y-3">
                  {assets.filter(a => a.totalPrints > 0).sort((a, b) => b.totalPrints - a.totalPrints).map(a => (
                    <div key={a.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 truncate flex-1 pr-2">{a.partName.split('—')[0].trim()}</span>
                        <span className="font-semibold text-slate-800">{a.totalPrints} prints</span>
                      </div>
                      <Progress value={(a.totalPrints / totalPrints) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between text-xs">
                  <span className="text-slate-500">Total prints, all assets</span>
                  <span className="font-bold text-[#0EA5E9]">{totalPrints} units</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Register IP Dialog ─────────────────────────────────────────── */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#8B5CF6]" />
              Register New IP Asset
            </DialogTitle>
            <DialogDescription>Submit a new blueprint or design for licensing on the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Part Name *</Label>
                <Input className="mt-1 h-9 text-xs" placeholder="e.g. Marine Pump Impeller" value={registerForm.partName} onChange={e => setRegisterForm(f => ({ ...f, partName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">OEM Part Number *</Label>
                <Input className="mt-1 h-9 text-xs" placeholder="e.g. WRT-IMP-7-AM" value={registerForm.partNumber} onChange={e => setRegisterForm(f => ({ ...f, partNumber: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Technology</Label>
                <Input className="mt-1 h-9 text-xs" placeholder="e.g. SLA Resin / DMLS" value={registerForm.technology} onChange={e => setRegisterForm(f => ({ ...f, technology: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Material</Label>
                <Input className="mt-1 h-9 text-xs" placeholder="e.g. Stainless 316L" value={registerForm.material} onChange={e => setRegisterForm(f => ({ ...f, material: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label className="text-xs">License Model *</Label>
              <Select value={registerForm.licenseType} onValueChange={v => setRegisterForm(f => ({ ...f, licenseType: v }))}>
                <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pay_per_print">Pay-Per-Print — % royalty per authorized job</SelectItem>
                  <SelectItem value="restricted">Restricted — pre-approved printers only, flat fee</SelectItem>
                  <SelectItem value="consortium">Consortium — available to certified network members</SelectItem>
                  <SelectItem value="open">Open — no royalty, broad platform access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(registerForm.licenseType === 'pay_per_print' || registerForm.licenseType === 'consortium') && (
              <div>
                <Label className="text-xs">Royalty Rate (%)</Label>
                <Input className="mt-1 h-9 text-xs" type="number" min="0" max="50" placeholder="e.g. 12" value={registerForm.royaltyRate} onChange={e => setRegisterForm(f => ({ ...f, royaltyRate: e.target.value }))} />
              </div>
            )}
            {registerForm.licenseType === 'restricted' && (
              <div>
                <Label className="text-xs">Flat Fee per Print (CAD)</Label>
                <Input className="mt-1 h-9 text-xs" type="number" min="0" placeholder="e.g. 850" value={registerForm.royaltyFlat} onChange={e => setRegisterForm(f => ({ ...f, royaltyFlat: e.target.value }))} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Certification Level</Label>
                <Input className="mt-1 h-9 text-xs" placeholder="e.g. DNV Type Approved" value={registerForm.certLevel} onChange={e => setRegisterForm(f => ({ ...f, certLevel: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Version</Label>
                <Input className="mt-1 h-9 text-xs" placeholder="e.g. v1.0" value={registerForm.version} onChange={e => setRegisterForm(f => ({ ...f, version: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea className="mt-1 text-xs resize-none" rows={2} placeholder="Describe the part, use case, and any licensing restrictions..." value={registerForm.description} onChange={e => setRegisterForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Upload Blueprint File</Label>
              <label className="mt-1 flex items-center justify-center gap-2 h-14 border-2 border-dashed rounded-md cursor-pointer hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">.stl / .step / .3mf — encrypted at rest</span>
                <input type="file" className="sr-only" accept=".stl,.step,.stp,.3mf,.amf" />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button size="sm" className="text-xs bg-[#8B5CF6] hover:bg-[#7C3AED] text-white" onClick={handleRegister}>
              Register IP Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Review Request Dialog ──────────────────────────────────────── */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review License Request</DialogTitle>
            {selectedRequest && (
              <DialogDescription>
                {selectedRequest.requesterName} · {selectedRequest.requesterOrg}
              </DialogDescription>
            )}
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3 py-2">
              <div className="rounded-md bg-slate-50 p-3 space-y-1.5">
                <p className="text-xs"><strong className="text-slate-700">Asset:</strong> <span className="text-slate-600">{selectedRequest.assetName}</span></p>
                <p className="text-xs"><strong className="text-slate-700">Intended Use:</strong> <span className="text-slate-600">{selectedRequest.intendedUse}</span></p>
                <p className="text-xs"><strong className="text-slate-700">Volume:</strong> <span className="text-slate-600">{selectedRequest.volume}</span></p>
                <p className="text-xs"><strong className="text-slate-700">Notes:</strong> <span className="text-slate-600">{selectedRequest.notes}</span></p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsRequestDialogOpen(false)}>Close</Button>
            <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => selectedRequest && handleReject(selectedRequest.id)}>
              <XCircle className="w-3 h-3 mr-1" />Reject
            </Button>
            <Button size="sm" className="text-xs bg-[#10B981] hover:bg-[#059669] text-white" onClick={() => selectedRequest && handleApprove(selectedRequest.id)}>
              <CheckCircle className="w-3 h-3 mr-1" />Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
