'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  severity: string
  read: boolean
  createdAt: string
  relatedOrderId?: string | null
}

const SEVERITY_STYLES: Record<string, { icon: typeof Info; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  success: { icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString()
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notifications?limit=20', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch + poll every 30s
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        popRef.current && !popRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markAllRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    // Fire-and-forget PUTs for each unread
    notifications.filter((n) => !n.read).forEach((n) => {
      fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: n.id, read: true }),
      }).catch(() => {})
    })
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => {
          setOpen((v) => !v)
          if (!open) fetchNotifications()
        }}
        title="Notifications"
        className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-[#F59E0B] text-white text-[9px] font-bold ring-2 ring-[#F8FAFC]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {loading && notifications.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-slate-400">
                  Loading notifications…
                </div>
              )}

              {error && (
                <div className="px-4 py-8 text-center text-xs text-red-500">
                  {error}
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400">You&apos;re all caught up!</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">No new notifications.</p>
                </div>
              )}

              {notifications.map((n) => {
                const style = SEVERITY_STYLES[n.severity] ?? SEVERITY_STYLES.info
                const Icon = style.icon
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50',
                      !n.read && 'bg-sky-50/40',
                    )}
                  >
                    <div className={cn('shrink-0 w-7 h-7 rounded-lg flex items-center justify-center', style.bg)}>
                      <Icon className={cn('w-3.5 h-3.5', style.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 text-center">
              <span className="text-[10px] text-slate-400">Auto-refreshes every 30s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
