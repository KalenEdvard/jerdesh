'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { METRO_STATIONS } from '@/types'
import { createClient } from '@/lib/supabase-client'

export default function Header() {
  const router = useRouter()
  const { user, setUser, filters, setFilter, setAuthOpen, showToast } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [metroOpen, setMetroOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const metroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (metroRef.current && !metroRef.current.contains(e.target as Node)) {
        setMetroOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    showToast('Вы вышли из аккаунта', 'info')
    router.push('/')
  }

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        borderBottom: '1px solid #e2e8f0',
        backdropFilter: 'blur(12px)',
        transition: 'box-shadow 0.2s',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 14 }}>
            Ж
          </div>
          <span style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
            Жердеш
          </span>
          <span style={{ fontSize: 11, color: '#64748b', background: '#f1f5f9', borderRadius: 6, padding: '2px 7px' }}>Объявления в России</span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, display: 'flex', gap: 8, maxWidth: 560 }}>
          {/* Metro dropdown */}
          <div ref={metroRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMetroOpen(!metroOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, color: '#334155', whiteSpace: 'nowrap' }}
            >
              🚇 {filters.metro || 'Метро'} <span style={{ color: '#94a3b8' }}>▾</span>
            </button>
            {metroOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: 220, maxHeight: 280, overflowY: 'auto', zIndex: 200, padding: 6 }}>
                <button onClick={() => { setFilter('metro', ''); setMetroOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, fontSize: 13, color: '#64748b', background: 'none' }}>
                  Все станции
                </button>
                {METRO_STATIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setFilter('metro', s); setMetroOpen(false) }}
                    style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, fontSize: 13, color: '#334155', background: filters.metro === s ? '#eff6ff' : 'none' }}
                  >
                    🚇 {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search input */}
          <div style={{ flex: 1, display: 'flex', gap: 0, border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            <input
              value={filters.query}
              onChange={e => setFilter('query', e.target.value)}
              placeholder="Поиск объявлений..."
              style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 14px', fontSize: 14, background: 'transparent' }}
            />
            <button
              style={{ padding: '0 16px', background: '#1d4ed8', color: '#fff', fontSize: 16, borderLeft: 'none' }}
              onClick={() => router.push(`/?q=${filters.query}`)}
            >
              🔍
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13 }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1d4ed8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                  {user.name?.[0]?.toUpperCase() || 'У'}
                </div>
                {user.name}
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: 180, zIndex: 200, padding: 6 }}>
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155' }}>👤 Мой профиль</Link>
                  <Link href="/profile/ads" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155' }}>📋 Мои объявления</Link>
                  <Link href="/profile/favorites" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155' }}>❤️ Избранное</Link>
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #f1f5f9' }} />
                  <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#ef4444', background: 'none' }}>
                    🚪 Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setAuthOpen(true)} style={{ padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#334155', fontWeight: 600, background: '#fff' }}>
              Войти
            </button>
          )}
          <Link
            href="/create"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#1d4ed8', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            + Подать объявление
          </Link>
        </div>
      </div>
    </header>
  )
}
