import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, verifyPassword, hashPassword, COOKIE_NAME } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { currentPassword, newPassword } = await request.json()
  if (!currentPassword || !newPassword)
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  if (newPassword.length < 6)
    return NextResponse.json({ error: 'Новый пароль минимум 6 символов' }, { status: 400 })

  const user = await queryOne<any>('SELECT password FROM users WHERE id=$1', [payload.userId])
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })

  const valid = await verifyPassword(currentPassword, user.password)
  if (!valid) return NextResponse.json({ error: 'Текущий пароль неверный' }, { status: 400 })

  const hashed = await hashPassword(newPassword)
  await query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, payload.userId])

  return NextResponse.json({ ok: true })
}
