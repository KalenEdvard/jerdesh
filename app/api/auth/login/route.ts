import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
  }

  // Собираем куки которые Supabase хочет выставить
  const cookiesToSet: { name: string; value: string; options: any }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => { cookiesToSet.push(...list) },
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

  const response = NextResponse.json({ profile: userProfile })
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, {
      ...options,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    })
  })

  return response
}
