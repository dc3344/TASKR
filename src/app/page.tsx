'use client'

import { useSessionStore } from '@/stores/session-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)
  const role = useSessionStore((s) => s.role)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    } else if (!role) {
      router.replace('/login')
    } else if (role === 'admin') {
      router.replace('/board')
    } else {
      router.replace('/my-tasks')
    }
  }, [isAuthenticated, role, router])

  return null
}
