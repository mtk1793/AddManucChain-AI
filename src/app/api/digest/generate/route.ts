import { NextRequest, NextResponse } from 'next/server'

interface DigestItem {
  type: 'critical_part' | 'low_stock' | 'completed_order' | 'upcoming_deadline'
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
}

function generateInventoryDigest(): {
  summaryNarrative: string
  items: DigestItem[]
  topMetrics: Record<string, string | number>
  recommendations: string[]
  generatedAt: string
} {
  const now = new Date()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // Simulated digest data
  const items: DigestItem[] = [
    {
      type: 'critical_part',
      title: 'Pump Impeller 316L - CRITICAL RISK',
      description: '2/5 units in stock, 14-day lead time. High print demand yesterday (240h estimated).',
      priority: 'critical',
      timestamp: now.toISOString(),
    },
    {
      type: 'low_stock',
      title: 'Titanium Grade 5 - Low Inventory',
      description: 'Material stock at 35% capacity. Reorder recommended within 48 hours.',
      priority: 'high',
      timestamp: now.toISOString(),
    },
    {
      type: 'completed_order',
      title: 'Bearing Housing - Order ORD-1847 Completed',
      description: 'Delivered to Hibernia Platform. QA verification complete. Now in production use.',
      priority: 'low',
      timestamp: yesterday.toISOString(),
    },
    {
      type: 'upcoming_deadline',
      title: 'Valve Seat Certificate Renewal Due',
      description: 'DNV GL certification expires in 8 days. Pre-renewal audit scheduled.',
      priority: 'high',
      timestamp: now.toISOString(),
    },
    {
      type: 'completed_order',
      title: 'Heat Exchanger Core - Order ORD-1846 Shipped',
      description: '2-unit batch via helicopter from St. John\'s AM. ETA +4 hours.',
      priority: 'medium',
      timestamp: yesterday.toISOString(),
    },
  ]

  const topMetrics = {
    ordersCompleted: 3,
    ordersPrinting: 2,
    partsAtRisk: 4,
    lowStockAlerts: 2,
    certExpiringDays: 8,
    avgPrintTime: '4.2 hours',
    printCenterUtilization: '72%',
  }

  const recommendations = [
    'Pre-queue 2 Pump Impeller units to reduce stockout risk',
    'Initiate material reorder for Titanium Grade 5 today',
    'Schedule DNV GL renewal audit immediately',
    'Redistribute load: St. John\'s AM is offline, reroute to Halifax XL',
    'Archive 5 completed orders for compliance audit',
  ]

  const summaryNarrative = `
📊 Daily Inventory Digest — ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

✅ Yesterday\'s Performance:
- Completed 3 orders totaling 8 parts
- Average print time: 4.2 hours
- No quality rejections or rework needed
- Print center utilization: 72% (optimal range)

⚠️  Today\'s Priorities:
- 4 parts at risk of stockout in next 7 days
- 2 material alerts (Titanium, Cast iron low)
- DNV GL cert renewal due in 8 days
- 1 print center offline for maintenance

🎯 Recommended Actions:
- Pre-queue Pump Impeller to reduce 52-hour vulnerability window
- Order Titanium Grade 5 stock immediately
- Rebalance workload: St. John\'s AM → Halifax XL
- Execute DNV audit pre-renewal

✨ System Status: All endpoints nominal. Next digest: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleTimeString()}`

  return {
    summaryNarrative,
    items,
    topMetrics,
    recommendations,
    generatedAt: now.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const digest = generateInventoryDigest()
    return NextResponse.json(digest)
  } catch (error) {
    console.error('Error generating digest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email } = body

    if (action === 'schedule_email' && email) {
      // Simulate scheduling
      const digest = generateInventoryDigest()
      return NextResponse.json({
        success: true,
        message: `Digest scheduled to send to ${email} daily at 08:00 UTC`,
        nextScheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        digest,
      })
    }

    if (action === 'send_now' && email) {
      const digest = generateInventoryDigest()
      return NextResponse.json({
        success: true,
        message: `Digest sent to ${email}`,
        digestSize: JSON.stringify(digest).length,
        items: digest.items.length,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing digest request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
