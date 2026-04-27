'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'

type Tab = 'login' | 'register'
type Screen = 'form' | 'confirm'

function EyeIcon({ show }: { show: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}

export default function AuthModal() {
  const { authOpen, setAuthOpen, setUser, showToast } = useStore()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [screen, setScreen] = useState<Screen>('form')
  const [form, setForm] = useState({ email: '', password: '', confirm: '', name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!authOpen) return null

  const handleLogin = async () => {
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const json = await res.json()

      if (!res.ok) {
        if (json.error === 'EMAIL_NOT_CONFIRMED') {
          setScreen('confirm')
        } else {
          setError(json.error || 'Ошибка входа')
        }
        return
      }

      const profile = json.profile
      setUser(profile)
      setAuthOpen(false)
      showToast(`Добро пожаловать, ${profile.name}! 👋`, 'ok')
      router.push('/profile')
    } catch {
      setError('Сервер не отвечает. Проверьте интернет и попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      if (!res.ok) { showToast('Ошибка при отправке', 'error'); return }
      showToast('Письмо отправлено повторно', 'ok')
    } catch {
      showToast('Ошибка при отправке', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!form.name.trim()) { setError('Введите имя'); return }
    if (form.password !== form.confirm) { setError('Пароли не совпадают'); return }
    if (form.password.length < 6) { setError('Пароль минимум 6 символов'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Ошибка регистрации'); return }

      if (json.confirmed) {
        // Email confirmation отключён — сразу логиним
        const profileRes = await fetch('/api/profile/me')
        if (profileRes.ok) {
          const profile = await profileRes.json()
          if (profile) setUser(profile)
        }
        setAuthOpen(false)
        showToast('Добро пожаловать! Аккаунт создан', 'ok')
        router.push('/profile')
      } else {
        setScreen('confirm')
      }
    } catch {
      setError('Сервер не отвечает. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const inputWrap: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center' }
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const eyeBtn: React.CSSProperties = { position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 }
  const showConfirmField = tab === 'register' && form.password.length > 0

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .confirm-field { animation: slideDown 0.25s ease; }
      `}</style>

      <div onClick={() => setAuthOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, backdropFilter: 'blur(4px)' }} />

      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: 440, background: '#fff', borderRadius: 24, padding: 36, zIndex: 600, boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        <button onClick={() => setAuthOpen(false)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 16, color: '#64748b' }}>✕</button>

        {/* Экран подтверждения email */}
        {screen === 'confirm' ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Подтвердите email</h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 8 }}>
              Мы отправили письмо на
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1d4ed8', marginBottom: 16 }}>{form.email}</p>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 28 }}>
              Перейдите по ссылке в письме чтобы активировать аккаунт. Проверьте папку «Спам» если письмо не пришло.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: loading ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer', marginBottom: 10 }}
            >
              {loading ? '...' : 'Отправить письмо повторно'}
            </button>
            <button
              onClick={() => { setScreen('form'); setError('') }}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#f1f5f9', color: '#64748b', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Назад
            </button>
          </div>
        ) : (
          <>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 22, margin: '0 auto 10px' }}>Ж</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{tab === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}</h2>
              <p style={{ fontSize: 13, color: '#64748b' }}>Мекендеш — Объявления кыргызов в России</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
              {(['login', 'register'] as Tab[]).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setForm(f => ({ ...f, password: '', confirm: '' })) }} style={{ flex: 1, padding: '9px', borderRadius: 10, background: tab === t ? '#fff' : 'none', fontWeight: tab === t ? 700 : 500, fontSize: 14, color: tab === t ? '#0f172a' : '#64748b', border: 'none', cursor: 'pointer', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
                  {t === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tab === 'register' && (
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ваше имя *" style={inputStyle} />
              )}
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email *" type="email" style={inputStyle} />
              {tab === 'register' && (
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Телефон (необязательно)" type="tel" style={inputStyle} />
              )}

              <div style={inputWrap}>
                <input value={form.password} onChange={e => set('password', e.target.value)} placeholder="Пароль *" type={showPass ? 'text' : 'password'} style={inputStyle} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={eyeBtn}><EyeIcon show={showPass} /></button>
              </div>

              {showConfirmField && (
                <div style={inputWrap} className="confirm-field">
                  <input
                    value={form.confirm}
                    onChange={e => { set('confirm', e.target.value); setShowPass(false) }}
                    placeholder="Повторите пароль *"
                    type={showConfirm ? 'text' : 'password'}
                    style={{ ...inputStyle, borderColor: form.confirm.length > 0 ? form.confirm === form.password ? '#22c55e' : '#ef4444' : '#e2e8f0' }}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={eyeBtn}><EyeIcon show={showConfirm} /></button>
                </div>
              )}

              {error && <div style={{ fontSize: 13, color: '#ef4444', background: '#fee2e2', padding: '10px 14px', borderRadius: 10 }}>{error}</div>}

              <button onClick={tab === 'login' ? handleLogin : handleRegister} disabled={loading} style={{ padding: '14px', borderRadius: 12, background: loading ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer', marginTop: 4 }}>
                {loading ? '...' : tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
