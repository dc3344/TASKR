'use client'

import type { Role } from '@/types/session.types'

interface RoleSelectorProps {
  selectedRole: Role | null
  onSelectRole: (role: Role) => void
  disabled: boolean
}

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'admin', label: 'ADMIN', description: 'Full access — command view' },
  { value: 'operator', label: 'OPERATOR', description: 'Task execution — my tasks' },
]

export function RoleSelector({
  selectedRole,
  onSelectRole,
  disabled,
}: RoleSelectorProps) {
  return (
    <fieldset disabled={disabled} className="space-y-3">
      <legend className="mb-3 text-center text-xs uppercase tracking-widest text-text-secondary">
        SELECT ROLE
      </legend>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Role selection">
        {ROLES.map(({ value, label, description }) => {
          const isSelected = selectedRole === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectRole(value)}
              className={`flex flex-col items-center gap-1 p-4 transition-colors ${
                isSelected
                  ? 'bg-accent/10 border border-accent text-accent'
                  : 'bg-surface border border-border-subtle text-text-secondary hover:bg-surface-high hover:text-text-primary'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-sm font-bold tracking-wider">{label}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">
                {description}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
