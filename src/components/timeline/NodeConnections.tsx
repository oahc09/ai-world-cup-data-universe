import { useMemo } from 'react'
import * as THREE from 'three'

interface Props {
  positions: Array<[number, number, number]>
}

export function NodeConnections({ positions }: Props) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < positions.length - 1; i++) {
      const p1 = new THREE.Vector3(...positions[i]!)
      const p2 = new THREE.Vector3(...positions[i + 1]!)
      const mid = p1.clone().add(p2).multiplyScalar(0.5)
      const dir = p2.clone().sub(p1)
      const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize()
      const offset = dir.length() * 0.15
      mid.add(perp.multiplyScalar(offset))
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      const curvePoints = curve.getPoints(15)
      for (let j = 0; j < curvePoints.length - 1; j++) {
        points.push(curvePoints[j]!, curvePoints[j + 1]!)
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [positions])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00ff88" transparent opacity={0.2} />
    </lineSegments>
  )
}
