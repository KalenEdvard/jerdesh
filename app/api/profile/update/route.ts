import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { name, phone, whatsapp, telegram, vk, city, avatar_url } = await request.json()

  await query(
    `UPDATE users SET
      name=COALESCE($1, name),
      phone=COALESCE($2, phone),
      whatsapp=COALESCE($3, whatsapp),
      telegram=COALESCE($4, telegram),
      vk=COALESCE($5, vk),
      city=COALESCE($6, city),
      avatar_url=COALESCE($7, avatar_url),
      updated_at=NOW()
     WHERE id=$8`,
    [name || null, phone || null, whatsapp || null, telegram || null,
     vk || null, city || null, avatar_url || null, payload.userId]
  )

  return NextResponse.json({ ok: true })
}
