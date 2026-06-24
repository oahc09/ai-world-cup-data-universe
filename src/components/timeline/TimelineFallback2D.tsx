import worldcups from '@/lib/data/worldcups.json'
import type { WorldCup } from '@/lib/data-types'

interface Props {
  onSelectYear?: (year: number) => void
}

export function TimelineFallback2D({ onSelectYear }: Props) {
  return (
    <div className="w-full overflow-x-auto py-8">
      <div className="flex gap-4 px-4 min-w-max">
        {(worldcups as WorldCup[]).map((w) => (
          <button
            key={w.year}
            onClick={() => onSelectYear?.(w.year)}
            className="flex-shrink-0 w-48 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
            style={{ borderColor: w.nodeColor }}
          >
            <div className="text-2xl font-bold" style={{ color: w.nodeColor }}>
              {w.year}
            </div>
            <div className="text-sm text-white/70 mt-1">{w.host}</div>
            <div className="text-xs text-white/50 mt-2">冠军：{w.champion}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
