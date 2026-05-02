import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Токен не указан' }, { status: 400 })

  const user = await queryOne<any>(
    'SELECT id FROM users WHERE reset_token=$1 AND reset_expires > NOW()',
    [token]
  )

  if (!user) return NextResponse.json({ error: 'Ссылка недействительна или истекла' }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()
  if (!token || !password) return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Минимум 6 символов' }, { status: 400 })

  const user = await queryOne<any>(
    'SELECT id FROM users WHERE reset_token=$1 AND reset_expires > NOW()',
    [token]
  )
  if (!user) return NextResponse.json({ error: 'Ссылка недействительна или истекла' }, { status: 400 })

  const hashed = await hashPassword(password)
  await query(
    'UPDATE users SET password=$1, reset_token=NULL, reset_expires=NULL WHERE id=$2',
    [hashed, user.id]
  )

  return NextResponse.json({ ok: true })
}
