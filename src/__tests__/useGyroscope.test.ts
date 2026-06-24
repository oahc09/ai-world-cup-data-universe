import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGyroscope } from '@/hooks/useGyroscope'

describe('useGyroscope', () => {
  it('returns supported false when DeviceOrientationEvent unavailable', () => {
    vi.stubGlobal('DeviceOrientationEvent', undefined)
    const { result } = renderHook(() => useGyroscope())
    expect(result.current.supported).toBe(false)
  })

  it('toggle enables gyroscope when supported', async () => {
    vi.stubGlobal('DeviceOrientationEvent', class {
      static requestPermission = () => Promise.resolve('granted')
    })
    const { result } = renderHook(() => useGyroscope())
    await act(async () => {
      await result.current.toggle()
    })
    expect(result.current.enabled).toBe(true)
  })
})
