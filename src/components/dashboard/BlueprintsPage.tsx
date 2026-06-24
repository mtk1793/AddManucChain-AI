'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
  FileBox, Search, Filter, Plus, Eye, Trash2, Package, Layers,
  Upload, X, CheckCircle, LayoutGrid, List, FileText, Info, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { blueprints as initialBlueprints } from '@/lib/static-data'

// ── Types ──────────────────────────────────────────────────────────────────
interface UploadedFile {
  name: string
  size: number
  type: string
  dataUrl?: string
}

interface Blueprint {
  id: string
  blueprintId: string
  name: string
  category: string
  material: string
  oem: string
  certification: string
  status: string
  printCount: number
  description?: string
  file?: UploadedFile
}

// ── Constants ──────────────────────────────────────────────────────────────
const ACCEPTED = '.stl,.step,.stp,.obj,.3mf,.dxf,.dwg,.pdf,.iges,.igs,.png,.jpg,.jpeg,.svg'
const FORMAT_COLOR: Record<string, string> = {
  stl: '#0EA5E9', step: '#14B8A6', stp: '#14B8A6', obj: '#F59E0B', '3mf': '#8B5CF6',
  dxf: '#10B981', dwg: '#059669', iges: '#6366f1', igs: '#6366f1',
  pdf: '#ef4444', png: '#ec4899', jpg: '#ec4899', jpeg: '#ec4899', svg: '#f97316',
}
const FORMAT_LABEL: Record<string, string> = {
  stl: 'STL', step: 'STEP', stp: 'STEP', obj: 'OBJ', '3mf': '3MF',
  dxf: 'DXF', dwg: 'DWG', iges: 'IGES', igs: 'IGES', pdf: 'PDF',
  png: 'PNG', jpg: 'JPG', jpeg: 'JPG', svg: 'SVG',
}
const formatSize = (b: number) =>
  b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

