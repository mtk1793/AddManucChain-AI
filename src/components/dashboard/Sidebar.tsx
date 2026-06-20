'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  FileBox,
  Factory,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Truck,
  Boxes,
  Shield,
  GraduationCap,
  Sparkles,
  KeyRound,
  X,
  BookMarked,
  FlaskConical,
  ChevronsUpDown,
  Zap,
  Database,
  Globe,
  HandshakeIcon,
  Printer,
  CheckCircle2,
  Search,
  Bell,
  TrendingUp,
  Download,
  Layers,
  Activity,
  AlertCircle,
  Workflow,
  Key,
  Grid,
  Brain,
  Smartphone,
  Bot,
} from 'lucide-react'
import { useState } from 'react'

// ── Demo personas — one per segment ──────────────────────────────────────────
const demoPersonas = [
  {
    role: 'admin',
    name: 'Mahmoud K.',
    org: 'AddManuChain Platform',
    initials: 'MK',
    color: '#0EA5E9',
    badge: 'Platform Admin',
  },
  {
    role: 'oem_partner',
    name: 'Johann Weber',
    org: 'Wärtsilä Marine OEM',
    initials: 'JW',
    color: '#8B5CF6',
    badge: 'OEM Partner',
  },
  {
    role: 'end_user',
    name: 'Capt. Sarah Leblanc',
    org: 'Horizon Maritime (Client)',
    initials: 'SL',
    color: '#14B8A6',
    badge: 'End User / Client',
  },
  {
    role: 'cert_authority',
    name: 'Dr. Priya Patel',
    org: 'DNV — Class Society',
    initials: 'PP',
    color: '#F59E0B',
    badge: 'Cert. Authority',
  },
  {
    role: 'lab',
    name: 'Prof. Ahmad Osman',
    org: 'Dalhousie AM Lab',
    initials: 'AO',
    color: '#10B981',
    badge: 'Lab / Testing',
  },
  {
    role: 'print_center',
    name: 'Michael Okafor',
    org: 'PolyUnity NL (Print Facility)',
    initials: 'MO',
    color: '#EF4444',
    badge: '3D Print Facility',
  },
]

// ── Role → allowed nav items ──────────────────────────────────────────────────
const rolePermissions: Record<string, string[]> = {
  // Full access to everything
  admin: [
    'overview', 'orders', 'print_queue', 'emergency',
    'ai_agent', 'ai_part_scanner', 'ai_auto_print',
    'workforce_knowledge',
    'ip_library', 'blueprints', 'partners', 'oem_portal',
    'digital_inventory', 'physical_inventory', 'smart_inventory', 'centers', 'peer_printers', 'shipments', 'materials', 'cooperative',
    'certifications', 'authorities', 'audit',
    'lab_portal', 'material_properties',
    'analytics', 'services', 'feasibility', 'sc_intelligence',
    'my_printers',
    'reports', 'notifications', 'search', 'batch', 'forecasts',
    'monitoring', 'integrations', 'automation', 'users', 'api', 'dashboards',
    'advanced_analytics', 'workflow_builder', 'mobile_dashboard', 'one-click-ordering',
    'settings',
  ],
  // IP holders
  oem_partner: [
    'overview', 'print_queue', 'oem_approvals',
    'ip_library', 'blueprints', 'oem_portal', 'partners', 'audit',
    'certifications',
    'material_properties',
    'analytics', 'feasibility',
    'reports', 'notifications', 'search', 'batch', 'forecasts',
    'monitoring', 'integrations', 'automation', 'users', 'api', 'dashboards',
    'advanced_analytics', 'workflow_builder', 'mobile_dashboard',
    'settings',
  ],
  // Customers / operators
  end_user: [
    'overview', 'orders', 'emergency',
    'ai_agent', 'smart_inventory',
    'peer_printers', 'shipments', 'physical_inventory', 'digital_inventory', 'cooperative',
    'material_properties', 'my_printers', 'lab_portal', 'materials',
    'services', 'feasibility', 'sc_intelligence',
    'reports', 'notifications', 'search', 'batch', 'forecasts',
    'monitoring', 'dashboards',
    'advanced_analytics', 'workflow_builder', 'mobile_dashboard', 'one-click-ordering',
    'settings',
  ],
  // DNV, Lloyd's, etc
  cert_authority: [
    'overview', 'print_queue', 'cert_approvals',
    'blueprints',
    'certifications', 'authorities', 'audit',
    'material_properties',
    'analytics', 'feasibility',
    'reports', 'notifications', 'search', 'batch', 'forecasts',
    'monitoring', 'integrations', 'automation', 'dashboards',
    'advanced_analytics', 'workflow_builder', 'mobile_dashboard',
    'settings',
  ],
  // Research & testing labs
  lab: [
    'overview',
    'lab_portal', 'material_properties',
    'blueprints',
    'materials', 'digital_inventory', 'physical_inventory',
    'certifications',
    'analytics', 'feasibility',
    'reports', 'notifications', 'search', 'batch', 'forecasts',
    'monitoring', 'dashboards',
    'advanced_analytics', 'mobile_dashboard',
    'settings',
  ],
  // Authorized AM facilities
  print_center: [
    'overview', 'orders', 'print_queue', 'emergency',
    'blueprints',
    'my_printers', 'materials', 'physical_inventory', 'digital_inventory', 'shipments', 'cooperative',
    'material_properties', 'feasibility',
    'reports', 'notifications', 'search', 'batch', 'forecasts',
    'monitoring', 'automation', 'dashboards',
    'advanced_analytics', 'workflow_builder', 'mobile_dashboard', 'one-click-ordering',
    'settings',
  ],
}

