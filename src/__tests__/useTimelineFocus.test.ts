import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimelineFocus } from '@/hooks/useTimelineFocus'

describe('useTimelineFocus', () => {
  it('exposes focusOn function', () => {
    const camera = { position: { set: vi.fn(), clone: () => ({ lerpVectors: vi.fn() }) }, updateProjectionMatrix: vi.fn() } as any
    const controls = { target: { set: vi.fn(), clone: () => ({ lerpVectors: vi.fn() }) }, update: vi.fn() } as any
    const { result } = renderHook(() => useTimelineFocus(camera, controls, 23))
    expect(typeof result.current.focusOn).toBe('function')
  })

  it('focusOn sets isAnimating true then false after duration', async () => {
    vi.useFakeTimers()
    // jsdom 没有 requestAnimationFrame，用 setTimeout 模拟一帧（约 16ms）
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
      return window.setTimeout(cb, 16) as unknown as number
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      window.clearTimeout(id as unknown as number)
    })
    // performance.now 默认基于 Date.now，fake timers 会接管
    vi.stubGlobal('performance', { now: () => Date.now() })

    const camera = {
      position: { set: vi.fn(), clone: () => ({ lerpVectors: vi.fn() }), lerpVectors: vi.fn() },
      updateProjectionMatrix: vi.fn()
    } as any
    const controls = {
      target: { set: vi.fn(), clone: () => ({ lerpVectors: vi.fn() }), lerpVectors: vi.fn() },
      update: vi.fn()
    } as any
    const { result } = renderHook(() => useTimelineFocus(camera, controls, 23))
    act(() => result.current.focusOn(5))
    expect(result.current.isAnimating).toBe(true)
    // 800ms 动画 + 一帧 ~16ms，给足 900ms 让动画完成
    act(() => { vi.advanceTimersByTime(900) })
    expect(result.current.isAnimating).toBe(false)
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })
})
