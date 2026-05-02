import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'
import { verifyToken, verifyPassword, COOKIE_NAME } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'
import { sendConfirmEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { newEmail, currentPassword } = await request.json()
  if (!newEmail || !currentPassword)
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newEmail))
    return NextResponse.json({ error: 'Неверный формат email' }, { status: 400 })

  const user = await queryOne<any>('SELECT id, name, password, email FROM users WHERE id=$1', [payload.userId])
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })

  const valid = await verifyPassword(currentPassword, user.password)
  if (!valid) return NextResponse.json({ error: 'Неверный пароль' }, { status: 400 })

  const existing = await queryOne('SELECT id FROM users WHERE email=$1 AND id!=$2', [newEmail.toLowerCase().trim(), user.id])
  if (existing) return NextResponse.json({ error: 'Этот email уже используется' }, { status: 409 })

  const confirmToken = randomUUID()
  const confirmExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await query(
    `UPDATE users SET email=$1, email_confirmed=FALSE, confirm_token=$2, confirm_expires=$3, updated_at=NOW() WHERE id=$4`,
    [newEmail.toLowerCase().trim(), confirmToken, confirmExpires, user.id]
  )

  sendConfirmEmail(newEmail, user.name, confirmToken).catch(e =>
    console.error('[mailer]', e.message)
  )

  return NextResponse.json({ ok: true })
}
