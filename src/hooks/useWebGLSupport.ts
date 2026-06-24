import { useState, useEffect } from 'react'

export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
      setSupported(Boolean(gl && typeof window !== 'undefined' && 'WebGLRenderingContext' in window))
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}
