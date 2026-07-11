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
    <aside className="fixed right-6 top-20 bottom-6 w-[360px] holo-card rounded-2xl p-6 overflow-y-auto z-50" style={{ maxHeight: 'calc(100vh - 96px)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/0 via-emerald-400/60 to-cyan-400/0" style={{ height: '1px' }}></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/0 via-emerald-400/40 to-cyan-400/0"></div>

      <header className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] text-cyan-300/70 tracking-widest uppercase mb-1">
            FIFA World Cup
          </div>
          <h2 className="text-5xl font-black text-glow-green" style={{ color: '#00ff88' }}>
            {data.year}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xl flex items-center justify-center transition-colors border border-white/10"
        >
          ×
        </button>
      </header>

      <dl className="space-y-4 text-sm">
        <InfoRow label="举办地" value={data.host} highlight />
        <InfoRow label="冠军" value={data.champion} size="lg" />
        <InfoRow label="金靴奖" value={`${data.goldenBoot}（${data.goldenBootGoals} 球）`} />
        <InfoRow label="金球奖" value={data.goldenBall} />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <InfoStat label="参赛队伍" value={`${data.teamsCount}`} unit="支" />
          <InfoStat label="总进球" value={`${data.totalGoals}`} unit="球" />
        </div>
        <InfoStat label="比赛场数" value={`${data.matchesCount}`} unit="场" full />
      </dl>

      <section className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/20">
        <div className="text-[10px] text-emerald-300/70 tracking-widest uppercase mb-2">
          ⚡ 经典比赛
        </div>
        <div className="text-sm font-semibold text-white mb-1">{data.classicMatch.round}</div>
        <div className="text-white/90 mb-2">{data.classicMatch.teams}</div>
        <div className="text-3xl font-black text-glow-green text-emerald-300 mb-2">
          {data.classicMatch.score}
        </div>
        <p className="text-xs text-white/60 leading-relaxed">{data.classicMatch.highlight}</p>
      </section>

      <nav className="flex justify-between mt-6 gap-2">
        <button
          onClick={() => prev && onNavigate(prev.year)}
          disabled={!prev}
          aria-label="上一届"
          className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ← 上一届{prev ? ` ${prev.year}` : ''}
        </button>
        <button
          onClick={() => next && onNavigate(next.year)}
          disabled={!next}
          aria-label="下一届"
          className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm text-right"
        >
          {next ? `${next.year} ` : ''}下一届 →
        </button>
      </nav>
    </aside>
  )
}

function InfoRow({ label, value, highlight, size }: { label: string; value: string; highlight?: boolean; size?: 'lg' }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <dt className="text-white/40 text-xs">{label}</dt>
      <dd className={`font-medium ${size === 'lg' ? 'text-lg' : 'text-sm'} ${highlight ? 'text-emerald-300' : 'text-white'}`}>
        {value}
      </dd>
    </div>
  )
}

function InfoStat({ label, value, unit, full }: { label: string; value: string; unit: string; full?: boolean }) {
  return (
    <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${full ? 'col-span-2' : ''}`}>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-emerald-300">{value}</span>
        <span className="text-xs text-white/40">{unit}</span>
      </div>
    </div>
  )
}
