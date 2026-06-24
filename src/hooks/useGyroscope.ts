import { useState, useEffect, useCallback } from 'react'

export function useGyroscope() {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined')
  }, [])

  const toggle = useCallback(async () => {
    if (!supported) return
    const DOE = window.DeviceOrientationEvent as any
    if (DOE?.requestPermission) {
      try {
        const result = await DOE.requestPermission()
        if (result !== 'granted') return
      } catch {
        return
      }
    }
    setEnabled((e) => !e)
  }, [supported])

  return { supported, enabled, toggle }
}
