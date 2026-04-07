import type { Role } from './session.types'

export interface User {
  id: string
  name: string
  role: Role
  unitIds: string[]
}

export interface Unit {
  id: string
  name: string
}
