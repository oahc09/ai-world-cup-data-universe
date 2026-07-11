import { useMemo } from 'react'
import * as THREE from 'three'

interface Props {
  turns: number
  radius: number
  height: number
  segments?: number
}

export function SpiralTrack({ turns, radius, height, segments = 400 }: Props) {
  const geometry = useMemo(() => {
    class SpiralCurve extends THREE.Curve<THREE.Vector3> {
      getPoint(t: number): THREE.Vector3 {
        const angle = t * Math.PI * 2 * turns
        const y = (t - 0.5) * height
        const r = radius * (0.5 + t * 0.5)
        return new THREE.Vector3(
          Math.cos(angle) * r,
          y,
          Math.sin(angle) * r
        )
      }
    }
    const curve = new SpiralCurve()
    return new THREE.TubeGeometry(curve, segments, 0.06, 8, false)
  }, [turns, radius, height, segments])

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff8c00"
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.15}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}
