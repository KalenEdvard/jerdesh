import { createClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import HomeClient from './HomeClient'

// Страница статична — HTML отдаётся мгновенно с CDN
// Объявления грузятся клиентски через useEffect в HomeClient
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Мекендеш — Объявления кыргызов в России',
  description: 'Сайт объявлений для кыргызской диаспоры в России. Сдам жильё, работа, услуги, продажа товаров рядом с вами.',
  keywords: ['объявления','кыргызы','Москва','жильё','работа','Мекендеш','Mekendesh'],
  openGraph: {
    title: 'Мекендеш — Объявления кыргызов в России',
    description: 'Жильё, работа, услуги — всё в одном месте для кыргызской диаспоры',
    url: 'https://mekendesh.site',
    siteName: 'Мекендеш',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://mekendesh.site' },
}

const IS_SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

export default async function HomePage() {
  if (!IS_SUPABASE_CONFIGURED) {
    return <HomeClient stats={undefined} />
  }

  const supabase = await createClient()

  // Только счётчики для Hero — лёгкий запрос, кэшируется 5 мин
  const [{ count: listingsCount }, { count: usersCount }, { data: citiesData }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('city').eq('status', 'active'),
  ])

  const citiesCount = citiesData
    ? new Set(citiesData.map((r: { city: string }) => r.city).filter(Boolean)).size
    : 0

  const stats = {
    listings: listingsCount || 0,
    users: usersCount || 0,
    cities: citiesCount,
  }

  return (
    <Suspense fallback={null}>
      <HomeClient stats={stats} />
    </Suspense>
  )
}
