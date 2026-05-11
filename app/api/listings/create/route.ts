import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query, queryOne } from '@/lib/db'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const userRow = await queryOne<any>('SELECT email_confirmed FROM users WHERE id=$1', [payload.userId])
  if (userRow?.email_confirmed === false)
    return NextResponse.json({ error: 'Email дарегиңизди тастыктаңыз' }, { status: 403 })

  const { title, description, category, price, metro, city, phone, photos, isUrgent } = await request.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Введите заголовок' }, { status: 400 })

  const S3_BASE = process.env.S3_PUBLIC_URL ?? 'https://s3.timeweb.cloud/mekendesh-photo'
  const safePhotos = Array.isArray(photos)
    ? photos.filter((u: unknown) => typeof u === 'string' && u.startsWith(S3_BASE)).slice(0, 10)
    : []

  try {
    const [listing] = await query(
      `INSERT INTO listings (user_id, title, description, category, price, metro, city, phone, photos, is_urgent, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active') RETURNING id`,
      [payload.userId, title.trim(), description || '', category || 'housing',
       price ? parseInt(price) : null, metro || null, city || 'Москва',
       phone || null, safePhotos, isUrgent || false]
    )
    await query('UPDATE users SET ads_count = ads_count + 1 WHERE id = $1', [payload.userId])
    return NextResponse.json({ id: listing.id })
  } catch (e: any) {
    console.error('[create]', e.message)
    return NextResponse.json({ error: 'Ошибка при создании объявления' }, { status: 500 })
  }
}
