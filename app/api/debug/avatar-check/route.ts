import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const result: Record<string, any> = {}

  // 1. Проверяем env vars
  result.url = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING'
  result.anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING'
  result.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? `OK (starts with: ${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 12)}...)`
    : 'MISSING ❌'

  // 2. Проверяем сессию
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    result.session = user ? `OK (user: ${user.email})` : 'NO SESSION'
  } catch (e: any) {
    result.session = `ERROR: ${e.message}`
  }

  // 3. Проверяем доступ к bucket
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data, error } = await admin.storage.getBucket('listings')
      result.bucket = error ? `ERROR: ${error.message}` : `OK (public: ${data?.public})`
    } catch (e: any) {
      result.bucket = `CRASH: ${e.message}`
    }
  } else {
    result.bucket = 'SKIPPED (no service key)'
  }

  return NextResponse.json(result)
}
