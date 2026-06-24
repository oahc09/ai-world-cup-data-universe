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

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 p-6">
      <div className="flex-1">
        <WorldMap />
      </div>
      <aside className="lg:w-64 space-y-3">
        <h3 className="text-sm font-semibold text-white/70">大洲举办次数</h3>
        {stats.map((s) => (
          <div key={s.continent} className="p-3 rounded bg-white/5">
            <div className="flex justify-between">
              <span>{s.label}</span>
              <span className="font-bold text-yellow-300">{s.count}</span>
            </div>
            <div className="text-xs text-white/50 mt-1">{s.years.join(', ')}</div>
          </div>
        ))}
      </aside>
    </div>
  )
}
