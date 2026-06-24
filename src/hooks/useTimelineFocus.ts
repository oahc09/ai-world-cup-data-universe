import { useState, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { spiralPosition } from '@/lib/spiral'
import { easeInOutCubic } from '@/lib/easing'

const FOCUS_DURATION = 800 // ms，PRD 规定
const SPIRAL_CONFIG = { radius: 8, height: 30, turns: 3 }
const CAMERA_OFFSET: [number, number, number] = [3, 1, 3]

export function useTimelineFocus(
  camera: THREE.Camera | null,
  controls: { target: THREE.Vector3; update: () => void } | null,
  total: number
) {
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  const focusOn = useCallback(
    (index: number) => {
      if (!camera || !controls) return
      const targetPos = spiralPosition(index, total, SPIRAL_CONFIG)
      const startPos = camera.position.clone()
      const endPos = new THREE.Vector3(
        targetPos[0] + CAMERA_OFFSET[0],
        targetPos[1] + CAMERA_OFFSET[1],
        targetPos[2] + CAMERA_OFFSET[2]
      )
      const startTarget = controls.target.clone()
      const endTarget = new THREE.Vector3(...targetPos)
      const startTime = performance.now()
      setIsAnimating(true)

      const animate = (now: number) => {
        const elapsed = now - startTime
        const t = Math.min(elapsed / FOCUS_DURATION, 1)
        const eased = easeInOutCubic(t)
        camera.position.lerpVectors(startPos, endPos, eased)
        controls.target.lerpVectors(startTarget, endTarget, eased)
        controls.update()
        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    },
    [camera, controls, total]
  )

  return { focusOn, isAnimating }
}
