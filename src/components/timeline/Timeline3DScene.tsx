import { useRef, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import worldcups from '@/lib/data/worldcups.json'
import type { WorldCup } from '@/lib/data-types'
import { spiralPosition } from '@/lib/spiral'
import { TimelineNode } from './TimelineNode'
import { useTimelineFocus } from '@/hooks/useTimelineFocus'
import { useAutoRotate } from '@/hooks/useAutoRotate'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useGyroscope } from '@/hooks/useGyroscope'

const SPIRAL_CONFIG = { radius: 8, height: 30, turns: 3 }

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

  const selectedIndex = (worldcups as WorldCup[]).findIndex((w) => w.year === selectedYear)
  const { focusOn } = useTimelineFocus(camera, orbitRef.current, worldcups.length)
  const { pauseTemporarily } = useAutoRotate(orbitRef.current, autoRotate)

  const starCount = isMobile ? 500 : 2000
  const effectiveAutoRotate = isMobile ? false : autoRotate

  useEffect(() => {
    if (selectedIndex >= 0 && orbitRef.current) {
      focusOn(selectedIndex)
      pauseTemporarily()
    }
  }, [selectedIndex])

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />
      <Stars radius={50} depth={50} count={starCount} factor={4} fade />

      {(worldcups as WorldCup[]).map((w, i) => (
        <TimelineNode
          key={w.year}
          data={w}
          position={spiralPosition(i, worldcups.length, SPIRAL_CONFIG)}
          onSelect={onSelectYear}
          isFocused={selectedYear === w.year}
        />
      ))}

      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        minDistance={5}
        maxDistance={isMobile ? 40 : 30}
        autoRotate={effectiveAutoRotate}
        autoRotateSpeed={2}
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
        camera={{ position: [12, 0, 12], fov: 60 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        className="w-full h-full"
      >
        <SceneContent {...props} />
      </Canvas>
      {isMobile && gyro.supported && (
        <button
          onClick={gyro.toggle}
          className="absolute bottom-4 right-4 px-3 py-2 rounded bg-black/60 text-xs text-white border border-white/20"
        >
          {gyro.enabled ? '关闭陀螺仪' : '开启陀螺仪'}
        </button>
      )}
    </div>
  )
}
