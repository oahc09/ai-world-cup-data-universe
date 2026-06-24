'use client'

import { useState } from 'react'
import { useViewState } from '@/hooks/useViewState'
import { TopNav } from '@/components/shell/TopNav'
import { Timeline3DScene } from '@/components/timeline/Timeline3DScene'
import { TimelineFallback2D } from '@/components/timeline/TimelineFallback2D'
import { DetailCard } from '@/components/timeline/DetailCard'
import { TeamRadarView } from '@/components/radar/TeamRadarView'
import { ChampionPathView } from '@/components/path/ChampionPathView'
import { HostMapView } from '@/components/map/HostMapView'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'

export default function Home() {
  const webglSupported = useWebGLSupport()
  const { view, setView, selectedYear, setSelectedYear } = useViewState()
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <main className="min-h-screen bg-black">
      <h1 className="sr-only">绿茵数据宇宙</h1>
      <TopNav currentView={view} onViewChange={setView} onShare={() => setShareOpen(true)} />

      <div className="w-full h-screen pt-14">
        {view === 'timeline' && (
          webglSupported ? (
            <Timeline3DScene
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              autoRotateEnabled={true}
            />
          ) : (
            <TimelineFallback2D onSelectYear={setSelectedYear} />
          )
        )}
        {view === 'radar' && <TeamRadarView />}
        {view === 'path' && <ChampionPathView />}
        {view === 'map' && <HostMapView />}
      </div>

      {view === 'timeline' && selectedYear && (
        <DetailCard
          year={selectedYear}
          onClose={() => setSelectedYear(null)}
          onNavigate={setSelectedYear}
        />
      )}
    </main>
  )
}
