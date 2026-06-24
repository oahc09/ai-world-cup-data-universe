import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DetailCard } from '@/components/timeline/DetailCard'

describe('DetailCard', () => {
  it('renders champion and golden ball for 1986', () => {
    render(<DetailCard year={1986} onClose={vi.fn()} onNavigate={vi.fn()} />)
    expect(screen.getAllByText(/阿根廷/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/马拉多纳/).length).toBeGreaterThan(0)
  })

  it('calls onNavigate with prev/next year', () => {
    const onNavigate = vi.fn()
    render(<DetailCard year={1986} onClose={vi.fn()} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole('button', { name: /上一届/ }))
    expect(onNavigate).toHaveBeenCalledWith(1982)
    fireEvent.click(screen.getByRole('button', { name: /下一届/ }))
    expect(onNavigate).toHaveBeenCalledWith(1990)
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<DetailCard year={1986} onClose={onClose} onNavigate={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /关闭/ }))
    expect(onClose).toHaveBeenCalled()
  })

  it('disables prev at 1930 and next at 2026', () => {
    const { rerender } = render(<DetailCard year={1930} onClose={vi.fn()} onNavigate={vi.fn()} />)
    expect(screen.getByRole('button', { name: /上一届/ })).toBeDisabled()
    rerender(<DetailCard year={2026} onClose={vi.fn()} onNavigate={vi.fn()} />)
    expect(screen.getByRole('button', { name: /下一届/ })).toBeDisabled()
  })
})
