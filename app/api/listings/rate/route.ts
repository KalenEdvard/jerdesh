import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { listing_id, rating, comment } = await request.json()
  if (!listing_id || !rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })

  const listing = await queryOne<{ user_id: string }>(
    'SELECT user_id FROM listings WHERE id=$1 AND status=$2',
    [listing_id, 'active']
  )
  if (!listing) return NextResponse.json({ error: 'Объявление не найдено' }, { status: 404 })
  if (listing.user_id === payload.userId)
    return NextResponse.json({ error: 'Нельзя оценить своё объявление' }, { status: 400 })

  await query(
    `INSERT INTO listing_ratings (listing_id, rater_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (listing_id, rater_id) DO UPDATE SET
       rating=$3,
       comment=CASE WHEN $4 != '' THEN $4 ELSE listing_ratings.comment END,
       created_at=NOW()`,
    [listing_id, payload.userId, rating, comment?.trim() || '']
  )

  const [avg] = await query<{ avg: string }>(
    `SELECT AVG(lr.rating)::numeric(3,1) as avg
     FROM listing_ratings lr JOIN listings l ON l.id=lr.listing_id
     WHERE l.user_id=$1`,
    [listing.user_id]
  )
  if (avg?.avg) await query('UPDATE users SET rating=$1 WHERE id=$2', [Number(avg.avg), listing.user_id])

  const [stats] = await query<{ avg: string; count: string }>(
    `SELECT AVG(rating)::numeric(3,1) as avg, COUNT(*) as count FROM listing_ratings WHERE listing_id=$1`,
    [listing_id]
  )

  // Комментарии к объявлению
  const comments = await query<any>(
    `SELECT lr.rating, lr.comment, lr.created_at,
            json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as rater
     FROM listing_ratings lr JOIN users u ON u.id=lr.rater_id
     WHERE lr.listing_id=$1 AND lr.comment!='' ORDER BY lr.created_at DESC`,
    [listing_id]
  )

  return NextResponse.json({
    success: true,
    myRating: rating,
    myComment: comment?.trim() || '',
    avgRating: Number(stats?.avg || 0),
    ratingCount: Number(stats?.count || 0),
    comments,
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const listing_id = searchParams.get('listing_id')
  if (!listing_id) return NextResponse.json({ avgRating: 0, ratingCount: 0, myRating: null, myComment: '', comments: [] })

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  const payload = token ? verifyToken(token) : null

  const [stats] = await query<{ avg: string; count: string }>(
    `SELECT AVG(rating)::numeric(3,1) as avg, COUNT(*) as count FROM listing_ratings WHERE listing_id=$1`,
    [listing_id]
  )

  let myRating = null, myComment = ''
  if (payload) {
    const existing = await queryOne<{ rating: number; comment: string }>(
      'SELECT rating, comment FROM listing_ratings WHERE listing_id=$1 AND rater_id=$2',
      [listing_id, payload.userId]
    )
    myRating = existing?.rating ?? null
    myComment = existing?.comment ?? ''
  }

  const comments = await query<any>(
    `SELECT lr.rating, lr.comment, lr.created_at,
            json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as rater
     FROM listing_ratings lr JOIN users u ON u.id=lr.rater_id
     WHERE lr.listing_id=$1 AND lr.comment!='' ORDER BY lr.created_at DESC`,
    [listing_id]
  )

  return NextResponse.json({
    avgRating: Number(stats?.avg || 0),
    ratingCount: Number(stats?.count || 0),
    myRating,
    myComment,
    comments,
  })
}
