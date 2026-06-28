import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ChampionPath } from '@/lib/data-types'

interface Props {
  path: ChampionPath
}

export function PathTree({ path }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  const getOption = () => {
    const treeData = buildTreeData(path)
    return {
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
    }
  }

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const tryInit = () => {
      if (chartRef.current) return true
      if (el.clientWidth === 0 || el.clientHeight === 0) return false
      chartRef.current = echarts.init(el, 'dark')
      chartRef.current.setOption(getOption())
      return true
    }

    if (!tryInit()) {
      const ro = new ResizeObserver(() => {
        if (tryInit()) ro.disconnect()
      })
      ro.observe(el)
      return () => ro.disconnect()
    }

    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)
    const ro = new ResizeObserver(() => chartRef.current?.resize())
    ro.observe(el)

    return () => {
      window.removeEventListener('resize', handleResize)
      ro.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(getOption())
  }, [path])

  return <div ref={ref} className="w-full h-full" />
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
