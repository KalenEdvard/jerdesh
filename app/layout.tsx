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
  metadataBase: new URL('https://mekendesh.site'),
  title: { default: 'Мекендеш — Объявления кыргызов в России', template: '%s | Мекендеш' },
  description: 'Сайт объявлений для кыргызской диаспоры в России. Жильё, работа, услуги, продажа товаров.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
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
