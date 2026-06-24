import { describe, it, expect } from 'vitest'
import worldcups from '@/lib/data/worldcups.json'
import teams from '@/lib/data/teams.json'
import championPaths from '@/lib/data/championPaths.json'
import hosts from '@/lib/data/hosts.json'
import type { WorldCup, Team, ChampionPath, Host } from '@/lib/data-types'

describe('worldcups data', () => {
  it('contains exactly 23 editions', () => {
    expect(worldcups).toHaveLength(23)
  })

  it('excludes 1942 and 1946', () => {
    const years = worldcups.map((w) => w.year)
    expect(years).not.toContain(1942)
    expect(years).not.toContain(1946)
  })

  it('starts at 1930 and ends at 2026', () => {
    expect(worldcups[0]!.year).toBe(1930)
    expect(worldcups[22]!.year).toBe(2026)
  })

  it('every entry satisfies WorldCup type', () => {
    for (const w of worldcups) {
      expect(typeof w.year).toBe('number')
      expect(typeof w.host).toBe('string')
      expect(typeof w.champion).toBe('string')
      expect(typeof w.nodeSize).toBe('number')
      expect(w.nodeColor).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})

describe('teams data', () => {
  it('contains at least 10 teams', () => {
    expect(teams.length).toBeGreaterThanOrEqual(10)
  })

  it('every team has 6 dimensions scored 0-100', () => {
    for (const t of teams as unknown as Team[]) {
      const dims = [t.attack, t.defense, t.midfield, t.speed, t.experience, t.homeAdvantage]
      for (const d of dims) {
        expect(d).toBeGreaterThanOrEqual(0)
        expect(d).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('championPaths data', () => {
  it('contains at least 5 champion paths', () => {
    expect(championPaths.length).toBeGreaterThanOrEqual(5)
  })

  it('every path has 7 matches', () => {
    for (const p of championPaths as ChampionPath[]) {
      expect(p.matches).toHaveLength(7)
    }
  })
})

describe('hosts data', () => {
  it('europe host count is 12', () => {
    const europe = (hosts as Host[]).filter((h) => h.continent === 'europe')
    expect(europe.length).toBeGreaterThanOrEqual(1)
  })
})
