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

  // Один отзыв на одно объявление
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', user.id)
    .eq('listing_id', listing_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Вы уже оценили это объявление' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ reviewer_id: user.id, reviewed_id, listing_id, rating, comment: comment?.trim() || '' })
    .select('*, reviewer:users(name,avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Пересчитываем средний рейтинг пользователя
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewed_id', reviewed_id)

  if (allReviews?.length) {
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    await supabase.from('users').update({ rating: Math.round(avg * 10) / 10 }).eq('id', reviewed_id)
  }

  return NextResponse.json(data)
}
