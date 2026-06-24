'use client'

import { useState } from 'react'
import { Timeline3DScene } from '@/components/timeline/Timeline3DScene'
import { TimelineFallback2D } from '@/components/timeline/TimelineFallback2D'
import { DetailCard } from '@/components/timeline/DetailCard'
import { useWebGLSupport } from '@/hooks/useWebGLSupport'

export default function Home() {
  const webglSupported = useWebGLSupport()
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-black">
      <h1 className="sr-only">绿茵数据宇宙</h1>
      <div className="w-full h-screen">
        {webglSupported ? (
          <Timeline3DScene
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            autoRotateEnabled={true}
          />
        ) : (
          <TimelineFallback2D onSelectYear={setSelectedYear} />
        )}
      </div>
      {selectedYear && (
        <DetailCard
          year={selectedYear}
          onClose={() => setSelectedYear(null)}
          onNavigate={setSelectedYear}
        />
      )}
    </main>
  )
}
