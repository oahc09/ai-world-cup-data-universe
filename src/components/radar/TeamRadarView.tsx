import { useState, useMemo } from 'react'
import teams from '@/lib/data/teams.json'
import type { Team } from '@/lib/data-types'
import { RadarChart } from './RadarChart'
import { TeamSelector } from './TeamSelector'

export function TeamRadarView() {
  const [code1, setCode1] = useState('BR')
  const [code2, setCode2] = useState('AR')

  const team1 = useMemo(() => (teams as unknown as Team[]).find((t) => t.code === code1)!, [code1])
  const team2 = useMemo(() => (teams as unknown as Team[]).find((t) => t.code === code2)!, [code2])

  const interpretation = useMemo(() => generateInterpretation(team1, team2), [team1, team2])

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-6">
      <div className="lg:w-64 flex lg:flex-col gap-4">
        <TeamSelector value={code1} onChange={setCode1} label="主队（绿）" />
        <TeamSelector value={code2} onChange={setCode2} label="客队（金）" />
        <div className="p-3 rounded bg-white/5 text-xs text-white/70">
          <p className="font-semibold mb-1">数据解读</p>
          <p>{interpretation}</p>
        </div>
      </div>
      <div className="flex-1">
        <RadarChart team1={team1} team2={team2} />
      </div>
    </div>
  )
}

function generateInterpretation(t1: Team, t2: Team): string {
  const dims = [
    { key: 'attack' as const, name: '攻击力' },
    { key: 'defense' as const, name: '防守力' },
    { key: 'midfield' as const, name: '中场控制' },
    { key: 'speed' as const, name: '速度' },
    { key: 'experience' as const, name: '大赛经验' },
    { key: 'homeAdvantage' as const, name: '主场优势' },
  ]
  const t1Wins = dims.filter((d) => t1[d.key] > t2[d.key])
  const t2Wins = dims.filter((d) => t2[d.key] > t1[d.key])
  return `${t1.name}在${t1Wins.map((d) => d.name).join('、') || '无维度'}领先；${t2.name}在${t2Wins.map((d) => d.name).join('、') || '无维度'}占优。`
}
