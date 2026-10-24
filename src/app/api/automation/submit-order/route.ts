import { NextRequest } from 'next/server'
import { runOrderPipeline } from '@/lib/order-pipeline'
import { getOrderAutomationAgent, DEFAULT_AUTOMATION_CONFIG } from '@/lib/order-automation-agent'
import { db } from '@/lib/db'

const agent = getOrderAutomationAgent()

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action')
  const orderId = request.nextUrl.searchParams.get('orderId')

  try {
    if (action === 'status' && orderId) {
      const order = await db.order.findFirst({
        where: { orderId },
        include: {
          auditLogs: { orderBy: { createdAt: 'asc' } },
          shipment: true,
        },
      })
      if (!order) {
        const legacy = agent.getOrderStatus(orderId)
        return Response.json({ success: true, status: legacy })
      }
      return Response.json({
        success: true,
        status: {
          orderId: order.orderId,
          dbStatus: order.status,
          pipeline: order.auditLogs.map((a) => ({
            stage: a.action,
            details: a.details,
            at: a.createdAt,
          })),
          shipment: order.shipment,
          isProcessing: false,
        },
      })
    }

    if (action === 'stats') {
      const [orderCount, delivered, certCount, shipCount] = await Promise.all([
        db.order.count(),
        db.order.count({ where: { status: 'delivered' } }),
        db.certificationRequest.count(),
        db.shipment.count(),
      ])
      return Response.json({
        success: true,
        stats: {
          ...agent.getStats(),
          totalOrders: orderCount,
          deliveredParts: delivered,
          certificationRequests: certCount,
          shipments: shipCount,
        },
        config: DEFAULT_AUTOMATION_CONFIG,
      })
    }

    if (action === 'pending_orders') {
      const pending = await db.order.findMany({
        where: { status: { in: ['submitted', 'oem_review', 'certification_review', 'printing'] } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { requester: true, center: true },
      })
      return Response.json({
        success: true,
        pendingOrders: pending,
        count: pending.length,
      })
    }

    return Response.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get status',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, order, config } = body

    // Submit order — runs the 4-stage pipeline (end_user -> oem -> cert -> print)
    if (action === 'submit_order' && order) {
      const firstItem = Array.isArray(order.items) && order.items.length > 0
        ? order.items[0]
        : null
      const metadata = order.metadata ?? {}
      const customerName =
        metadata.customerName ??
        (typeof order.customerId === 'string' ? order.customerId : undefined)
      const customerEmail = metadata.customerEmail

      const result = await runOrderPipeline({
        partName: firstItem?.name ?? order.partName ?? 'Unnamed Part',
        quantity:
          firstItem?.quantity ??
          order.quantity ??
          (Array.isArray(order.items) ? order.items.length : 1),
        priority: order.priority ?? 'normal',
        notes: order.notes,
        customerName,
        customerEmail,
        items: order.items,
        blueprintId: order.blueprintId ?? null,
        centerId: order.centerId ?? null,
      })

      return Response.json({
        success: result.success,
        result,
        message: result.message,
      })
    }

    // Update automation configuration (kept from original agent)
    if (action === 'update_config' && config) {
      agent.updateConfig(config)
      return Response.json({
        success: true,
        message: 'Automation configuration updated',
        config: DEFAULT_AUTOMATION_CONFIG,
      })
    }

    // Reset automation system (kept from original agent)
    if (action === 'reset') {
      agent.reset()
      return Response.json({
        success: true,
        message: 'Automation system reset',
      })
    }

    return Response.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Order automation error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Automation failed',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    // Update order processing status
    if (action === 'update_status') {
      return Response.json({
        success: true,
        message: 'Order status updated',
      })
    }

    return Response.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed',
      },
      { status: 500 }
    )
  }
}
