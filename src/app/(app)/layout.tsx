'use client'

import { useSessionStore } from '@/stores/session-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-12 items-center border-b border-border-subtle bg-surface-low px-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          TASKR
        </span>
      </header>
      <main className="flex flex-1">{children}</main>
    </div>
  )
}