// ── Nav structure ─────────────────────────────────────────────────────────────
// End User menu
const endUserMenuSections = [
  {
    title: 'Core',
    items: [
      { id: 'overview',     label: 'Overview',         icon: LayoutDashboard },
      { id: 'orders',       label: 'Orders',           icon: Package,  badge: 3 },
      { id: 'ai_agent',     label: 'AI Agent',         icon: Bot },
      { id: 'my_printers',  label: 'My Printers',      icon: Printer },
      { id: 'lab_portal',   label: 'Lab Testing',      icon: FlaskConical },
      { id: 'shipments',    label: 'Shipments',        icon: Truck },
      { id: 'materials',    label: 'Materials',        icon: Boxes },
      { id: 'smart_inventory', label: 'Smart Inventory', icon: Boxes },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

// OEM Partner menu
const oemPartnerMenuSections = [
  {
    title: 'Core',
    items: [
      { id: 'overview',     label: 'Overview',         icon: LayoutDashboard },
      { id: 'blueprints',   label: 'Blueprints',       icon: FileBox },
      { id: 'ip_library',   label: 'IP Library',       icon: BookMarked },
      { id: 'analytics',    label: 'Analytics',        icon: BarChart3 },
    ],
  },
  {
    title: 'Approvals',
    items: [
      { id: 'oem_approvals', label: 'DRM Approvals',   icon: CheckCircle2, badge: 4 },
    ],
  },
  {
    title: 'Integration',
    items: [
      { id: 'partners',     label: 'Partners',         icon: HandshakeIcon },
      { id: 'audit',        label: 'Audit Chain',      icon: FileText },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

// Lab Testing menu
const labTestingMenuSections = [
  {
    title: 'Testing',
    items: [
      { id: 'overview',     label: 'Overview',         icon: LayoutDashboard },
      { id: 'lab_portal',   label: 'Lab Portal',       icon: FlaskConical },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { id: 'certifications', label: 'Certifications', icon: Shield },
      { id: 'audit',          label: 'Audit Chain',    icon: FileText },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

// Certification Authority menu
const certAuthorityMenuSections = [
  {
    title: 'Approvals',
    items: [
      { id: 'overview',       label: 'Overview',           icon: LayoutDashboard },
      { id: 'certifications', label: 'Certifications',     icon: Shield },
      { id: 'cert_approvals', label: 'Print Approvals',    icon: CheckCircle2, badge: 6 },
      { id: 'authorities',    label: 'Authorities',        icon: Users },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { id: 'audit',  label: 'Audit Chain',    icon: FileText },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

// Default admin menu (legacy)
const baseMenuSections = [
  {
    title: 'Pipeline',
    items: [
      { id: 'overview',     label: 'Overview',         icon: LayoutDashboard },
      { id: 'orders',       label: 'Orders',           icon: Package,  badge: 3 },
      { id: 'print_queue',  label: 'DRM Approval',     icon: KeyRound, badge: 5 },
    ],
  },
  {
    title: 'AI Intelligence',
    items: [
      { id: 'ai_agent',        label: 'AI Operations Agent', icon: Bot },
      { id: 'ai_part_scanner', label: 'Part Scanner',        icon: Brain },
      { id: 'ai_auto_print',   label: 'Auto-Print',          icon: Zap },
    ],
  },
  {
    title: 'People & Knowledge',
    items: [
      { id: 'workforce_knowledge', label: 'Workforce Knowledge', icon: GraduationCap },
    ],
  },
  {
    title: 'Resources',
    items: [
      { id: 'blueprints',        label: 'Blueprint Library',     icon: FileBox },
      { id: 'centers',           label: 'Print Centers',         icon: Factory },
      { id: 'my_printers',       label: 'My Printers',           icon: Printer },
      { id: 'shipments',         label: 'Shipments',             icon: Truck },
      { id: 'physical_inventory',label: 'Physical Inventory',    icon: Database },
      { id: 'smart_inventory',   label: 'Smart Inventory Console', icon: Boxes },
      { id: 'lab_portal',        label: 'Lab Portal',            icon: FlaskConical },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { id: 'certifications', label: 'Certifications', icon: Shield },
      { id: 'audit',          label: 'Audit Chain',    icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

// Print center facility-specific menu
const facilityMenuSections = [
  {
    title: 'Operations',
    items: [
      { id: 'overview',     label: 'Facility Dashboard',  icon: LayoutDashboard },
      { id: 'orders',       label: 'Orders',              icon: Package,  badge: 3 },
      { id: 'print_queue',  label: 'Job Queue',           icon: KeyRound, badge: 5 },
      { id: 'my_printers',  label: 'Printers',            icon: Printer },
    ],
  },
  {
    title: 'Facility',
    items: [
      { id: 'materials',    label: 'Materials',           icon: Boxes },
      { id: 'blueprints',   label: 'Approved Blueprints', icon: FileBox },
      { id: 'shipments',    label: 'Shipments',           icon: Truck },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { id: 'certifications', label: 'Certifications', icon: Shield },
      { id: 'audit',          label: 'Audit Chain',    icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Controlled role — if provided, overrides internal state */
  activeRole?: string
  /** Called when the user switches demo persona */
  onRoleChange?: (role: string) => void
}

export function Sidebar({ activeTab, onTabChange, mobileOpen, onMobileClose, collapsed = false, onCollapsedChange, activeRole, onRoleChange }: SidebarProps) {
  const setCollapsed = (val: boolean) => onCollapsedChange?.(val)
  // Use activeRole as default to prevent hydration mismatch
  const [internalRole, setInternalRole] = useState(activeRole ?? 'admin')
  const demoRole = activeRole ?? internalRole
  const [showRolePicker, setShowRolePicker] = useState(false)
  
  // Select menu based on role - support 5 personas
  let menuSections = baseMenuSections
  if (demoRole === 'end_user') menuSections = endUserMenuSections
  else if (demoRole === 'oem_partner') menuSections = oemPartnerMenuSections
  else if (demoRole === 'lab') menuSections = labTestingMenuSections
  else if (demoRole === 'cert_authority') menuSections = certAuthorityMenuSections
  else if (demoRole === 'print_center') menuSections = facilityMenuSections
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(menuSections.map(s => [s.title, true]))
  )

  const toggleSection = (title: string) =>
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }))

  const allowed = rolePermissions[demoRole] ?? rolePermissions.admin
  const currentPersona = demoPersonas.find(p => p.role === demoRole)!

  const handleRoleSwitch = (role: string) => {
    setInternalRole(role)
    onRoleChange?.(role)
    setShowRolePicker(false)
    onTabChange('overview')
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-[#0F172A] border-r border-slate-800 transition-all duration-300 flex flex-col',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'flex' : 'hidden',
          'md:flex'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 flex-shrink-0">
          <div className={cn('flex items-center gap-3', collapsed && 'hidden')}>
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/addmanuchain-logo.png"
                alt="AddManuChain Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold text-white">
              AddManu<span className="text-[#0EA5E9]">Chain</span>
            </span>
          </div>
          {collapsed && (
            <div className="w-10 h-10 relative flex-shrink-0 mx-auto">
              <Image
                src="/addmanuchain-logo.png"
                alt="AddManuChain Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn('hidden md:flex items-center justify-center text-slate-400 hover:text-white transition-colors', collapsed && 'md:hidden')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onMobileClose}
            className="md:hidden flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="absolute right-2 top-6 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current role badge — expanded only */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-slate-800/50">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold text-white"
              style={{ backgroundColor: `${currentPersona.color}30`, color: currentPersona.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentPersona.color }} />
              {currentPersona.badge}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav
          className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-1 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {menuSections.map((section, index) => {
            const visibleItems = section.items.filter(item => allowed.includes(item.id))
            if (visibleItems.length === 0) return null
            const isOpen = openSections[section.title] ?? true

            return (
              <div key={`${section.title}-${index}`} className="mb-1">
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-md group hover:bg-slate-800/60 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                      {section.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-all duration-200',
                        !isOpen && '-rotate-90'
                      )}
                    />
                  </button>
                )}
                <div
                  className={cn(
                    'space-y-0.5 overflow-hidden transition-all duration-200',
                    !collapsed && !isOpen ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'
                  )}
                >
                  {visibleItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { onTabChange(item.id); onMobileClose?.() }}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                        activeTab === item.id
                          ? 'bg-[#0EA5E9]/20 text-[#0EA5E9]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800',
                        collapsed && 'justify-center px-0'
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-[#F59E0B] text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
                {collapsed && <div className="w-8 h-px bg-slate-800 mx-auto my-2" />}
              </div>
            )
          })}
        </nav>

        {/* User / Role Switcher */}
        <div className="border-t border-slate-800 p-3 flex-shrink-0 relative">
          {/* Role picker flyout */}
          {showRolePicker && !collapsed && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider px-3 pt-3 pb-1.5">
                Switch Demo View
              </p>
              {demoPersonas.map(persona => (
                <button
                  key={persona.role}
                  onClick={() => handleRoleSwitch(persona.role)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 transition-colors text-left',
                    demoRole === persona.role && 'bg-slate-800/70'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: persona.color }}
                  >
                    {persona.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{persona.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{persona.badge}</p>
                  </div>
                  {demoRole === persona.role && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: persona.color }} />
                  )}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowRolePicker(v => !v)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: currentPersona.color }}
            >
              {currentPersona.initials}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">{currentPersona.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentPersona.org}</p>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

