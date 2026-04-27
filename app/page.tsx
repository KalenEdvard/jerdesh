import type { Metadata } from 'next'
import { Suspense } from 'react'
import { query, queryOne } from '@/lib/db'
import HomeClient from './HomeClient'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Мекендеш — Объявления для кыргызов в России | Жильё, работа, услуги',
  description: 'Мекендеш — бесплатные объявления в России. Батир ижарага (снять жильё), жумуш (работа), сатуу (продажа), кызматтар (услуги). Москва, СПб и другие города. Оной издеп, оной тап!',
  alternates: { canonical: 'https://mekendesh.online' },
  openGraph: {
    title: 'Мекендеш — Объявления для кыргызов в России',
    description: 'Бесплатные объявления: жильё, работа, услуги, продажа товаров.',
    url: 'https://mekendesh.online', siteName: 'Мекендеш', locale: 'ru_RU', type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default async function HomePage() {
  try {
    const [listingsRow, usersRow, metroRows] = await Promise.all([
      queryOne<any>("SELECT COUNT(*) FROM listings WHERE status='active'"),
      queryOne<any>('SELECT COUNT(*) FROM users'),
      query<any>("SELECT metro, COUNT(*) as count FROM listings WHERE status='active' AND metro IS NOT NULL GROUP BY metro"),
    ])

    const metroStats = metroRows
      .map(r => ({ name: r.metro, count: Number(r.count) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))

    const stats = {
      listings: Number(listingsRow?.count || 0),
      users: Number(usersRow?.count || 0),
      cities: 6,
    }

    return (
      <Suspense fallback={null}>
        <HomeClient stats={stats} metroStats={metroStats} />
      </Suspense>
    )
  } catch {
    return <Suspense fallback={null}><HomeClient stats={undefined} /></Suspense>
  }
}
