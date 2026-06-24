import { useState, useMemo } from 'react'
import championPaths from '@/lib/data/championPaths.json'
import type { ChampionPath } from '@/lib/data-types'
import { PathTree } from './PathTree'
import { PathSelector } from './PathSelector'

export function ChampionPathView() {
  const paths = championPaths as unknown as ChampionPath[]
  const [teamCode, setTeamCode] = useState(paths[0]!.teamCode)
  const availableYears = paths.filter((p) => p.teamCode === teamCode)
  const [year, setYear] = useState(availableYears[0]!.year)

  const path = useMemo(
    () => paths.find((p) => p.teamCode === teamCode && p.year === year) ?? paths[0]!,
    [paths, teamCode, year]
  )

  const handleTeamChange = (code: string) => {
    setTeamCode(code)
    const firstYear = paths.find((p) => p.teamCode === code)!.year
    setYear(firstYear)
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-6">
      <PathSelector
        teamCode={teamCode}
        year={year}
        onTeamChange={handleTeamChange}
        onYearChange={setYear}
      />
      <div className="text-2xl font-bold">
        {path.teamName} · {path.year} 夺冠路径
      </div>
      <PathTree path={path} />
    </div>
  )
}
