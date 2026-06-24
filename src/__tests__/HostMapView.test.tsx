import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HostMapView } from '@/components/map/HostMapView'

vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    dispose: vi.fn(),
    on: vi.fn(),
  })),
  registerMap: vi.fn(),
}))

// Mock fetch for world.json
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ type: 'FeatureCollection', features: [] }),
  })
) as any

describe('HostMapView', () => {
  it('renders continent stats', () => {
    render(<HostMapView />)
    expect(screen.getByText(/欧洲/)).toBeInTheDocument()
    expect(screen.getByText(/南美/)).toBeInTheDocument()
    expect(screen.getByText(/北美/)).toBeInTheDocument()
  })

  it('shows host count per continent', () => {
    render(<HostMapView />)
    // Europe has 11 host years: IT(2) + FR(2) + CH(1) + SE(1) + GB-ENG(1) + DE-W(1) + ES(1) + DE(1) + RU(1)
    expect(screen.getByText(/11/)).toBeInTheDocument()
  })
})
