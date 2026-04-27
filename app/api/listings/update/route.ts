import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { id, title, description, category, price, metro, city, phone, photos, isUrgent } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID обязателен' }, { status: 400 })

  try {
    await query(
      `UPDATE listings SET title=$1, description=$2, category=$3, price=$4, metro=$5,
       city=$6, phone=$7, photos=$8, is_urgent=$9, updated_at=NOW()
       WHERE id=$10 AND user_id=$11`,
      [title, description || '', category, price ? parseInt(price) : null,
       metro || null, city || 'Москва', phone || null, photos || [], isUrgent || false, id, payload.userId]
    )
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
