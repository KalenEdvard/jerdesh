import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/db'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json(null, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json(null, { status: 401 })

  const user = await queryOne<any>(
    'SELECT id, name, email, city, rating, ads_count, avatar_url, phone, whatsapp, telegram, vk, created_at FROM users WHERE id = $1',
    [payload.userId]
  )

  if (!user) return NextResponse.json(null, { status: 401 })
  return NextResponse.json(user)
}
