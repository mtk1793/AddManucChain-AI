import { NextRequest } from 'next/server'

// Simple HTTP polling fallback for real-time events
// WebSocket upgrade would be handled by middleware/proxy

const activeConnections = new Map<string, { userId: string; role: string; lastPing: number }>()
const eventQueue: any[] = []

export async function GET(request: NextRequest) {
  const channel = request.nextUrl.searchParams.get('channel') || 'global'
  const userId = request.nextUrl.searchParams.get('userId') || 'guest'
  const role = request.nextUrl.searchParams.get('role') || 'viewer'

  // Register connection
  const connectionId = `${userId}-${Date.now()}`
  activeConnections.set(connectionId, { userId, role, lastPing: Date.now() })

  // Clean old connections
  for (const [id, conn] of activeConnections) {
    if (Date.now() - conn.lastPing > 60000) activeConnections.delete(id)
  }

  // Collect events for this user
  const userEvents = eventQueue.filter(e => 
    e.channel === channel || e.channel === 'global' ||
    (e.visibility === 'all' || (e.visibility === role))
  )

  return Response.json({
    success: true,
    connectionId,
    channel,
    activeConnections: activeConnections.size,
    events: userEvents.slice(-50), // Last 50 events
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { event, channel = 'global', visibility = 'all', data } = body

  const newEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    event,
    channel,
    visibility,
    data,
    timestamp: new Date().toISOString(),
    broadcastTo: Array.from(activeConnections.values()).length,
  }

  eventQueue.push(newEvent)
  
  // Keep only last 1000 events in memory
  if (eventQueue.length > 1000) eventQueue.shift()

  return Response.json({
    success: true,
    eventId: newEvent.id,
    broadcastTo: newEvent.broadcastTo,
    message: 'Event broadcasted to all connected clients',
  })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { userId, status = 'active' } = body

  // Heartbeat/ping to keep connection alive
  for (const [id, conn] of activeConnections) {
    if (conn.userId === userId) {
      conn.lastPing = Date.now()
    }
  }

  return Response.json({
    success: true,
    status,
    activeConnections: activeConnections.size,
    message: 'Connection refreshed',
  })
}
