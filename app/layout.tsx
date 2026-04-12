import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/auth/AuthModal'
import Toast from '@/components/ui/Toast'
import AuthProvider from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://zherdesh.ru'),
  title: { default: 'Жердеш — Объявления кыргызов в России', template: '%s | Жердеш' },
  description: 'Сайт объявлений для кыргызской диаспоры в России. Жильё, работа, услуги, продажа товаров.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
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
