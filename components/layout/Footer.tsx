import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 32 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 14 }}>М</div>
            <span style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>Мекендеш</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>
            Объявления для кыргызской диаспоры в России. Жильё, работа, услуги — всё в одном месте.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {[
              { icon: '✈️', label: 'Telegram', href: '#' },
              { icon: '🔵', label: 'ВКонтакте', href: '#' },
              { icon: '📸', label: 'Instagram', href: '#' },
            ].map(s => (
              <a key={s.label} href={s.href} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'background 0.2s' }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Категории</h4>
          {['Сдаю жильё','Сниму жильё','Работа','Продаю/Куплю','Услуги'].map(c => (
            <Link key={c} href={`/?cat=${c}`} style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#94a3b8', transition: 'color 0.15s' }}>
              {c}
            </Link>
          ))}
        </div>

        {/* Project */}
        <div>
          <h4 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Проект</h4>
          {[
            { label: 'Подать объявление', href: '/create' },
            { label: 'Мой профиль',       href: '/profile' },
            { label: 'Избранное',         href: '/profile?tab=favs' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* App */}
        <div>
          <h4 style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Мобильное приложение</h4>
          <p style={{ fontSize: 13, marginBottom: 14 }}>Доступно на iOS и Android</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, color: '#e2e8f0' }}>
              🍎 App Store
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, color: '#e2e8f0' }}>
              🤖 Google Play
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px', textAlign: 'center', fontSize: 12 }}>
        © {new Date().getFullYear()} Мекендеш — Объявления кыргызов в России
      </div>
    </footer>
  )
}
