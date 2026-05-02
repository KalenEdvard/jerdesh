import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { queryOne, query } from '@/lib/db'
import { sendResetEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Введите email' }, { status: 400 })

  const user = await queryOne<any>(
    'SELECT id, name, email FROM users WHERE email=$1',
    [email.toLowerCase().trim()]
  )

  // Всегда возвращаем OK (не раскрываем есть ли такой email)
  if (!user) return NextResponse.json({ ok: true })

  const token = randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 час

  await query(
    'UPDATE users SET reset_token=$1, reset_expires=$2 WHERE id=$3',
    [token, expires, user.id]
  )

  sendResetEmail(user.email, user.name, token).catch(e =>
    console.error('[mailer reset]', e.message)
  )

  return NextResponse.json({ ok: true })
}
