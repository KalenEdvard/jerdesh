'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useStore } from '@/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()

  useEffect(() => {
    const supabase = createClient()

    // Get current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        if (profile) setUser(profile)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        if (profile) setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
