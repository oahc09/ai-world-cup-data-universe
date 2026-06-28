import { useState, useEffect, useCallback } from 'react'

export type ViewMode = 'timeline' | 'radar' | 'path' | 'map'

export interface ViewState {
  view: ViewMode
  selectedYear: number | null
  selectedTeam: string | null
  selectedTeam2: string | null // 雷达图第二支球队
}

function parseHash(): Partial<ViewState> {
  const hash = window.location.hash.slice(1)
  const params = new URLSearchParams(hash)
  return {
    view: (params.get('view') as ViewMode) || 'timeline',
    selectedYear: params.get('year') ? Number(params.get('year')) : null,
    selectedTeam: params.get('team'),
    selectedTeam2: params.get('team2'),
  }
}

function buildHash(state: ViewState): string {
  const params = new URLSearchParams()
  params.set('view', state.view)
  if (state.selectedYear) params.set('year', String(state.selectedYear))
  if (state.selectedTeam) params.set('team', state.selectedTeam)
  if (state.selectedTeam2) params.set('team2', state.selectedTeam2)
  return `#${params.toString()}`
}

export function useViewState() {
  const [view, setViewState] = useState<ViewMode>('timeline')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedTeam2, setSelectedTeam2] = useState<string | null>(null)

  const setView = useCallback((v: ViewMode) => setViewState(v), [])

  useEffect(() => {
    const parsed = parseHash()
    if (parsed.view) setViewState(parsed.view)
    if (parsed.selectedYear !== undefined) setSelectedYear(parsed.selectedYear)
    if (parsed.selectedTeam !== undefined) setSelectedTeam(parsed.selectedTeam)
    if (parsed.selectedTeam2 !== undefined) setSelectedTeam2(parsed.selectedTeam2)
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash()
      if (parsed.view) setViewState(parsed.view)
      if (parsed.selectedYear !== undefined) setSelectedYear(parsed.selectedYear)
      if (parsed.selectedTeam !== undefined) setSelectedTeam(parsed.selectedTeam)
      if (parsed.selectedTeam2 !== undefined) setSelectedTeam2(parsed.selectedTeam2)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const hash = buildHash({ view, selectedYear, selectedTeam, selectedTeam2 })
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [view, selectedYear, selectedTeam, selectedTeam2])

  return {
    view,
    setView,
    selectedYear,
    setSelectedYear,
    selectedTeam,
    setSelectedTeam,
    selectedTeam2,
    setSelectedTeam2,
  }
}
