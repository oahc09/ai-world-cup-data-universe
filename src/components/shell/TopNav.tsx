import { ViewSwitcher } from './ViewSwitcher'
import { ShareButton } from './ShareButton'
import type { ViewMode } from '@/hooks/useViewState'

interface Props {
  currentView: ViewMode
  onViewChange: (v: ViewMode) => void
  onShare: () => void
}

export function TopNav({ currentView, onViewChange, onShare }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-lg">
          ⚽
        </div>
        <div>
          <div className="text-base font-black tracking-wider text-white text-glow-green">
            绿茵数据宇宙
          </div>
          <div className="text-[10px] text-cyan-400/70 tracking-widest uppercase -mt-0.5">
            World Cup Data Universe
          </div>
        </div>
      </div>
      <ViewSwitcher current={currentView} onChange={onViewChange} />
      <ShareButton onClick={onShare} />
    </header>
  )
}
