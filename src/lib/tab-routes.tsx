'use client'

import React from 'react'
import {
  OverviewPage,
  RoleDashboard,
  OrdersPage,
  PrintersPage,
  BlueprintsPage,
  CentersPage,
  AnalyticsPage,
  SettingsPage,
  AuditLogPage,
  PartnersPage,
  ShipmentsPage,
  MaterialsPage,
  CertificationsPage,
  AuthoritiesPage,
  CustomerSuccessPage,
  DigitalInventoryPage,
  PrintApprovalPage,
  PhysicalInventoryPage,
  PeerPrintersPage,
  IPLibraryPage,
  LabPage,
  EmergencyResponsePage,
  OEMPortalPage,
  DigitalCooperativePage,
  MaterialPropertiesPage,
  AMFeasibilityPage,
  SupplyChainIntelligencePage,
  ReportsPanel,
  NotificationsPanel,
  AdvancedSearchPanel,
  BatchOperationsPanel,
  AnalyticsPanel,
  MonitoringPanel,
  IntegrationsPanel,
  AutomationPanel,
  UserManagementPanel,
  APIManagementPanel,
  CustomDashboardsPanel,
  AdvancedAnalyticsDashboard,
  WorkflowAutomationBuilder,
  MobileResponsiveDashboard,
  PartSuitabilityScannerPage,
  AutoPrintRulesPanel,
  AIAgentConsole,
  WorkforceKnowledgePage,
  SmartInventoryConsole,
} from '@/components/dashboard'
import OneClickOrderAutomation from '@/components/OneClickOrderAutomation'

export type TabId =
  | 'overview' | 'orders' | 'my_printers' | 'print_queue' | 'physical_inventory'
  | 'digital_inventory' | 'blueprints' | 'centers' | 'peer_printers' | 'shipments'
  | 'materials' | 'partners' | 'analytics' | 'audit' | 'certifications'
  | 'authorities' | 'services' | 'ip_library' | 'lab_portal' | 'oem_approvals'
  | 'cert_approvals' | 'emergency' | 'ai_agent' | 'ai_part_scanner' | 'ai_auto_print'
  | 'workforce_knowledge' | 'smart_inventory' | 'oem_portal' | 'cooperative'
  | 'material_properties' | 'feasibility' | 'sc_intelligence' | 'reports'
  | 'notifications' | 'search' | 'batch' | 'forecasts' | 'monitoring'
  | 'integrations' | 'automation' | 'users' | 'api' | 'dashboards'
  | 'advanced_analytics' | 'workflow_builder' | 'mobile_dashboard'
  | 'one-click-ordering' | 'settings'

interface PageTitle {
  title: string
  subtitle: string
}

