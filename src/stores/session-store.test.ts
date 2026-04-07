import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStore } from './session-store'

describe('session-store', () => {
  beforeEach(() => {
    useSessionStore.setState({
      isAuthenticated: false,
      role: null,
      userId: null,
      isAuthenticating: false,
      authError: null,
    })
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    })
  })

  describe('initial state', () => {
    it('starts unauthenticated with no role', () => {
      const state = useSessionStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.role).toBeNull()
      expect(state.userId).toBeNull()
      expect(state.isAuthenticating).toBe(false)
      expect(state.authError).toBeNull()
    })
  })

  describe('selectRole', () => {
    it('sets the selected role', () => {
      useSessionStore.getState().actions.selectRole('admin')
      expect(useSessionStore.getState().role).toBe('admin')
    })

    it('clears any existing auth error', () => {
      useSessionStore.setState({ authError: 'previous error' })
      useSessionStore.getState().actions.selectRole('operator')
      expect(useSessionStore.getState().authError).toBeNull()
    })
  })

  describe('login', () => {
    it('sets authenticated state with userId', () => {
      useSessionStore.getState().actions.selectRole('admin')
      useSessionStore.getState().actions.login('user-admin-1')

      const state = useSessionStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.userId).toBe('user-admin-1')
      expect(state.isAuthenticating).toBe(false)
      expect(state.authError).toBeNull()
    })
  })

  describe('loginFailed', () => {
    it('sets error and remains unauthenticated', () => {
      useSessionStore.getState().actions.loginFailed('INVALID PIN')

      const state = useSessionStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isAuthenticating).toBe(false)
      expect(state.authError).toBe('INVALID PIN')
    })
  })

  describe('logout', () => {
    it('resets all session state', () => {
      useSessionStore.getState().actions.selectRole('admin')
      useSessionStore.getState().actions.login('user-admin-1')
      useSessionStore.getState().actions.logout()

      const state = useSessionStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.role).toBeNull()
      expect(state.userId).toBeNull()
      expect(state.isAuthenticating).toBe(false)
      expect(state.authError).toBeNull()
    })
  })

  describe('setAuthenticating', () => {
    it('toggles the authenticating flag', () => {
      useSessionStore.getState().actions.setAuthenticating(true)
      expect(useSessionStore.getState().isAuthenticating).toBe(true)

      useSessionStore.getState().actions.setAuthenticating(false)
      expect(useSessionStore.getState().isAuthenticating).toBe(false)
    })
  })

  describe('clearError', () => {
    it('clears the auth error', () => {
      useSessionStore.setState({ authError: 'some error' })
      useSessionStore.getState().actions.clearError()
      expect(useSessionStore.getState().authError).toBeNull()
    })
  })
})
