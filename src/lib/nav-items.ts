// Central registry of all dashboard pages.
// Used by the Sidebar, Command Palette, and onboarding tutorials so there is a
// single source of truth for page id → label/icon mapping.

import {
  LayoutDashboard,
  Package,
  KeyRound,
  FileBox,
  Factory,
  Printer,
  Truck,
  FlaskConical,
  Boxes,
  Shield,
  FileText,
  Users,
  Settings,
  BarChart3,
  BookMarked,
  AlertCircle,
  Globe,
  HandshakeIcon,
  Database,
  Layers,
  Activity,
  Workflow,
  Brain,
  Smartphone,
  Bell,
  Search,
  Download,
  Grid,
  Zap,
  Bot,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  section: string
  keywords?: string[]
  badge?: number
}

// Master flat list — covers every page the dashboard can render.
export const ALL_NAV_ITEMS: NavItem[] = [
  // Pipeline
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'Pipeline', keywords: ['home', 'dashboard', 'main'] },
  { id: 'orders', label: 'Orders', icon: Package, section: 'Pipeline', keywords: ['parts', 'requests'], badge: 3 },
  { id: 'print_queue', label: 'DRM Approval', icon: KeyRound, section: 'Pipeline', keywords: ['drm', 'approval', 'queue', 'oem', 'cert'], badge: 5 },
  { id: 'print_approval', label: 'Print Approval', icon: KeyRound, section: 'Pipeline', keywords: ['approval', 'signoff'] },
  { id: 'emergency', label: 'Emergency Response', icon: AlertCircle, section: 'Pipeline', keywords: ['urgent', 'critical', 'triage'] },

  // AI Intelligence (new — interview-grounded)
  { id: 'ai_agent', label: 'AI Operations Agent', icon: Bot, section: 'AI Intelligence', keywords: ['autonomous', 'agent', 'assistant', 'auto', 'chat', 'command', 'natural language'] },
  { id: 'ai_part_scanner', label: 'AI Part Scanner', icon: Brain, section: 'AI Intelligence', keywords: ['suitability', 'feasibility', 'candidate', 'roi', 'scan', 'am'] },
  { id: 'ai_auto_print', label: 'Auto-Print Rules', icon: Zap, section: 'AI Intelligence', keywords: ['replenishment', 'trigger', 'safety stock', 'automatic'] },

  // People & Knowledge (Phase 4 — workforce memory)
  { id: 'workforce_knowledge', label: 'Workforce Knowledge', icon: GraduationCap, section: 'People & Knowledge', keywords: ['employee', 'senior', 'junior', 'mentor', 'sop', 'lesson learned', 'onboarding', 'institutional memory', 'retiring'] },

  // Resources
  { id: 'blueprints', label: 'Blueprint Library', icon: FileBox, section: 'Resources', keywords: ['cad', 'design', 'files'] },
  { id: 'centers', label: 'Print Centers', icon: Factory, section: 'Resources', keywords: ['facility', 'facilities'] },
  { id: 'my_printers', label: 'My Printers', icon: Printer, section: 'Resources', keywords: ['devices', 'machines'] },
  { id: 'peer_printers', label: 'Peer Printers', icon: Printer, section: 'Resources', keywords: ['network', 'coop'] },
  { id: 'shipments', label: 'Shipments', icon: Truck, section: 'Resources', keywords: ['delivery', 'logistics'] },
  { id: 'materials', label: 'Materials', icon: Boxes, section: 'Resources', keywords: ['filament', 'resin', 'powder'] },
  { id: 'lab_portal', label: 'Lab Portal', icon: FlaskConical, section: 'Resources', keywords: ['testing', 'lab'] },
  { id: 'physical_inventory', label: 'Physical Inventory', icon: Database, section: 'Resources', keywords: ['stock', 'warehouse', 'spares'] },
  { id: 'smart_inventory', label: 'Smart Inventory Console', icon: Boxes, section: 'Resources', keywords: ['ai inventory', 'auto', 'reorder', 'audit', 'manual'] },
  { id: 'digital_inventory', label: 'Digital Inventory', icon: Layers, section: 'Resources', keywords: ['forecast', 'ai'] },

  // Partners & IP
  { id: 'partners', label: 'OEM Partners', icon: HandshakeIcon, section: 'Partners & IP', keywords: ['oem', 'collaborators'] },
  { id: 'oem_portal', label: 'OEM Portal', icon: Globe, section: 'Partners & IP', keywords: ['oem', 'portal'] },
  { id: 'ip_library', label: 'IP Library', icon: BookMarked, section: 'Partners & IP', keywords: ['intellectual', 'property', 'ip'] },
  { id: 'cooperative', label: 'Digital Cooperative', icon: Globe, section: 'Partners & IP', keywords: ['coop', 'network'] },

  // Compliance
  { id: 'certifications', label: 'Certifications', icon: Shield, section: 'Compliance', keywords: ['cert', 'compliance'] },
  { id: 'authorities', label: 'Authorities', icon: Users, section: 'Compliance', keywords: ['dnv', 'class', 'society'] },
  { id: 'audit', label: 'Audit Chain', icon: FileText, section: 'Compliance', keywords: ['log', 'trail'] },

  // Intelligence
  { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Intelligence', keywords: ['metrics', 'charts'] },
  { id: 'advanced_analytics', label: 'Advanced Analytics', icon: Brain, section: 'Intelligence', keywords: ['ml', 'predictive'] },
  { id: 'sc_intelligence', label: 'Supply Chain Intelligence', icon: Activity, section: 'Intelligence', keywords: ['supply', 'chain', 'intel'] },
  { id: 'material_properties', label: 'Material Properties', icon: Boxes, section: 'Intelligence', keywords: ['specs', 'properties'] },
  { id: 'feasibility', label: 'AM Feasibility', icon: Zap, section: 'Intelligence', keywords: ['feasibility', 'analysis'] },
  { id: 'customer_success', label: 'Customer Success', icon: Users, section: 'Intelligence', keywords: ['engagement', 'success'] },

  // System
  { id: 'reports', label: 'Reports', icon: Download, section: 'System', keywords: ['export', 'pdf'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, section: 'System', keywords: ['alerts'] },
  { id: 'search', label: 'Advanced Search', icon: Search, section: 'System', keywords: ['find'] },
  { id: 'batch', label: 'Batch Operations', icon: Layers, section: 'System', keywords: ['bulk'] },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, section: 'System', keywords: ['health', 'status'] },
  { id: 'integrations', label: 'Integrations', icon: Grid, section: 'System', keywords: ['api', 'connect'] },
  { id: 'automation', label: 'Automation', icon: Workflow, section: 'System', keywords: ['workflow', 'auto'] },
  { id: 'workflow_builder', label: 'Workflow Builder', icon: Workflow, section: 'System', keywords: ['builder', 'flow'] },
  { id: 'users', label: 'User Management', icon: Users, section: 'System', keywords: ['people', 'team'] },
  { id: 'api', label: 'API Management', icon: KeyRound, section: 'System', keywords: ['keys', 'tokens'] },
  { id: 'dashboards', label: 'Custom Dashboards', icon: Grid, section: 'System', keywords: ['custom', 'widgets'] },
  { id: 'mobile_dashboard', label: 'Mobile Dashboard', icon: Smartphone, section: 'System', keywords: ['mobile', 'phone'] },
  { id: 'one-click-ordering', label: 'One-Click Ordering', icon: Zap, section: 'System', keywords: ['quick', 'order'] },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'System', keywords: ['config', 'prefs'] },
]

// Quick lookup by id
export const NAV_ITEM_MAP: Record<string, NavItem> = Object.fromEntries(
  ALL_NAV_ITEMS.map((item) => [item.id, item]),
)
