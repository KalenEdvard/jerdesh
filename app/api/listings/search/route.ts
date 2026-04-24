import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  const query = searchParams.get('query') || ''
  const metro = searchParams.get('metro') || ''
  const city = searchParams.get('city') || 'Москва'
  const sort = searchParams.get('sort') || 'new'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let q = supabase
    .from('listings')
    .select('id,title,description,category,price,metro,city,photos,views,is_urgent,is_premium,status,created_at,user:users(id,name,avatar_url,rating)')
    .eq('status', 'active')

  if (category && category !== 'all') q = q.eq('category', category)
  if (query) {
    const safe = query.replace(/[%_(),"']/g, ' ').trim()
    if (safe) q = q.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)
  }
  if (metro) q = q.eq('metro', metro)
  if (city) q = q.eq('city', city)

  if (sort === 'pa') q = q.order('price', { ascending: true })
  else if (sort === 'pd') q = q.order('price', { ascending: false })
  else if (sort === 'pop') q = q.order('views', { ascending: false })
  else if (sort === 'old') q = q.order('created_at', { ascending: true })
  else q = q.order('is_premium', { ascending: false }).order('created_at', { ascending: false })

  q = q.limit(48)

  const { data, error } = await q

  if (error) {
    console.error('[listings/search] error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}
