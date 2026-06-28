import { useState, useMemo } from 'react'
import championPaths from '@/lib/data/championPaths.json'
import type { ChampionPath, PathMatch } from '@/lib/data-types'
import { PathTree } from './PathTree'
import { PathSelector } from './PathSelector'

function calcStats(path: ChampionPath) {
  let goalsFor = 0
  let goalsAgainst = 0
  let wins = 0
  let draws = 0
  const scorerMap = new Map<string, number>()

  for (const m of path.matches) {
    const [f, a] = m.score.split('-').map(Number)
    goalsFor += f ?? 0
    goalsAgainst += a ?? 0
    if (m.result === 'win') wins++
    if (m.result === 'draw') draws++
    for (const e of m.events) {
      if (e.type === 'goal' || e.type === 'penalty') {
        const name = e.player.replace(/\(.*?\)/g, '')
        scorerMap.set(name, (scorerMap.get(name) ?? 0) + 1)
      }
    }
  }

  const topScorer = Array.from(scorerMap.entries()).sort((a, b) => b[1] - a[1])[0]
  const finalMatch = path.matches[path.matches.length - 1]

  return {
    goalsFor,
    goalsAgainst,
    goalDiff: goalsFor - goalsAgainst,
    wins,
    draws,
    losses: path.matches.length - wins - draws,
    topScorer: topScorer ? { name: topScorer[0], goals: topScorer[1] } : null,
    finalMatch,
    matches: path.matches.length,
  }
}

const STAGE_LABELS: Record<string, string> = {
  '小组赛 R1': '小组赛',
  '小组赛 R2': '小组赛',
  '小组赛 R3': '小组赛',
  '1/8 决赛': '淘汰赛',
  '1/4 决赛': '淘汰赛',
  '半决赛': '淘汰赛',
  '决赛': '决赛',
}

export function ChampionPathView() {
  const paths = championPaths as unknown as ChampionPath[]
  const [teamCode, setTeamCode] = useState(paths[0]!.teamCode)
  const availableYears = paths.filter((p) => p.teamCode === teamCode)
  const [year, setYear] = useState(availableYears[0]!.year)

  const path = useMemo(
    () => paths.find((p) => p.teamCode === teamCode && p.year === year) ?? paths[0]!,
    [paths, teamCode, year]
  )

  const stats = useMemo(() => calcStats(path), [path])

  const handleTeamChange = (code: string) => {
    setTeamCode(code)
    const firstYear = paths.find((p) => p.teamCode === code)!.year
    setYear(firstYear)
  }

  const groupMatches = path.matches.filter((m) => m.round.startsWith('小组赛'))
  const koMatches = path.matches.filter((m) => !m.round.startsWith('小组赛') && m.round !== '决赛')
  const finalMatch = path.matches.find((m) => m.round === '决赛')

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
      <div className="flex-shrink-0 px-8 pt-6 pb-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs text-yellow-300/80 font-medium tracking-widest uppercase mb-2">
              🏆 World Cup Champion
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              {path.teamName}
              <span className="text-yellow-300 ml-3">{path.year}</span>
            </h2>
            <p className="text-white/40 text-sm mt-1">
              从小组赛到决赛的完整夺冠之路
            </p>
          </div>
          <PathSelector
            teamCode={teamCode}
            year={year}
            onTeamChange={handleTeamChange}
            onYearChange={setYear}
          />
        </div>
      </div>

      <div className="flex-1 flex gap-4 px-8 pb-6 min-h-0">
        <div className="w-64 flex-shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="进球" value={stats.goalsFor} color="text-green-400" />
            <StatCard label="失球" value={stats.goalsAgainst} color="text-red-400" />
            <StatCard label="胜场" value={stats.wins} color="text-blue-400" />
            <StatCard label="净胜球" value={`+${stats.goalDiff}`} color="text-yellow-400" />
          </div>

          {stats.topScorer && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <div className="text-xs text-yellow-300/70 mb-1">最佳射手</div>
              <div className="text-lg font-bold text-white">{stats.topScorer.name}</div>
              <div className="text-xs text-white/50">{stats.topScorer.goals} 粒进球</div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs text-white/50 mb-2">决赛结果</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{path.teamName}</span>
              <span className="text-xl font-black text-yellow-300">
                {stats.finalMatch?.score}
              </span>
              <span className="text-sm text-white/60">{stats.finalMatch?.opponent}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs text-white/50 px-1">比赛阶段</div>
            <StageBadge label="小组赛" count={groupMatches.length} />
            <StageBadge label="淘汰赛" count={koMatches.length} />
            <StageBadge label="决赛" count={1} highlight />
          </div>
        </div>

        <div className="flex-1 min-w-0 rounded-2xl bg-black/40 border border-white/10 p-4 flex flex-col min-h-0">
          <div className="flex-shrink-0 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-white/50">点击节点查看比赛详情</span>
          </div>
          <div className="flex-1 min-h-0">
            <PathTree path={path} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
      <div className="text-xs text-white/40">{label}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
    </div>
  )
}

function StageBadge({ label, count, highlight }: { label: string; count: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
      highlight
        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
        : 'bg-white/5 border border-white/10'
    }`}>
      <span className={highlight ? 'text-yellow-200 font-medium' : 'text-white/70'}>{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        highlight ? 'bg-yellow-500/30 text-yellow-200' : 'bg-white/10 text-white/50'
      }`}>
        {count} 场
      </span>
    </div>
  )
}
