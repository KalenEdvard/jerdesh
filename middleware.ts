import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

const PROTECTED = ['/profile', '/create']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token || !verifyToken(token)) {
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
