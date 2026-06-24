import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ChampionPath } from '@/lib/data-types'

interface Props {
  path: ChampionPath
}

export function PathTree({ path }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!ref.current) return
    chartRef.current = echarts.init(ref.current, 'dark')
    return () => chartRef.current?.dispose()
  }, [])

  useEffect(() => {
    if (!chartRef.current) return
    const treeData = buildTreeData(path)
    chartRef.current.setOption({
      tooltip: {
        formatter: (params: any) => {
          const m = params.data?.match
          if (!m) return params.name
          const events = m.events.map((e: any) => `${e.minute}' ${e.type}: ${e.player}`).join('<br/>')
          return `${m.round}<br/>${path.teamName} ${m.score} ${m.opponent}<br/>${events || '无关键事件'}`
        },
      },
      series: [{
        type: 'tree',
        data: [treeData],
        top: '5%',
        left: '10%',
        bottom: '5%',
        right: '20%',
        symbolSize: 12,
        orientation: 'LR',
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 12,
          color: '#ccc',
          formatter: (params: any) => {
            const m = params.data?.match
            return m ? `${m.round}\n${m.score}` : params.name
          },
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
          },
        },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: false,
        animationDuration: 550,
        animationDurationUpdate: 750,
      }],
    })
  }, [path])

  return <div ref={ref} className="w-full h-[600px]" />
}

function buildTreeData(path: ChampionPath) {
  let children: any = null
  for (let i = path.matches.length - 1; i >= 0; i--) {
    const m = path.matches[i]!
    children = {
      name: `${m.round}-${m.opponent}`,
      match: m,
      itemStyle: m.round === '决赛' ? { color: '#ffd54f' } : { color: '#00e676' },
      symbolSize: m.round === '决赛' ? 20 : 12,
      children: children ? [children] : undefined,
    }
  }
  return children
}
