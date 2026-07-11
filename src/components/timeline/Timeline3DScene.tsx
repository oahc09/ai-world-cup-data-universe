import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import worldcups from '@/lib/data/worldcups.json'
import type { WorldCup } from '@/lib/data-types'
import { spiralPosition } from '@/lib/spiral'
import { TimelineNode } from './TimelineNode'
import { SpiralTrack } from './SpiralTrack'
import { NodeConnections } from './NodeConnections'
import { useTimelineFocus } from '@/hooks/useTimelineFocus'
import { useAutoRotate } from '@/hooks/useAutoRotate'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useGyroscope } from '@/hooks/useGyroscope'

const SPIRAL_CONFIG = { radius: 7, height: 28, turns: 3.2 }

interface Props {
  selectedYear: number | null
  onSelectYear: (year: number) => void
  autoRotateEnabled: boolean
}

function SceneContent({ selectedYear, onSelectYear, autoRotateEnabled }: Props) {
  const isMobile = useIsMobile()
  const { camera } = useThree()
  const [autoRotate, setAutoRotate] = useState(isMobile ? false : autoRotateEnabled)
  const orbitRef = useRef<any>(null)

  const positions = useMemo(
    () => (worldcups as WorldCup[]).map((_, i) =>
      spiralPosition(i, worldcups.length, SPIRAL_CONFIG)
    ),
    []
  )

  const selectedIndex = (worldcups as WorldCup[]).findIndex((w) => w.year === selectedYear)
  const { focusOn } = useTimelineFocus(camera, orbitRef.current, worldcups.length)
  const { pauseTemporarily } = useAutoRotate(orbitRef.current, autoRotate)

  const starCount = isMobile ? 800 : 3000
  const effectiveAutoRotate = isMobile ? false : autoRotate

  useEffect(() => {
    if (selectedIndex >= 0 && orbitRef.current) {
      focusOn(selectedIndex)
      pauseTemporarily()
    }
  }, [selectedIndex])

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 8, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.6} color="#00e5ff" />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#ffd700" />
      <pointLight position={[0, -15, 0]} intensity={0.4} color="#00ff88" />

      <Stars
        radius={80}
        depth={60}
        count={starCount}
        factor={5}
        fade
      />

      <SpiralTrack
        turns={SPIRAL_CONFIG.turns}
        radius={SPIRAL_CONFIG.radius}
        height={SPIRAL_CONFIG.height}
      />

      <NodeConnections positions={positions} />

      {(worldcups as WorldCup[]).map((w, i) => (
        <TimelineNode
          key={w.year}
          data={w}
          position={positions[i]!}
          onSelect={onSelectYear}
          isFocused={selectedYear === w.year}
        />
      ))}

      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        minDistance={6}
        maxDistance={isMobile ? 45 : 35}
        autoRotate={effectiveAutoRotate}
        autoRotateSpeed={1.5}
        enableDamping
        dampingFactor={0.05}
        onStart={() => { setAutoRotate(false); pauseTemporarily() }}
        onEnd={() => pauseTemporarily()}
      />
    </>
  )
}

export function Timeline3DScene(props: Props) {
  const isMobile = useIsMobile()
  const gyro = useGyroscope()

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [14, 2, 14], fov: 55 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
        className="w-full h-full"
      >
        <SceneContent {...props} />
      </Canvas>
      {isMobile && gyro.supported && (
        <button
          onClick={gyro.toggle}
          className="absolute bottom-4 right-4 px-3 py-2 rounded-lg glass-card text-xs text-white/80 hover:text-white transition-colors"
        >
          {gyro.enabled ? '关闭陀螺仪' : '开启陀螺仪'}
        </button>
      )}
    </div>
  )
}
