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
            <a href="#" aria-label="Telegram" style={{ width: 36, height: 36, borderRadius: 10, background: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="#" aria-label="ВКонтакте" style={{ width: 36, height: 36, borderRadius: 10, background: '#0077FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.405 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
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

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px', textAlign: 'center', fontSize: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px 20px' }}>
        <span>© {new Date().getFullYear()} Мекендеш — Объявления кыргызов в России</span>
        <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'underline' }}>Политика конфиденциальности</Link>
        <Link href="/terms" style={{ color: '#64748b', textDecoration: 'underline' }}>Пользовательское соглашение</Link>
      </div>
    </footer>
  )
}
