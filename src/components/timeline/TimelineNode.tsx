import { useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { WorldCup } from '@/lib/data-types'

interface Props {
  data: WorldCup
  position: [number, number, number]
  onSelect: (year: number) => void
  isFocused: boolean
}

export function TimelineNode({ data, position, onSelect, isFocused }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
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
    <mesh
      ref={meshRef as any}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={data.nodeColor}
        emissive={data.nodeColor}
        emissiveIntensity={hovered || isFocused ? 1.5 : 0.6}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  )
}
