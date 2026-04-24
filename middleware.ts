import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/profile', '/create']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ВАЖНО: supabaseResponse пересоздаётся внутри setAll, чтобы cookies
  // были записаны и в request, и в response — иначе токен не обновится
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // Сначала пишем в request (для последующих server-side читалок)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Пересоздаём response с обновлённым request
          supabaseResponse = NextResponse.next({ request })
          // Пишем в response с принудительным maxAge 1 год
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge: 60 * 60 * 24 * 365,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          )
        },
      },
    }
  )

  // getUser() обращается к Supabase и обновляет токен если нужно
  const { data: { user } } = await supabase.auth.getUser()

  // Защита приватных маршрутов
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('auth', '1')
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Запускаем на всех страницах кроме статики и api
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
