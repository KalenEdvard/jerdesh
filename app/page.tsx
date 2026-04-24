import { createClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import HomeClient from './HomeClient'

// Страница статична — HTML отдаётся мгновенно с CDN
// Объявления грузятся клиентски через useEffect в HomeClient
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Мекендеш — Объявления для кыргызов в России | Жильё, работа, услуги',
  description: 'Мекендеш — бесплатные объявления в России. Батир ижарага (снять жильё), жумуш (работа), сатуу (продажа), кызматтар (услуги). Москва, СПб и другие города. Оной издеп, оной тап!',
  keywords: [
    'Мекендеш', 'Mekendesh', 'мекендеш сайт объявлений',
    // Русские
    'объявления для кыргызов', 'кыргызы в Москве', 'снять жильё Москва',
    'работа для кыргызов в России',
    // Кыргызские — жильё
    'батир ижарага Москва', 'үй ижарага', 'батир издеп табуу',
    'ижарага берүү Москва', 'арзан батир Москва',
    // Кыргызские — работа
    'жумуш Москва', 'жумуш издеп', 'иш орду Россия', 'жумуш табуу Москва',
    // Кыргызские — общие
    'оной издеп оной тап', 'кыргыз объявление', 'батир сатуу Москва',
    'кызматтар Москва', 'сатуу Москва',
  ],
  alternates: { canonical: 'https://mekendesh.online' },
  openGraph: {
    title: 'Мекендеш — Объявления для кыргызов в России',
    description: 'Бесплатные объявления: жильё, работа, услуги, продажа товаров для кыргызской диаспоры в России.',
    url: 'https://mekendesh.online',
    siteName: 'Мекендеш',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
}

const IS_SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

export default async function HomePage() {
  if (!IS_SUPABASE_CONFIGURED) {
    return (
      <Suspense fallback={null}>
        <HomeClient stats={undefined} />
      </Suspense>
    )
  }

  const supabase = await createClient()

  // Только счётчики для Hero — лёгкий запрос, кэшируется 5 мин
  const [{ count: listingsCount }, { count: usersCount }, { data: citiesData }, { data: metroData }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('city').eq('status', 'active'),
    supabase.from('listings').select('metro').eq('status', 'active').not('metro', 'is', null),
  ])

  const citiesCount = citiesData
    ? new Set(citiesData.map((r: { city: string }) => r.city).filter(Boolean)).size
    : 0

  const metroCountMap: Record<string, number> = {}
  if (metroData) {
    for (const row of metroData as { metro: string }[]) {
      if (row.metro) metroCountMap[row.metro] = (metroCountMap[row.metro] || 0) + 1
    }
  }
  const metroStats = Object.entries(metroCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))

  const stats = {
    listings: listingsCount || 0,
    users: usersCount || 0,
    cities: citiesCount,
  }

  return (
    <Suspense fallback={null}>
      <HomeClient stats={stats} metroStats={metroStats} />
    </Suspense>
  )
}
