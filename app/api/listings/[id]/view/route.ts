import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase.from('listings').select('views').eq('id', id).single()
  if (data) {
    await supabase.from('listings').update({ views: (data.views || 0) + 1 }).eq('id', id)
  }
  return NextResponse.json({ ok: true })
}
