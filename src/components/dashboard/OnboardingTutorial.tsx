'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  Package, 
  FileBox, 
  Factory, 
  BarChart3, 
  Settings,
  Sparkles,
  Boxes,
  Shield,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  highlight?: string // CSS selector or area name
  position: 'center' | 'left' | 'right' | 'bottom'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AddManuChain! 🎉',
    description: 'Your digital inventory platform for offshore oil & gas spare parts management. Let us show you around the dashboard to help you get started quickly.',
    icon: Rocket,
    position: 'center',
  },
  {
    id: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'Use the sidebar on the left to navigate between different sections of the platform. It\'s organized into Main, Supply Chain, Partners, Insights, and System categories.',
    icon: LayoutDashboard,
    highlight: 'sidebar',
    position: 'right',
  },
  {
    id: 'overview',
    title: 'Dashboard Overview',
    description: 'The Overview page gives you a quick snapshot of your operations — active orders, print center status, recent activities, and key metrics at a glance.',
    icon: LayoutDashboard,
    position: 'center',
  },
  {
    id: 'orders',
    title: 'Orders Management',
    description: 'Track and manage all your part orders here. View order status, priority levels, estimated delivery times, and communicate with print centers.',
    icon: Package,
    position: 'center',
  },
  {
    id: 'digital-inventory',
    title: 'Digital Inventory',
    description: 'AI-powered forecasting helps you predict which parts you\'ll need. Manage your digital blueprint library and ensure onsite readiness.',
    icon: Sparkles,
    position: 'center',
  },
  {
    id: 'blueprints',
    title: 'Blueprint Library',
    description: 'Access certified CAD blueprints for 3D printing. Each blueprint includes material specs, certifications, and print history.',
    icon: FileBox,
    position: 'center',
  },
  {
    id: 'physical-inventory',
    title: 'Physical Inventory',
    description: 'Monitor physical spare parts across all your sites. Track stock levels, set reorder points, and manage warehouse locations.',
    icon: Boxes,
    position: 'center',
  },
  {
    id: 'centers',
    title: 'Print Centers',
    description: 'View the status of certified additive manufacturing facilities. Monitor capacity, active jobs, and material availability.',
    icon: Factory,
    position: 'center',
  },
  {
    id: 'certifications',
    title: 'Certifications & Compliance',
    description: 'Manage certifications from DNV GL, Lloyd\'s Register, and other authorities. Track expiry dates and renewal requirements.',
    icon: Shield,
    position: 'center',
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Dive deep into performance metrics, cost savings, lead time reductions, and environmental impact reports.',
    icon: BarChart3,
    position: 'center',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Customize your account preferences, notification settings, and team management options.',
    icon: Settings,
    position: 'center',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'You now know the basics of AddManuChain. Start exploring the dashboard or click "Finish" to begin. You can always restart this tutorial from Settings.',
    icon: Rocket,
    position: 'center',
  },
]

interface OnboardingTutorialProps {
  onComplete: () => void
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const step = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === tutorialSteps.length - 1


  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    setIsVisible(false)
    // Small delay to allow exit animation
    setTimeout(() => {
      localStorage.setItem('addmanuchain_onboarding_complete', 'true')
      onComplete()
    }, 300)
  }

  const Icon = step.icon


  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Tutorial card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4 sm:px-0"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header with progress */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </span>
                  <button
                    onClick={handleSkip}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close tutorial"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                                      >
                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#14B8A6] flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-3">
                      {step.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              <div className="px-6 pb-6 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Skip Tutorial
                </Button>

                <div className="flex gap-2">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="gap-1 bg-gradient-to-r from-[#0EA5E9] to-[#14B8A6] hover:from-[#0284C7] hover:to-[#0D9488] text-white"
                  >
                    {isLastStep ? 'Finish' : 'Next'}
                    {!isLastStep && <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Step indicators */}
              <div className="px-6 pb-4 flex justify-center gap-1.5">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-[#0EA5E9] w-6'
                        : index < currentStep
                        ? 'bg-[#14B8A6]'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook to check if onboarding should be shown
export function useOnboarding() {
  // Initialize with a function to ensure consistent SSR/client rendering
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Only check localStorage on client side
    if (typeof window !== 'undefined') {
      const hasCompleted = localStorage.getItem('addmanuchain_onboarding_complete')
      return !hasCompleted
    }
    return true // Server-side default
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verify localStorage state on client after mount
    const hasCompleted = localStorage.getItem('addmanuchain_onboarding_complete')
    setShowOnboarding(!hasCompleted)
    setIsLoading(false)
  }, [])

  const resetOnboarding = () => {
    localStorage.removeItem('addmanuchain_onboarding_complete')
    setShowOnboarding(true)
  }

  const completeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('addmanuchain_onboarding_complete', 'true')
  }

  return {
    showOnboarding,
    isLoading,
    resetOnboarding,
    completeOnboarding,
  }
}
