'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Printer,
  Search,
  Plus,
  MapPin,
  Star,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Package,
  Filter,
  Heart,
  Calendar,
  ArrowRight,
  Info,
  Wifi,
  WifiOff,
  Award,
  Upload,
  X,
  FileCode,
  Building2,
  ClipboardCheck,
  Lock,
  FlaskConical,
  TestTubeDiagonal,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'

// ── Types ─────────────────────────────────────────────────────────────────────
type Tier = 1 | 2 | 3
type PrinterStatus = 'available' | 'busy' | 'offline'

interface PeerPrinter {
  id: string
  ownerId: string
  ownerName: string
  ownerOrg: string
  ownerRating: number
  ownerReviews: number
  model: string
  technology: string
  buildVolume: string
  materials: string[]
  location: string
  distance: number
  tier: Tier
  status: PrinterStatus
  pricePerJob: number
  currency: string
  minJobValue: number
  completedJobs: number
  onTimeRate: number
  available: string
  description: string
  certifications: string[]
  oemPartners: string[]
  listedDate: string
  totalEarnings: number
  imageColor: string
}

interface MyListing {
  id: string
  model: string
  technology: string
  status: PrinterStatus
  requestsPending: number
  completedJobs: number
  totalEarnings: number
  pricePerJob: number
  listedDate: string
  materials: string[]
  tier: Tier
}

