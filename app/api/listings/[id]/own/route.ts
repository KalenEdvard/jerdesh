import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/db'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json(null, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json(null, { status: 401 })

  const listing = await queryOne('SELECT * FROM listings WHERE id=$1 AND user_id=$2', [id, payload.userId])
  if (!listing) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(listing)
}
