import type { ViewMode } from '@/hooks/useViewState'

const VIEWS: { key: ViewMode; label: string }[] = [
  { key: 'timeline', label: '3D 时间线' },
  { key: 'radar', label: '球队雷达' },
  { key: 'path', label: '夺冠路径' },
  { key: 'map', label: '历届地图' },
]

interface Props {
  current: ViewMode
  onChange: (v: ViewMode) => void
}

export function ViewSwitcher({ current, onChange }: Props) {
  return (
    <nav className="flex gap-1 bg-white/5 rounded-lg p-1">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          className={`px-4 py-1.5 rounded text-sm transition ${
            current === v.key ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          {v.label}
        </button>
      ))}
    </nav>
  )
}
