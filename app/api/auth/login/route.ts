import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { verifyPassword, createToken, COOKIE_NAME, COOKIE_OPTS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
  }

  const user = await queryOne<any>(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase().trim()]
  )

  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
  }

  const token = createToken({ userId: user.id, email: user.email })

  const profile = {
    id: user.id, name: user.name, email: user.email,
    city: user.city, rating: user.rating, ads_count: user.ads_count,
    avatar_url: user.avatar_url, phone: user.phone,
    whatsapp: user.whatsapp, telegram: user.telegram, vk: user.vk,
    created_at: user.created_at,
  }

  const response = NextResponse.json({ profile })
  response.cookies.set(COOKIE_NAME, token, COOKIE_OPTS)
  return response
}
