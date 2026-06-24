export interface SpiralConfig {
  radius: number
  height: number
  turns: number
}

/**
 * 计算螺旋路径上第 index 个节点的 3D 位置。
 * y 轴为时间轴（向上递增），xz 平面为螺旋。
 */
export function spiralPosition(index: number, total: number, config: SpiralConfig): [number, number, number] {
  const { radius, height, turns } = config
  const t = total <= 1 ? 0 : index / (total - 1)
  const angle = t * turns * Math.PI * 2
  const y = (t - 0.5) * height
  const x = radius * Math.cos(angle)
  const z = radius * Math.sin(angle)
  return [x, y, z]
}
