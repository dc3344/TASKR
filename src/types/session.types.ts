export type Role = 'admin' | 'operator'

export interface SessionState {
  isAuthenticated: boolean
  role: Role | null
  userId: string | null
  isAuthenticating: boolean
  authError: string | null
}
