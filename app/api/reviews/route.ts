import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { reviewed_id, listing_id, rating, comment } = await request.json()

  if (!reviewed_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
  }
  if (reviewed_id === user.id) {
    return NextResponse.json({ error: 'Нельзя оценить себя' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Upsert: один отзыв от reviewer на reviewed (Avito-модель)
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', user.id)
    .eq('reviewed_id', reviewed_id)
    .single()

  let data, error
  if (existing) {
    const res = await supabase
      .from('reviews')
      .update({ rating, comment: comment?.trim() || '', listing_id: listing_id || null })
      .eq('id', existing.id)
      .select('*, reviewer:users(name,avatar_url)')
      .single()
    data = res.data; error = res.error
  } else {
    const res = await supabase
      .from('reviews')
      .insert({ reviewer_id: user.id, reviewed_id, listing_id: listing_id || null, rating, comment: comment?.trim() || '' })
      .select('*, reviewer:users(name,avatar_url)')
      .single()
    data = res.data; error = res.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Пересчитываем средний рейтинг
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewed_id', reviewed_id)

  if (allReviews?.length) {
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    await supabase.from('users').update({ rating: Math.round(avg * 10) / 10 }).eq('id', reviewed_id)
  }

  return NextResponse.json({ ...data, isUpdate: !!existing })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reviewed_id = searchParams.get('reviewed_id')
  const reviewer_id = searchParams.get('reviewer_id')

  if (!reviewed_id) return NextResponse.json([], { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let q = supabase
    .from('reviews')
    .select('*, reviewer:users(id,name,avatar_url)')
    .eq('reviewed_id', reviewed_id)
    .order('created_at', { ascending: false })

  const { data } = await q

  // If reviewer_id provided, also return their existing review
  let myReview = null
  if (reviewer_id) {
    myReview = data?.find(r => (r.reviewer as any)?.id === reviewer_id || r.reviewer_id === reviewer_id) || null
  }

  return NextResponse.json({ reviews: data || [], myReview })
}
