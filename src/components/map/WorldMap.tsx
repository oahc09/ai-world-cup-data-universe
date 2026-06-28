import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import hostsData from '@/lib/data/hosts.json'
import type { Host } from '@/lib/data-types'

interface Props {
  onSelectHost?: (host: Host) => void
}

export function WorldMap({ onSelectHost }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const buildOption = () => {
      const hosts = hostsData as unknown as Host[]
      const data = hosts.map((h) => ({
        name: h.name,
        value: h.hostYears.length,
        coords: h.coords,
        host: h,
      }))
      return {
        backgroundColor: '#0a0a0a',
        tooltip: {
          formatter: (p: any) => {
            const host = p.data?.host
            if (!host) return p.name
            return `${host.name}<br/>举办次数：${host.hostYears.length}<br/>年份：${host.hostYears.join(', ')}`
          },
        },
        geo: {
          map: 'world',
          roam: true,
          itemStyle: { areaColor: '#1a1a1a', borderColor: '#333' },
          emphasis: { itemStyle: { areaColor: '#2a2a2a' } },
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          label: {
            show: true,
            formatter: '{b}',
            position: 'right',
            color: '#ffe082',
            fontSize: 12,
            textBorderColor: '#000',
            textBorderWidth: 2,
          },
          data: data.map((d) => ({
            name: d.name,
            value: [...d.coords, d.value],
            host: d.host,
            itemStyle: {
              color: d.value >= 3 ? '#ffd54f' : d.value === 2 ? '#ffb300' : '#ffe082',
            },
            symbolSize: d.value * 8 + 10,
          })),
        }],
      }
    }

    const tryInit = () => {
      if (chartRef.current) return true
      if (el.clientWidth === 0 || el.clientHeight === 0) return false

      fetch('/geo/world.json')
        .then((r) => r.json())
        .then((geo) => {
          echarts.registerMap('world', geo)
          chartRef.current = echarts.init(el, 'dark')
          chartRef.current.setOption(buildOption())
          chartRef.current.on('click', (params: any) => {
            if (params.data?.host) onSelectHost?.(params.data.host)
          })
        })
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
  }, [onSelectHost])

  return <div ref={ref} className="w-full h-full min-h-[400px]" />
}
