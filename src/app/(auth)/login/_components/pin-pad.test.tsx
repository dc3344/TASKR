import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PinPad } from './pin-pad'

describe('PinPad', () => {
  const defaultProps = {
    onComplete: vi.fn(),
    disabled: false,
    error: null as string | null,
  }

  it('renders all digit buttons 0-9', () => {
    render(<PinPad {...defaultProps} />)
    for (let i = 0; i <= 9; i++) {
      expect(
        screen.getByRole('button', { name: `Digit ${i}` })
      ).toBeInTheDocument()
    }
  })

  it('renders backspace and submit buttons', () => {
    render(<PinPad {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: 'Delete last digit' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Submit PIN' })
    ).toBeInTheDocument()
  })

  it('submit button is disabled when PIN is incomplete', () => {
    render(<PinPad {...defaultProps} />)
    const submitBtn = screen.getByRole('button', { name: 'Submit PIN' })
    expect(submitBtn).toBeDisabled()
  })

  it('calls onComplete when 6 digits entered and submit is clicked', () => {
    const onComplete = vi.fn()
    render(<PinPad {...defaultProps} onComplete={onComplete} />)

    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Digit 0' }))
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit PIN' }))
    expect(onComplete).toHaveBeenCalledWith('000000')
  })

  it('backspace removes last entered digit', () => {
    const onComplete = vi.fn()
    render(<PinPad {...defaultProps} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Digit 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Digit 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete last digit' }))

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Digit 0' }))
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit PIN' }))
    expect(onComplete).toHaveBeenCalledWith('100000')
  })

  it('prevents entering more than 6 digits', () => {
    const onComplete = vi.fn()
    render(<PinPad {...defaultProps} onComplete={onComplete} />)

    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Digit 1' }))
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit PIN' }))
    expect(onComplete).toHaveBeenCalledWith('111111')
  })

  it('disables all buttons when disabled prop is true', () => {
    render(<PinPad {...defaultProps} disabled={true} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})
