'use client'
import { useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'
import { useStore } from '@/store'

const IS_SUPABASE_CONFIGURED = (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

async function fetchMyProfile() {
  const res = await fetch('/api/profile/me')
  if (!res.ok) return null
  return res.json()
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return

    // Восстанавливаем сессию через серверный API — надёжнее чем браузерный клиент
    fetchMyProfile().then(profile => {
      if (profile) setUser(profile)
    })

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      if (session?.user) {
        const profile = await fetchMyProfile()
        if (profile) setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
