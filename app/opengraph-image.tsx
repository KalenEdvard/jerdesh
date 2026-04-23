import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Мекендеш — объявления для кыргызов в России'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, display: 'flex', flexWrap: 'wrap', gap: 40, padding: 40 }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
          ))}
        </div>

        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
            🏠
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>MEKENDESH</span>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>Оной издеп, оной тап!</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 120, height: 3, background: '#f59e0b', borderRadius: 2, marginBottom: 28 }} />

        {/* Tagline */}
        <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)', textAlign: 'center', margin: 0, fontWeight: 500 }}>
          Объявления для кыргызской диаспоры в России
        </p>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 12 }}>
          Жильё · Работа · Услуги · Продажа
        </p>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 36, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>mekendesh.site</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
