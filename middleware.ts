import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/profile', '/create']
const COOKIE_NAME = 'auth_token'

function hasValidToken(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.userId || !payload.email) return false
    if (payload.exp && payload.exp < Date.now() / 1000) return false
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !hasValidToken(token)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('auth', '1')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)'],
}
