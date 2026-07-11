import type { ViewMode } from '@/hooks/useViewState'

const VIEWS: { key: ViewMode; label: string; icon: string }[] = [
  { key: 'timeline', label: '3D 时间线', icon: '🌀' },
  { key: 'radar', label: '球队雷达', icon: '📊' },
  { key: 'path', label: '夺冠路径', icon: '🏆' },
  { key: 'map', label: '历届地图', icon: '🌍' },
]

interface Props {
  current: ViewMode
  onChange: (v: ViewMode) => void
}

export function ViewSwitcher({ current, onChange }: Props) {
  return (
    <nav className="flex gap-1 rounded-xl p-1 glass-card">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            current === v.key
              ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/40'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-base">{v.icon}</span>
          <span>{v.label}</span>
        </button>
      ))}
    </nav>
  )
}
