import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/useIsMobile'

describe('useIsMobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })

  it('returns false on desktop width', () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true on mobile width', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
