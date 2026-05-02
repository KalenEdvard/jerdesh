import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/?confirm=invalid', request.url))

  const user = await queryOne<any>(
    `SELECT id FROM users WHERE confirm_token=$1 AND confirm_expires > NOW() AND email_confirmed=FALSE`,
    [token]
  )

  if (!user) return NextResponse.redirect(new URL('/?confirm=invalid', request.url))

  await query(
    `UPDATE users SET email_confirmed=TRUE, confirm_token=NULL, confirm_expires=NULL WHERE id=$1`,
    [user.id]
  )

  return NextResponse.redirect(new URL('/profile?confirm=ok', request.url))
}
