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

  const { title, description, category, price, metro, city, phone, photos, isUrgent } = await request.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Введите заголовок' }, { status: 400 })

  try {
    const [listing] = await query(
      `INSERT INTO listings (user_id, title, description, category, price, metro, city, phone, photos, is_urgent, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active') RETURNING id`,
      [payload.userId, title.trim(), description || '', category || 'housing',
       price ? parseInt(price) : null, metro || null, city || 'Москва',
       phone || null, photos || [], isUrgent || false]
    )
    await query('UPDATE users SET ads_count = ads_count + 1 WHERE id = $1', [payload.userId])
    return NextResponse.json({ id: listing.id })
  } catch (e: any) {
    console.error('[create]', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
