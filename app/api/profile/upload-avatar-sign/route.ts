import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase env не настроены на сервере' }, { status: 500 })
    }

    const cookieStore = await cookies()

    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const { fileType } = await request.json()

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: 'Неподдерживаемый формат' }, { status: 400 })
    }

    const ext = fileType.split('/')[1] || 'jpg'
    const path = `avatars/${user.id}.${ext}`

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error } = await supabaseAdmin.storage
      .from('listings')
      .createSignedUploadUrl(path)

    if (error) {
      console.error('[upload-avatar-sign] error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ path: data.path, token: data.token })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка сервера'
    console.error('[upload-avatar-sign] crash:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
