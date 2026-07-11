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
      <label className="flex flex-col gap-1.5 flex-1">
        <span className="text-xs text-white/50 tracking-wide">球队</span>
        <select
          value={teamCode}
          onChange={(e) => onTeamChange(e.target.value)}
          className="bg-zinc-900/80 text-white border border-emerald-400/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        >
          {teams.map(([code, name]) => (
            <option key={code} value={code} className="bg-zinc-900 text-white">{name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 flex-1">
        <span className="text-xs text-white/50 tracking-wide">年份</span>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-zinc-900/80 text-white border border-emerald-400/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        >
          {years.map((y) => (
            <option key={y} value={y} className="bg-zinc-900 text-white">{y}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
