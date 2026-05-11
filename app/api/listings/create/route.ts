import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query, queryOne } from '@/lib/db'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { z } from 'zod'

const CreateSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional().default(''),
  category: z.enum(['housing', 'findhousing', 'jobs', 'sell', 'services']).default('services'),
  price: z.number().int().nonnegative().optional().nullable(),
  metro: z.string().max(100).optional().nullable(),
  city: z.string().max(100).default('Москва'),
  phone: z.string().max(30).optional().nullable(),
  photos: z.array(z.string().url()).max(10).optional().default([]),
  isUrgent: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const userRow = await queryOne<any>('SELECT email_confirmed FROM users WHERE id=$1', [payload.userId])
  if (userRow?.email_confirmed === false)
    return NextResponse.json({ error: 'Email дарегиңизди тастыктаңыз' }, { status: 403 })

  const body = await request.json()
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Неверные данные' }, { status: 400 })

  const { title, description, category, price, metro, city, phone, photos, isUrgent } = parsed.data

  const S3_BASE = process.env.S3_PUBLIC_URL ?? 'https://s3.timeweb.cloud/mekendesh-photo'
  const safePhotos = photos.filter(u => u.startsWith(S3_BASE))

  try {
    const [listing] = await query(
      `INSERT INTO listings (user_id, title, description, category, price, metro, city, phone, photos, is_urgent, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active') RETURNING id`,
      [payload.userId, title.trim(), description, category,
       price ?? null, metro ?? null, city,
       phone ?? null, safePhotos, isUrgent]
    )
    await query('UPDATE users SET ads_count = ads_count + 1 WHERE id = $1', [payload.userId])
    return NextResponse.json({ id: listing.id })
  } catch (e: any) {
    console.error('[create]', e.message)
    return NextResponse.json({ error: 'Ошибка при создании объявления' }, { status: 500 })
  }
}
