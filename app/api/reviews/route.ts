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

  const { reviewed_id, listing_id, rating, comment } = await request.json()
  if (!reviewed_id || !rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
  if (reviewed_id === payload.userId) return NextResponse.json({ error: 'Нельзя оценить себя' }, { status: 400 })

  const existing = await queryOne<any>('SELECT id FROM reviews WHERE reviewer_id=$1 AND reviewed_id=$2', [payload.userId, reviewed_id])

  let row
  if (existing) {
    // Обновляем рейтинг всегда, комментарий — только если новый написан
    const [r] = await query<any>(
      `UPDATE reviews SET
         rating=$1,
         comment = CASE WHEN $2 != '' THEN $2 ELSE comment END,
         listing_id=COALESCE($3, listing_id)
       WHERE id=$4
       RETURNING *, (SELECT json_build_object('id',id,'name',name,'avatar_url',avatar_url) FROM users WHERE id=$5) as reviewer`,
      [rating, comment?.trim() || '', listing_id || null, existing.id, payload.userId]
    )
    row = { ...r, isUpdate: true }
  } else {
    const [r] = await query<any>(
      `INSERT INTO reviews (reviewer_id, reviewed_id, listing_id, rating, comment) VALUES ($1,$2,$3,$4,$5)
       RETURNING *, (SELECT json_build_object('id',id,'name',name,'avatar_url',avatar_url) FROM users WHERE id=$1) as reviewer`,
      [payload.userId, reviewed_id, listing_id || null, rating, comment?.trim() || '']
    )
    row = { ...r, isUpdate: false }
  }

  const [avg] = await query<any>('SELECT AVG(rating) as avg FROM reviews WHERE reviewed_id=$1', [reviewed_id])
  if (avg?.avg) await query('UPDATE users SET rating=$1 WHERE id=$2', [Math.round(Number(avg.avg) * 10) / 10, reviewed_id])

  return NextResponse.json(row)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reviewed_id = searchParams.get('reviewed_id')
  if (!reviewed_id) return NextResponse.json({ reviews: [] })

  const reviews = await query<any>(
    `SELECT r.*, json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as reviewer
     FROM reviews r LEFT JOIN users u ON u.id=r.reviewer_id
     WHERE r.reviewed_id=$1 ORDER BY r.created_at DESC`,
    [reviewed_id]
  )
  return NextResponse.json({ reviews })
}
