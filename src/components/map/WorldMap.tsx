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
  const mountedRef = useRef(true)
  const initStartedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
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

      const lineData: any[] = []
      for (let i = 0; i < data.length - 1; i++) {
        const from = data[i]!
        const to = data[i + 1]!
        lineData.push({
          coords: [from.coords, to.coords],
          fromName: from.name,
          toName: to.name,
        })
      }

      return {
        backgroundColor: 'transparent',
        tooltip: {
          backgroundColor: 'rgba(10, 20, 40, 0.9)',
          borderColor: 'rgba(0, 255, 136, 0.3)',
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: 12 },
          formatter: (p: any) => {
            const host = p.data?.host
            if (!host) return p.name
            return `<div style="font-weight:bold;color:#00ff88;margin-bottom:4px">${host.name}</div>
              <div style="color:#aaa;font-size:11px">举办次数：<span style="color:#ffd700">${host.hostYears.length}</span> 次</div>
              <div style="color:#aaa;font-size:11px;margin-top:2px">${host.hostYears.join(', ')}</div>`
          },
        },
        geo: {
          map: 'world',
          roam: true,
          zoom: 1.2,
          itemStyle: {
            areaColor: '#0a1628',
            borderColor: '#00ff88',
            borderWidth: 0.5,
            shadowColor: 'rgba(0, 255, 136, 0.3)',
            shadowBlur: 10,
          },
          emphasis: {
            itemStyle: {
              areaColor: '#112240',
              borderColor: '#00ff88',
              borderWidth: 1,
            },
            label: { show: false },
          },
        },
        series: [
          {
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 1,
            effect: {
              show: true,
              period: 5,
              trailLength: 0.3,
              symbol: 'arrow',
              symbolSize: 5,
              color: '#00ff88',
            },
            lineStyle: {
              color: '#00ff88',
              width: 1,
              opacity: 0.3,
              curveness: 0.25,
            },
            data: lineData,
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              period: 3,
              scale: 4,
              brushType: 'stroke',
            },
            symbol: 'pin',
            symbolSize: (val: number[]) => Math.max(val[2]! * 10 + 20, 24),
            label: {
              show: true,
              formatter: (p: any) => p.data?.host?.hostYears?.[0] || '',
              position: 'top',
              color: '#ffd700',
              fontSize: 11,
              fontWeight: 'bold',
              textBorderColor: '#000',
              textBorderWidth: 2,
            },
            itemStyle: {
              color: '#ffd700',
              shadowBlur: 15,
              shadowColor: '#ffd700',
            },
            data: data.map((d) => ({
              name: d.name,
              value: [...d.coords, d.value],
              host: d.host,
            })),
          },
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            symbol: 'circle',
            symbolSize: 6,
            label: {
              show: true,
              formatter: '{b}',
              position: 'right',
              color: '#7fffae',
              fontSize: 11,
              textBorderColor: '#001122',
              textBorderWidth: 3,
            },
            itemStyle: {
              color: '#00ff88',
              shadowBlur: 8,
              shadowColor: '#00ff88',
            },
            data: data.map((d) => ({
              name: d.name,
              value: [...d.coords, d.value],
              host: d.host,
            })),
          },
        ],
      }
    }

    const initChart = () => {
      if (chartRef.current) return
      if (el.clientWidth === 0 || el.clientHeight === 0) return
      if (initStartedRef.current) return
      initStartedRef.current = true

      fetch('/geo/world.json')
        .then((r) => r.json())
        .then((geo) => {
          if (!mountedRef.current || chartRef.current) return
          echarts.registerMap('world', geo)
          chartRef.current = echarts.init(el, 'dark')
          chartRef.current.setOption(buildOption())
          chartRef.current.on('click', (params: any) => {
            if (params.data?.host) onSelectHost?.(params.data.host)
          })
        })
        .catch(() => {
          initStartedRef.current = false
        })
    }

    initChart()

    const ro = new ResizeObserver(() => {
      if (!chartRef.current) {
        initChart()
      } else {
        try {
          chartRef.current.resize()
        } catch {
          // geo resize may fail internally during transition
        }
      }
    })
    ro.observe(el)

    const handleResize = () => {
      try {
        chartRef.current?.resize()
      } catch {
        // ignore internal geo resize errors
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      mountedRef.current = false
      window.removeEventListener('resize', handleResize)
      ro.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
      initStartedRef.current = false
    }
  }, [onSelectHost])

  return <div ref={ref} className="w-full h-full min-h-[400px]" />
}
