import { createClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Жердеш — Объявления кыргызов в России',
  description: 'Сайт объявлений для кыргызской диаспоры в России. Сдам жильё, работа, услуги, продажа товаров рядом с вами.',
  keywords: ['объявления','кыргызы','Москва','жильё','работа','Жердеш'],
  openGraph: {
    title: 'Жердеш — Объявления кыргызов в России',
    description: 'Жильё, работа, услуги — всё в одном месте для кыргызской диаспоры',
    url: 'https://zherdesh.ru',
    siteName: 'Жердеш',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://zherdesh.ru' },
}

const IS_SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; metro?: string }>
}) {
  const { q, cat, metro } = await searchParams

  if (!IS_SUPABASE_CONFIGURED) {
    return <HomeClient listings={[]} totalCount={0} />
  }

  const supabase = await createClient()

  const now = new Date().toISOString()

  let query = supabase
    .from('listings')
    .select('*, user:users(*)')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)

  if (cat && cat !== 'all') query = query.eq('category', cat)
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  if (metro) query = query.eq('metro', metro)

  query = query.order('is_premium', { ascending: false }).order('created_at', { ascending: false }).limit(48)

  const { data: listings } = await query
  const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true)

  return <HomeClient listings={listings || []} totalCount={count || 0} />
}
