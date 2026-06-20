'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Boxes, AlertTriangle, CheckCircle, Clock, TrendingUp, RefreshCw, FlaskConical, TestTubeDiagonal, Download, Award, Package, ShoppingCart, ChevronDown, ChevronUp, Plus, Send } from 'lucide-react'
import { materials } from '@/lib/static-data'

const statusColors: Record<string, string> = {
  adequate: 'bg-[#14B8A6]/10 text-[#14B8A6]',
  low: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  critical: 'bg-red-100 text-red-600',
}

const statusLabels: Record<string, string> = {
  adequate: 'Adequate',
  low: 'Low Stock',
  critical: 'Critical',
}

const SUPPLIERS = [
  { id: 's1', name: 'Carpenter Additive', leadTime: '5–7 days', rating: 4.8 },
  { id: 's2', name: 'Höganäs AB', leadTime: '7–10 days', rating: 4.6 },
  { id: 's3', name: 'EOS GmbH', leadTime: '10–14 days', rating: 4.7 },
  { id: 's4', name: 'SLM Solutions', leadTime: '5–8 days', rating: 4.5 },
  { id: 's5', name: 'Sandvik Materials', leadTime: '8–12 days', rating: 4.9 },
]

export function MaterialsPage({ role = 'admin' }: { role?: string }) {
  // print_center scope: Atlantic XL (pc-1) — show only materials stocked at their facility
  const CENTER_NAME = 'Atlantic XL'
  const scopedMaterials = role === 'print_center'
    ? materials.filter(m => m.centerStocks?.some(cs => cs.centerName === CENTER_NAME))
    : materials

  // For print center, show their specific stock level, not global total
  const displayStock = (material: typeof materials[0]) => {
    if (role === 'print_center') {
      const cs = material.centerStocks?.find(s => s.centerName === CENTER_NAME)
      return cs ? `${cs.stock} ${material.unit}` : `${material.totalStock} ${material.unit}`
    }
    return `${material.totalStock} ${material.unit}`
  }

  const canOrder = ['admin', 'manager', 'print_center'].includes(role)

  // Order Material form state
  const [orderPanelOpen, setOrderPanelOpen] = useState(false)
  const [orderMaterial, setOrderMaterial] = useState('')
  const [orderQty, setOrderQty] = useState('')
  const [orderSupplier, setOrderSupplier] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  const handleOrderSubmit = () => {
    if (!orderMaterial || !orderQty || !orderSupplier) return
    setOrderSubmitted(true)
    setTimeout(() => {
      setOrderSubmitted(false)
      setOrderPanelOpen(false)
      setOrderMaterial('')
      setOrderQty('')
      setOrderSupplier('')
      setOrderNotes('')
    }, 2500)
  }

  const stats = {
    total: scopedMaterials.length,
    adequate: scopedMaterials.filter(m => m.status === 'adequate').length,
    low: scopedMaterials.filter(m => m.status === 'low').length,
    critical: scopedMaterials.filter(m => m.status === 'critical').length,
    totalValue: scopedMaterials.reduce((sum, m) => sum + (m.totalStock * m.unitCost), 0),
  }

  const getStockPercentage = (material: typeof materials[0]) => {
    return Math.min(100, (material.totalStock / material.maxStock) * 100)
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* Role Banner */}
      {role === 'print_center' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-teal-50 border-teal-200 text-teal-800 text-sm font-medium">
          🏭 Facility View: {CENTER_NAME} — showing {scopedMaterials.length} materials stocked at your facility.
        </div>
      )}
      {role === 'oem_partner' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-purple-50 border-purple-200 text-purple-800 text-sm font-medium">
          🔑 Read-only: Material inventory managed by print centers. Ensure your blueprints specify compatible materials.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
                <p className="text-sm text-slate-500">Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.adequate}</p>
                <p className="text-sm text-slate-500">Adequate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.low}</p>
                <p className="text-sm text-slate-500">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.critical}</p>
                <p className="text-sm text-slate-500">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">${(stats.totalValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-500">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner */}
      {stats.critical > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  {stats.critical} material{stats.critical > 1 ? 's' : ''} at critical stock levels
                </p>
                <p className="text-sm text-red-600">
                  Immediate reorder required: {materials.filter(m => m.status === 'critical').map(m => m.name).join(', ')}
                </p>
              </div>
              {canOrder && (
              <Button className="ml-auto bg-red-600 hover:bg-red-700">
                Create Purchase Order
              </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#0F172A]">Material Inventory</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-[#0F172A]">Material</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Stock Level</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Status</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Distribution</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Unit Cost</TableHead>
                <TableHead className="font-semibold text-[#0F172A]">Lead Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scopedMaterials.map((material) => (
                <TableRow key={material.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#0F172A]">{material.name}</p>
                      <p className="text-xs text-slate-500">{material.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-40">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-[#0F172A]">{displayStock(material)}</span>
                        <span className="text-slate-500">{role === 'print_center' ? `global: ${material.totalStock}` : `max ${material.maxStock}`}</span>
                      </div>
                      <Progress 
                        value={getStockPercentage(material)} 
                        className={`h-2 ${material.status === 'critical' ? '[&>div]:bg-red-500' : material.status === 'low' ? '[&>div]:bg-[#F59E0B]' : ''}`}
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Min: {material.minStock} • Reorder: {material.reorderPoint}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[material.status]}>
                      {statusLabels[material.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {material.centerStocks?.map((stock, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-slate-600">{stock.centerName}:</span>
                          <span className="font-medium text-[#0F172A]">{stock.stock} {material.unit}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[#0F172A]">
                    ${material.unitCost}/{material.unit}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-4 h-4" />
                      {material.leadTime} days
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Material — print_center only */}
      {role === 'print_center' && (
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-[#0F172A]">Order Materials</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Request resupply from certified material suppliers</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOrderPanelOpen(v => !v)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              New Order
              {orderPanelOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </Button>
          </CardHeader>

          {orderPanelOpen && (
            <CardContent className="pt-0 space-y-4">
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-4">
                <h4 className="font-semibold text-sm text-[#0F172A]">Material Purchase Order</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Material selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Material *</label>
                    <Select value={orderMaterial} onValueChange={setOrderMaterial}>
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Select material..." />
                      </SelectTrigger>
                      <SelectContent>
                        {scopedMaterials.map(m => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="flex items-center gap-2">
                              {m.name}
                              {m.status === 'critical' && <Badge className="bg-red-100 text-red-600 text-[10px] py-0">Critical</Badge>}
                              {m.status === 'low' && <Badge className="bg-amber-100 text-amber-600 text-[10px] py-0">Low</Badge>}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {orderMaterial && (
                      <p className="text-xs text-slate-500">
                        Current stock: {scopedMaterials.find(m => m.id === orderMaterial) && displayStock(scopedMaterials.find(m => m.id === orderMaterial)!)}
                        {' · '}Unit cost: ${scopedMaterials.find(m => m.id === orderMaterial)?.unitCost}/{scopedMaterials.find(m => m.id === orderMaterial)?.unit}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Quantity *</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 50"
                        value={orderQty}
                        onChange={e => setOrderQty(e.target.value)}
                        className="bg-white border-slate-200"
                      />
                      {orderMaterial && (
                        <span className="text-sm text-slate-500 shrink-0">
                          {scopedMaterials.find(m => m.id === orderMaterial)?.unit}
                        </span>
                      )}
                    </div>
                    {orderMaterial && orderQty && (
                      <p className="text-xs text-teal-700 font-medium">
                        Estimated cost: ${((parseFloat(orderQty) || 0) * (scopedMaterials.find(m => m.id === orderMaterial)?.unitCost ?? 0)).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Supplier */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Supplier *</label>
                    <Select value={orderSupplier} onValueChange={setOrderSupplier}>
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Select supplier..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPLIERS.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            <span className="flex items-center gap-2">
                              {s.name}
                              <span className="text-xs text-slate-400">{s.leadTime}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {orderSupplier && (
                      <p className="text-xs text-slate-500">
                        Lead time: {SUPPLIERS.find(s => s.id === orderSupplier)?.leadTime}
                        {' · '}Rating: ⭐ {SUPPLIERS.find(s => s.id === orderSupplier)?.rating}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Notes (optional)</label>
                    <Input
                      placeholder="Special requirements, urgency..."
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                      className="bg-white border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <Button variant="outline" size="sm" onClick={() => setOrderPanelOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                    onClick={handleOrderSubmit}
                    disabled={!orderMaterial || !orderQty || !orderSupplier || orderSubmitted}
                  >
                    {orderSubmitted ? (
                      <><CheckCircle className="w-4 h-4" /> Order Submitted!</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Order</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

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
