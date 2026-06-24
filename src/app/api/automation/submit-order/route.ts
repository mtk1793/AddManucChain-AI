import { NextRequest } from 'next/server'
import { getOrderAutomationAgent, DEFAULT_AUTOMATION_CONFIG } from '@/lib/order-automation-agent'

const agent = getOrderAutomationAgent()

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action')
  const orderId = request.nextUrl.searchParams.get('orderId')

  try {
    if (action === 'status' && orderId) {
      const status = await agent.getOrderStatus(orderId)
      return Response.json({
        success: true,
        status,
      })
    }

    if (action === 'stats') {
      const stats = agent.getStats()
      return Response.json({
        success: true,
        stats,
        config: DEFAULT_AUTOMATION_CONFIG,
      })
    }

    if (action === 'pending_orders') {
      const pending = agent.getOrdersNeedingAttention()
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

    // Submit order for automated processing
    if (action === 'submit_order' && order) {
      const result = await agent.submitOrder({
        orderId: order.orderId || `ORD-${Date.now()}`,
        customerId: order.customerId || 'guest',
        items: order.items || [],
        priority: order.priority || 'normal',
        notes: order.notes,
      })

      return Response.json({
        success: true,
        result,
        message: 'Order submitted to automation engine',
      })
    }

    // Update automation configuration
    if (action === 'update_config' && config) {
      agent.updateConfig(config)
      return Response.json({
        success: true,
        message: 'Automation configuration updated',
        config: DEFAULT_AUTOMATION_CONFIG,
      })
    }

    // Reset automation system
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
