import { useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Text } from '@react-three/drei'
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
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()
  const segments = isMobile ? 16 : 32
  const targetScale = isFocused ? data.nodeSize * 1.5 : hovered ? data.nodeSize * 1.2 : data.nodeSize

  useFrame(() => {
    if (!meshRef.current) return
    const current = meshRef.current.scale.x
    const next = current + (targetScale - current) * 0.1
    meshRef.current.scale.setScalar(next)
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
      <mesh
        ref={meshRef as any}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.5, segments, segments]} />
        <meshStandardMaterial
          color={data.nodeColor}
          emissive={data.nodeColor}
          emissiveIntensity={hovered || isFocused ? 1.5 : 0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      <Text
        position={[0.8, 0, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {data.year}
      </Text>
    </group>
  )
}
