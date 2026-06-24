import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import worldcups from '@/lib/data/worldcups.json'
import type { WorldCup } from '@/lib/data-types'
import { spiralPosition } from '@/lib/spiral'
import { TimelineNode } from './TimelineNode'

interface Props {
  selectedYear: number | null
  onSelectYear: (year: number) => void
  autoRotateEnabled: boolean
}

const SPIRAL_CONFIG = { radius: 8, height: 30, turns: 3 }

export function Timeline3DScene({ selectedYear, onSelectYear, autoRotateEnabled }: Props) {
  return (
    <Canvas
      camera={{ position: [12, 0, 12], fov: 60 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />
      <Stars radius={50} depth={50} count={2000} factor={4} fade />

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
        enablePan={false}
        minDistance={5}
        maxDistance={30}
        autoRotate={autoRotateEnabled}
        autoRotateSpeed={2}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  )
}
