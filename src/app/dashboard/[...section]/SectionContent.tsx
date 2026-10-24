'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import useSWR from 'swr'
import { renderDashboardPage } from '@/lib/tab-routes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Package, FileBox, Truck } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function OrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { data: order, isLoading } = useSWR(`/api/orders`, fetcher)
  const orderData = useMemo(() => {
    if (!order) return null
    if (Array.isArray(order)) return order.find((o: any) => o.orderId === orderId || o.id === orderId)
    return order
  }, [order, orderId])

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!orderData) return <Card><CardContent className="p-8 text-center text-muted-foreground">Order {orderId} not found</CardContent></Card>

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/orders')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {orderData.orderId} — {orderData.partName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><span className="text-xs text-muted-foreground">Status</span><Badge className="ml-2">{orderData.status}</Badge></div>
            <div><span className="text-xs text-muted-foreground">Priority</span><p className="font-medium">{orderData.priority}</p></div>
            <div><span className="text-xs text-muted-foreground">Quantity</span><p className="font-medium">{orderData.quantity}</p></div>
            <div><span className="text-xs text-muted-foreground">ETA</span><p className="font-medium">{orderData.eta ? new Date(orderData.eta).toLocaleDateString() : '—'}</p></div>
          </div>
          {orderData.notes && <div><span className="text-xs text-muted-foreground block mb-1">Notes</span><p className="text-sm whitespace-pre-wrap">{orderData.notes}</p></div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-xs text-muted-foreground block">Created</span>{new Date(orderData.createdAt).toLocaleString()}</div>
            <div><span className="text-xs text-muted-foreground block">Updated</span>{new Date(orderData.updatedAt).toLocaleString()}</div>
            {orderData.requester && <div><span className="text-xs text-muted-foreground block">Requester</span>{orderData.requester.name ?? orderData.requester.email}</div>}
            {orderData.center && <div><span className="text-xs text-muted-foreground block">Print Center</span>{orderData.center.name}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BlueprintDetail({ blueprintId }: { blueprintId: string }) {
  const router = useRouter()
  const { data: blueprints, isLoading } = useSWR('/api/blueprints', fetcher)
  const bp = useMemo(() => {
    if (!blueprints || !Array.isArray(blueprints)) return null
    return blueprints.find((b: any) => b.blueprintId === blueprintId || b.id === blueprintId)
  }, [blueprints, blueprintId])

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!bp) return <Card><CardContent className="p-8 text-center text-muted-foreground">Blueprint {blueprintId} not found</CardContent></Card>

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/blueprints')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blueprints
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBox className="w-5 h-5" />
            {bp.blueprintId} — {bp.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><span className="text-xs text-muted-foreground">Status</span><Badge className="ml-2">{bp.status}</Badge></div>
            <div><span className="text-xs text-muted-foreground">Category</span><p className="font-medium">{bp.category}</p></div>
            <div><span className="text-xs text-muted-foreground">Material</span><p className="font-medium">{bp.material}</p></div>
            <div><span className="text-xs text-muted-foreground">OEM</span><p className="font-medium">{bp.oem}</p></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><span className="text-xs text-muted-foreground">Certification</span><p className="font-medium">{bp.certification}</p></div>
            <div><span className="text-xs text-muted-foreground">Print Count</span><p className="font-medium">{bp.printCount}</p></div>
            {bp.description && <div className="col-span-2"><span className="text-xs text-muted-foreground block">Description</span><p className="text-sm">{bp.description}</p></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ShipmentDetail({ shipmentId }: { shipmentId: string }) {
  const router = useRouter()
  const { data: shipments, isLoading } = useSWR('/api/shipments', fetcher)
  const ship = useMemo(() => {
    if (!shipments || !Array.isArray(shipments)) return null
    return shipments.find((s: any) => s.trackingId === shipmentId || s.id === shipmentId)
  }, [shipments, shipmentId])

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!ship) return <Card><CardContent className="p-8 text-center text-muted-foreground">Shipment {shipmentId} not found</CardContent></Card>

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/shipments')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shipments
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            {ship.trackingId} — {ship.origin} → {ship.destination}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><span className="text-xs text-muted-foreground">Status</span><Badge className="ml-2">{ship.status}</Badge></div>
            <div><span className="text-xs text-muted-foreground">Carrier</span><p className="font-medium">{ship.carrier}</p></div>
            <div><span className="text-xs text-muted-foreground">Progress</span><p className="font-medium">{ship.progress}%</p></div>
            <div><span className="text-xs text-muted-foreground">Distance</span><p className="font-medium">{ship.distance} km</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-xs text-muted-foreground block">Estimated Delivery</span><p className="font-medium">{new Date(ship.estimatedDelivery).toLocaleDateString()}</p></div>
            {ship.actualDelivery && <div><span className="text-xs text-muted-foreground block">Actual Delivery</span><p className="font-medium">{new Date(ship.actualDelivery).toLocaleDateString()}</p></div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Pattern: /dashboard/orders/ORD-2860 or /dashboard/blueprints/BP-1024
const ENTITY_PATTERNS: Record<string, { prefix: string; component: React.ComponentType<Record<string, string>> }> = {
  orders: { prefix: 'ORD-', component: OrderDetail },
  blueprints: { prefix: 'BP-', component: BlueprintDetail },
  shipments: { prefix: 'TRK-', component: ShipmentDetail },
}

interface SectionContentProps {
  section: string[]
}

export function SectionContent({ section }: SectionContentProps) {
  const router = useRouter()

  const result = useMemo(() => {
    if (!section || section.length === 0) return { type: 'page' as const, tabId: 'overview' }

    const [first, second] = section

    // Check if this is an entity detail: /dashboard/{entity}/{id}
    if (second) {
      const pattern = ENTITY_PATTERNS[first]
      if (pattern && second.startsWith(pattern.prefix)) {
        return { type: 'detail' as const, entity: first, id: second }
      }
    }

    // Standard dashboard page
    if (first === 'overview') return { type: 'page' as const, tabId: 'overview' }
    return { type: 'page' as const, tabId: first }
  }, [section])

  if (result.type === 'detail') {
    const pattern = ENTITY_PATTERNS[result.entity]
    if (pattern) {
      const DetailComp = pattern.component
      return <DetailComp {...{ [`${result.entity}Id`]: result.id }} />
    }
  }

  return renderDashboardPage(
    result.tabId,
    'admin',
    (tab: string) => router.push('/dashboard/' + tab),
  )
}