// ── SVG Technical Drawing ─────────────────────────────────────────────────
function BlueprintDrawing({ bp }: { bp: Blueprint }) {
  const W = 400; const H = 300
  const cx = 195; const cy = 108
  const bw = 110; const bh = 68; const bd = 44
  const top: [number, number][] = [
    [cx, cy],
    [cx + bw / 2, cy + bh * 0.28],
    [cx, cy + bh * 0.56],
    [cx - bw / 2, cy + bh * 0.28],
  ]
  const left: [number, number][] = [
    [cx - bw / 2, cy + bh * 0.28],
    [cx, cy + bh * 0.56],
    [cx, cy + bh * 0.56 + bd],
    [cx - bw / 2, cy + bh * 0.28 + bd],
  ]
  const right: [number, number][] = [
    [cx, cy + bh * 0.56],
    [cx + bw / 2, cy + bh * 0.28],
    [cx + bw / 2, cy + bh * 0.28 + bd],
    [cx, cy + bh * 0.56 + bd],
  ]
  const pts = (arr: [number, number][]) => arr.map(p => p.join(',')).join(' ')
  const hue = bp.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  const accent = `hsl(${hue},70%,55%)`

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#0EA5E9]/20 bg-[#060f1e]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'monospace' }}>
        <defs>
          <pattern id="bp-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#0EA5E9" strokeWidth="0.15" opacity="0.25" />
          </pattern>
          <pattern id="bp-grid-major" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M 90 0 L 0 0 0 90" fill="none" stroke="#0EA5E9" strokeWidth="0.4" opacity="0.18" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="#060f1e" />
        <rect width={W} height={H} fill="url(#bp-grid)" />
        <rect width={W} height={H} fill="url(#bp-grid-major)" />
        <rect x="5" y="5" width={W - 10} height={H - 10} fill="none" stroke="#0EA5E9" strokeWidth="1.2" opacity="0.45" />
        <rect x="9" y="9" width={W - 18} height={H - 18} fill="none" stroke="#0EA5E9" strokeWidth="0.4" opacity="0.2" />
        {/* Center cross */}
        <line x1={cx - 10} y1={cy + bh * 0.28 + bd / 2} x2={cx + 10} y2={cy + bh * 0.28 + bd / 2} stroke="#14B8A6" strokeWidth="0.7" opacity="0.5" strokeDasharray="3,2,1,2" />
        <line x1={cx} y1={cy + bh * 0.28 + bd / 2 - 10} x2={cx} y2={cy + bh * 0.28 + bd / 2 + 10} stroke="#14B8A6" strokeWidth="0.7" opacity="0.5" strokeDasharray="3,2,1,2" />
        {/* Isometric box */}
        <polygon points={pts(top)} fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1.4" />
        <polygon points={pts(left)} fill="#0EA5E9" fillOpacity="0.07" stroke="#0EA5E9" strokeWidth="1.2" />
        <polygon points={pts(right)} fill="#0EA5E9" fillOpacity="0.12" stroke="#0EA5E9" strokeWidth="1.2" />
        <line x1={cx - bw / 2} y1={cy + bh * 0.28} x2={cx} y2={cy} stroke="#0EA5E9" strokeWidth="0.7" strokeDasharray="3,2" opacity="0.4" />
        {[...top].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={accent} opacity="0.9" />)}
        {/* Dimension width */}
        <line x1={cx - bw / 2 - 2} y1={cy + bh * 0.28 - 14} x2={cx + bw / 2 + 2} y2={cy + bh * 0.28 - 14} stroke="#F59E0B" strokeWidth="0.6" />
        <line x1={cx - bw / 2} y1={cy + bh * 0.28 - 17} x2={cx - bw / 2} y2={cy + bh * 0.28 - 10} stroke="#F59E0B" strokeWidth="0.6" />
        <line x1={cx + bw / 2} y1={cy + bh * 0.28 - 17} x2={cx + bw / 2} y2={cy + bh * 0.28 - 10} stroke="#F59E0B" strokeWidth="0.6" />
        <text x={cx} y={cy + bh * 0.28 - 17} fill="#F59E0B" fontSize="6.5" textAnchor="middle">240 mm</text>
        {/* Dimension height */}
        <line x1={cx + bw / 2 + 9} y1={cy + bh * 0.28} x2={cx + bw / 2 + 9} y2={cy + bh * 0.28 + bd} stroke="#F59E0B" strokeWidth="0.6" />
        <line x1={cx + bw / 2 + 6} y1={cy + bh * 0.28} x2={cx + bw / 2 + 12} y2={cy + bh * 0.28} stroke="#F59E0B" strokeWidth="0.6" />
        <line x1={cx + bw / 2 + 6} y1={cy + bh * 0.28 + bd} x2={cx + bw / 2 + 12} y2={cy + bh * 0.28 + bd} stroke="#F59E0B" strokeWidth="0.6" />
        <text x={cx + bw / 2 + 22} y={cy + bh * 0.28 + bd / 2 + 2} fill="#F59E0B" fontSize="6.5" textAnchor="middle">185 mm</text>
        {/* Material tag */}
        <rect x="14" y="14" width="86" height="15" rx="2.5" fill="#0EA5E9" fillOpacity="0.12" stroke="#0EA5E9" strokeWidth="0.6" />
        <text x="57" y="24.5" fill="#0EA5E9" fontSize="6.5" textAnchor="middle">{bp.material.slice(0, 20)}</text>
        {/* Category tag */}
        <rect x={W - 100} y="14" width="86" height="15" rx="2.5" fill={accent} fillOpacity="0.12" stroke={accent} strokeWidth="0.6" />
        <text x={W - 57} y="24.5" fill={accent} fontSize="6.5" textAnchor="middle">{bp.category}</text>
        {/* FRONT view */}
        <rect x="14" y="200" width="55" height="42" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.55" />
        <line x1="14" y1="221" x2="69" y2="221" stroke="#0EA5E9" strokeWidth="0.35" strokeDasharray="4,2" opacity="0.4" />
        <line x1="41.5" y1="200" x2="41.5" y2="242" stroke="#0EA5E9" strokeWidth="0.35" strokeDasharray="4,2" opacity="0.4" />
        <circle cx="41.5" cy="221" r="11" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.7" />
        <circle cx="41.5" cy="221" r="4" fill="none" stroke={accent} strokeWidth="0.7" opacity="0.8" />
        <text x="41.5" y="252" fill="#475569" fontSize="5.5" textAnchor="middle">FRONT</text>
        {/* TOP view */}
        <rect x="78" y="200" width="55" height="42" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.55" />
        <rect x="88" y="208" width="35" height="26" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.7" />
        <line x1="78" y1="221" x2="133" y2="221" stroke="#0EA5E9" strokeWidth="0.35" strokeDasharray="4,2" opacity="0.4" />
        <text x="105.5" y="252" fill="#475569" fontSize="5.5" textAnchor="middle">TOP</text>
        {/* SIDE view */}
        <rect x="142" y="200" width="55" height="42" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.55" />
        <polygon points="169.5,207 197,221 169.5,235 142,221" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.7" />
        <text x="169.5" y="252" fill="#475569" fontSize="5.5" textAnchor="middle">SIDE</text>
        {/* Detail callout */}
        <circle cx="166" cy="215" r="5" fill="none" stroke="#14B8A6" strokeWidth="0.8" opacity="0.7" />
        <line x1="171" y1="215" x2="180" y2="208" stroke="#14B8A6" strokeWidth="0.6" opacity="0.7" />
        <text x="181" y="207" fill="#14B8A6" fontSize="5.5">A</text>
        {/* Title block */}
        <rect x={W - 118} y={H - 72} width="113" height="67" fill="#0A1628" stroke="#0EA5E9" strokeWidth="0.7" />
        <line x1={W - 118} y1={H - 56} x2={W - 5} y2={H - 56} stroke="#0EA5E9" strokeWidth="0.5" opacity="0.6" />
        <line x1={W - 118} y1={H - 38} x2={W - 5} y2={H - 38} stroke="#0EA5E9" strokeWidth="0.5" opacity="0.6" />
        <line x1={W - 118} y1={H - 20} x2={W - 5} y2={H - 20} stroke="#0EA5E9" strokeWidth="0.5" opacity="0.6" />
        <text x={W - 61.5} y={H - 62} fill="#0EA5E9" fontSize="5" textAnchor="middle" opacity="0.5">PART DESIGNATION</text>
        <text x={W - 61.5} y={H - 44} fill="white" fontSize="7.5" textAnchor="middle" fontWeight="bold">
          {bp.name.length > 20 ? bp.name.slice(0, 20) + '…' : bp.name}
        </text>
        <text x={W - 61.5} y={H - 27} fill="#64748b" fontSize="5.5" textAnchor="middle">NO: {bp.blueprintId}</text>
        <text x={W - 61.5} y={H - 10} fill="#64748b" fontSize="5.5" textAnchor="middle">OEM: {bp.oem.slice(0, 22)}</text>
        <rect x={W - 118} y={H - 72} width="18" height="16" fill="#0EA5E9" fillOpacity="0.2" stroke="#0EA5E9" strokeWidth="0.5" />
        <text x={W - 109} y={H - 63} fill="#0EA5E9" fontSize="6" textAnchor="middle">REV</text>
        <text x={W - 109} y={H - 55} fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">A</text>
      </svg>
    </div>
  )
}

