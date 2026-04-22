'use client'
import { useState, useEffect, useRef } from 'react'
import { CATEGORIES, METRO_STATIONS, CITIES, COUNTRIES, DEFAULT_CITY } from '@/types'
import { useFilters } from '@/hooks/useFilters'

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

type HeroStats = { listings: number; users: number; cities: number }

export default function Hero({ stats }: { stats?: HeroStats }) {
  const { category, metro, city, country, setFilter } = useFilters()
  const [metroOpen, setMetroOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [metroSearch, setMetroSearch] = useState('')
  const metroRef = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const cityRef = useRef<HTMLDivElement>(null)
  const countryRef = useRef<HTMLDivElement>(null)

  const citiesForCountry = CITIES.filter(c => c.country === country)
  const hasMetro = CITIES.find(c => c.id === city)?.metro ?? false

  const filteredMetro = METRO_STATIONS.filter(s =>
    s.toLowerCase().includes(metroSearch.toLowerCase())
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (metroRef.current && !metroRef.current.contains(e.target as Node)) setMetroOpen(false)
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false)
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const statItems = [
    { label: 'Объявлений', target: stats?.listings ?? 0, suffix: stats?.listings ? '+' : '' },
    { label: 'Пользователей', target: stats?.users ?? 0, suffix: stats?.users ? '+' : '' },
    { label: 'Городов', target: stats?.cities ?? 0, suffix: '' },
  ]

  return (
    <section className="hero-section" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', padding: '56px 20px 64px', position: 'relative', zIndex: 10 }}>
      {/* Background ornament */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 50%, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 className="hero-title" style={{ fontFamily: "'Unbounded',sans-serif", fontWeight: 900, fontSize: 'clamp(24px,5vw,48px)', color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
            Мекендеш — Объявления<br />кыргызов в России
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Жильё, работа, услуги и товары от соотечественников. Найди всё что нужно рядом с тобой.
          </p>
        </div>

        {/* Search box */}
        <div style={{ maxWidth: 780, margin: '0 auto 32px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }} className="hero-searchbox">
          {/* Country + City pickers — hidden on mobile (MobileFilterBar handles it) */}
          <div className="hero-pickers" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Country picker */}
          <div style={{ position: 'relative' }} ref={countryRef}>
            <button
              onClick={() => setCountryOpen(!countryOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}
            >
              {COUNTRIES.find(c => c.id === country)?.flag || '🌍'} {country || 'Страна'} ▾
            </button>
            {countryOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 200, zIndex: 9999, padding: 6 }}>
                {COUNTRIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setFilter('country', c.id)
                      const firstCity = CITIES.find(ci => ci.country === c.id)
                      if (firstCity) setFilter('city', firstCity.id)
                      setFilter('metro', '')
                      setCountryOpen(false)
                    }}
                    style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155', background: country === c.id ? '#eff6ff' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span style={{ fontSize: 18 }}>{c.flag}</span> {c.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City picker */}
          <div style={{ position: 'relative' }} ref={cityRef}>
            <button
              onClick={() => setCityOpen(!cityOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}
            >
              {CITIES.find(c => c.id === city)?.flag || '🏙️'} {city || 'Город'} ▾
            </button>
            {cityOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 200, zIndex: 9999, padding: 6 }}>
                {citiesForCountry.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setFilter('city', c.id); setFilter('metro', ''); setCityOpen(false) }}
                    style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155', background: city === c.id ? '#eff6ff' : 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span style={{ fontSize: 18 }}>{c.flag}</span> {c.id}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>

          {/* Category picker — hidden on mobile */}
          <div className="hero-pickers" style={{ position: 'relative' }} ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.2)' }}
            >
              {CATEGORIES.find(c => c.id === category)?.label || 'Все категории'} ▾
            </button>
            {catOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 180, zIndex: 9999, padding: 6 }}>
                <button onClick={() => { setFilter('category', 'all'); setCatOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155', background: 'none' }}>
                  Все категории
                </button>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => { setFilter('category', c.id); setCatOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#334155', background: category === c.id ? '#eff6ff' : 'none' }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metro picker — hidden on mobile, only if city has metro */}
          {hasMetro && (
          <div className="hero-pickers" style={{ position: 'relative' }} ref={metroRef}>
            <button
              onClick={() => { setMetroOpen(!metroOpen); setMetroSearch('') }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}
            >
              🚇 {metro || 'Метро'} ▾
            </button>
            {metroOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', width: 240, zIndex: 9999 }}>
                <div style={{ padding: '10px 10px 6px' }}>
                  <input
                    autoFocus
                    value={metroSearch}
                    onChange={e => setMetroSearch(e.target.value)}
                    placeholder="Поиск станции..."
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ maxHeight: 340, overflowY: 'auto', padding: '0 6px 6px' }}>
                  <button onClick={() => { setFilter('metro', ''); setMetroOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, fontSize: 13, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                    — Любое —
                  </button>
                  {filteredMetro.map(s => (
                    <button key={s} onClick={() => { setFilter('metro', s); setMetroOpen(false) }} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, fontSize: 13, color: '#334155', background: metro === s ? '#eff6ff' : 'none', border: 'none', cursor: 'pointer', display: 'block' }}>
                      🚇 {s}
                    </button>
                  ))}
                  {filteredMetro.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: '12px 0' }}>Не найдено</p>
                  )}
                </div>
              </div>
            )}
          </div>
          )}

          <button
            onClick={() => {}}
            style={{ padding: '10px 24px', borderRadius: 12, background: '#f59e0b', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Найти
          </button>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {statItems.map(s => (
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
