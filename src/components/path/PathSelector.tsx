import championPaths from '@/lib/data/championPaths.json'
import type { ChampionPath } from '@/lib/data-types'

interface Props {
  teamCode: string
  year: number
  onTeamChange: (code: string) => void
  onYearChange: (year: number) => void
}

export function PathSelector({ teamCode, year, onTeamChange, onYearChange }: Props) {
  const paths = championPaths as unknown as ChampionPath[]
  const teams = Array.from(new Map(paths.map((p) => [p.teamCode, p.teamName])).entries())
  const years = paths.filter((p) => p.teamCode === teamCode).map((p) => p.year)

  return (
    <div className="flex gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-white/50">球队</span>
        <select
          value={teamCode}
          onChange={(e) => onTeamChange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded px-3 py-2"
        >
          {teams.map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-white/50">年份</span>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-white/10 border border-white/20 rounded px-3 py-2"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
