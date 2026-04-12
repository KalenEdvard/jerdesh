'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'

type Tab = 'login' | 'register'

export default function AuthModal() {
  const { authOpen, setAuthOpen, setUser, showToast } = useStore()
  const [tab, setTab] = useState<Tab>('login')
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!authOpen) return null

  const supabase = createClient()

  const handleLogin = async () => {
    setError(''); setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { setError(error.message); setLoading(false); return }
    // Load user profile
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()
    setUser(profile)
    setAuthOpen(false)
    showToast(`Добро пожаловать, ${profile?.name || 'друг'}! 👋`, 'ok')
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!form.name.trim()) { setError('Введите имя'); return }
    setError(''); setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        name: form.name,
        phone: form.phone || null,
        city: 'Москва',
      })
      const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single()
      setUser(profile)
    }
    setAuthOpen(false)
    showToast('Регистрация прошла успешно! 🎉', 'ok')
    setLoading(false)
  }

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setAuthOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, backdropFilter: 'blur(4px)' }} />

      {/* Modal */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: 440, background: '#fff', borderRadius: 24, padding: 36, zIndex: 600, animation: 'fadeIn 0.25s ease', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        {/* Close */}
        <button onClick={() => setAuthOpen(false)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 16, color: '#64748b' }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 22, margin: '0 auto 10px' }}>Ж</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{tab === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}</h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>Жердеш — Объявления кыргызов в России</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {(['login', 'register'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{ flex: 1, padding: '9px', borderRadius: 10, background: tab === t ? '#fff' : 'none', fontWeight: tab === t ? 700 : 500, fontSize: 14, color: tab === t ? '#0f172a' : '#64748b', border: 'none', cursor: 'pointer', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
              {t === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'register' && (
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ваше имя *" style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          )}
          <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email *" type="email" style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          {tab === 'register' && (
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Телефон (необязательно)" type="tel" style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          )}
          <input value={form.password} onChange={e => set('password', e.target.value)} placeholder="Пароль *" type="password" style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />

          {error && <div style={{ fontSize: 13, color: '#ef4444', background: '#fee2e2', padding: '10px 14px', borderRadius: 10 }}>{error}</div>}

          <button
            onClick={tab === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            style={{ padding: '14px', borderRadius: 12, background: loading ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer', marginTop: 4 }}
          >
            {loading ? '...' : tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </div>
      </div>
    </>
  )
}
