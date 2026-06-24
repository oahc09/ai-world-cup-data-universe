import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { Team } from '@/lib/data-types'
import { TEAM_COLORS } from '@/lib/colors'

interface Props {
  team1: Team
  team2: Team
}

const DIMENSIONS = [
  { key: 'attack' as const, name: '攻击力', max: 100 },
  { key: 'defense' as const, name: '防守力', max: 100 },
  { key: 'midfield' as const, name: '中场控制', max: 100 },
  { key: 'speed' as const, name: '速度', max: 100 },
  { key: 'experience' as const, name: '大赛经验', max: 100 },
  { key: 'homeAdvantage' as const, name: '主场优势', max: 100 },
]

export function RadarChart({ team1, team2 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!ref.current) return
    chartRef.current = echarts.init(ref.current, 'dark')
    return () => chartRef.current?.dispose()
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    chartRef.current.setOption({
      tooltip: {},
      legend: { data: [team1.name, team2.name], bottom: 0 },
      radar: {
        indicator: DIMENSIONS,
        shape: 'polygon',
        splitNumber: 5,
        axisName: { color: '#ccc' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        splitArea: { areaStyle: { color: ['rgba(0,230,118,0.02)', 'rgba(255,213,79,0.02)'] } },
      },
      series: [{
        type: 'radar',
        data: [
          {
            value: DIMENSIONS.map((d) => team1[d.key]),
            name: team1.name,
            itemStyle: { color: TEAM_COLORS.home },
            areaStyle: { opacity: 0.3 },
          },
          {
            value: DIMENSIONS.map((d) => team2[d.key]),
            name: team2.name,
            itemStyle: { color: TEAM_COLORS.away },
            areaStyle: { opacity: 0.3 },
          },
        ],
      }],
    })
  }, [team1, team2])

  return <div ref={ref} className="w-full h-[500px]" />
}
