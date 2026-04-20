'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import { motion, AnimatePresence } from 'framer-motion'
import { User, FileText, Heart, LogOut, Plus } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { user, setUser, setAuthOpen, showToast } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [userMenuOpen])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    showToast('Вы вышли из аккаунта', 'info')
    router.push('/')
  }

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.98)' : '#fff',
        borderBottom: '1px solid #e2e8f0',
        backdropFilter: 'blur(16px)',
        transition: 'box-shadow 0.3s',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 15, boxShadow: '0 4px 12px rgba(29,78,216,0.35)' }}
          >
            М
          </motion.div>
          <span style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Мекендеш
          </span>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          {user ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 14px 6px 7px', borderRadius: 50, border: '2px solid #e2e8f0', background: '#f8fafc', fontSize: 13, cursor: 'pointer', fontWeight: 600, color: '#0f172a' }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
                  {user.name?.[0]?.toUpperCase() || 'У'}
                </div>
                {user.name}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.12)', width: 200, zIndex: 200, padding: 8, overflow: 'hidden' }}
                  >
                    {[
                      { href: '/profile?tab=ads', icon: <User size={15} />, label: 'Мой профиль' },
                      { href: '/profile?tab=ads', icon: <FileText size={15} />, label: 'Мои объявления' },
                      { href: '/profile?tab=favs', icon: <Heart size={15} />, label: 'Избранное' },
                    ].map(item => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, fontSize: 13, color: '#334155', textDecoration: 'none', transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <span style={{ color: '#1d4ed8' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={15} />
                      Выйти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAuthOpen(true)}
              style={{ padding: '8px 18px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, color: '#334155', fontWeight: 600, background: '#fff', cursor: 'pointer' }}
            >
              Войти
            </motion.button>
          )}

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/create"
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 12, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(29,78,216,0.3)' }}
            >
              <Plus size={15} strokeWidth={2.5} />
              Подать объявление
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
