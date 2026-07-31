'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, User, Settings, ChevronDown, X, Menu, HelpCircle, Command, LayoutDashboard, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NotificationsDropdown } from './NotificationsDropdown'
import {
  orders,
  blueprints,
  physicalParts,
  physicalSites,
} from '@/lib/static-data'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    onClick: () => void
  }
  onNavigate?: (tab: string) => void
  onTutorialClick?: () => void
  onCommandPaletteTrigger?: () => void
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
  currentRole?: string
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-700'
    case 'operator': return 'bg-sky-100 text-sky-700'
    case 'customer_admin': return 'bg-blue-100 text-blue-700'
    case 'oem_partner': return 'bg-green-100 text-green-700'
    case 'print_center': return 'bg-orange-100 text-orange-700'
    case 'cert_authority': return 'bg-red-100 text-red-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Admin'
    case 'customer_admin': return 'Customer Admin'
    case 'oem_partner': return 'OEM Manufacturer'
    case 'print_center': return 'Print Facility'
    case 'cert_authority': return 'Certification Body'
    case 'operator': return 'End User'
    default: return role
  }
}

// ─── Search index ─────────────────────────────────────────────────────────────
function buildSearchIndex() {
  const results: { label: string; sub: string; tab: string; keyword: string }[] = []
  orders.forEach(o => {
    results.push({ label: o.partName, sub: `Order ${o.orderId} · ${o.status}`, tab: 'orders', keyword: `${o.partName} ${o.orderId}`.toLowerCase() })
  })
  blueprints.forEach(b => {
    results.push({ label: b.name, sub: `${b.blueprintId} · ${b.material}`, tab: 'blueprints', keyword: `${b.name} ${b.blueprintId} ${b.material}`.toLowerCase() })
  })
  physicalParts.forEach(p => {
    const site = physicalSites.find(s => s.id === p.siteId)
    results.push({ label: p.name, sub: `${p.partNumber} · ${site?.name ?? ''}`, tab: 'physical_inventory', keyword: `${p.name} ${p.partNumber}`.toLowerCase() })
  })
  results.push({ label: 'Print Queue', sub: 'DRM approval pipeline', tab: 'print_queue', keyword: 'print queue drm approval token' })
  results.push({ label: 'Physical Inventory', sub: 'Spare parts cabinet by site', tab: 'physical_inventory', keyword: 'physical inventory parts stock' })
  results.push({ label: 'Digital Inventory', sub: 'AI-ranked blueprint risk queue', tab: 'digital_inventory', keyword: 'digital inventory ai blueprint' })
  results.push({ label: 'Audit Logs', sub: 'Hash chain integrity', tab: 'audit', keyword: 'audit log hash chain drm' })
  return results
}

const searchIndex = buildSearchIndex()

const DASH_LINKS = [
  { role: 'admin', label: 'Admin', url: '/dash/admin', color: 'bg-violet-500' },
  { role: 'operator', label: 'End User', url: '/dash/operator', color: 'bg-sky-500' },
  { role: 'partner', label: 'OEM Manufacturer', url: '/dash/partner', color: 'bg-teal-500' },
  { role: 'cert', label: 'Certification Body', url: '/dash/cert', color: 'bg-amber-500' },
  { role: 'center', label: 'Print Facility', url: '/dash/center', color: 'bg-rose-500' },
]

export function Header({ title, subtitle, action, onNavigate, onTutorialClick, onCommandPaletteTrigger, mobileOpen, setMobileOpen, currentRole = 'admin' }: HeaderProps) {
  const { data: session } = useSession()
  const user = session?.user || {
    name: 'Platform User',
    email: 'user@addmanuchain.com',
    company: 'AddManuChain',
    role: currentRole,
    image: null as string | null,
  }
  
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const searchResults = query.length >= 2
    ? searchIndex.filter(r => r.keyword.includes(query.toLowerCase())).slice(0, 6)
    : []

  const handleSelect = (tab: string) => {
    setQuery('')
    setFocused(false)
    onNavigate?.(tab)
  }

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC] border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
{/* Mobile menu toggle + Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {setMobileOpen && (
              <button
                className="md:hidden p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
            )}
            <div className="min-w-0" onClick={e => e.stopPropagation()}>
              <h1 className="text-xl font-bold text-[#0F172A] truncate">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 truncate">{subtitle}</p>}
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">

          {/* Search with live dropdown */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input
              placeholder="Search parts, orders..."
              className="w-40 lg:w-64 xl:w-72 pl-10 pr-8 bg-white border-slate-200"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setQuery('')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Results dropdown */}
            {focused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                {searchResults.map((r, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                    onMouseDown={() => handleSelect(r.tab)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{r.label}</p>
                      <p className="text-xs text-slate-400 truncate">{r.sub}</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0">{r.tab.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            )}

            {focused && query.length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 text-center text-sm text-slate-400">
                No results for "{query}"
              </div>
            )}
          </div>

          {/* Command Palette trigger (Cmd+K) */}
          {onCommandPaletteTrigger && (
            <button
              onClick={onCommandPaletteTrigger}
              title="Open command palette (Cmd+K)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-500"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">K</span>
            </button>
          )}

          {/* Tutorial help button */}
          {onTutorialClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onTutorialClick}
              title="Show section tutorial"
              className="relative text-slate-500 hover:text-sky-600 hover:bg-sky-50"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          )}

          {/* Notifications dropdown (live API data) */}
          <NotificationsDropdown />

          {/* Primary Action */}
          {action && (
            <Button
              onClick={action.onClick}
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          )}

          {/* User Menu - Always shown since authentication is removed */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="bg-[#0EA5E9] text-white text-xs">
                    {getInitials(user.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-[#0F172A]">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.company}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit mt-2 ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Inter-dashboard navigation bar */}
        <div className="flex items-center gap-1 px-6 py-1.5 bg-slate-100/50 border-t border-slate-200 overflow-x-auto">
          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mr-1" />
          <span className="text-[11px] text-slate-500 font-medium flex-shrink-0 mr-2">Dashboards:</span>
          {DASH_LINKS.map((d) => (
            <a
              key={d.role}
              href={d.url}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                currentRole === d.role
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${d.color}`} />
              {d.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
