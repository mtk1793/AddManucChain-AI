import { blueprints, orders, printCenters, shipments, users } from '@/lib/static-data'

const byId = <T extends { id: string }>(items: T[], id?: string | null) =>
  items.find((item) => item.id === id) ?? null

export function getDemoOrders(params?: URLSearchParams) {
  const status = params?.get('status')
  const search = params?.get('search')?.toLowerCase()
  return orders
    .filter((order) => !status || status === 'all' || order.status === status)
    .filter((order) => !search || order.orderId.toLowerCase().includes(search) || order.partName.toLowerCase().includes(search))
    .map((order) => ({
      ...order,
      requester: byId(users, order.requesterId),
      blueprint: byId(blueprints, order.blueprintId),
      center: byId(printCenters, order.centerId),
    }))
}

export function getDemoBlueprints(params?: URLSearchParams) {
  const category = params?.get('category')
  const certification = params?.get('certification')?.toLowerCase()
  const status = params?.get('status')
  const search = params?.get('search')?.toLowerCase()
  return blueprints.filter((bp) =>
    (!category || category === 'all' || bp.category === category) &&
    (!certification || certification === 'all' || bp.certification.toLowerCase().includes(certification)) &&
    (!status || status === 'all' || bp.status === status) &&
    (!search || [bp.blueprintId, bp.name, bp.oem].some((value) => value.toLowerCase().includes(search)))
  )
}

export function getDemoCenters() {
  return printCenters.map((center) => ({ ...center, orderCount: orders.filter((order) => order.centerId === center.id).length }))
}

export function getDemoShipments(params?: URLSearchParams) {
  const status = params?.get('status')
  const search = params?.get('search')?.toLowerCase()
  return shipments
    .filter((shipment) => !status || status === 'all' || shipment.status === status)
    .filter((shipment) => !search || shipment.trackingId.toLowerCase().includes(search))
    .map((shipment) => {
      const order = orders.find((item) => item.id === shipment.orderId)
      return { ...shipment, order: order ? { orderId: order.orderId, partName: order.partName } : null }
    })
}

export function getDemoStats() {
  const delivered = orders.filter((order) => order.status === 'delivered')
  const activeOrders = orders.filter((order) => ['pending', 'printing', 'quality_check'].includes(order.status))
  const centers = getDemoCenters()
  return {
    kpis: {
      totalOrders: orders.length,
      activeOrders: activeOrders.length,
      deliveredParts: delivered.reduce((sum, order) => sum + order.quantity, 0),
      avgLeadTime: 4.2,
      costSavings: delivered.reduce((sum, order) => sum + order.quantity, 0) * 150,
    },
    blueprints: {
      total: blueprints.length,
      active: blueprints.filter((bp) => bp.status === 'active').length,
      pending: blueprints.filter((bp) => bp.status === 'pending_review').length,
    },
    centers: {
      online: centers.filter((center) => center.status === 'online').length,
      total: centers.length,
      status: centers.map(({ id, name, status, currentJobs, completedToday, capacity }) => ({ id, name, status, currentJobs, completedToday, capacity })),
    },
    recentOrders: getDemoOrders().slice(0, 5),
  }
}
