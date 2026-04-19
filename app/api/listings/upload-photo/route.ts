import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
      return NextResponse.json({ error: 'SERVICE_KEY_MISSING' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey
    )

    const { error: uploadError } = await admin.storage
      .from('listings')
      .upload(path, buffer, { upsert: false, contentType: file.type })

    if (uploadError) {
      console.error('[upload-photo]', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage.from('listings').getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch (e: any) {
    console.error('[upload-photo crash]', e)
    return NextResponse.json({ error: e?.message || 'Ошибка сервера' }, { status: 500 })
  }
}
