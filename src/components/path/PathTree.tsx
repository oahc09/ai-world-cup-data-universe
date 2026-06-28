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
        backgroundColor: 'rgba(20,20,30,0.95)',
        borderColor: 'rgba(255,213,79,0.3)',
        textStyle: { color: '#fff' },
        formatter: (params: any) => {
          const m = params.data?.match
          if (!m) return params.name
          const events = m.events.map((e: any) => `${e.minute}' ${e.type === 'penalty' ? '⚽(点)' : '⚽'} ${e.player}`).join('<br/>')
          return `<div style="font-weight:bold;font-size:14px;color:#ffd54f;margin-bottom:4px">${m.round}</div>
            <div style="font-size:16px;font-weight:bold">${path.teamName} ${m.score} ${m.opponent}</div>
            <div style="margin-top:6px;color:#ccc;font-size:12px">${events || '无关键事件'}</div>`
        },
      },
      series: [{
        type: 'tree',
        data: [treeData],
        top: '3%',
        left: '5%',
        bottom: '3%',
        right: '15%',
        symbolSize: 14,
        symbol: 'circle',
        orientation: 'LR',
        roam: true,
        lineStyle: {
          color: '#00e676',
          width: 2,
          curveness: 0.5,
        },
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 13,
          color: '#e0e0e0',
          fontWeight: 500,
          distance: 8,
          formatter: (params: any) => {
            const m = params.data?.match
            if (!m) return params.name
            const resultColor = m.result === 'win' ? '#00e676' : m.result === 'draw' ? '#ffd54f' : '#ff5252'
            return `{round|${m.round}}\n{score|${m.score}  vs  ${m.opponent}}`
          },
          rich: {
            round: {
              fontSize: 13,
              color: '#fff',
              fontWeight: 'bold',
              padding: [0, 0, 2, 0],
            },
            score: {
              fontSize: 11,
              color: '#aaa',
            },
          },
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            fontWeight: 'bold',
            fontSize: 14,
            color: '#ffd54f',
            distance: 8,
            formatter: (params: any) => {
              const m = params.data?.match
              if (!m) return params.name
              return `{final|🏆 ${m.round}}\n{result|${path.teamName} ${m.score} ${m.opponent}}`
            },
            rich: {
              final: {
                fontSize: 14,
                color: '#ffd54f',
                fontWeight: 'bold',
                padding: [0, 0, 2, 0],
              },
              result: {
                fontSize: 12,
                color: '#ccc',
              },
            },
          },
          itemStyle: {
            color: '#ffd54f',
            shadowBlur: 15,
            shadowColor: '#ffd54f',
          },
        },
        itemStyle: {
          color: '#00e676',
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: 'rgba(0,230,118,0.5)',
        },
        emphasis: { focus: 'descendant' },
        expandAndCollapse: false,
        animationDuration: 800,
        animationDurationUpdate: 1000,
        initialTreeDepth: 7,
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
