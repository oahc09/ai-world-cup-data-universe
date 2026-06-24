import { describe, it, expect } from 'vitest'
import { spiralPosition } from '@/lib/spiral'

describe('spiralPosition', () => {
  it('places 23 nodes with increasing y (time axis)', () => {
    const positions = Array.from({ length: 23 }, (_, i) =>
      spiralPosition(i, 23, { radius: 8, height: 30, turns: 3 })
    )
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]![1]).toBeGreaterThan(positions[i - 1]![1])
    }
  })

  it('first node is at bottom, last at top', () => {
    const first = spiralPosition(0, 23, { radius: 8, height: 30, turns: 3 })
    const last = spiralPosition(22, 23, { radius: 8, height: 30, turns: 3 })
    expect(first[1]).toBeLessThan(last[1])
  })

  it('all nodes lie within radius bound on xz plane', () => {
    for (let i = 0; i < 23; i++) {
      const [x, , z] = spiralPosition(i, 23, { radius: 8, height: 30, turns: 3 })
      expect(Math.sqrt(x * x + z * z)).toBeCloseTo(8, 1)
    }
  })
})
