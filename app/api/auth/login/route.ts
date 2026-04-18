import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const msg = error.message === 'Invalid login credentials'
      ? 'Неверный email или пароль'
      : error.message === 'Email not confirmed'
        ? 'EMAIL_NOT_CONFIRMED'
        : error.message
    return NextResponse.json({ error: msg }, { status: 401 })
  }

  // Загружаем профиль
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  const userProfile = profile ?? {
    id: data.user.id,
    name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Пользователь',
    email: data.user.email,
    city: 'Москва',
    rating: 5.0,
    ads_count: 0,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ profile: userProfile })
}