export function getDashboardPageTitle(tab: string): PageTitle {
  switch (tab) {
    case 'overview': return { title: 'Dashboard Overview', subtitle: 'Welcome back, John' }
    case 'orders': return { title: 'Orders', subtitle: 'Manage and track your part orders' }
    case 'my_printers': return { title: 'My Printers', subtitle: 'Manage on-site printer schedules, job queues, and material stock' }
    case 'print_queue': return { title: 'Print Queue', subtitle: 'DRM approval pipeline — OEM & Certification Authority sign-offs' }
    case 'physical_inventory': return { title: 'Physical Inventory', subtitle: 'Manage physical spare parts across all sites' }
    case 'digital_inventory': return { title: 'Digital Inventory', subtitle: 'AI-driven parts forecasting and onsite readiness' }
    case 'blueprints': return { title: 'Blueprint Library', subtitle: 'Manage certified CAD blueprints' }
    case 'centers': return { title: 'Print Centers', subtitle: 'Monitor certified AM facilities' }
    case 'peer_printers': return { title: 'Peer Printers', subtitle: 'Airbnb-style peer-to-peer 3D printer network' }
    case 'shipments': return { title: 'Shipments', subtitle: 'Track delivery logistics' }
    case 'materials': return { title: 'Materials Inventory', subtitle: 'Raw material stock management' }
    case 'partners': return { title: 'OEM Partners', subtitle: 'Manage partner relationships' }
    case 'analytics': return { title: 'Analytics', subtitle: 'Performance insights and reports' }
    case 'audit': return { title: 'Audit Logs', subtitle: 'System activity and compliance tracking' }
    case 'certifications': return { title: 'Certifications', subtitle: 'Compliance and certification management' }
    case 'authorities': return { title: 'Certification Authorities', subtitle: 'Manage relationships with certifying bodies' }
    case 'services': return { title: 'Customer Success', subtitle: 'End-to-end service and training management' }
    case 'ip_library': return { title: 'IP Library', subtitle: 'OEM intellectual property, licensing & royalty management' }
    case 'lab_portal': return { title: 'Lab & Testing Portal', subtitle: 'AM testing requests, equipment scheduling & certification reports' }
    case 'emergency': return { title: 'Emergency Response', subtitle: 'Fast-path from breakdown to replacement — every minute counts' }
    case 'ai_agent': return { title: 'AI Operations Agent', subtitle: 'Type a request in plain English — the agent answers or acts automatically, with full audit logging' }
    case 'ai_part_scanner': return { title: 'AI Part Suitability Scanner', subtitle: 'Identify which inventory parts are worth digitizing for additive manufacturing' }
    case 'ai_auto_print': return { title: 'Smart Replenishment & Auto-Print', subtitle: 'When inventory drops, the printer kicks in automatically' }
    case 'workforce_knowledge': return { title: 'Workforce Knowledge & Memory', subtitle: 'Capture institutional knowledge from senior experts before it walks out the door' }
    case 'smart_inventory': return { title: 'Smart Inventory Console', subtitle: 'Manage physical spare parts manually or let the AI handle it — every action is audit-logged' }
    case 'oem_portal': return { title: 'OEM Self-Service Portal', subtitle: 'Upload blueprints, set licensing terms, and earn passive royalty revenue' }
    case 'cooperative': return { title: 'Digital Cooperative', subtitle: 'Shared certified blueprint pool — draw any part, print at any member facility' }
    case 'material_properties': return { title: 'Material Properties Library', subtitle: 'Tested AM material mechanical data — the MMPDS equivalent for additive manufacturing' }
    case 'feasibility': return { title: 'AM Feasibility Triage', subtitle: '30-second AI verdict on whether your part is suitable for additive manufacturing' }
    case 'sc_intelligence': return { title: 'Supply Chain Intelligence', subtitle: 'Sovereignty dashboard, LEAN analysis, and Pareto working capital optimiser' }
    case 'oem_approvals': return { title: 'DRM Approvals', subtitle: 'Review and approve digital rights management for OEM prints' }
    case 'cert_approvals': return { title: 'Print Approvals', subtitle: 'Review and approve prints for certification compliance' }
    case 'reports': return { title: 'Reports & Export', subtitle: 'Generate and download reports in PDF, Excel, or CSV' }
    case 'notifications': return { title: 'Notifications', subtitle: 'Real-time alerts and system notifications' }
    case 'search': return { title: 'Advanced Search', subtitle: 'Full-text search across all entities' }
    case 'batch': return { title: 'Batch Operations', subtitle: 'Execute bulk actions on multiple items' }
    case 'forecasts': return { title: 'Forecasts & Analytics', subtitle: 'Demand, risk, and cost predictions' }
    case 'monitoring': return { title: 'System Monitoring', subtitle: 'Health metrics, alerts, and performance' }
    case 'integrations': return { title: 'Integrations Hub', subtitle: 'Manage third-party system connections' }
    case 'automation': return { title: 'Workflow Automation', subtitle: 'Create and manage automated workflows' }
    case 'users': return { title: 'User Management', subtitle: 'Manage team members and permissions' }
    case 'api': return { title: 'API Management', subtitle: 'API keys, rate limits, and documentation' }
    case 'dashboards': return { title: 'Custom Dashboards', subtitle: 'Build personalized analytics dashboards' }
    case 'advanced_analytics': return { title: 'Advanced Analytics', subtitle: 'ML-powered insights and predictions' }
    case 'workflow_builder': return { title: 'Workflow Automation', subtitle: 'Create and manage automated processes' }
    case 'mobile_dashboard': return { title: 'Mobile Dashboard', subtitle: 'Optimized experience for mobile devices' }
    case 'one-click-ordering': return { title: '1-Click AI Order Automation', subtitle: 'Submit orders instantly with AI processing' }
    case 'settings': return { title: 'Settings', subtitle: 'Manage your account preferences' }
    default: return { title: 'Dashboard', subtitle: '' }
  }
}

