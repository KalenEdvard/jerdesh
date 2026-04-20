import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, category, price, metro, city, phone, photos, isUrgent } = body

    if (!id) return NextResponse.json({ error: 'Нет ID объявления' }, { status: 400 })
    if (!title?.trim()) return NextResponse.json({ error: 'Введите заголовок' }, { status: 400 })

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin
      .from('listings')
      .update({
        title: title.trim(),
        description: description || null,
        category: category || 'housing',
        price: price ? parseInt(price, 10) : null,
        metro: metro || null,
        city: city || 'Москва',
        phone: phone || null,
        photos: photos || [],
        is_urgent: isUrgent || false,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[listings/update] error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Ошибка сервера'
    console.error('[listings/update] crash:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
