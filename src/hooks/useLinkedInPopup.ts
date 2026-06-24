import { useState, useEffect } from 'react'

export function useLinkedInPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // NOTE: Auto-show is DISABLED so the dashboard loads cleanly without a
    // blocking modal 2s after every fresh session. The popup remains
    // available to be triggered on-demand by setting showPopup true.
    setIsLoading(false)
  }, [])

  const dismissPopup = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('linkedin_popup_dismissed', 'true')
    }
    setShowPopup(false)
  }

  // Allow manual trigger (e.g. from a "Connect" button in the footer/header)
  const triggerPopup = () => {
    setShowPopup(true)
  }

  return {
    showPopup,
    isLoading,
    dismissPopup,
    triggerPopup,
  }
}
