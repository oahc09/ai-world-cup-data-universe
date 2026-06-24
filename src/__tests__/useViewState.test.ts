import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useViewState } from '@/hooks/useViewState'

describe('useViewState', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  it('defaults to timeline view', () => {
    const { result } = renderHook(() => useViewState())
    expect(result.current.view).toBe('timeline')
  })

  it('setView updates state and hash', () => {
    const { result } = renderHook(() => useViewState())
    act(() => result.current.setView('radar'))
    expect(result.current.view).toBe('radar')
    expect(window.location.hash).toContain('view=radar')
  })

  it('parses initial hash', () => {
    window.location.hash = '#view=path&year=1986&team=AR'
    const { result } = renderHook(() => useViewState())
    expect(result.current.view).toBe('path')
    expect(result.current.selectedYear).toBe(1986)
    expect(result.current.selectedTeam).toBe('AR')
  })
})