// ── Drag-drop file upload zone ─────────────────────────────────────────────
function FileDropZone({ onFile, file, onClear }: {
  onFile: (f: UploadedFile) => void
  file?: UploadedFile
  onClear: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const process = useCallback((raw: File) => {
    const ext = raw.name.split('.').pop()?.toLowerCase() || 'bin'
    const isImage = ['png', 'jpg', 'jpeg', 'svg'].includes(ext)
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => onFile({ name: raw.name, size: raw.size, type: ext, dataUrl: e.target?.result as string })
      reader.readAsDataURL(raw)
    } else {
      onFile({ name: raw.name, size: raw.size, type: ext })
    }
  }, [onFile])

  if (file) {
    const col = FORMAT_COLOR[file.type] || '#64748b'
    return (
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
        {file.dataUrl ? (
          <img src={file.dataUrl} alt={file.name} className="w-full max-h-40 object-contain rounded-lg bg-white border border-slate-200" />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: col + '20', border: `1px solid ${col}40` }}>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: col }}>
                {FORMAT_LABEL[file.type] || file.type.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A] truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-700 font-medium">File ready</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear} className="h-7 px-2 text-slate-400 hover:text-red-500 text-xs">
            <X className="w-3 h-3 mr-1" />Remove
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all select-none ${dragging ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 scale-[1.01]' : 'border-slate-200 hover:border-[#0EA5E9]/60 hover:bg-slate-50'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) process(f) }}
    >
      <input ref={inputRef} type="file" className="hidden" accept={ACCEPTED}
        onChange={e => { const f = e.target.files?.[0]; if (f) process(f) }} />
      <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${dragging ? 'text-[#0EA5E9]' : 'text-slate-300'}`} />
      <p className="text-sm font-medium text-slate-600">Drop your CAD file here, or click to browse</p>
      <p className="text-xs text-slate-400 mt-1">STL · STEP · OBJ · 3MF · DXF · DWG · IGES · PDF · PNG · JPG · SVG</p>
    </div>
  )
}

// ── Blueprint Card (grid view) ─────────────────────────────────────────────
function BlueprintCard({ bp, onView, onDelete }: { bp: Blueprint; onView: () => void; onDelete: () => void }) {
  const col = bp.file ? (FORMAT_COLOR[bp.file.type] || '#64748b') : '#0EA5E9'
  return (
    <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow group cursor-pointer" onClick={onView}>
      <CardContent className="p-0 overflow-hidden">
        <div className="h-36 bg-[#060f1e] flex items-center justify-center relative overflow-hidden">
          {bp.file?.dataUrl ? (
            <img src={bp.file.dataUrl} alt={bp.name} className="w-full h-full object-contain p-2" />
          ) : (
            <svg viewBox="0 0 120 90" className="w-full h-full opacity-60">
              <defs>
                <pattern id={`g-${bp.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
                  <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#0EA5E9" strokeWidth="0.2" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="120" height="90" fill="#060f1e" />
              <rect width="120" height="90" fill={`url(#g-${bp.id})`} />
              <polygon points="60,22 82,32 60,42 38,32" fill={col} fillOpacity="0.2" stroke={col} strokeWidth="1" />
              <polygon points="38,32 60,42 60,58 38,48" fill={col} fillOpacity="0.08" stroke={col} strokeWidth="1" />
              <polygon points="60,42 82,32 82,48 60,58" fill={col} fillOpacity="0.12" stroke={col} strokeWidth="1" />
              <text x="60" y="72" fill="#0EA5E9" fontSize="6" textAnchor="middle" fontFamily="monospace">{bp.blueprintId}</text>
            </svg>
          )}
          {bp.file && (
            <span className="absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: col + '30', color: col, border: `1px solid ${col}50` }}>
              {FORMAT_LABEL[bp.file.type] || bp.file.type}
            </span>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="font-mono text-xs text-[#0EA5E9]">{bp.blueprintId}</p>
              <p className="text-sm font-semibold text-[#0F172A] truncate">{bp.name}</p>
            </div>
            <Badge className={`text-[10px] px-1.5 flex-shrink-0 ${statusColors[bp.status]}`}>{statusLabels[bp.status]}</Badge>
          </div>
          <p className="text-xs text-slate-500 truncate">{bp.material}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 truncate">{bp.oem}</span>
            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onView}><Eye className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-red-500" onClick={onDelete}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Blank form defaults ────────────────────────────────────────────────────
const blankForm = {
  name: '', category: '', material: '', oem: '',
  certification: '', status: 'pending_review', description: '',
}

const statusColors: Record<string, string> = {
  active: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  pending_review: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  inactive: 'bg-slate-100 text-slate-500',
  archived: 'bg-slate-100 text-slate-400',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  pending_review: 'Pending Review',
  inactive: 'Inactive',
  archived: 'Archived',
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function BlueprintsPage({ role = 'admin' }: { role?: string }) {
  const [blueprints, setBlueprints] = useState<Blueprint[]>(initialBlueprints as Blueprint[])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Role-specific access rules
  const canAddEdit = ['admin', 'manager', 'oem_partner', 'lab'].includes(role)
  const isReadOnly  = ['end_user', 'print_center'].includes(role)

  // View dialog
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selected, setSelected] = useState<Blueprint | null>(null)
  const [viewTab, setViewTab] = useState<'drawing' | 'details' | 'file'>('drawing')

  // Add dialog
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>()
  const [addErrors, setAddErrors] = useState<{ name?: string; material?: string; oem?: string }>({})

  const categories = [...new Set(blueprints.map(b => b.category))]

  const filtered = blueprints.filter(bp => {
    const q = search.toLowerCase()
    return (
      (bp.name.toLowerCase().includes(q) || bp.blueprintId.toLowerCase().includes(q) || bp.oem.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || bp.status === statusFilter) &&
      (catFilter === 'all' || bp.category === catFilter)
    )
  })

  const stats = {
    total: blueprints.length,
    active: blueprints.filter(b => b.status === 'active').length,
    pending: blueprints.filter(b => b.status === 'pending_review').length,
    prints: blueprints.reduce((s, b) => s + b.printCount, 0),
  }

  const openView = (bp: Blueprint) => {
    setSelected(bp)
    setViewTab(bp.file?.dataUrl ? 'file' : 'drawing')
    setIsViewOpen(true)
  }

  const handleDelete = (id: string) => {
    setBlueprints(p => p.filter(b => b.id !== id))
    if (selected?.id === id) setIsViewOpen(false)
    toast.success('Blueprint removed from vault.')
  }

  const handleAdd = () => {
    const errors: typeof addErrors = {}
    if (!form.name.trim()) errors.name = 'Required'
    if (!form.material.trim()) errors.material = 'Required'
    if (!form.oem.trim()) errors.oem = 'Required'
    if (Object.keys(errors).length) {
      setAddErrors(errors)
      toast.error('Please fill in required fields.')
      return
    }
    const newId = `BP-${String(Math.floor(Math.random() * 8999) + 1000)}`
    const bp: Blueprint = {
      id: `bp-${Date.now()}`,
      blueprintId: newId,
      name: form.name.trim(),
      category: form.category.trim() || 'Uncategorized',
      material: form.material.trim(),
      oem: form.oem.trim(),
      certification: form.certification.trim() || 'Pending',
      status: form.status,
      printCount: 0,
      description: form.description.trim(),
      file: uploadedFile,
    }
    setBlueprints(p => [bp, ...p])
    setForm(blankForm)
    setUploadedFile(undefined)
    setIsAddOpen(false)
    toast.success(`Blueprint ${newId} added to the vault!`)
  }

  const resetAdd = () => {
    setForm(blankForm)
    setUploadedFile(undefined)
    setIsAddOpen(false)
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* Role Context Banner */}
      {role === 'oem_partner' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-purple-50 border-purple-200 text-purple-800 text-sm font-medium">
          🔑 IP Vault View — Register new blueprints, manage licensing, and track print usage across the network.
        </div>
      )}
      {isReadOnly && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-sky-50 border-sky-200 text-sky-800 text-sm font-medium">
          📚 Browse Mode — You can view and search blueprints. Contact your OEM partner to register or modify IP.
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Blueprints', val: stats.total, icon: FileBox, color: '#0EA5E9', bg: 'bg-[#0EA5E9]/10' },
          { label: 'Active', val: stats.active, icon: Layers, color: '#14B8A6', bg: 'bg-[#14B8A6]/10' },
          { label: 'Pending Review', val: stats.pending, icon: AlertTriangle, color: '#F59E0B', bg: 'bg-[#F59E0B]/10' },
          { label: 'Total Prints', val: stats.prints, icon: Package, color: '#8B5CF6', bg: 'bg-purple-100' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <Card key={label} className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0F172A]">{val}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search blueprints…" className="pl-10 bg-white border-slate-200"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white border-slate-200">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-40 bg-white border-slate-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        {/* View mode toggle */}
        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('table')}
            className={`px-3 py-2 flex items-center text-sm transition-colors ${viewMode === 'table' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-600'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('grid')}
            className={`px-3 py-2 flex items-center text-sm transition-colors ${viewMode === 'grid' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-600'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        {canAddEdit && (
        <Button onClick={() => setIsAddOpen(true)} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" />Add Blueprint
        </Button>
        )}
      </div>

      {/* ── Table view ── */}
      {viewMode === 'table' && (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {['Blueprint', 'Category', 'Material', 'OEM', 'Certification', 'Status', 'Prints', 'File', 'Actions'].map(h => (
                      <TableHead key={h} className="font-semibold text-[#0F172A] text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-slate-400">
                        No blueprints match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map(bp => (
                    <TableRow key={bp.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {bp.file?.dataUrl
                              ? <img src={bp.file.dataUrl} className="w-full h-full object-cover" alt="" />
                              : <FileBox className="w-4 h-4 text-white" />
                            }
                          </div>
                          <div>
                            <p className="font-mono text-xs text-[#0EA5E9]">{bp.blueprintId}</p>
                            <p className="text-sm font-medium text-[#0F172A]">{bp.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{bp.category}</TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[120px] truncate">{bp.material}</TableCell>
                      <TableCell className="text-sm text-slate-600">{bp.oem}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{bp.certification}</Badge></TableCell>
                      <TableCell><Badge className={`text-xs ${statusColors[bp.status]}`}>{statusLabels[bp.status]}</Badge></TableCell>
                      <TableCell className="text-sm font-medium text-[#0F172A]">{bp.printCount}</TableCell>
                      <TableCell>
                        {bp.file ? (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{ background: (FORMAT_COLOR[bp.file.type] || '#64748b') + '20', color: FORMAT_COLOR[bp.file.type] || '#64748b' }}>
                            {FORMAT_LABEL[bp.file.type] || bp.file.type}
                          </span>
                        ) : <span className="text-xs text-slate-300">—</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(bp)}><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500" onClick={() => handleDelete(bp.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Grid view ── */}
      {viewMode === 'grid' && (
        <div>
          {filtered.length === 0 && (
            <Card className="bg-white border-slate-200">
              <CardContent className="py-16 text-center text-slate-400">No blueprints match your filters.</CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(bp => (
              <BlueprintCard key={bp.id} bp={bp} onView={() => openView(bp)} onDelete={() => handleDelete(bp.id)} />
            ))}
          </div>
        </div>
      )}

      {/* ── View Dialog ── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
                <FileBox className="w-4 h-4 text-[#0EA5E9]" />
              </div>
              <div>
                <span className="font-mono text-sm text-[#0EA5E9] block">{selected?.blueprintId}</span>
                <span className="text-base font-bold text-[#0F172A]">{selected?.name}</span>
              </div>
              <Badge className={`ml-auto text-xs ${statusColors[selected?.status ?? 'inactive']}`}>
                {statusLabels[selected?.status ?? 'inactive']}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-slate-200 -mx-6 px-6">
            {(['drawing', 'details', 'file'] as const).map(tab => (
              <button key={tab} onClick={() => setViewTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${viewTab === tab ? 'border-[#0EA5E9] text-[#0EA5E9]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {tab === 'drawing' && '📐 Drawing'}
                {tab === 'details' && '📋 Details'}
                {tab === 'file' && '📁 File'}
              </button>
            ))}
          </div>

          {selected && (
            <div className="pt-2">
              {/* Drawing tab */}
              {viewTab === 'drawing' && <BlueprintDrawing bp={selected} />}

              {/* Details tab */}
              {viewTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Category', val: selected.category },
                      { label: 'Material', val: selected.material },
                      { label: 'OEM', val: selected.oem },
                      { label: 'Certification', val: selected.certification },
                      { label: 'Print Count', val: String(selected.printCount) },
                      { label: 'Status', val: statusLabels[selected.status] },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{val}</p>
                      </div>
                    ))}
                  </div>
                  {selected.description && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Description</p>
                      <p className="text-sm text-slate-600">{selected.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* File tab */}
              {viewTab === 'file' && (
                selected.file ? (
                  <div className="space-y-4">
                    {selected.file.dataUrl ? (
                      <img src={selected.file.dataUrl} alt={selected.file.name} className="w-full rounded-xl border border-slate-200 object-contain max-h-72" />
                    ) : (
                      <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: (FORMAT_COLOR[selected.file.type] || '#64748b') + '18', border: `1px solid ${FORMAT_COLOR[selected.file.type] || '#64748b'}30` }}>
                          <span className="text-sm font-bold uppercase" style={{ color: FORMAT_COLOR[selected.file.type] || '#64748b' }}>
                            {FORMAT_LABEL[selected.file.type] || selected.file.type}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0F172A]">{selected.file.name}</p>
                          <p className="text-sm text-slate-500">{formatSize(selected.file.size)}</p>
                          <p className="text-xs text-slate-400 mt-1">CAD file stored in session — upload to server for permanent storage</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: 'Format', val: (FORMAT_LABEL[selected.file.type] || selected.file.type).toUpperCase() },
                        { label: 'Size', val: formatSize(selected.file.size) },
                        { label: 'Type', val: ['stl', 'step', 'stp', 'obj', '3mf', 'iges', 'igs'].includes(selected.file.type) ? '3D CAD' : ['dxf', 'dwg'].includes(selected.file.type) ? '2D CAD' : 'Document' },
                      ].map(({ label, val }) => (
                        <div key={label} className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-sm font-bold text-[#0F172A]">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No file attached to this blueprint.</p>
                    <p className="text-xs mt-1">Add a new blueprint and attach a CAD file.</p>
                  </div>
                )
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add Blueprint Dialog ── */}
      <Dialog open={isAddOpen} onOpenChange={v => { if (!v) resetAdd() }}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#0EA5E9]" />
              Add New Blueprint
            </DialogTitle>
            <DialogDescription>Fill in the part details and optionally attach a CAD or design file.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-sm font-medium mb-1.5 block">Part Name <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g. Thruster Bearing Housing"
                  value={form.name}
                  onChange={e => {
                    setForm(f => ({ ...f, name: e.target.value }))
                    if (addErrors.name) setAddErrors(a => ({ ...a, name: undefined }))
                  }}
                  className={addErrors.name ? 'border-red-500' : ''}
                />
                {addErrors.name && <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Material <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g. Titanium Ti-6Al-4V"
                  value={form.material}
                  onChange={e => {
                    setForm(f => ({ ...f, material: e.target.value }))
                    if (addErrors.material) setAddErrors(a => ({ ...a, material: undefined }))
                  }}
                  className={addErrors.material ? 'border-red-500' : ''}
                />
                {addErrors.material && <p className="text-xs text-red-500 mt-1">{addErrors.material}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Category</Label>
                <Input placeholder="e.g. Structural, Hydraulic, Rotating…" value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">OEM / Company <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g. Rosen Maritime"
                  value={form.oem}
                  onChange={e => {
                    setForm(f => ({ ...f, oem: e.target.value }))
                    if (addErrors.oem) setAddErrors(a => ({ ...a, oem: undefined }))
                  }}
                  className={addErrors.oem ? 'border-red-500' : ''}
                />
                {addErrors.oem && <p className="text-xs text-red-500 mt-1">{addErrors.oem}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Certification Authority</Label>
                <Input placeholder="e.g. Lloyd's Register, DNV GL…" value={form.certification}
                  onChange={e => setForm(f => ({ ...f, certification: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-sm font-medium mb-1.5 block">Description</Label>
                <Textarea placeholder="Brief description of the part and its use case…"
                  className="resize-none h-20" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-400" />
                Attach CAD / Design File
                <span className="text-xs font-normal text-slate-400">(optional)</span>
              </Label>
              <FileDropZone
                onFile={f => setUploadedFile(f)}
                file={uploadedFile}
                onClear={() => setUploadedFile(undefined)}
              />
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Accepted: STL · STEP · OBJ · 3MF · DXF · DWG · IGES · PDF · PNG · JPG · SVG
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetAdd}>Cancel</Button>
            <Button onClick={handleAdd} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />Add to Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
