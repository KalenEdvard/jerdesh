'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useStore } from '@/store'

const IS_SUPABASE_CONFIGURED = (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return

    const supabase = createClient()

    // getSession() читает куку локально — не требует сетевого запроса к Supabase
    // Безопасность: middleware и серверные компоненты проверяют сессию на сервере
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        if (profile) setUser(profile)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
