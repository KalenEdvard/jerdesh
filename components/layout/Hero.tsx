'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { CATEGORIES, METRO_STATIONS } from '@/types'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const dur = 1600; const step = 16
      const inc = target / (dur / step)
      let cur = 0
      const t = setInterval(() => {
        cur = Math.min(cur + inc, target)
        setCount(Math.floor(cur))
        if (cur >= target) clearInterval(t)
      }, step)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{count.toLocaleString('ru')}{suffix}</span>
}

export default function Hero() {
  const router = useRouter()
  const { filters, setFilter } = useStore()
  const [metroOpen, setMetroOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const metroRef = useRef<HTMLDivElement>(null)

  const stats = [
    { label: 'Объявлений', target: 12400, suffix: '+' },
    { label: 'Пользователей', target: 8200, suffix: '+' },
    { label: 'Городов', target: 24, suffix: '' },
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.query)    params.set('q', filters.query)
    if (filters.metro)    params.set('metro', filters.metro)
    if (filters.category !== 'all') params.set('cat', filters.category)
    router.push(`/?${params.toString()}`)
  }

  return (
    <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', padding: '56px 20px 64px', position: 'relative', overflow: 'hidden' }}>
      {/* Background ornament */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 50%, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 'clamp(24px,5vw,48px)', color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
            Жердеш — Объявления<br />кыргызов в России
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Жильё, работа, услуги и товары от соотечественников. Найди всё что нужно рядом с тобой.
          </p>
        </div>

        {/* Search box */}
        <div style={{ maxWidth: 780, margin: '0 auto 32px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Category picker */}
          <div style={{ position: 'relative' }} ref={metroRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              {CATEGORIES.find(c => c.id === filters.category)?.label || 'Все категории'} ▾
            </button>
            {catOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 180, zIndex: 300, padding: 6 }}>
                <button onClick={() => { setFilter('category', 'all'); setCatOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155', background: 'none' }}>
                  Все категории
                </button>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => { setFilter('category', c.id); setCatOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155', background: filters.category === c.id ? '#eff6ff' : 'none' }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metro picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMetroOpen(!metroOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              🚇 {filters.metro || 'Метро'} ▾
            </button>
            {metroOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', width: 220, maxHeight: 260, overflowY: 'auto', zIndex: 300, padding: 6 }}>
                <button onClick={() => { setFilter('metro', ''); setMetroOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, fontSize: 13, color: '#64748b', background: 'none' }}>Все станции</button>
                {METRO_STATIONS.map(s => (
                  <button key={s} onClick={() => { setFilter('metro', s); setMetroOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, fontSize: 13, color: '#334155', background: 'none' }}>
                    🚇 {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search input */}
          <input
            value={filters.query}
            onChange={e => setFilter('query', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Что ищете? Комнату, работу, услуги..."
            style={{ flex: 1, minWidth: 180, border: 'none', outline: 'none', padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 14, backdropFilter: 'blur(8px)' }}
          />

          <button
            onClick={handleSearch}
            style={{ padding: '10px 24px', borderRadius: 12, background: '#f59e0b', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Найти
          </button>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => { setFilter('category', c.id); router.push(`/?cat=${c.id}`) }}
              style={{ padding: '7px 16px', borderRadius: 100, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'background 0.15s' }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 28, fontFamily: "'Unbounded',sans-serif", fontWeight: 900 }}>
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
