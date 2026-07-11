import { useRef, useState, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { WorldCup } from '@/lib/data-types'
import { useIsMobile } from '@/hooks/useIsMobile'

interface Props {
  data: WorldCup
  position: [number, number, number]
  onSelect: (year: number) => void
  isFocused: boolean
}

export function TimelineNode({ data, position, onSelect, isFocused }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()
  const segments = isMobile ? 16 : 32
  const baseSize = 0.5
  const targetScale = isFocused ? 1.6 : hovered ? 1.3 : 1

  const yearTexture = useMemo(() => makeYearTexture(data.year), [data.year])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      const current = groupRef.current.scale.x
      const next = current + (targetScale - current) * 0.12
      groupRef.current.scale.setScalar(next * baseSize)
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 2 + position[0] * 0.5) * 0.2
      glowRef.current.scale.setScalar(pulse * (isFocused ? 1.5 : hovered ? 1.3 : 1.1))
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = isFocused ? 0.45 : hovered ? 0.3 : 0.15
    }
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(data.year)
  }

  return (
    <group position={position}>
      <mesh ref={glowRef as any}>
        <sphereGeometry args={[1, segments, segments]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <group ref={groupRef as any}>
        <mesh
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <sphereGeometry args={[1, segments, segments]} />
          <meshPhysicalMaterial
            color="#0a1628"
            metalness={0.9}
            roughness={0.08}
            transmission={0.7}
            thickness={0.6}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            emissive="#004433"
            emissiveIntensity={isFocused ? 0.9 : hovered ? 0.5 : 0.25}
          />
        </mesh>

        <mesh scale={[1.03, 1.03, 1.03]}>
          <sphereGeometry args={[1, segments, segments]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={isFocused ? 0.45 : hovered ? 0.25 : 0.12}
            wireframe
          />
        </mesh>

        <sprite scale={[0.9, 0.45, 1]} position={[0, 0, 0.01]}>
          <spriteMaterial map={yearTexture} transparent depthWrite={false} />
        </sprite>
      </group>
    </group>
  )
}

function makeYearTexture(year: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  ctx.font = 'bold 72px Arial Black, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.shadowColor = '#00ff88'
  ctx.shadowBlur = 25
  ctx.fillStyle = '#00ff88'
  ctx.fillText(String(year), 128, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}
