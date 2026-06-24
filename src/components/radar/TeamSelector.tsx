import teams from '@/lib/data/teams.json'
import type { Team } from '@/lib/data-types'

interface Props {
  value: string
  onChange: (code: string) => void
  label: string
}

export function TeamSelector({ value, onChange, label }: Props) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-white/50">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
      >
        {(teams as unknown as Team[]).map((t) => (
          <option key={t.code} value={t.code}>{t.name}</option>
        ))}
      </select>
    </label>
  )
}
