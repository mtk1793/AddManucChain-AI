'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, X, Send, Bot, User, Loader2,
  Trash2, ChevronDown, Sparkles, Copy, Check, Zap, Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant' | 'action'
  content: string
  timestamp: Date
  actionLabel?: string
  actionType?: string
}

// ─── Suggested starter prompts ────────────────────────────────────────────────

const SUGGESTIONS = [
  'How do I create a new print order?',
  'Explain the DRM approval pipeline',
  'How does the AI risk score work?',
  'What is a Secure Print Token?',
  'How do certifications affect print approval?',
  'What does the Audit Log hash chain do?',
  'How do I register a new blueprint?',
  'What are the 6 user roles?',
]

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
// Converts **bold**, `code`, bullet lists, and line breaks to JSX

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()

    // Bullet lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const content = trimmed.slice(2)
      elements.push(
        <li key={key++} className="flex items-start gap-1.5 ml-1">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
          <span>{inlineMarkdown(content)}</span>
        </li>
      )
    // Numbered lists
    } else if (/^\d+\.\s/.test(trimmed)) {
      const [, num, , content] = trimmed.match(/^(\d+)(\.\s)(.*)$/) ?? []
      elements.push(
        <li key={key++} className="flex items-start gap-1.5 ml-1">
          <span className="flex-shrink-0 text-sky-400 font-bold text-xs mt-0.5">{num}.</span>
          <span>{inlineMarkdown(content)}</span>
        </li>
      )
    // Headings (## or **)
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <p key={key++} className="font-bold text-slate-900 mt-2 mb-0.5">
          {inlineMarkdown(trimmed.slice(3))}
        </p>
      )
    // Empty line → spacer
    } else if (trimmed === '') {
      elements.push(<div key={key++} className="h-1" />)
    } else {
      elements.push(
        <p key={key++} className="leading-relaxed">{inlineMarkdown(trimmed)}</p>
      )
    }
  }

  return <div className="space-y-0.5">{elements}</div>
}

function inlineMarkdown(text: string): React.ReactNode {
  if (!text) return text
  // Split on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-slate-100 text-sky-700 rounded px-1 py-0.5 text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'
  const isAction = msg.role === 'action'

  const copyText = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Action card (navigate / created)
  if (isAction) {
    const isNavigate = msg.actionType === 'navigate'
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border ${
          isNavigate
            ? 'bg-teal-50 border-teal-200 text-teal-700'
            : 'bg-violet-50 border-violet-200 text-violet-700'
        }`}>
          {isNavigate
            ? <Navigation className="w-3 h-3" />
            : <Zap className="w-3 h-3" />
          }
          {msg.actionLabel}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm mt-0.5 ${
        isUser
          ? 'bg-gradient-to-br from-sky-500 to-teal-400'
          : 'bg-gradient-to-br from-violet-500 to-purple-400'
      }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-white" />
          : <Bot className="w-3.5 h-3.5 text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-tr-sm'
          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
      }`}>
        {isUser
          ? <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          : renderMarkdown(msg.content)
        }

        {/* Copy button — assistant only */}
        {!isUser && (
          <button
            onClick={copyText}
            className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
          >
            {copied
              ? <Check className="w-3 h-3 text-teal-500" />
              : <Copy className="w-3 h-3" />
            }
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-sm">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN AI ASSISTANT COMPONENT ─────────────────────────────────────────────

interface AIAssistantProps {
  role?: string
  onNavigate?: (page: string) => void
}

export function AIAssistant({ role = 'admin', onNavigate }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  useEffect(() => {
    if (isOpen) scrollToBottom(false)
  }, [isOpen, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const handleScroll = () => {
    const el = scrollAreaRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 80)
  }

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build history for context (last 10 messages)
    const history = [...messages.slice(-10), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, role }),
      })

      const data = await res.json()
      const reply = data.reply ?? 'Sorry, I encountered an issue. Please try again.'
      const action = data.frontendAction as { type: string; page?: string; label?: string; entity?: string } | undefined

      // Execute frontend action (navigate / show created badge)
      if (action) {
        if (action.type === 'navigate' && action.page && onNavigate) {
          onNavigate(action.page)
        }
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'action',
            content: '',
            actionLabel: action.label ?? (action.type === 'navigate' ? `Navigated to ${action.page}` : 'Action completed'),
            actionType: action.type,
            timestamp: new Date(),
          },
        ])
      }

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting right now. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => setMessages([])

  const isEmpty = messages.length === 0

  return (
    <>
      {/* ── Floating toggle button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-violet-500/40 transition-shadow"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl bg-[#F8FAFC] border border-slate-200 overflow-hidden"
            style={{ height: '580px' }}
          >

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-500 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">AddManuChain AI</p>
                <p className="text-white/60 text-xs">Powered by Z.ai</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 transition-colors text-white/70 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={scrollAreaRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
            >
              {/* Empty state / welcome */}
              {isEmpty && (
                <div className="flex flex-col items-center justify-center h-full gap-4 pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-violet-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900 text-sm">Hi! I'm your AddManuChain assistant.</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Ask me anything about the platform, your orders, blueprints, certifications, or additive manufacturing.
                    </p>
                  </div>
                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 text-slate-600 rounded-full px-3 py-1.5 transition-colors shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message list */}
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Typing indicator */}
              {loading && <TypingDots />}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 right-5 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <div className="flex-shrink-0 border-t border-slate-200 bg-white px-3 py-3">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about AddManuChain…"
                    rows={1}
                    className="resize-none min-h-[40px] max-h-[120px] pr-2 text-sm border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 rounded-xl bg-slate-50 py-2.5"
                    style={{ fieldSizing: 'content' } as React.CSSProperties}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white border-0 rounded-xl shadow-sm disabled:opacity-40"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                Press <kbd className="bg-slate-100 px-1 rounded text-slate-500">Enter</kbd> to send · <kbd className="bg-slate-100 px-1 rounded text-slate-500">Shift+Enter</kbd> for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
