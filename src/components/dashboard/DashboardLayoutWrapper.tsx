'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Sidebar,
  Header,
  RoleDashboard,
  OnboardingTutorial,
  useOnboarding,
  SectionTutorial,
  useSectionTutorial,
  AIAssistant,
} from '@/components/dashboard'
import { CommandPalette } from '@/components/dashboard/CommandPalette'
import { getDashboardPageTitle } from '@/lib/tab-routes'

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const activeTab = useMemo(() => {
    const segment = pathname.replace(/^\/dashboard\/?/, '') || 'overview'
    return segment.includes('/') ? segment.split('/')[0] : segment
  }, [pathname])

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

  const handleNavigate = useCallback((tabId: string) => {
    router.push('/dashboard/' + tabId)
    setMobileOpen(false)
  }, [router])

  const handlePaletteNavigate = useCallback((pageId: string) => {
    router.push('/dashboard/' + pageId)
  }, [router])

  const pageInfo = useMemo(() => getDashboardPageTitle(activeTab), [activeTab])

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
        activeTab=""
        onTabChange={handleNavigate}
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
          onNavigate={handleNavigate}
          onTutorialClick={() => showTutorial(activeTab)}
          onCommandPaletteTrigger={() => setCommandPaletteOpen(true)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </div>

      <AIAssistant role={currentRole} onNavigate={handleNavigate} />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={handlePaletteNavigate}
      />
    </div>
  )
}
