import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await query('UPDATE listings SET views = views + 1 WHERE id=$1', [id])
  } catch {}
  return NextResponse.json({ ok: true })
}
