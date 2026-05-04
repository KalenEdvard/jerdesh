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

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 900, color: '#f59e0b' }}>
            М
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 64, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 }}>MEKENDESH</span>
            <span style={{ fontSize: 22, color: '#f59e0b', letterSpacing: 2, fontWeight: 600 }}>MEKENDESH.ONLINE</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 160, height: 3, background: '#f59e0b', borderRadius: 2, marginBottom: 36 }} />

        {/* Kyrgyz tagline only */}
        <p style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', textAlign: 'center', margin: 0, fontWeight: 700 }}>
          Оной издеп, оной тап!
        </p>
        <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: 14, fontWeight: 400 }}>
          Батир · Жумуш · Кызматтар · Сатуу
        </p>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>mekendesh.online</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
