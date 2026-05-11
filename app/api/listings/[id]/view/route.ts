import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`view:${ip}:${id}`, 1, 86_400_000)) {
    return NextResponse.json({ ok: true })
  }
  try {
    await query('UPDATE listings SET views = views + 1 WHERE id=$1', [id])
  } catch {}
  return NextResponse.json({ ok: true })
}
