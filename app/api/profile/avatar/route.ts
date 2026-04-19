import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
  const cookieStore = await cookies()

  // Проверяем сессию через anon key
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Файл больше 5MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const path = `avatars/${user.id}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Используем service role key для обхода Storage RLS
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'SERVICE_KEY_MISSING: добавь SUPABASE_SERVICE_ROLE_KEY в Vercel env' }, { status: 500 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  )

  const { error: uploadError } = await admin.storage
    .from('listings')
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (uploadError) {
    console.error('[avatar upload]', uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage.from('listings').getPublicUrl(path)

  await admin.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)

  return NextResponse.json({ url: publicUrl })
  } catch (e: any) {
    console.error('[avatar route crash]', e)
    return NextResponse.json({ error: e?.message || 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
