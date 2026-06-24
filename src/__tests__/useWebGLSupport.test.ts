import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'

// Looser canvas type that allows stubbing getContext with any signature
type StubCanvas = Omit<HTMLCanvasElement, 'getContext'> & {
  getContext: (type: string) => unknown
}

describe('useWebGLSupport', () => {
  const originalCreateElement = document.createElement.bind(document)
  const originalWebGLRenderingContext = (window as unknown as { WebGLRenderingContext?: unknown }).WebGLRenderingContext

  beforeEach(() => {
    // Default: WebGL unavailable (null context, no WebGLRenderingContext)
    vi.stubGlobal('WebGLRenderingContext', undefined)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const canvas = originalCreateElement(tag) as StubCanvas
      canvas.getContext = () => null
      return canvas
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal('WebGLRenderingContext', originalWebGLRenderingContext)
  })

  it('returns false when WebGL is unavailable', () => {
    const { result } = renderHook(() => useWebGLSupport())
    expect(result.current).toBe(false)
  })

  it('returns true when WebGL is available', () => {
    vi.stubGlobal('WebGLRenderingContext', class {})
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const canvas = originalCreateElement(tag) as StubCanvas
      canvas.getContext = (type: string) => (type === 'webgl' ? {} : null)
      return canvas
    })
    const { result } = renderHook(() => useWebGLSupport())
    expect(result.current).toBe(true)
  })
})
