'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid' | 'success'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setStatus('invalid'); return }
    fetch(`/api/auth/reset?token=${token}`)
      .then(r => r.json())
      .then(d => setStatus(d.ok ? 'valid' : 'invalid'))
      .catch(() => setStatus('invalid'))
  }, [token])

  const handleSubmit = async () => {
    if (password !== confirm) { setError('Пароли не совпадают'); return }
    if (password.length < 6) { setError('Минимум 6 символов'); return }
    setError(''); setLoading(true)
    const res = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const json = await res.json()
    setLoading(false)
    if (res.ok) setStatus('success')
    else setError(json.error || 'Ошибка')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 24, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24, fontWeight: 900, color: '#fff' }}>М</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Сырсөздү калыбына келтирүү</h1>
        </div>

        {status === 'checking' && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>Текшерилүүдө...</div>
        )}

        {status === 'invalid' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⛔</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Шилтеме жарактуу эмес</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24 }}>Шилтеменин мөөнөтү бүттү же ал мурда колдонулган</div>
            <button onClick={() => router.push('/?auth=1')} style={{ padding: '12px 24px', borderRadius: 12, background: '#1d4ed8', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Кайрадан сурануу
            </button>
          </div>
        )}

        {status === 'valid' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Жаңы сырсөз</label>
              <div style={{ position: 'relative' }}>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  style={{ width: '100%', padding: '13px 44px 13px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Сырсөздү ырастаңыз</label>
              <input
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                type="password"
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: `1.5px solid ${confirm && confirm !== password ? '#ef4444' : '#e2e8f0'}`, fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
              />
              {confirm && confirm !== password && (
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Пароли не совпадают</div>
              )}
            </div>
            {error && <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: 13, padding: '10px 14px', borderRadius: 10 }}>{error}</div>}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading || !password || password !== confirm}
              style={{ padding: '14px', borderRadius: 12, background: (!password || password !== confirm || loading) ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              {loading ? 'Сакталууда...' : 'Сырсөздү өзгөртүү'}
            </motion.button>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#059669', marginBottom: 8 }}>Сырсөз өзгөртүлдү!</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Эми жаңы сырсөзүңүз менен кире аласыз</div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/?auth=1')}
              style={{ padding: '13px 28px', borderRadius: 12, background: '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Кирүү
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetForm /></Suspense>
}
