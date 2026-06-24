import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TeamRadarView } from '@/components/radar/TeamRadarView'

// Mock echarts to avoid canvas rendering in jsdom
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    dispose: vi.fn(),
  })),
  default: { init: vi.fn(() => ({ setOption: vi.fn(), dispose: vi.fn() })) },
}))

describe('TeamRadarView', () => {
  it('renders two team selectors', () => {
    render(<TeamRadarView />)
    expect(screen.getAllByRole('combobox')).toHaveLength(2)
  })

  it('renders 6 dimension labels', () => {
    render(<TeamRadarView />)
    expect(screen.getByText(/攻击力/)).toBeInTheDocument()
    expect(screen.getByText(/防守力/)).toBeInTheDocument()
    expect(screen.getByText(/中场控制/)).toBeInTheDocument()
    expect(screen.getByText(/速度/)).toBeInTheDocument()
    expect(screen.getByText(/大赛经验/)).toBeInTheDocument()
    expect(screen.getByText(/主场优势/)).toBeInTheDocument()
  })

  it('updates radar when team changed', () => {
    render(<TeamRadarView />)
    const selectors = screen.getAllByRole('combobox')
    fireEvent.change(selectors[1]!, { target: { value: 'DE' } })
    // Use /德国在/ to match only the interpretation <p>, not the <option> elements
    expect(screen.getByText(/德国在/)).toBeInTheDocument()
  })
})
