import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChampionPathView } from '@/components/path/ChampionPathView'

vi.mock('echarts', () => ({
  init: vi.fn(() => ({ setOption: vi.fn(), dispose: vi.fn() })),
}))

describe('ChampionPathView', () => {
  it('renders team and year selectors', () => {
    render(<ChampionPathView />)
    expect(screen.getByText(/球队/)).toBeInTheDocument()
    expect(screen.getByText(/年份/)).toBeInTheDocument()
  })

  it('renders champion header with team name and year', () => {
    render(<ChampionPathView />)
    expect(screen.getAllByText('阿根廷').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1986').length).toBeGreaterThan(0)
  })

  it('shows stats panel with goals and wins', () => {
    render(<ChampionPathView />)
    expect(screen.getByText('进球')).toBeInTheDocument()
    expect(screen.getByText('胜场')).toBeInTheDocument()
    expect(screen.getByText('最佳射手')).toBeInTheDocument()
  })
})
