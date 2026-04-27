'use client'
import { useEffect } from 'react'
import { useStore } from '@/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()

  useEffect(() => {
    fetch('/api/profile/me')
      .then(res => res.ok ? res.json() : null)
      .then(profile => { if (profile) setUser(profile) })
  }, [setUser])

  return <>{children}</>
}
