'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Command } from 'lucide-react'
import { ALL_NAV_ITEMS, type NavItem } from '@/lib/nav-items'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (pageId: string) => void
}

// Simple subsequence fuzzy match — returns score (higher = better) or -1 if no match.
function fuzzyMatch(query: string, target: string): number {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  if (t.includes(q)) {
    // Exact substring match → strong score, bonus for prefix match
    return t.startsWith(q) ? 100 + q.length : 80 + q.length
  }
  // Subsequence match
  let qi = 0
  let score = 0
  let lastMatchIdx = -1
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += lastMatchIdx === -1 ? 2 : (ti - lastMatchIdx === 1 ? 4 : 1)
      lastMatchIdx = ti
      qi++
    }
  }
  return qi === q.length ? score : -1
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Reset state whenever the palette opens/closes
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      // Focus input on next tick so the element is mounted
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Filter + rank items by fuzzy score across label, keywords, and section
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show all grouped by section when no query
      return ALL_NAV_ITEMS
    }
    return ALL_NAV_ITEMS.map((item) => {
      const labelScore = fuzzyMatch(query, item.label)
      const kwScore = Math.max(
        0,
        ...(item.keywords ?? []).map((k) => fuzzyMatch(query, k)),
      )
      const sectionScore = fuzzyMatch(query, item.section) * 0.3
      const best = Math.max(labelScore, kwScore, sectionScore)
      return { item, score: best }
    })
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item)
  }, [query])

  // Group results by section for display
  const grouped = useMemo(() => {
    const map = new Map<string, NavItem[]>()
    for (const item of results) {
      if (!map.has(item.section)) map.set(item.section, [])
      map.get(item.section)!.push(item)
    }
    return Array.from(map.entries())
  }, [results])

  // Flat index of visible items for keyboard nav
  const flat = useMemo(() => results, [results])

  // Clamp active index when results change
  useEffect(() => {
    setActiveIdx((idx) => Math.min(idx, flat.length - 1))
  }, [flat.length])

  const selectItem = useCallback(
    (item: NavItem) => {
      onNavigate(item.id)
      onOpenChange(false)
    },
    [onNavigate, onOpenChange],
  )

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = flat[activeIdx]
      if (item) selectItem(item)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-cp-idx="${activeIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  // Global Cmd+K / Ctrl+K listener is registered by the parent (page.tsx).
  // Here we just render when `open` is true.

  // Running flat index across grouped sections for highlight tracking
  let runningIdx = -1

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />
          {/* Panel */}
          <div className="fixed inset-0 z-[61] flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onKeyDown={onKeyDown}
              className="pointer-events-auto w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIdx(0)
                  }}
                  placeholder="Search pages, orders, blueprints…"
                  className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-500 border border-slate-200">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[55vh] overflow-y-auto py-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                {flat.length === 0 && (
                  <div className="px-6 py-10 text-center text-sm text-slate-400">
                    No pages match “{query}”.
                  </div>
                )}
                {grouped.map(([section, items]) => (
                  <div key={section} className="mb-1">
                    <div className="px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                      {section}
                    </div>
                    {items.map((item) => {
                      runningIdx++
                      const idx = runningIdx
                      const active = idx === activeIdx
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          data-cp-idx={idx}
                          onMouseMove={() => setActiveIdx(idx)}
                          onClick={() => selectItem(item)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                            active ? 'bg-sky-50' : 'hover:bg-slate-50',
                          )}
                        >
                          <span
                            className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors',
                              active
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-100 text-slate-500',
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-slate-800 truncate">
                              {item.label}
                            </span>
                            <span className="block text-xs text-slate-400 truncate">
                              {item.section}
                            </span>
                          </span>
                          {item.badge ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold">
                              {item.badge}
                            </span>
                          ) : null}
                          {active && (
                            <CornerDownLeft className="w-4 h-4 text-sky-500 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    <ArrowDown className="w-3 h-3" />
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="w-3 h-3" />
                    select
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Command className="w-3 h-3" />
                  <span>AddManuChain</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
