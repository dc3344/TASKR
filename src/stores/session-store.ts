'use client'

import { create } from 'zustand'
import type { Role } from '@/types/session.types'

function setSessionCookie(userId: string, role: Role) {
  const payload = JSON.stringify({ userId, role })
  document.cookie = `taskr-session=${encodeURIComponent(payload)}; path=/; SameSite=Lax`
}

function getSessionCookie(): { userId: string; role: Role } | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split('; ')
  const sessionCookie = cookies.find((c) => c.startsWith('taskr-session='))
  if (!sessionCookie) return null
  try {
    const value = decodeURIComponent(sessionCookie.split('=')[1])
    return JSON.parse(value)
  } catch {
    return null
  }
}

function clearSessionCookie() {
  document.cookie = 'taskr-session=; path=/; max-age=0'
}

interface SessionActions {
  selectRole: (role: Role) => void
  login: (userId: string) => void
  loginFailed: (error: string) => void
  logout: () => void
  setAuthenticating: (value: boolean) => void
  clearError: () => void
}

interface SessionStore {
  isAuthenticated: boolean
  role: Role | null
  userId: string | null
  isAuthenticating: boolean
  authError: string | null
  actions: SessionActions
}

export const useSessionStore = create<SessionStore>((set, get) => {
  const session = getSessionCookie()
  return {
    isAuthenticated: !!session,
    role: session?.role ?? null,
    userId: session?.userId ?? null,
    isAuthenticating: false,
    authError: null,
    actions: {
      selectRole: (role) => set({ role, authError: null }),
      login: (userId) => {
        const { role } = get()
        if (!role) return
        setSessionCookie(userId, role)
        set({
          isAuthenticated: true,
          userId,
          isAuthenticating: false,
          authError: null,
        })
      },
    loginFailed: (error) =>
      set({
        isAuthenticated: false,
        isAuthenticating: false,
        authError: error,
      }),
    logout: () => {
      clearSessionCookie()
      set({
        isAuthenticated: false,
        role: null,
        userId: null,
        isAuthenticating: false,
        authError: null,
      })
    },
    setAuthenticating: (value) => set({ isAuthenticating: value }),
    clearError: () => set({ authError: null }),
  },
}})
