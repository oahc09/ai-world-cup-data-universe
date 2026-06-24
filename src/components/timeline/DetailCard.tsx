import worldcups from '@/lib/data/worldcups.json'
import type { WorldCup } from '@/lib/data-types'

interface Props {
  year: number
  onClose: () => void
  onNavigate: (year: number) => void
}

export function DetailCard({ year, onClose, onNavigate }: Props) {
  const list = worldcups as WorldCup[]
  const currentIndex = list.findIndex((w) => w.year === year)
  if (currentIndex < 0) return null
  const data = list[currentIndex]!
  const prev = list[currentIndex - 1]
  const next = list[currentIndex + 1]

  return (
    <aside className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto z-50">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold" style={{ color: data.nodeColor }}>
          {data.year}
        </h2>
        <button
          onClick={onClose}
          aria-label="关闭"
          className="text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>
      </header>

      <dl className="space-y-3 text-sm">
        <div><dt className="text-white/50">举办地</dt><dd>{data.host}</dd></div>
        <div><dt className="text-white/50">冠军</dt><dd className="text-lg font-semibold">{data.champion}</dd></div>
        <div><dt className="text-white/50">金靴奖</dt><dd>{data.goldenBoot}（{data.goldenBootGoals} 球）</dd></div>
        <div><dt className="text-white/50">金球奖</dt><dd>{data.goldenBall}</dd></div>
        <div><dt className="text-white/50">参赛队伍</dt><dd>{data.teamsCount} 支</dd></div>
        <div><dt className="text-white/50">总进球</dt><dd>{data.totalGoals} 球 / {data.matchesCount} 场</dd></div>
      </dl>

      <section className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5">
        <h3 className="text-sm font-semibold text-white/70 mb-2">经典比赛 · {data.classicMatch.round}</h3>
        <p className="font-medium">{data.classicMatch.teams}</p>
        <p className="text-2xl font-bold my-1" style={{ color: data.nodeColor }}>{data.classicMatch.score}</p>
        <p className="text-xs text-white/60">{data.classicMatch.highlight}</p>
      </section>

      <nav className="flex justify-between mt-6 gap-2">
        <button
          onClick={() => prev && onNavigate(prev.year)}
          disabled={!prev}
          aria-label="上一届"
          className="flex-1 px-4 py-2 rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← 上一届{prev ? ` ${prev.year}` : ''}
        </button>
        <button
          onClick={() => next && onNavigate(next.year)}
          disabled={!next}
          aria-label="下一届"
          className="flex-1 px-4 py-2 rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {next ? `${next.year} ` : ''}下一届 →
        </button>
      </nav>
    </aside>
  )
}
