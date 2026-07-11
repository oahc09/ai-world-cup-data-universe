import { useMemo } from 'react'
import hostsData from '@/lib/data/hosts.json'
import type { Host, Continent } from '@/lib/data-types'
import { WorldMap } from './WorldMap'

const CONTINENT_LABELS: Record<Continent, string> = {
  europe: '欧洲',
  'south-america': '南美',
  'north-america': '北美',
  asia: '亚洲',
  africa: '非洲',
}

export function HostMapView() {
  const hosts = hostsData as unknown as Host[]
  const stats = useMemo(() => {
    const map = new Map<Continent, { count: number; years: number[] }>()
    for (const h of hosts) {
      const cur = map.get(h.continent) ?? { count: 0, years: [] }
      cur.count += h.hostYears.length
      cur.years.push(...h.hostYears)
      map.set(h.continent, cur)
    }
    return Array.from(map.entries()).map(([continent, s]) => ({
      continent,
      label: CONTINENT_LABELS[continent],
      ...s,
    }))
  }, [])

  const totalHosts = stats.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-6">
      <div className="flex-1 rounded-2xl glass-card overflow-hidden p-2">
        <div className="px-4 py-2 flex items-center gap-2">
          <span className="text-lg">🌍</span>
          <span className="text-sm font-semibold text-white/90">历届世界杯举办地</span>
          <span className="text-xs text-emerald-400/70 ml-auto">共 {totalHosts} 届</span>
        </div>
        <div className="h-[calc(100%-44px)]">
          <WorldMap />
        </div>
      </div>
      <aside className="lg:w-64 space-y-2">
        <div className="text-xs text-white/50 px-1 mb-2 tracking-wider uppercase">大洲举办统计</div>
        {stats.sort((a, b) => b.count - a.count).map((s) => (
          <div key={s.continent} className="p-3 rounded-xl glass-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white/90">{s.label}</span>
              <span className="text-lg font-black text-glow-gold" style={{ color: '#ffd700' }}>
                {s.count}
              </span>
            </div>
            <div className="text-[10px] text-white/40 leading-relaxed">
              {s.years.sort((a, b) => a - b).join(' · ')}
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: `${(s.count / totalHosts) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </aside>
    </div>
  )
}
