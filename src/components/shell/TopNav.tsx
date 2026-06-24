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
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="text-lg font-bold tracking-wide">绿茵数据宇宙</div>
      <ViewSwitcher current={currentView} onChange={onViewChange} />
      <ShareButton onClick={onShare} />
    </header>
  )
}
