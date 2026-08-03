'use client'

import { useState, useEffect } from 'react'

export function useCountdown(targetIsoDate?: string): string {
  const [timeLeft, setTimeLeft] = useState<string>('--m --s')

  useEffect(() => {
    if (!targetIsoDate) {
      setTimeLeft('Expired')
      return
    }

    const updateTimer = () => {
      const now = new Date().getTime()
      const target = new Date(targetIsoDate).getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft('Expired / Updating...')
        return
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`)
      }
    }

    // Run immediately
    updateTimer()

    // Tick every 1 second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetIsoDate])

  return timeLeft
}