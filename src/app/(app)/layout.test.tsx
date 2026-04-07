import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import AppLayout from './layout'
import { useSessionStore } from '@/stores/session-store'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe('AppLayout - Route Gating', () => {
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

  it('redirects to login when not authenticated', async () => {
    render(
      <AppLayout>
        <div>Protected Content</div>
      </AppLayout>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login')
    })

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    useSessionStore.setState({
      isAuthenticated: true,
      role: 'admin',
      userId: 'user-admin-1',
      isAuthenticating: false,
      authError: null,
    })

    render(
      <AppLayout>
        <div>Protected Content</div>
      </AppLayout>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('redirects if authentication state changes to false', async () => {
    useSessionStore.setState({
      isAuthenticated: true,
      role: 'operator',
      userId: 'user-op-1',
      isAuthenticating: false,
      authError: null,
    })

    const { rerender } = render(
      <AppLayout>
        <div>Protected Content</div>
      </AppLayout>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()

    useSessionStore.setState({
      isAuthenticated: false,
      role: null,
      userId: null,
      isAuthenticating: false,
      authError: null,
    })

    rerender(
      <AppLayout>
        <div>Protected Content</div>
      </AppLayout>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login')
    })
  })
})
