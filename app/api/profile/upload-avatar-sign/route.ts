import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { getUploadUrl } from '@/lib/s3'
import { query } from '@/lib/db'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { fileType } = await request.json()
  if (!ALLOWED.includes(fileType)) return NextResponse.json({ error: 'Неподдерживаемый формат' }, { status: 400 })

  const ext = fileType === 'image/png' ? 'png' : fileType === 'image/webp' ? 'webp' : 'jpg'
  const path = `avatars/${payload.userId}.${ext}`

  try {
    const { signedUrl, publicUrl } = await getUploadUrl(path, fileType)
    await query('UPDATE users SET avatar_url=$1 WHERE id=$2', [publicUrl, payload.userId])
    return NextResponse.json({ signedUrl, publicUrl })
  } catch (e: any) {
    console.error('[upload-avatar]', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
