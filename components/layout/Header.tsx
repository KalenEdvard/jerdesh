'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'

export default function Header() {
  const router = useRouter()
  const { user, setUser, setAuthOpen, showToast } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
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
        </Link>


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
