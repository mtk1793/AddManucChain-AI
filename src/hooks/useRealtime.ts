import { useEffect, useState, useCallback } from 'react'

interface RealtimeEvent {
  id: string
  event: string
  channel: string
  data: any
  timestamp: string
}

interface UseRealtimeOptions {
  userId?: string
  role?: string
  channel?: string
  onEventReceived?: (event: RealtimeEvent) => void
}

/**
 * Hook for real-time event streaming
 * Uses polling as websocket fallback
 */
export function useRealtime(options: UseRealtimeOptions = {}) {
  const { userId = 'guest', role = 'viewer', channel = 'global', onEventReceived } = options
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    try {
      const response = await fetch(`/api/realtime/websocket?userId=${userId}&role=${role}&channel=${channel}`)
      const data = await response.json()

      if (data.success) {
        setConnected(true)
        setEvents(data.events || [])
        setError(null)

        // Notify about new events
        if (data.events && onEventReceived) {
          data.events.slice(-5).forEach((event: RealtimeEvent) => {
            onEventReceived(event)
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
      setConnected(false)
    }
  }, [userId, role, channel, onEventReceived])

  const broadcastEvent = useCallback(async (event: string, eventData: any) => {
    try {
      const response = await fetch('/api/realtime/websocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          channel,
          visibility: 'all',
          data: eventData,
        }),
      })
      const data = await response.json()
      return data.success
    } catch (err) {
      console.error('Broadcast failed:', err)
      return false
    }
  }, [channel])

  const ping = useCallback(async () => {
    try {
      await fetch('/api/realtime/websocket', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'active' }),
      })
    } catch (err) {
      console.error('Ping failed:', err)
    }
  }, [userId])

  // Connect on mount and set polling interval
  useEffect(() => {
    connect()
    const pollInterval = setInterval(connect, 5000) // Poll every 5 seconds
    const pingInterval = setInterval(ping, 30000) // Ping every 30 seconds

    return () => {
      clearInterval(pollInterval)
      clearInterval(pingInterval)
    }
  }, [connect, ping])

  return {
    events,
    connected,
    error,
    broadcastEvent,
    reconnect: connect,
  }
}
