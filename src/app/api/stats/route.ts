import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/require-auth'

// GET dashboard stats
export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error
  try {
    // Get real counts from database
    const [
      totalOrders,
      activeOrders,
      deliveredOrders,
      totalBlueprints,
      activeBlueprints,
      pendingBlueprints,
      onlineCenters,
      totalCenters,
      orders,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: { in: ['pending', 'printing', 'quality_check'] } } }),
      db.order.count({ where: { status: 'delivered' } }),
      db.blueprint.count(),
      db.blueprint.count({ where: { status: 'active' } }),
      db.blueprint.count({ where: { status: 'pending_review' } }),
      db.printCenter.count({ where: { status: 'online' } }),
      db.printCenter.count(),
      db.order.findMany({
        where: { status: 'delivered' },
        include: { blueprint: true },
      }),
    ])

    // Calculate delivered parts (sum of quantities)
    const deliveredParts = orders.reduce((sum, order) => sum + order.quantity, 0)

    // Calculate cost savings (estimate $150 per part on average)
    const costSavings = deliveredParts * 150

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        requester: true,
        center: true,
      },
    })

    // Get center status
    const centerStatus = await db.printCenter.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        currentJobs: true,
        completedToday: true,
        capacity: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      kpis: {
        totalOrders,
        activeOrders,
        deliveredParts,
        avgLeadTime: 4.2,
        costSavings,
      },
      blueprints: {
        total: totalBlueprints,
        active: activeBlueprints,
        pending: pendingBlueprints,
      },
      centers: {
        online: onlineCenters,
        total: totalCenters,
        status: centerStatus,
      },
      recentOrders,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
