import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RoleSelector } from './role-selector'

describe('RoleSelector', () => {
  const defaultProps = {
    selectedRole: null as 'admin' | 'operator' | null,
    onSelectRole: vi.fn(),
    disabled: false,
  }

  it('renders Admin and Operator buttons', () => {
    render(<RoleSelector {...defaultProps} />)
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('OPERATOR')).toBeInTheDocument()
  })

  it('calls onSelectRole when a role button is clicked', () => {
    const onSelectRole = vi.fn()
    render(<RoleSelector {...defaultProps} onSelectRole={onSelectRole} />)

    fireEvent.click(screen.getByText('ADMIN'))
    expect(onSelectRole).toHaveBeenCalledWith('admin')

    fireEvent.click(screen.getByText('OPERATOR'))
    expect(onSelectRole).toHaveBeenCalledWith('operator')
  })

  it('marks the selected role as checked via aria-checked', () => {
    render(<RoleSelector {...defaultProps} selectedRole="admin" />)
    const adminButton = screen.getByRole('radio', { name: /ADMIN/i })
    expect(adminButton).toHaveAttribute('aria-checked', 'true')

    const operatorButton = screen.getByRole('radio', { name: /OPERATOR/i })
    expect(operatorButton).toHaveAttribute('aria-checked', 'false')
  })

  it('disables buttons when disabled prop is true', () => {
    render(<RoleSelector {...defaultProps} disabled={true} />)
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})
