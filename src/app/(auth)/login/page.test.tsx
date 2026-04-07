import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import LoginPage from './page'
import { useSessionStore } from '@/stores/session-store'

const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSessionStore.setState({
      isAuthenticated: false,
      role: null,
      userId: null,
      isAuthenticating: false,
      authError: null,
    })
  })

  it('renders the secure access terminal heading', () => {
    render(<LoginPage />)
    expect(screen.getByText('SECURE ACCESS TERMINAL')).toBeInTheDocument()
    expect(screen.getByText('TASKR')).toBeInTheDocument()
  })

  it('renders role selector with Admin and Operator options', () => {
    render(<LoginPage />)
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    expect(screen.getByText('OPERATOR')).toBeInTheDocument()
  })

  it('does not render PIN pad before role is selected', () => {
    render(<LoginPage />)
    expect(
      screen.queryByText('ENTER PIN TO AUTHENTICATE')
    ).not.toBeInTheDocument()
  })

  it('shows PIN pad after selecting a role', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByText('ADMIN'))
    expect(screen.getByText('ENTER PIN TO AUTHENTICATE')).toBeInTheDocument()
  })

  it('shows error message on failed authentication', () => {
    vi.useFakeTimers()
    render(<LoginPage />)

    fireEvent.click(screen.getByText('ADMIN'))

    const digitButtons = ['1', '2', '3', '4', '5', '6']
    for (const d of digitButtons) {
      fireEvent.click(screen.getByRole('button', { name: `Digit ${d}` }))
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit PIN' }))

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'AUTHENTICATION FAILED'
    )

    vi.useRealTimers()
  })

  it('authenticates with correct demo PIN and routes operator to my-tasks', () => {
    vi.useFakeTimers()
    render(<LoginPage />)

    fireEvent.click(screen.getByText('OPERATOR'))

    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Digit 0' }))
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit PIN' }))

    act(() => {
      vi.advanceTimersByTime(400)
    })

    const state = useSessionStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.userId).toBe('user-op-1')
    expect(mockPush).toHaveBeenCalledWith('/my-tasks')

    vi.useRealTimers()
  })

  it('authenticates with correct demo PIN and routes admin to board', () => {
    vi.useFakeTimers()
    render(<LoginPage />)

    fireEvent.click(screen.getByText('ADMIN'))

    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Digit 0' }))
    }

    fireEvent.click(screen.getByRole('button', { name: 'Submit PIN' }))

    act(() => {
      vi.advanceTimersByTime(400)
    })

    const state = useSessionStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.userId).toBe('user-admin-1')
    expect(mockPush).toHaveBeenCalledWith('/board')

    vi.useRealTimers()
  })

  it('sets role to admin on Admin button click', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByText('ADMIN'))
    expect(useSessionStore.getState().role).toBe('admin')
  })

  it('sets role to operator on Operator button click', () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByText('OPERATOR'))
    expect(useSessionStore.getState().role).toBe('operator')
  })
})
