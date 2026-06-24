import type { Continent } from './data-types'

export const CONTINENT_COLORS: Record<Continent, string> = {
  'south-america': '#00e676',
  europe: '#ffd54f',
  'north-america': '#42a5f5',
  asia: '#ef5350',
  africa: '#ab47bc',
}

export const TEAM_COLORS = {
  home: '#00e676',
  away: '#ffd54f',
} as const

export const NODE_COLOR_BY_CONTINENT = CONTINENT_COLORS
