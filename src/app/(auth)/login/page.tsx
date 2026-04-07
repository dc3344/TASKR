'use client'

import { useSessionStore } from '@/stores/session-store'
import { RoleSelector } from './_components/role-selector'
import { PinPad } from './_components/pin-pad'
import { DEMO_PIN } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'

export default function LoginPage() {
  const role = useSessionStore((s) => s.role)
  const isAuthenticating = useSessionStore((s) => s.isAuthenticating)
  const authError = useSessionStore((s) => s.authError)
  const { selectRole, login, loginFailed, setAuthenticating } =
    useSessionStore((s) => s.actions)
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const mountedRef = useRef(true)
  const pendingRef = useRef(false)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function handlePinComplete(pin: string) {
    if (pendingRef.current) return
    
    pendingRef.current = true
    setAuthenticating(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return
      
      if (pin === DEMO_PIN) {
        const userId = role === 'admin' ? 'user-admin-1' : 'user-op-1'
        login(userId)
        router.push(role === 'admin' ? '/board' : '/my-tasks')
      } else {
        loginFailed('AUTHENTICATION FAILED — INVALID PIN')
      }
      pendingRef.current = false
    }, 300)
  }

  return (
    <div className="w-full max-w-md p-8">
      <header className="mb-8 text-center">
        <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-text-secondary mb-2">
          SECURE ACCESS TERMINAL
        </h1>
        <p className="text-2xl font-bold tracking-wider text-accent">TASKR</p>
      </header>

      <RoleSelector
        selectedRole={role}
        onSelectRole={selectRole}
        disabled={isAuthenticating}
      />

      {role && (
        <div className="mt-8">
          <p className="mb-4 text-center text-xs uppercase tracking-widest text-text-secondary">
            ENTER PIN TO AUTHENTICATE
          </p>
          <PinPad
            onComplete={handlePinComplete}
            disabled={isAuthenticating}
            error={authError}
          />
          {authError && (
            <p
              role="alert"
              className="mt-4 text-center text-xs uppercase tracking-wider text-error"
            >
              {authError}
            </p>
          )}
          <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-text-disabled">
            DEMO PIN: 000000
          </p>
        </div>
      )}
    </div>
  )
}