// ── Static data ───────────────────────────────────────────────────────────────
const peerPrinters: PeerPrinter[] = [
  {
    id: 'pp-001',
    ownerId: 'usr-014',
    ownerName: 'Arad Gharagozli',
    ownerOrg: 'Galaxia Mission Systems',
    ownerRating: 4.9,
    ownerReviews: 23,
    model: 'Bambu Lab X1 Carbon',
    technology: 'FDM',
    buildVolume: '256 × 256 × 256 mm',
    materials: ['PLA', 'PETG', 'TPU', 'ABS', 'ASA'],
    location: 'Halifax, NS',
    distance: 2.1,
    tier: 1,
    status: 'available',
    pricePerJob: 45,
    currency: 'CAD',
    minJobValue: 20,
    completedJobs: 23,
    onTimeRate: 96,
    available: 'Mon–Sat, 8am–8pm',
    description: 'High-speed multi-material FDM printer. Ideal for functional prototypes and non-critical replacement parts. I can pick up your blueprint file and print same-day for urgent needs.',
    certifications: [],
    oemPartners: [],
    listedDate: '2026-01-12',
    totalEarnings: 1035,
    imageColor: 'from-[#0EA5E9] to-[#14B8A6]',
  },
  {
    id: 'pp-002',
    ownerId: 'usr-027',
    ownerName: 'Sarah Leblanc',
    ownerOrg: 'Dalhousie Prototyping Lab',
    ownerRating: 4.7,
    ownerReviews: 41,
    model: 'Formlabs Form 3L',
    technology: 'SLA Resin',
    buildVolume: '335 × 200 × 300 mm',
    materials: ['Standard Resin', 'Tough 2000', 'Flexible 80A', 'Castable Wax'],
    location: 'Halifax, NS',
    distance: 3.8,
    tier: 2,
    status: 'available',
    pricePerJob: 95,
    currency: 'CAD',
    minJobValue: 50,
    completedJobs: 41,
    onTimeRate: 100,
    available: 'Weekdays, 9am–5pm',
    description: 'University-grade SLA printer with verified operator. Parts come with dimensional accuracy report. Suitable for marine hardware fittings, jigs, and moderate-criticality components.',
    certifications: ['ISO 9001 Print Operator', 'Dal AM Lab Certified'],
    oemPartners: ['Rolls-Royce Marine', 'MAN Energy Solutions'],
    listedDate: '2025-11-05',
    totalEarnings: 3895,
    imageColor: 'from-[#8B5CF6] to-[#EC4899]',
  },
  {
    id: 'pp-003',
    ownerId: 'usr-033',
    ownerName: 'Omar Tremblay',
    ownerOrg: 'Independent',
    ownerRating: 4.5,
    ownerReviews: 12,
    model: 'Prusa MK4',
    technology: 'FDM',
    buildVolume: '250 × 210 × 220 mm',
    materials: ['PLA', 'PETG', 'TPU'],
    location: 'Dartmouth, NS',
    distance: 6.4,
    tier: 1,
    status: 'busy',
    pricePerJob: 30,
    currency: 'CAD',
    minJobValue: 15,
    completedJobs: 12,
    onTimeRate: 92,
    available: 'Evenings & weekends',
    description: 'Reliable workhorse printer for brackets, spacers, enclosures, and general functional parts. Contact me 24hr ahead to schedule.',
    certifications: [],
    oemPartners: [],
    listedDate: '2026-02-01',
    totalEarnings: 360,
    imageColor: 'from-[#F59E0B] to-[#EF4444]',
  },
  {
    id: 'pp-004',
    ownerId: 'usr-041',
    ownerName: 'Nadia Kowalski',
    ownerOrg: 'Atlantic Composites Inc.',
    ownerRating: 5.0,
    ownerReviews: 8,
    model: 'Markforged Mark Two',
    technology: 'Continuous Fiber FFF',
    buildVolume: '320 × 132 × 154 mm',
    materials: ['Onyx', 'HSHT Fiberglass', 'Carbon Fiber Continuous'],
    location: 'Dartmouth, NS',
    distance: 7.1,
    tier: 2,
    status: 'available',
    pricePerJob: 180,
    currency: 'CAD',
    minJobValue: 100,
    completedJobs: 8,
    onTimeRate: 100,
    available: 'Mon–Fri, 8am–6pm',
    description: 'Industrial-grade continuous fiber printer. Produces parts stronger than aluminum at a fraction of the cost. Ideal for tooling, jigs, and structurally demanding replacements where certification is not yet required.',
    certifications: ['Markforged Certified Operator', 'Atlantic Composites QA'],
    oemPartners: ['Wärtsilä', 'Atlas Copco Marine'],
    listedDate: '2026-01-28',
    totalEarnings: 1440,
    imageColor: 'from-[#14B8A6] to-[#0EA5E9]',
  },
  {
    id: 'pp-005',
    ownerId: 'usr-055',
    ownerName: 'Michael Okafor',
    ownerOrg: 'PolyUnity NL (partner)',
    ownerRating: 4.8,
    ownerReviews: 67,
    model: '3D Systems ProJet MJP 2500',
    technology: 'Multi-Jet Printing',
    buildVolume: '295 × 211 × 142 mm',
    materials: ['VisiJet M2R-WT', 'VisiJet M2R-CL', 'VisiJet Flex'],
    location: 'St. John\'s, NL (remote ship)',
    distance: 0,
    tier: 3,
    status: 'available',
    pricePerJob: 310,
    currency: 'CAD',
    minJobValue: 150,
    completedJobs: 67,
    onTimeRate: 98,
    available: 'Mon–Fri, 7am–7pm NST',
    description: 'PolyUnity partner node — certified for regulated print jobs in medical and marine sectors. Full chain of custody, OEM blueprint authentication, and signed quality report included. Part shipment to any Atlantic port within 48hr.',
    certifications: ['Health Canada AM Operator', 'DNV Type Approval', 'ISO 13485 (Medical)', 'Lloyd\'s Register AM Framework'],
    oemPartners: ['Rolls-Royce Marine', 'Caterpillar Marine', 'Siemens Energy'],
    listedDate: '2025-09-15',
    totalEarnings: 20770,
    imageColor: 'from-[#10B981] to-[#059669]',
  },
]

