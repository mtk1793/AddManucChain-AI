'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Truck, MapPin, Clock, CheckCircle, Package, AlertCircle, ArrowRight, 
  Calendar, User, Phone, MessageSquare, Download, Map, TrendingUp,
  Zap, Navigation, Building2, Home, FileText, Eye, Filter, Plus,
  ChevronDown, ChevronUp, ArrowUpRight, Boxes, DollarSign, BarChart3, AlertTriangle
} from 'lucide-react'
import { shipments, orders } from '@/lib/static-data'

const statusColors: Record<string, string> = {
  preparing: 'bg-slate-100 text-slate-600',
  in_transit: 'bg-[#0EA5E9]/10 text-[#0EA5E9]',
  out_for_delivery: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  delivered: 'bg-green-100 text-green-600',
  delayed: 'bg-red-100 text-red-600',
}

const statusLabels: Record<string, string> = {
  preparing: 'Preparing',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  delayed: 'Delayed',
}

const statusIcons: Record<string, any> = {
  preparing: Package,
  in_transit: Truck,
  out_for_delivery: ArrowRight,
  delivered: CheckCircle,
  delayed: AlertTriangle,
}

interface ShipmentEvent {
  timestamp: string
  event: string
  location: string
  detail: string
}

function ShipmentTrackingCard({ shipment }: { shipment: typeof shipments[0] }) {
  const [expanded, setExpanded] = useState(false)
  const StatusIcon = statusIcons[shipment.status]
  const order = orders.find(o => o.id === shipment.orderId)
  
  const trackingEvents: ShipmentEvent[] = [
    { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString(), event: 'In transit', location: shipment.origin, detail: 'Package picked up and scanned' },
    { timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleTimeString(), event: 'At facility', location: 'Distribution Center, Toronto ON', detail: 'Sorted and loaded' },
    { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString(), event: 'Shipment created', location: shipment.origin, detail: `Order ${order?.orderId} prepared for shipment` }
  ]

  return (
    <Card className="border-slate-200 hover:border-[#0EA5E9]/50 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-[#0EA5E9] font-bold">{shipment.trackingId}</code>
              <Badge className={statusColors[shipment.status]}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusLabels[shipment.status]}
              </Badge>
            </div>
            <p className="font-semibold text-[#0F172A]">{order?.partName || 'Unknown Part'}</p>
            <p className="text-xs text-slate-500 mt-1">Order: {order?.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">{shipment.carrier}</p>
            <p className="font-bold text-lg text-[#0EA5E9] mt-1">{shipment.progress}%</p>
          </div>
        </div>

        <Progress value={shipment.progress} className="mb-3 h-2" />

        <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="flex-1 font-medium">{shipment.origin}</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
          <span className="flex-1 text-right font-medium">{shipment.destination}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="bg-slate-50 p-2 rounded">
            <p className="text-slate-500 font-medium">Distance</p>
            <p className="text-[#0F172A] font-bold">{shipment.distance}km</p>
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <p className="text-slate-500 font-medium">Est. Delivery</p>
            <p className="text-[#0F172A] font-bold">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded">
            <p className="text-slate-500 font-medium">Carrier</p>
            <p className="text-[#0F172A] font-bold text-[10px]">{shipment.carrier}</p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 transition text-sm font-medium text-slate-700 mb-3"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Tracking Events ({trackingEvents.length})
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="space-y-2 mb-4 border-l-2 border-[#0EA5E9] pl-4">
            {trackingEvents.map((evt, i) => (
              <div key={i} className="text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0EA5E9] mt-1.5" />
                  <div>
                    <p className="font-bold text-[#0F172A]">{evt.event}</p>
                    <p className="text-slate-500">{evt.location}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{evt.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-[#0EA5E9]">
            <Map className="w-3 h-3 mr-1" />
            Track
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <MessageSquare className="w-3 h-3 mr-1" />
            Notify
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="w-3 h-3 mr-1" />
            Label
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ShipmentsPage({ role = 'admin' }: { role?: string }) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [schedOrder, setSchedOrder] = useState('')
  const [schedCarrier, setSchedCarrier] = useState('')
  const [schedPickupDate, setSchedPickupDate] = useState('')
  const [schedAddress, setSchedAddress] = useState('')
  const [schedSubmitted, setSchedSubmitted] = useState(false)

  const handleScheduleSubmit = () => {
    if (!schedOrder || !schedCarrier || !schedPickupDate || !schedAddress) {
      alert('Please fill in all required fields')
      return
    }
    setSchedSubmitted(true)
    setTimeout(() => {
      setSchedSubmitted(false)
      setShowScheduleForm(false)
      setSchedOrder('')
      setSchedCarrier('')
      setSchedPickupDate('')
      setSchedAddress('')
    }, 1800)
  }

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
  }

  const filteredShipments = shipments.filter(ship => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'in_transit' && (ship.status === 'in_transit' || ship.status === 'out_for_delivery')) ||
      (activeTab === 'delivered' && ship.status === 'delivered') ||
      (activeTab === 'delayed' && ship.status === 'delayed')
    const matchesSearch = ship.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ship.destination.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const avgDeliveryTime = 3.2
  const onTimeRate = 94

  return (
    <div className="p-3 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">🚚 Shipments</h1>
        <p className="text-slate-600 mt-1">Real-time tracking for all active and delivered shipments</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Shipments</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
              </div>
              <Package className="w-6 h-6 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">In Transit</p>
                <p className="text-2xl font-bold text-[#0EA5E9]">{stats.inTransit}</p>
              </div>
              <Truck className="w-6 h-6 text-[#0EA5E9]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">On-Time Rate</p>
                <p className="text-2xl font-bold text-emerald-600">{onTimeRate}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl p-4" style={{ background: '#0a0f1e', border: '1px solid #1e2d45' }}>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">⏱️ Avg Delivery Time</p>
            <p className="text-xl font-bold text-white mt-1">{avgDeliveryTime} days</p>
          </div>
          <div className="h-8 w-0.5 bg-slate-700"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">📈 Performance Trend</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-emerald-400">+2.3%</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="h-8 w-0.5 bg-slate-700"></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">🎯 Success Rate</p>
            <p className="text-lg font-bold text-cyan-400 mt-1">{onTimeRate}% SLA met</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="in_transit">In Transit ({stats.inTransit})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({stats.delivered})</TabsTrigger>
            <TabsTrigger value="delayed">Delayed ({stats.delayed})</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
          className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Shipment
        </Button>
      </div>

      {showScheduleForm && (
        <Card className="border-[#0EA5E9]/30 bg-[#0EA5E9]/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0EA5E9]" />
              Schedule New Shipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Order ID *</label>
                <Select value={schedOrder} onValueChange={setSchedOrder}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map(o => <SelectItem key={o.id} value={o.id}>{o.orderId} - {o.partName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Carrier *</label>
                <Select value={schedCarrier} onValueChange={setSchedCarrier}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fedex">FedEx Priority</SelectItem>
                    <SelectItem value="purolator">Purolator Express</SelectItem>
                    <SelectItem value="ups">UPS Ground</SelectItem>
                    <SelectItem value="canada-post">Canada Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Pickup Date *</label>
                <Input 
                  type="date" 
                  className="bg-white" 
                  value={schedPickupDate}
                  onChange={(e) => setSchedPickupDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Delivery Address *</label>
                <Input 
                  placeholder="Street address" 
                  className="bg-white" 
                  value={schedAddress}
                  onChange={(e) => setSchedAddress(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleScheduleSubmit}
                disabled={schedSubmitted}
                className="md:col-span-2 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              >
                {schedSubmitted ? '✓ Shipment Scheduled!' : 'Submit'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by tracking ID or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
          <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredShipments.length > 0 ? (
          filteredShipments.map(shipment => (
            <ShipmentTrackingCard key={shipment.id} shipment={shipment} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No shipments found</p>
          </div>
        )}
      </div>
    </div>
  )
}
