import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '@/app/page'

describe('Home', () => {
  it('renders app title', () => {
    render(<Home />)
    expect(screen.getByText('绿茵数据宇宙')).toBeInTheDocument()
  })
})
