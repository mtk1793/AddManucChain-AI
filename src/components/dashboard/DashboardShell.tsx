'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Sidebar,
  Header,
  OverviewPage,
  RoleDashboard,
  OnboardingTutorial,
  useOnboarding,
  SectionTutorial,
  useSectionTutorial,
  AIAssistant,
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
  CommandPalette,
  PartSuitabilityScannerPage,
  AutoPrintRulesPanel,
  AIAgentConsole,
  WorkforceKnowledgePage,
  SmartInventoryConsole,
} from '@/components/dashboard'
import OneClickOrderAutomation from '@/components/OneClickOrderAutomation'

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentRole, setCurrentRole] = useState('admin')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { showOnboarding, isLoading, completeOnboarding } = useOnboarding()
  const { tutorialSection, showTutorial, hideTutorial, isVisible: tutorialVisible } = useSectionTutorial(activeTab)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((v) => !v)
        return
      }
      if (e.key === '/' && !commandPaletteOpen) {
        const target = e.target as HTMLElement | null
        const tag = target?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !(target?.isContentEditable)) {
          e.preventDefault()
          setCommandPaletteOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen])

  const handlePaletteNavigate = useCallback((pageId: string) => {
    setActiveTab(pageId)
  }, [])

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return { title: 'Dashboard Overview', subtitle: 'Welcome back, John' }
      case 'orders':
        return { title: 'Orders', subtitle: 'Manage and track your part orders' }
      case 'printers':
        return { title: 'Printers', subtitle: 'Manage your own printers and connect to nearby facilities' }
      case 'print_queue':
        return { title: 'Print Queue', subtitle: 'DRM approval pipeline — OEM & Certification Authority sign-offs' }
      case 'physical_inventory':
        return { title: 'Physical Inventory', subtitle: 'Manage physical spare parts across all sites' }
      case 'digital_inventory':
        return { title: 'Digital Inventory', subtitle: 'AI-driven parts forecasting and onsite readiness' }
      case 'blueprints':
        return { title: 'Blueprint Library', subtitle: 'Manage certified CAD blueprints' }
      case 'centers':
        return { title: 'Print Centers', subtitle: 'Monitor certified AM facilities' }
      case 'peer_printers':
        return { title: 'Peer Printers', subtitle: 'Airbnb-style peer-to-peer 3D printer network' }
      case 'shipments':
        return { title: 'Shipments', subtitle: 'Track delivery logistics' }
      case 'materials':
        return { title: 'Materials Inventory', subtitle: 'Raw material stock management' }
      case 'partners':
        return { title: 'OEM Partners', subtitle: 'Manage partner relationships' }
      case 'analytics':
        return { title: 'Analytics', subtitle: 'Performance insights and reports' }
      case 'audit':
        return { title: 'Audit Logs', subtitle: 'System activity and compliance tracking' }
      case 'certifications':
        return { title: 'Certifications', subtitle: 'Compliance and certification management' }
      case 'authorities':
        return { title: 'Certification Authorities', subtitle: 'Manage relationships with certifying bodies' }
      case 'services':
        return { title: 'Customer Success', subtitle: 'End-to-end service and training management' }
      case 'ip_library':
        return { title: 'IP Library', subtitle: 'OEM intellectual property, licensing & royalty management' }
      case 'lab_portal':
        return { title: 'Lab & Testing Portal', subtitle: 'AM testing requests, equipment scheduling & certification reports' }
      case 'emergency':
        return { title: 'Emergency Response', subtitle: 'Fast-path from breakdown to replacement — every minute counts' }
      case 'ai_agent':
        return { title: 'AI Operations Agent', subtitle: 'Type a request in plain English — the agent answers or acts automatically, with full audit logging' }
      case 'ai_part_scanner':
        return { title: 'AI Part Suitability Scanner', subtitle: 'Identify which inventory parts are worth digitizing for additive manufacturing' }
      case 'ai_auto_print':
        return { title: 'Smart Replenishment & Auto-Print', subtitle: 'When inventory drops, the printer kicks in automatically' }
      case 'workforce_knowledge':
        return { title: 'Workforce Knowledge & Memory', subtitle: 'Capture institutional knowledge from senior experts before it walks out the door' }
      case 'smart_inventory':
        return { title: 'Smart Inventory Console', subtitle: 'Manage physical spare parts manually or let the AI handle it — every action is audit-logged' }
      case 'oem_portal':
        return { title: 'OEM Self-Service Portal', subtitle: 'Upload blueprints, set licensing terms, and earn passive royalty revenue' }
      case 'cooperative':
        return { title: 'Digital Cooperative', subtitle: 'Shared certified blueprint pool — draw any part, print at any member facility' }
      case 'material_properties':
        return { title: 'Material Properties Library', subtitle: 'Tested AM material mechanical data — the MMPDS equivalent for additive manufacturing' }
      case 'feasibility':
        return { title: 'AM Feasibility Triage', subtitle: '30-second AI verdict on whether your part is suitable for additive manufacturing' }
      case 'sc_intelligence':
        return { title: 'Supply Chain Intelligence', subtitle: 'Sovereignty dashboard, LEAN analysis, and Pareto working capital optimiser' }
      case 'my_printers':
        return { title: 'My Printers', subtitle: 'Manage on-site printer schedules, job queues, and material stock' }
      case 'oem_approvals':
        return { title: 'DRM Approvals', subtitle: 'Review and approve digital rights management for OEM prints' }
      case 'cert_approvals':
        return { title: 'Print Approvals', subtitle: 'Review and approve prints for certification compliance' }
      case 'reports':
        return { title: 'Reports & Export', subtitle: 'Generate and download reports in PDF, Excel, or CSV' }
      case 'notifications':
        return { title: 'Notifications', subtitle: 'Real-time alerts and system notifications' }
      case 'search':
        return { title: 'Advanced Search', subtitle: 'Full-text search across all entities' }
      case 'batch':
        return { title: 'Batch Operations', subtitle: 'Execute bulk actions on multiple items' }
      case 'forecasts':
        return { title: 'Forecasts & Analytics', subtitle: 'Demand, risk, and cost predictions' }
      case 'monitoring':
        return { title: 'System Monitoring', subtitle: 'Health metrics, alerts, and performance' }
      case 'integrations':
        return { title: 'Integrations Hub', subtitle: 'Manage third-party system connections' }
      case 'automation':
        return { title: 'Workflow Automation', subtitle: 'Create and manage automated workflows' }
      case 'users':
        return { title: 'User Management', subtitle: 'Manage team members and permissions' }
      case 'api':
        return { title: 'API Management', subtitle: 'API keys, rate limits, and documentation' }
      case 'dashboards':
        return { title: 'Custom Dashboards', subtitle: 'Build personalized analytics dashboards' }
      case 'advanced_analytics':
        return { title: 'Advanced Analytics', subtitle: 'ML-powered insights and predictions' }
      case 'workflow_builder':
        return { title: 'Workflow Automation', subtitle: 'Create and manage automated processes' }
      case 'mobile_dashboard':
        return { title: 'Mobile Dashboard', subtitle: 'Optimized experience for mobile devices' }
      case 'one-click-ordering':
        return { title: '⚡ 1-Click AI Order Automation', subtitle: 'Submit orders instantly with AI processing' }
      case 'settings':
        return { title: 'Settings', subtitle: 'Manage your account preferences' }
      default:
        return { title: 'Dashboard', subtitle: '' }
    }
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <RoleDashboard role={currentRole} />
      case 'orders':
        return <OrdersPage role={currentRole} onNavigate={setActiveTab} />
      case 'my_printers':
        return <PrintersPage role={currentRole} onNavigate={setActiveTab} />
      case 'print_queue':
        return <PrintApprovalPage role={currentRole} />
      case 'physical_inventory':
        return <PhysicalInventoryPage role={currentRole} />
      case 'digital_inventory':
        return <DigitalInventoryPage role={currentRole} />
      case 'blueprints':
        return <BlueprintsPage role={currentRole} />
      case 'centers':
        return <CentersPage role={currentRole} />
      case 'peer_printers':
        return <PeerPrintersPage role={currentRole} />
      case 'shipments':
        return <ShipmentsPage role={currentRole} />
      case 'materials':
        return <MaterialsPage role={currentRole} />
      case 'partners':
        return <PartnersPage role={currentRole} />
      case 'analytics':
        return <AnalyticsPage role={currentRole} />
      case 'audit':
        return <AuditLogPage role={currentRole} />
      case 'certifications':
        return <CertificationsPage role={currentRole} />
      case 'authorities':
        return <AuthoritiesPage role={currentRole} />
      case 'services':
        return <CustomerSuccessPage role={currentRole} />
      case 'ip_library':
        return <IPLibraryPage role={currentRole} />
      case 'lab_portal':
        return <LabPage role={currentRole} />
      case 'oem_approvals':
        return <PrintApprovalPage role={currentRole} />
      case 'cert_approvals':
        return <PrintApprovalPage role={currentRole} />
      case 'emergency':
        return <EmergencyResponsePage role={currentRole} />
      case 'ai_agent':
        return <AIAgentConsole onNavigate={setActiveTab} />
      case 'ai_part_scanner':
        return <PartSuitabilityScannerPage onNavigate={setActiveTab} />
      case 'ai_auto_print':
        return <AutoPrintRulesPanel onNavigate={setActiveTab} />
      case 'workforce_knowledge':
        return <WorkforceKnowledgePage onNavigate={setActiveTab} />
      case 'smart_inventory':
        return <SmartInventoryConsole onNavigate={setActiveTab} />
      case 'oem_portal':
        return <OEMPortalPage role={currentRole} />
      case 'cooperative':
        return <DigitalCooperativePage role={currentRole} />
      case 'material_properties':
        return <MaterialPropertiesPage role={currentRole} />
      case 'feasibility':
        return <AMFeasibilityPage role={currentRole} onNavigate={setActiveTab} />
      case 'sc_intelligence':
        return <SupplyChainIntelligencePage role={currentRole} />
      case 'reports':
        return <ReportsPanel />
      case 'notifications':
        return <NotificationsPanel />
      case 'search':
        return <AdvancedSearchPanel />
      case 'batch':
        return <BatchOperationsPanel />
      case 'forecasts':
        return <AnalyticsPanel />
      case 'monitoring':
        return <MonitoringPanel />
      case 'integrations':
        return <IntegrationsPanel />
      case 'automation':
        return <AutomationPanel />
      case 'users':
        return <UserManagementPanel />
      case 'api':
        return <APIManagementPanel />
      case 'dashboards':
        return <CustomDashboardsPanel />
      case 'advanced_analytics':
        return <AdvancedAnalyticsDashboard />
      case 'workflow_builder':
        return <WorkflowAutomationBuilder />
      case 'mobile_dashboard':
        return <MobileResponsiveDashboard />
      case 'one-click-ordering':
        return <OneClickOrderAutomation />
      case 'settings':
        return <SettingsPage role={currentRole} />
      default:
        return <OverviewPage />
    }
  }

  const pageInfo = getPageTitle()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {!isLoading && showOnboarding && (
        <OnboardingTutorial onComplete={completeOnboarding} />
      )}

      {!showOnboarding && (
        <SectionTutorial
          sectionId={tutorialSection ?? activeTab}
          visible={tutorialVisible}
          onClose={hideTutorial}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={(t) => { setActiveTab(t); setMobileOpen(false); }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        activeRole={currentRole}
        onRoleChange={setCurrentRole}
      />

      <div className={`ml-0 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onNavigate={setActiveTab}
          onTutorialClick={() => showTutorial(activeTab)}
          onCommandPaletteTrigger={() => setCommandPaletteOpen(true)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="min-h-[calc(100vh-64px)]">{renderPage()}</main>
      </div>

      <AIAssistant role={currentRole} onNavigate={setActiveTab} />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={handlePaletteNavigate}
      />
    </div>
  )
}
