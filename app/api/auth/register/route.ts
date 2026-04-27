import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { hashPassword, createToken, COOKIE_NAME, COOKIE_OPTS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Пароль минимум 6 символов' }, { status: 400 })
  }

  const existing = await queryOne('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()])
  if (existing) {
    return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 409 })
  }

  const hashedPassword = await hashPassword(password)
  const [user] = await query<any>(
    'INSERT INTO users (name, email, password, city) VALUES ($1, $2, $3, $4) RETURNING *',
    [name.trim(), email.toLowerCase().trim(), hashedPassword, 'Москва']
  )

  const token = createToken({ userId: user.id, email: user.email })

  const profile = {
    id: user.id, name: user.name, email: user.email,
    city: user.city, rating: user.rating, ads_count: user.ads_count,
    avatar_url: user.avatar_url, created_at: user.created_at,
  }

  const response = NextResponse.json({ ok: true, confirmed: true, profile })
  response.cookies.set(COOKIE_NAME, token, COOKIE_OPTS)
  return response
}
