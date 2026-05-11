import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://mekendesh.online'),
  title: { default: 'Мекендеш — Батир, жумуш, кызматтар | Mekendesh', template: '%s | Мекендеш' },
  description: 'Мекендеш — оной издеп, оной тап! Батир ижарага, жумуш, кызматтар, сатуу. Россиядагы кыргыздар үчүн акысыз жарнамалар. Москва, СПб жана башка шаарлар.',
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
    title: 'Мекендеш — Батир, жумуш, кызматтар | Mekendesh',
    description: 'Мекендеш — оной издеп, оной тап! Батир ижарага, жумуш, кызматтар, сатуу. Россиядагы кыргыздар үчүн акысыз жарнамалар.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Mekendesh — оной издеп, оной тап!' }],
  },
  twitter: { card: 'summary_large_image', title: 'Мекендеш — Батир, жумуш, кызматтар', description: 'Оной издеп, оной тап! Батир ижарага, жумуш, кызматтар, сатуу.', images: ['/opengraph-image'] },
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
