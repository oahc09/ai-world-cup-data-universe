import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ViewTransition } from '@/components/shell/ViewTransition'

describe('ViewTransition', () => {
  it('renders children', () => {
    render(<ViewTransition viewKey="timeline"><div>Timeline</div></ViewTransition>)
    expect(screen.getByText('Timeline')).toBeInTheDocument()
  })

  it('applies fade animation class', () => {
    const { container } = render(<ViewTransition viewKey="timeline"><div>Timeline</div></ViewTransition>)
    expect(container.firstChild).toHaveClass('animate-fade-in')
  })
})
