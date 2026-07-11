import teams from '@/lib/data/teams.json'
import type { Team } from '@/lib/data-types'

interface Props {
  value: string
  onChange: (code: string) => void
  label: string
}

export function TeamSelector({ value, onChange, label }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
        <span className="text-xs text-white/50 tracking-wide">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900/80 border border-emerald-400/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
        >
          {(teams as unknown as Team[]).map((t) => (
            <option key={t.code} value={t.code} className="bg-zinc-900 text-white">{t.name}</option>
          ))}
        </select>
      </label>
  )
}
