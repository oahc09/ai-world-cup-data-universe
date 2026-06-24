import { describe, it, expect } from 'vitest'
import { easeInOutCubic } from '@/lib/easing'

describe('easeInOutCubic', () => {
  it('returns 0 at t=0', () => {
    expect(easeInOutCubic(0)).toBe(0)
  })

  it('returns 1 at t=1', () => {
    expect(easeInOutCubic(1)).toBe(1)
  })

  it('is monotonically increasing', () => {
    let prev = -Infinity
    for (let i = 0; i <= 100; i++) {
      const v = easeInOutCubic(i / 100)
      expect(v).toBeGreaterThanOrEqual(prev)
      prev = v
    }
  })

  it('is symmetric around 0.5', () => {
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1, 5)
  })
})
