import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'
import { sendConfirmEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const user = await queryOne<any>(
    'SELECT id, name, email, email_confirmed FROM users WHERE id=$1',
    [payload.userId]
  )
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
  if (user.email_confirmed) return NextResponse.json({ error: 'Email уже подтверждён' }, { status: 400 })

  const confirmToken = randomUUID()
  const confirmExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await query(
    'UPDATE users SET confirm_token=$1, confirm_expires=$2 WHERE id=$3',
    [confirmToken, confirmExpires, user.id]
  )

  sendConfirmEmail(user.email, user.name, confirmToken).catch(e =>
    console.error('[mailer]', e.message)
  )

  return NextResponse.json({ ok: true })
}
