import type { Metadata } from 'next'
import { Unbounded, Onest } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/auth/AuthModal'
import Toast from '@/components/ui/Toast'
import AuthProvider from '@/components/auth/AuthProvider'

// Шрифты скачиваются при билде и раздаются с Vercel — не зависят от Google
const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  weight: ['700', '900'],
  variable: '--font-unbounded',
  display: 'swap',
})

const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-onest',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mekendesh.online'),
  title: { default: 'Мекендеш — Объявления кыргызов в России', template: '%s | Мекендеш' },
  description: 'Мекендеш (Mekendesh) — сайт объявлений в России на кыргызском и русском. Батир ижарага, жумуш, сатуу, кызматтар. Оной издеп, оной тап! Москва, СПб и другие города.',
  keywords: [
    // Бренд
    'Мекендеш', 'Mekendesh', 'мекендеш сайт',
    // Русские
    'объявления для кыргызов', 'кыргызы в России', 'жильё для кыргызов',
    'работа для кыргызов', 'снять квартиру Москва', 'объявления Москва',
    // Кыргызские — жильё
    'батир', 'батир ижарага', 'үй ижарага', 'батир Москва', 'үй Москва',
    'ижарага берүү', 'ижарага алуу', 'батир издеп', 'батир табуу',
    // Кыргызские — работа
    'жумуш', 'жумуш Москва', 'жумуш издеп', 'жумуш табуу', 'иш орду',
    'жумуш Россия', 'иш орун Москва',
    // Кыргызские — услуги и продажа
    'кызматтар', 'сатуу', 'сатып алуу', 'арзан батир', 'жаңы объявление',
    // Смешанные
    'кыргыз жумуш Москва', 'кыргыз батир Москва', 'оной издеп оной тап',
  ],
  authors: [{ name: 'Мекендеш', url: 'https://mekendesh.online' }],
  creator: 'Мекендеш',
  publisher: 'Мекендеш',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://mekendesh.online', languages: { 'ru-RU': 'https://mekendesh.online' } },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://mekendesh.online',
    siteName: 'Мекендеш',
    title: 'Мекендеш — Объявления кыргызов в России',
    description: 'Сайт объявлений для кыргызской диаспоры. Жильё, работа, услуги, продажа.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Мекендеш — объявления кыргызов в России' }],
  },
  twitter: { card: 'summary_large_image', title: 'Мекендеш', description: 'Объявления для кыргызской диаспоры в России', images: ['/og-image.png'] },
  icons: { icon: '/favicon.ico' },
  verification: { google: 'GOOGLE_VERIFICATION_CODE', yandex: 'YANDEX_VERIFICATION_CODE' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://mekendesh.online/#organization',
      name: 'Мекендеш',
      alternateName: 'Mekendesh',
      url: 'https://mekendesh.online',
      logo: { '@type': 'ImageObject', url: 'https://mekendesh.online/og-image.png' },
      description: 'Сайт объявлений для кыргызской диаспоры в России',
      foundingLocation: { '@type': 'Country', name: 'Россия' },
      areaServed: { '@type': 'Country', name: 'Россия' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://mekendesh.online/#website',
      url: 'https://mekendesh.online',
      name: 'Мекендеш',
      inLanguage: 'ru-RU',
      publisher: { '@id': 'https://mekendesh.online/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://mekendesh.online/?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <main style={{ minHeight: '70vh' }}>{children}</main>
          <Footer />
          <AuthModal />
          <Toast />
        </AuthProvider>
      </body>
    </html>
  )
}