const myListings: MyListing[] = [
  {
    id: 'ml-001',
    model: 'Bambu Lab P1S',
    technology: 'FDM',
    status: 'available',
    requestsPending: 2,
    completedJobs: 7,
    totalEarnings: 315,
    pricePerJob: 45,
    listedDate: '2026-02-10',
    materials: ['PLA', 'PETG', 'ABS'],
    tier: 1,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const tierConfig: Record<Tier, { label: string; color: string; bg: string; description: string; icon: any }> = {
  1: {
    label: 'Tier 1 — Peer',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    description: 'Non-critical, commodity parts. No certification required.',
    icon: Zap,
  },
  2: {
    label: 'Tier 2 — Verified SME',
    color: 'text-[#0EA5E9]',
    bg: 'bg-[#0EA5E9]/10',
    description: 'Operator-verified. Semi-critical, self-certified output.',
    icon: Shield,
  },
  3: {
    label: 'Tier 3 — Certified',
    color: 'text-[#14B8A6]',
    bg: 'bg-[#14B8A6]/10',
    description: 'Full certification chain. Regulated & safety-critical parts.',
    icon: Award,
  },
}

const statusConfig: Record<PrinterStatus, { label: string; color: string; dot: string }> = {
  available: { label: 'Available', color: 'text-[#14B8A6]', dot: 'bg-[#14B8A6]' },
  busy: { label: 'Busy', color: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  offline: { label: 'Offline', color: 'text-slate-400', dot: 'bg-slate-400' },
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PeerPrintersPage({ role = 'admin' }: { role?: string }) {
  const [printers] = useState<PeerPrinter[]>(peerPrinters)
  const [listings, setListings] = useState<MyListing[]>(myListings)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [technologyFilter, setTechnologyFilter] = useState<string>('all')

  // Dialogs
  const [isListOpen, setIsListOpen] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isTierInfoOpen, setIsTierInfoOpen] = useState(false)
  const [selectedPrinter, setSelectedPrinter] = useState<PeerPrinter | null>(null)

  // List Your Printer form
  const [listForm, setListForm] = useState({
    model: '',
    technology: 'FDM',
    buildVolume: '',
    materials: '',
    location: '',
    pricePerJob: '',
    available: '',
    description: '',
    tier: '1' as string,
    certifications: '',
  })

  // Request print form
  const [requestForm, setRequestForm] = useState({
    partName: '',
    quantity: '1',
    material: '',
    urgency: 'standard',
    notes: '',
    blueprintRef: '',
    oemAuthCode: '',
    certBody: '',
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // ── Filtered printers
  const filtered = printers.filter(p => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      p.model.toLowerCase().includes(q) ||
      p.ownerName.toLowerCase().includes(q) ||
      p.ownerOrg.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.materials.some(m => m.toLowerCase().includes(q))
    const matchesTier = tierFilter === 'all' || p.tier === Number(tierFilter)
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    const matchesTech = technologyFilter === 'all' || p.technology === technologyFilter
    return matchesSearch && matchesTier && matchesStatus && matchesTech
  })

  // ── Stats
  const totalEarningsNetwork = printers.reduce((s, p) => s + p.totalEarnings, 0)
  const availableCount = printers.filter(p => p.status === 'available').length
  const totalJobs = printers.reduce((s, p) => s + p.completedJobs, 0)
  const myTotalEarnings = listings.reduce((s, l) => s + l.totalEarnings, 0)

  // ── Handlers
  const handleListPrinter = () => {
    if (!listForm.model || !listForm.location || !listForm.pricePerJob) {
      toast.error('Model, location, and price are required')
      return
    }
    const newListing: MyListing = {
      id: `ml-${Date.now()}`,
      model: listForm.model,
      technology: listForm.technology,
      status: 'available',
      requestsPending: 0,
      completedJobs: 0,
      totalEarnings: 0,
      pricePerJob: Number(listForm.pricePerJob),
      listedDate: new Date().toISOString().split('T')[0],
      materials: listForm.materials.split(',').map(s => s.trim()).filter(Boolean),
      tier: Number(listForm.tier) as Tier,
    }
    setListings(prev => [...prev, newListing])
    setIsListOpen(false)
    setListForm({ model: '', technology: 'FDM', buildVolume: '', materials: '', location: '', pricePerJob: '', available: '', description: '', tier: '1', certifications: '' })
    toast.success(`${newListing.model} listed successfully! You'll be notified when print requests come in.`)
  }

  const handleRequestPrint = () => {
    if (!requestForm.partName || !requestForm.material) {
      toast.error('Part name and material are required')
      return
    }
    if (selectedPrinter?.tier === 3 && (!requestForm.oemAuthCode || !requestForm.certBody)) {
      toast.error('Tier 3 jobs require an OEM authorization code and a certifying body')
      return
    }
    setIsRequestOpen(false)
    setRequestForm({ partName: '', quantity: '1', material: '', urgency: 'standard', notes: '', blueprintRef: '', oemAuthCode: '', certBody: '' })
    setUploadedFile(null)
    toast.success(`Print request sent to ${selectedPrinter?.ownerName}! Expect a response within 2 hours.`)
  }

  const openRequest = (printer: PeerPrinter) => {
    setSelectedPrinter(printer)
    setIsRequestOpen(true)
  }

  // ── Render
  return (
    <div className="p-6 space-y-6">

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Peer Printers</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{printers.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">{availableCount} available now</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                <Printer className="w-5 h-5 text-[#0EA5E9]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Network Jobs</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalJobs}</p>
                <p className="text-xs text-slate-400 mt-0.5">Completed all time</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#14B8A6]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Network Earnings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${totalEarningsNetwork.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-0.5">Distributed to owners</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">My Earnings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${myTotalEarnings.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-0.5">{listings.length} printer{listings.length !== 1 ? 's' : ''} listed</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tier Info Banner ────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Peer-to-Peer Printer Network — How Tiers Work</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Tier 1 handles non-critical commodity parts (no certification needed). Tier 2 covers operator-verified semi-critical parts. Tier 3 is the fully certified chain for regulated industries (marine, defense, aerospace-adjacent).
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-xs flex-shrink-0"
              onClick={() => setIsTierInfoOpen(true)}
            >
              View Tier Guide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Compliance Chain ─────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#14B8A6]" />
            Compliance &amp; Oversight Chain — Who is in Charge
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
            {[
              { icon: Building2, label: 'OEM', sub: 'Blueprint auth & IP licensing', color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10' },
              { icon: Lock, label: 'Platform', sub: 'Escrow + routing + traceability', color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10' },
              { icon: Printer, label: 'Peer Printer', sub: 'Print + operator QA check', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
              { icon: ClipboardCheck, label: 'Cert Body', sub: 'Inspection + sign-off (Tier 2/3)', color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
              { icon: Package, label: 'Customer', sub: 'Delivery + part traceability record', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
            ].map(({ icon: Icon, label, sub, color, bg }, i, arr) => (
              <div key={label} className="flex sm:flex-1 items-center gap-2 sm:gap-0">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-1`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-700 text-center">{label}</p>
                  <p className="text-[10px] text-slate-400 text-center leading-tight mt-0.5">{sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mx-1 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 border-t pt-2">
            <strong className="text-slate-500">Payment escrow:</strong> funds are held by the platform and released to the printer owner only after the certifying body approves the output. Tier 1 jobs release on delivery confirmation.
          </p>
        </CardContent>
      </Card>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <Tabs defaultValue="browse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="browse" className="text-xs">Browse Printers</TabsTrigger>
            <TabsTrigger value="my_listings" className="text-xs">My Listed Printers</TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs">Earnings & History</TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs flex items-center gap-1.5"
            onClick={() => setIsListOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            List My Printer
          </Button>
        </div>

        {/* ── Browse Tab ─────────────────────────────────────────────── */}
        <TabsContent value="browse" className="mt-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search by owner, model, material, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="All Tiers" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="1">Tier 1 — Peer</SelectItem>
                <SelectItem value="2">Tier 2 — Verified</SelectItem>
                <SelectItem value="3">Tier 3 — Certified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
              <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="All Technologies" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                <SelectItem value="FDM">FDM</SelectItem>
                <SelectItem value="SLA Resin">SLA Resin</SelectItem>
                <SelectItem value="Continuous Fiber FFF">Continuous Fiber</SelectItem>
                <SelectItem value="Multi-Jet Printing">Multi-Jet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Printer Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Printer className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No printers match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(printer => {
                const tier = tierConfig[printer.tier]
                const TierIcon = tier.icon
                const status = statusConfig[printer.status]
                return (
                  <Card key={printer.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${printer.imageColor} flex items-center justify-center flex-shrink-0`}>
                            <Printer className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{printer.model}</p>
                            <p className="text-xs text-slate-500">{printer.technology} &middot; {printer.buildVolume}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${tier.bg}`}>
                            <TierIcon className={`w-3 h-3 ${tier.color}`} />
                            <span className={`text-xs font-medium ${tier.color}`}>{tier.label.split(' — ')[1]}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* Owner */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{printer.ownerName}</p>
                          <p className="text-xs text-slate-400 truncate">{printer.ownerOrg}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                          <span className="text-xs font-semibold text-slate-700">{printer.ownerRating}</span>
                          <span className="text-xs text-slate-400">({printer.ownerReviews})</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{printer.description}</p>

                      {/* Materials */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {printer.materials.slice(0, 4).map(m => (
                          <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{m}</span>
                        ))}
                        {printer.materials.length > 4 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px]">+{printer.materials.length - 4}</span>
                        )}
                      </div>

                      {/* Certifications (Tier 2/3) */}
                      {printer.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {printer.certifications.map(c => (
                            <span key={c} className="px-2 py-0.5 bg-[#14B8A6]/10 text-[#14B8A6] rounded text-[10px] flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5" />{c}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* OEM Partners (Tier 2/3) */}
                      {printer.oemPartners.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {printer.oemPartners.map(oem => (
                            <span key={oem} className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-[10px] flex items-center gap-1">
                              <Building2 className="w-2.5 h-2.5" />{oem}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-900">{printer.completedJobs}</p>
                          <p className="text-[10px] text-slate-400">Jobs done</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-900">{printer.onTimeRate}%</p>
                          <p className="text-[10px] text-slate-400">On time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-900">${printer.pricePerJob}</p>
                          <p className="text-[10px] text-slate-400">Per job</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {printer.location}{printer.distance > 0 ? ` · ${printer.distance}km` : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {printer.available.split(',')[0]}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          disabled={printer.status !== 'available'}
                          onClick={() => openRequest(printer)}
                          className="h-7 px-3 text-xs bg-[#0EA5E9] hover:bg-[#0284C7] text-white disabled:opacity-40"
                        >
                          {printer.status === 'available' ? 'Request Print' : printer.status === 'busy' ? 'Busy' : 'Offline'}
                          {printer.status === 'available' && <ArrowRight className="w-3 h-3 ml-1" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ── My Listings Tab ─────────────────────────────────────────── */}
        <TabsContent value="my_listings" className="mt-0">
          {listings.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Printer className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium mb-1">No printers listed yet</p>
              <p className="text-xs">List your idle printer and start earning when others use it.</p>
              <Button
                size="sm"
                className="mt-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs"
                onClick={() => setIsListOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                List My Printer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map(listing => {
                const tier = tierConfig[listing.tier]
                const TierIcon = tier.icon
                const status = statusConfig[listing.status]
                return (
                  <Card key={listing.id} className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#14B8A6] flex items-center justify-center">
                            <Printer className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{listing.model}</p>
                            <p className="text-xs text-slate-500">{listing.technology} &middot; Listed {listing.listedDate}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${tier.bg}`}>
                            <TierIcon className={`w-3 h-3 ${tier.color}`} />
                            <span className={`text-xs font-medium ${tier.color}`}>{tier.label.split(' — ')[1]}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-900">${listing.totalEarnings.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">Total earned</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{listing.completedJobs}</p>
                          <p className="text-[10px] text-slate-400">Jobs done</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#F59E0B]">{listing.requestsPending}</p>
                          <p className="text-[10px] text-slate-400">Pending requests</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">${listing.pricePerJob}</p>
                          <p className="text-[10px] text-slate-400">Per job</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {listing.materials.map(m => (
                          <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{m}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-dashed"
                onClick={() => setIsListOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                List Another Printer
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ── Earnings Tab ─────────────────────────────────────────────── */}
        <TabsContent value="earnings" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">My Total Earned</p>
                <p className="text-3xl font-bold text-[#14B8A6]">${myTotalEarnings.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">Since listing</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Jobs Completed</p>
                <p className="text-3xl font-bold text-[#0EA5E9]">{listings.reduce((s, l) => s + l.completedJobs, 0)}</p>
                <p className="text-xs text-slate-400 mt-1">Across all my listings</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-[#F59E0B]">{listings.reduce((s, l) => s + l.requestsPending, 0)}</p>
                <p className="text-xs text-slate-400 mt-1">Awaiting your response</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-900 mb-4">Network Earnings Distribution by Tier</p>
              <div className="space-y-4">
                {([1, 2, 3] as Tier[]).map(tier => {
                  const tierPrinters = printers.filter(p => p.tier === tier)
                  const tierEarnings = tierPrinters.reduce((s, p) => s + p.totalEarnings, 0)
                  const pct = Math.round((tierEarnings / totalEarningsNetwork) * 100)
                  const cfg = tierConfig[tier]
                  const TierIcon = cfg.icon
                  return (
                    <div key={tier}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${cfg.bg} flex items-center justify-center`}>
                            <TierIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          </div>
                          <span className="text-xs font-medium text-slate-700">{cfg.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">${tierEarnings.toLocaleString()}</span>
                          <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <p className="text-[10px] text-slate-400 mt-1">{tierPrinters.length} printer{tierPrinters.length !== 1 ? 's' : ''} &middot; {tierPrinters.reduce((s, p) => s + p.completedJobs, 0)} jobs</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── List My Printer Dialog ─────────────────────────────────── */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#0EA5E9]" />
              List Your Printer
            </DialogTitle>
            <DialogDescription>
              Make your idle printer available to the network. You&apos;ll be paid per completed job — you control availability, pricing, and which requests you accept.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Printer Model *</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. Bambu Lab X1C"
                  value={listForm.model}
                  onChange={e => setListForm(f => ({ ...f, model: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Technology *</Label>
                <Select value={listForm.technology} onValueChange={v => setListForm(f => ({ ...f, technology: v }))}>
                  <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FDM">FDM</SelectItem>
                    <SelectItem value="SLA Resin">SLA Resin</SelectItem>
                    <SelectItem value="SLS">SLS</SelectItem>
                    <SelectItem value="Continuous Fiber FFF">Continuous Fiber FFF</SelectItem>
                    <SelectItem value="Multi-Jet Printing">Multi-Jet Printing</SelectItem>
                    <SelectItem value="DLP">DLP</SelectItem>
                    <SelectItem value="DMLS/SLM">DMLS/SLM (Metal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Build Volume (mm)</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. 256 × 256 × 256"
                  value={listForm.buildVolume}
                  onChange={e => setListForm(f => ({ ...f, buildVolume: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Price Per Job (CAD) *</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  type="number"
                  placeholder="e.g. 45"
                  value={listForm.pricePerJob}
                  onChange={e => setListForm(f => ({ ...f, pricePerJob: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Materials (comma-separated)</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. PLA, PETG, TPU, ABS"
                value={listForm.materials}
                onChange={e => setListForm(f => ({ ...f, materials: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Location *</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. Halifax, NS"
                value={listForm.location}
                onChange={e => setListForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Availability</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. Mon–Fri, 9am–5pm"
                value={listForm.available}
                onChange={e => setListForm(f => ({ ...f, available: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Tier *</Label>
              <Select value={listForm.tier} onValueChange={v => setListForm(f => ({ ...f, tier: v }))}>
                <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Tier 1 — Peer (non-critical parts, no certification)</SelectItem>
                  <SelectItem value="2">Tier 2 — Verified SME (operator-certified, semi-critical)</SelectItem>
                  <SelectItem value="3">Tier 3 — Certified (regulated, full chain of custody)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-slate-400 mt-1">{tierConfig[Number(listForm.tier) as Tier].description}</p>
            </div>
            {Number(listForm.tier) >= 2 && (
              <div>
                <Label className="text-xs">Certifications (comma-separated)</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. ISO 9001, DNV Type Approval"
                  value={listForm.certifications}
                  onChange={e => setListForm(f => ({ ...f, certifications: e.target.value }))}
                />
              </div>
            )}
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                className="mt-1 text-xs resize-none"
                rows={3}
                placeholder="Tell requesters what you can print, typical turnaround, any specialties..."
                value={listForm.description}
                onChange={e => setListForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsListOpen(false)}>Cancel</Button>
            <Button size="sm" className="text-xs bg-[#0EA5E9] hover:bg-[#0284C7] text-white" onClick={handleListPrinter}>
              List Printer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Request Print Dialog ──────────────────────────────────────── */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0EA5E9]" />
              Request a Print
            </DialogTitle>
            <DialogDescription>
              {selectedPrinter && (
                <span>Sending to <strong>{selectedPrinter.ownerName}</strong> ({selectedPrinter.model}) &middot; ${selectedPrinter.pricePerJob} per job</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs">Part Name *</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. Pump Bracket Spacer"
                value={requestForm.partName}
                onChange={e => setRequestForm(f => ({ ...f, partName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Quantity</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  type="number"
                  min="1"
                  value={requestForm.quantity}
                  onChange={e => setRequestForm(f => ({ ...f, quantity: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs">Material *</Label>
                <Select value={requestForm.material} onValueChange={v => setRequestForm(f => ({ ...f, material: v }))}>
                  <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {selectedPrinter?.materials.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Urgency</Label>
              <Select value={requestForm.urgency} onValueChange={v => setRequestForm(f => ({ ...f, urgency: v }))}>
                <SelectTrigger className="mt-1 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (2–5 days)</SelectItem>
                  <SelectItem value="expedited">Expedited (24–48 hr)</SelectItem>
                  <SelectItem value="urgent">Urgent (same day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Blueprint Reference (optional)</Label>
              <Input
                className="mt-1 h-9 text-xs"
                placeholder="e.g. BP-1024 or paste file link"
                value={requestForm.blueprintRef}
                onChange={e => setRequestForm(f => ({ ...f, blueprintRef: e.target.value }))}
              />
            </div>

            {/* ── Compliance — Tier-conditional ──────────────────────── */}
            {selectedPrinter?.tier === 1 && (
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                <p className="text-[10px] font-semibold text-amber-700 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Tier 1 — Non-Critical Only
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">No OEM authorization or certification body required. Parts must be non-critical, non-load-bearing, and unregulated. Payment releases automatically on delivery confirmation.</p>
              </div>
            )}
            {selectedPrinter?.tier === 2 && (
              <div className="rounded-md bg-blue-50 border border-blue-200 p-3 space-y-2">
                <p className="text-[10px] font-semibold text-blue-700 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Tier 2 — OEM Authorization Reference
                </p>
                <p className="text-[10px] text-blue-600">Provide an OEM blueprint auth code if available. Output is self-certified by the printer operator — no third-party inspection required. Payment releases when operator marks job complete.</p>
                <Input
                  className="h-8 text-xs bg-white"
                  placeholder="OEM auth code or blueprint ID (optional)"
                  value={requestForm.oemAuthCode}
                  onChange={e => setRequestForm(f => ({ ...f, oemAuthCode: e.target.value }))}
                />
              </div>
            )}
            {selectedPrinter?.tier === 3 && (
              <div className="rounded-md bg-teal-50 border border-teal-200 p-3 space-y-2">
                <p className="text-[10px] font-semibold text-teal-700 flex items-center gap-1.5">
                  <ClipboardCheck className="w-3 h-3" /> Tier 3 — Full Compliance Required
                </p>
                <p className="text-[10px] text-teal-600">OEM blueprint authentication and a certifying body are mandatory. Payment is held in escrow until the cert body approves the output and signs the quality report.</p>
                <div>
                  <Label className="text-[10px] font-semibold text-teal-700">OEM Authorization Code *</Label>
                  <Input
                    className="mt-1 h-8 text-xs bg-white"
                    placeholder="e.g. RR-AM-2026-0047"
                    value={requestForm.oemAuthCode}
                    onChange={e => setRequestForm(f => ({ ...f, oemAuthCode: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-semibold text-teal-700">Certifying Body *</Label>
                  <Select value={requestForm.certBody} onValueChange={v => setRequestForm(f => ({ ...f, certBody: v }))}>
                    <SelectTrigger className="mt-1 h-8 text-xs bg-white"><SelectValue placeholder="Select certifying body..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dnv">DNV — Det Norske Veritas</SelectItem>
                      <SelectItem value="lloyds">Lloyd&apos;s Register</SelectItem>
                      <SelectItem value="bureau_veritas">Bureau Veritas</SelectItem>
                      <SelectItem value="class_nk">ClassNK</SelectItem>
                      <SelectItem value="abs">ABS — American Bureau of Shipping</SelectItem>
                      <SelectItem value="tc_canada">Transport Canada</SelectItem>
                      <SelectItem value="health_canada">Health Canada (Medical)</SelectItem>
                      <SelectItem value="iso_9001">ISO 9001 — Internal Audit Body</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs">Attach Print File (optional)</Label>
              <p className="text-[10px] text-muted-foreground mb-1">Supported: .stl, .obj, .step, .stp, .3mf</p>
              {uploadedFile ? (
                <div className="flex items-center gap-2 mt-1 p-2 rounded-md border bg-muted/40">
                  <FileCode className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                  <span className="text-xs truncate flex-1">{uploadedFile.name}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{(uploadedFile.size / 1024).toFixed(0)} KB</span>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="mt-1 flex items-center justify-center gap-2 h-16 border-2 border-dashed rounded-md cursor-pointer hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/5 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload or drag & drop</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".stl,.obj,.step,.stp,.3mf,.amf"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) setUploadedFile(f)
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
            <div>
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                className="mt-1 text-xs resize-none"
                rows={2}
                placeholder="Tolerances, surface finish, color, delivery address..."
                value={requestForm.notes}
                onChange={e => setRequestForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsRequestOpen(false)}>Cancel</Button>
            <Button size="sm" className="text-xs bg-[#0EA5E9] hover:bg-[#0284C7] text-white" onClick={handleRequestPrint}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Tier Info Dialog ──────────────────────────────────────────── */}
      <Dialog open={isTierInfoOpen} onOpenChange={setIsTierInfoOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Peer Printer Tier Guide</DialogTitle>
            <DialogDescription>
              AddManuChain uses a three-tier model to match print requests with the right level of quality and certification for each part.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {([1, 2, 3] as Tier[]).map(tier => {
              const cfg = tierConfig[tier]
              const TierIcon = cfg.icon
              return (
                <div key={tier} className={`p-4 rounded-xl ${cfg.bg} border border-transparent`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TierIcon className={`w-4 h-4 ${cfg.color}`} />
                    <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-slate-600">{cfg.description}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    {tier === 1 && <p>Best for: brackets, spacers, housings, jigs, non-structural enclosures, rapid prototyping. No paper trail required.</p>}
                    {tier === 2 && <p>Best for: marine fitting replacements, tooling, moderate-load structural parts. Operator must have verifiable credentials. Self-certified quality report provided.</p>}
                    {tier === 3 && <p>Best for: regulated industries — defense, marine classification, offshore oil & gas, medical-adjacent. Full OEM blueprint authentication, DNV/Lloyd&apos;s/ISO chain of custody, signed quality report, part traceability.</p>}
                  </div>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button size="sm" className="text-xs bg-[#0EA5E9] hover:bg-[#0284C7] text-white" onClick={() => setIsTierInfoOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
