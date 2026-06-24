export type Continent = 'south-america' | 'europe' | 'north-america' | 'asia' | 'africa'

export interface ClassicMatch {
  round: string
  teams: string
  score: string
  highlight: string
}

export interface WorldCup {
  year: number
  host: string
  hostCode: string
  hostCoords: [number, number] // [lat, lng]
  hostContinent: Continent
  champion: string
  championCode: string
  goldenBoot: string
  goldenBootGoals: number
  goldenBall: string
  teamsCount: number
  totalGoals: number
  matchesCount: number
  classicMatch: ClassicMatch
  nodeSize: number
  nodeColor: string
}

export interface Team {
  code: string
  name: string
  continent: Continent
  attack: number
  defense: number
  midfield: number
  speed: number
  experience: number
  homeAdvantage: number
  worldCupTitles: number
  history?: Record<string, Omit<Team, 'history' | 'code' | 'name' | 'continent'>>
}

export interface PathMatch {
  round: string
  opponent: string
  score: string
  result: 'win' | 'draw' | 'loss'
  events: { minute: number; type: 'goal' | 'yellow' | 'red' | 'penalty'; player: string }[]
}

export interface ChampionPath {
  teamCode: string
  teamName: string
  year: number
  matches: PathMatch[]
}

export interface Host {
  code: string
  name: string
  continent: Continent
  hostYears: number[]
  coords: [number, number]
}
