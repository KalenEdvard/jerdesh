import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Если email confirmation отключён в Supabase — сразу логиним
  // data.session будет не null
  const confirmed = !!data.session

  const response = NextResponse.json({ ok: true, confirmed })
  cookiesToSet.forEach(({ name: n, value, options }) => {
    response.cookies.set(n, value, {
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
