import { useEffect, useRef, useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

// Configuration
const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes
const WARNING_TIMEOUT = 2 * 60 * 1000 // 2 minutes before timeout
const CHECK_INTERVAL = 30 * 1000 // Check every 30 seconds

interface UseSessionTimeoutOptions {
  onTimeout?: () => void
  onWarning?: (timeRemaining: number) => void
  enabled?: boolean
}

export function useSessionTimeout({
  onTimeout,
  onWarning,
  enabled = true
}: UseSessionTimeoutOptions = {}) {
  const { data: session, status } = useSession()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(0)
  const [warningShown, setWarningShown] = useState(false)

  // Handle session timeout
  const handleTimeout = useCallback(async () => {
    console.log('Session timeout - logging out user')
    
    // Call custom timeout handler if provided
    if (onTimeout) {
      onTimeout()
    }
    
    // Sign out user
    await signOut({ redirect: true, callbackUrl: '/login?reason=timeout' })
  }, [onTimeout])

  // Reset timers and update last activity
  const resetTimers = useCallback(() => {
    const now = Date.now()
    lastActivityRef.current = now
    
    // Defer setState to avoid cascading renders in effects
    setTimeout(() => setWarningShown(false), 0)

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current)
    }

    // Set new timeout for session expiration
    timeoutRef.current = setTimeout(() => {
      handleTimeout()
    }, INACTIVITY_TIMEOUT)

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      if (!warningShown) {
        setWarningShown(true)
        const timeRemaining = INACTIVITY_TIMEOUT - WARNING_TIMEOUT
        onWarning?.(timeRemaining)
      }
    }, INACTIVITY_TIMEOUT - WARNING_TIMEOUT)
  }, [onWarning, handleTimeout, warningShown])

  // Track user activity
  const trackActivity = useCallback(() => {
    if (enabled && status === 'authenticated') {
      resetTimers()
    }
  }, [enabled, status, resetTimers])

  // Check session validity periodically
  const checkSession = useCallback(() => {
    if (!enabled || status !== 'authenticated') {
      return
    }

    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityRef.current

    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
      handleTimeout()
    }
  }, [enabled, status, handleTimeout])

  // Initialize timers when session changes
  useEffect(() => {
    if (enabled && status === 'authenticated') {
      // Initialize last activity time
      lastActivityRef.current = Date.now()
      resetTimers()
    }
  }, [enabled, status, resetTimers])

  // Set up activity listeners and periodic checks
  useEffect(() => {
    if (!enabled || status !== 'authenticated') {
      return
    }

    // Set up periodic check
    checkIntervalRef.current = setInterval(checkSession, CHECK_INTERVAL)

    // Add event listeners for user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
      'keyup'
    ]

    const handleActivity = () => trackActivity()

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Handle visibility change (user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackActivity()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current)
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }

      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, status, trackActivity, checkSession])

  // Manual reset function for external use
  const manualReset = useCallback(() => {
    resetTimers()
  }, [resetTimers])

  // Get time remaining until timeout
  const getTimeRemaining = useCallback(() => {
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivityRef.current
    return Math.max(0, INACTIVITY_TIMEOUT - timeSinceLastActivity)
  }, [])

  return {
    reset: manualReset,
    getTimeRemaining,
    isWarningShown: warningShown
  }
}

// Hook for displaying session timeout warning
export function useSessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const handleWarning = useCallback((time: number) => {
    setTimeRemaining(time)
    setShowWarning(true)
  }, [])

  const handleDismiss = useCallback(() => {
    setShowWarning(false)
  }, [])

  return {
    showWarning,
    timeRemaining,
    onWarning: handleWarning,
    onDismiss: handleDismiss
  }
}

// Utility function to format time remaining
export function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  
  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}
