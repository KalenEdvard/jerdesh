'use client'
import { CITIES, METRO_STATIONS, CATEGORIES } from '@/types'
import { useFilters } from '@/hooks/useFilters'
import { useGeoCity } from '@/hooks/useGeoCity'
import { useStore } from '@/store'

const CITIES_WITH_METRO = new Set(['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань'])

const CAT_BG: Record<string, string> = {
  housing:     'linear-gradient(135deg,#1d4ed8,#3b82f6)',
  findhousing: 'linear-gradient(135deg,#6366f1,#818cf8)',
  jobs:        'linear-gradient(135deg,#059669,#34d399)',
  sell:        'linear-gradient(135deg,#d97706,#fbbf24)',
  services:    'linear-gradient(135deg,#7c3aed,#a78bfa)',
}

export default function MobileFilterBar() {
  const { city, metro, category, setFilter } = useFilters()
  const { detect, loading: geoLoading } = useGeoCity()
  const { showToast } = useStore()
  const hasMetro = CITIES_WITH_METRO.has(city)

  const handleGeo = () => {
    detect(
      (detected) => {
        setFilter('city', detected)
        setFilter('metro', '')
        showToast(`📍 Определён город: ${detected}`, 'ok')
      },
      () => showToast('Не удалось определить город', 'error')
    )
  }

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* City + Geo button + Metro row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none', zIndex: 1 }}>
            {CITIES.find(c => c.id === city)?.flag || '🏙️'}
          </span>
          <select
            value={city}
            onChange={e => { setFilter('city', e.target.value); setFilter('metro', '') }}
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, background: '#f8fafc', color: '#0f172a', fontWeight: 600, appearance: 'none', WebkitAppearance: 'none' }}
          >
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.id}</option>)}
          </select>
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: 12 }}>▾</span>
        </div>

        {/* Geo detect button */}
        <button
          onClick={handleGeo}
          disabled={geoLoading}
          title="Определить мой город"
          style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, border: '1.5px solid #e2e8f0', background: geoLoading ? '#f1f5f9' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: geoLoading ? 'default' : 'pointer', transition: 'all 0.15s' }}
        >
          {geoLoading ? (
            <span style={{ width: 16, height: 16, border: '2px solid #bfdbfe', borderTopColor: '#1d4ed8', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          ) : '📍'}
        </button>

        {hasMetro && (
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none', zIndex: 1 }}>🚇</span>
            <select
              value={metro}
              onChange={e => setFilter('metro', e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, background: '#f8fafc', color: metro ? '#0f172a' : '#94a3b8', appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="">Все метро</option>
              {METRO_STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: 12 }}>▾</span>
          </div>
        )}
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        <style>{`.mob-cat-scroll::-webkit-scrollbar{display:none}`}</style>
        <button
          onClick={() => setFilter('category', 'all')}
          style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, border: 'none', background: category === 'all' ? '#0f172a' : '#f1f5f9', color: category === 'all' ? '#fff' : '#334155', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          Все
        </button>
        {CATEGORIES.map(c => {
          const isActive = category === c.id
          return (
            <button
              key={c.id}
              onClick={() => setFilter('category', isActive ? 'all' : c.id)}
              style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, border: 'none', background: isActive ? CAT_BG[c.id] : '#f1f5f9', color: isActive ? '#fff' : '#334155', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
            >
              {c.icon} {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
