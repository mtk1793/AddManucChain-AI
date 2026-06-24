import { NextRequest, NextResponse } from 'next/server'

// Get system health metrics
export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      uptime: 672,
      cpu: { usage: 34, limit: 80 },
      memory: { usage: 5.2, limit: 8, unit: 'GB' },
      disk: { usage: 78, limit: 100 },
      database: { status: 'connected', latency: 12, connections: 24 },
      api: { responseTime: 145, errorRate: 0.2 },
      services: [
        { name: 'Auth Service', status: 'up', uptime: 672 },
        { name: 'Order Service', status: 'up', uptime: 672 },
        { name: 'Print Service', status: 'up', uptime: 671 },
        { name: 'Notification Service', status: 'up', uptime: 672 },
      ],
    }
    
    return NextResponse.json({
      success: true,
      health,
      timestamp: new Date(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Get performance metrics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, period } = body
    
    const metrics = {
      requests: [
        { timestamp: new Date(Date.now() - 3600000), value: 4523 },
        { timestamp: new Date(Date.now() - 2400000), value: 5124 },
        { timestamp: new Date(Date.now() - 1200000), value: 4856 },
        { timestamp: new Date(), value: 5234 },
      ],
      errors: [
        { timestamp: new Date(Date.now() - 3600000), value: 12 },
        { timestamp: new Date(Date.now() - 2400000), value: 8 },
        { timestamp: new Date(Date.now() - 1200000), value: 5 },
        { timestamp: new Date(), value: 3 },
      ],
      latency: [
        { timestamp: new Date(Date.now() - 3600000), value: 145 },
        { timestamp: new Date(Date.now() - 2400000), value: 152 },
        { timestamp: new Date(Date.now() - 1200000), value: 138 },
        { timestamp: new Date(), value: 142 },
      ],
    }
    
    return NextResponse.json({
      success: true,
      metric: metric || 'overall',
      period: period || '1h',
      data: metrics,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Get alerts
export async function PUT(request: NextRequest) {
  try {
    const alerts = [
      { id: '1', severity: 'critical', title: 'High CPU Usage', message: 'CPU usage at 85%', timestamp: new Date(Date.now() - 300000) },
      { id: '2', severity: 'warning', title: 'Database Latency', message: 'Database latency increased to 890ms', timestamp: new Date(Date.now() - 900000) },
      { id: '3', severity: 'info', title: 'Backup Started', message: 'Scheduled backup started', timestamp: new Date(Date.now() - 1800000) },
      { id: '4', severity: 'warning', title: 'Low Disk Space', message: 'Disk usage at 89%', timestamp: new Date(Date.now() - 3600000) },
    ]
    
    return NextResponse.json({
      success: true,
      alerts,
      totalAlerts: 4,
      criticalAlerts: 1,
      warningAlerts: 2,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// Configure alert thresholds
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertType, threshold, actions } = body
    
    return NextResponse.json({
      success: true,
      alertType,
      threshold,
      actions,
      updatedAt: new Date(),
      message: 'Alert threshold configured',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
