import { useEffect, useRef } from 'react'

const RESUME_DELAY = 5000 // PRD：停止交互 5 秒后恢复

export function useAutoRotate(
  controls: { autoRotate: boolean; autoRotateSpeed: number; update: () => void } | null,
  enabled: boolean
) {
  const resumeTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!controls) return
    controls.autoRotate = enabled
    controls.autoRotateSpeed = 2 // 约 30 秒一圈
  }, [controls, enabled])

  const pauseTemporarily = () => {
    if (!controls) return
    controls.autoRotate = false
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      if (enabled) controls.autoRotate = true
    }, RESUME_DELAY)
  }

  return { pauseTemporarily }
}
