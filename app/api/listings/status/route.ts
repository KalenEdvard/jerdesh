import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query, queryOne } from '@/lib/db'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { z } from 'zod'

const StatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['active', 'archived', 'deleted']),
})

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const body = await request.json()
  const parsed = StatusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })

  const { id, status } = parsed.data

  try {
    const prev = await queryOne<{ status: string; user_id: string }>(
      'SELECT status, user_id FROM listings WHERE id=$1 AND user_id=$2',
      [id, payload.userId]
    )
    if (!prev) return NextResponse.json({ error: 'Объявление не найдено' }, { status: 404 })

    await query('UPDATE listings SET status=$1, updated_at=NOW() WHERE id=$2', [status, id])

    // Корректируем ads_count: active → non-active = -1, non-active → active = +1
    if (prev.status === 'active' && status !== 'active') {
      await query('UPDATE users SET ads_count = GREATEST(ads_count - 1, 0) WHERE id=$1', [payload.userId])
    } else if (prev.status !== 'active' && status === 'active') {
      await query('UPDATE users SET ads_count = ads_count + 1 WHERE id=$1', [payload.userId])
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
