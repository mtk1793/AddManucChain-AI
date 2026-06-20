import { useState, useEffect } from 'react'

export function useLinkedInPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already dismissed this popup in this session
    const isDismissed = sessionStorage.getItem('linkedin_popup_dismissed')
    
    if (!isDismissed) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
    
    setIsLoading(false)
  }, [])

  const dismissPopup = () => {
    // Mark as dismissed for this session
    sessionStorage.setItem('linkedin_popup_dismissed', 'true')
    setShowPopup(false)
  }

  return {
    showPopup,
    isLoading,
    dismissPopup,
  }
}
