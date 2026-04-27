import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  const q = searchParams.get('query') || ''
  const metro = searchParams.get('metro') || ''
  const city = searchParams.get('city') || 'Москва'
  const sort = searchParams.get('sort') || 'new'

  const conditions = ["l.status = 'active'"]
  const params: any[] = []

  if (city) { params.push(city); conditions.push(`l.city = $${params.length}`) }
  if (category && category !== 'all') { params.push(category); conditions.push(`l.category = $${params.length}`) }
  if (metro) { params.push(metro); conditions.push(`l.metro = $${params.length}`) }
  if (q?.trim()) {
    const safe = q.trim().slice(0, 100)
    params.push(`%${safe}%`)
    conditions.push(`(l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`)
  }

  const where = conditions.join(' AND ')
  const orderBy = sort === 'pa' ? 'l.price ASC NULLS LAST'
    : sort === 'pd' ? 'l.price DESC NULLS LAST'
    : sort === 'pop' ? 'l.views DESC'
    : sort === 'old' ? 'l.created_at ASC'
    : 'l.is_premium DESC, l.created_at DESC'

  try {
    const rows = await query(
      `SELECT l.id, l.title, l.description, l.category, l.price, l.metro, l.city,
              l.photos, l.views, l.is_urgent, l.is_premium, l.status, l.created_at,
              json_build_object('id', u.id, 'name', u.name, 'avatar_url', u.avatar_url, 'rating', u.rating) as user
       FROM listings l
       LEFT JOIN users u ON u.id = l.user_id
       WHERE ${where}
       ORDER BY ${orderBy}
       LIMIT 48`,
      params
    )
    return NextResponse.json(rows)
  } catch (e: any) {
    console.error('[search]', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