export function renderDashboardPage(
  tab: string,
  role: string,
  onNavigate: (tab: string) => void,
): React.ReactElement {
  switch (tab) {
    case 'overview': return React.createElement(RoleDashboard, { role })
    case 'orders': return React.createElement(OrdersPage, { role, onNavigate })
    case 'my_printers': return React.createElement(PrintersPage, { role, onNavigate })
    case 'print_queue': return React.createElement(PrintApprovalPage, { role })
    case 'physical_inventory': return React.createElement(PhysicalInventoryPage, { role })
    case 'digital_inventory': return React.createElement(DigitalInventoryPage, { role })
    case 'blueprints': return React.createElement(BlueprintsPage, { role })
    case 'centers': return React.createElement(CentersPage, { role })
    case 'peer_printers': return React.createElement(PeerPrintersPage, { role })
    case 'shipments': return React.createElement(ShipmentsPage, { role })
    case 'materials': return React.createElement(MaterialsPage, { role })
    case 'partners': return React.createElement(PartnersPage, { role })
    case 'analytics': return React.createElement(AnalyticsPage, { role })
    case 'audit': return React.createElement(AuditLogPage, { role })
    case 'certifications': return React.createElement(CertificationsPage, { role })
    case 'authorities': return React.createElement(AuthoritiesPage, { role })
    case 'services': return React.createElement(CustomerSuccessPage, { role })
    case 'ip_library': return React.createElement(IPLibraryPage, { role })
    case 'lab_portal': return React.createElement(LabPage, { role })
    case 'oem_approvals': return React.createElement(PrintApprovalPage, { role })
    case 'cert_approvals': return React.createElement(PrintApprovalPage, { role })
    case 'emergency': return React.createElement(EmergencyResponsePage, { role })
    case 'ai_agent': return React.createElement(AIAgentConsole, { onNavigate })
    case 'ai_part_scanner': return React.createElement(PartSuitabilityScannerPage, { onNavigate })
    case 'ai_auto_print': return React.createElement(AutoPrintRulesPanel, { onNavigate })
    case 'workforce_knowledge': return React.createElement(WorkforceKnowledgePage, { onNavigate })
    case 'smart_inventory': return React.createElement(SmartInventoryConsole, { onNavigate })
    case 'oem_portal': return React.createElement(OEMPortalPage, { role })
    case 'cooperative': return React.createElement(DigitalCooperativePage, { role })
    case 'material_properties': return React.createElement(MaterialPropertiesPage, { role })
    case 'feasibility': return React.createElement(AMFeasibilityPage, { role, onNavigate })
    case 'sc_intelligence': return React.createElement(SupplyChainIntelligencePage, { role })
    case 'reports': return React.createElement(ReportsPanel)
    case 'notifications': return React.createElement(NotificationsPanel)
    case 'search': return React.createElement(AdvancedSearchPanel)
    case 'batch': return React.createElement(BatchOperationsPanel)
    case 'forecasts': return React.createElement(AnalyticsPanel)
    case 'monitoring': return React.createElement(MonitoringPanel)
    case 'integrations': return React.createElement(IntegrationsPanel)
    case 'automation': return React.createElement(AutomationPanel)
    case 'users': return React.createElement(UserManagementPanel)
    case 'api': return React.createElement(APIManagementPanel)
    case 'dashboards': return React.createElement(CustomDashboardsPanel)
    case 'advanced_analytics': return React.createElement(AdvancedAnalyticsDashboard)
    case 'workflow_builder': return React.createElement(WorkflowAutomationBuilder)
    case 'mobile_dashboard': return React.createElement(MobileResponsiveDashboard)
    case 'one-click-ordering': return React.createElement('div', { className: 'pt-6' }, React.createElement(OneClickOrderAutomation))
    case 'settings': return React.createElement(SettingsPage, { role })
    default: return React.createElement(OverviewPage)
  }
}

export const ALL_TABS: TabId[] = [
  'overview', 'orders', 'my_printers', 'print_queue', 'physical_inventory',
  'digital_inventory', 'blueprints', 'centers', 'peer_printers', 'shipments',
  'materials', 'partners', 'analytics', 'audit', 'certifications',
  'authorities', 'services', 'ip_library', 'lab_portal', 'oem_approvals',
  'cert_approvals', 'emergency', 'ai_agent', 'ai_part_scanner', 'ai_auto_print',
  'workforce_knowledge', 'smart_inventory', 'oem_portal', 'cooperative',
  'material_properties', 'feasibility', 'sc_intelligence', 'reports',
  'notifications', 'search', 'batch', 'forecasts', 'monitoring',
  'integrations', 'automation', 'users', 'api', 'dashboards',
  'advanced_analytics', 'workflow_builder', 'mobile_dashboard',
  'one-click-ordering', 'settings',
]
