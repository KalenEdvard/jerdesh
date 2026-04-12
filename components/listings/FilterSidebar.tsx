'use client'
import { useStore } from '@/store'
import { METRO_STATIONS, CATEGORIES } from '@/types'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

export default function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useStore()

  return (
    <aside style={{ width: 260, flexShrink: 0 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Фильтры</h3>
          <button onClick={resetFilters} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
            Сбросить
          </button>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>КАТЕГОРИЯ</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              onClick={() => setFilter('category', 'all')}
              style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, fontSize: 13, background: filters.category === 'all' ? '#eff6ff' : 'none', color: filters.category === 'all' ? '#1d4ed8' : '#334155', fontWeight: filters.category === 'all' ? 700 : 400, border: 'none', cursor: 'pointer' }}
            >
              Все категории
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setFilter('category', c.id)}
                style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, fontSize: 13, background: filters.category === c.id ? '#eff6ff' : 'none', color: filters.category === c.id ? '#1d4ed8' : '#334155', fontWeight: filters.category === c.id ? 700 : 400, border: 'none', cursor: 'pointer' }}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metro */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>СТАНЦИЯ МЕТРО</label>
          <select
            value={filters.metro}
            onChange={e => setFilter('metro', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc' }}
          >
            <option value="">Все станции</option>
            {METRO_STATIONS.map(s => <option key={s} value={s}>🚇 {s}</option>)}
          </select>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>ЦЕНА (₽)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              placeholder="От"
              value={filters.priceMin}
              onChange={e => setFilter('priceMin', e.target.value)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
            />
            <input
              type="number"
              placeholder="До"
              value={filters.priceMax}
              onChange={e => setFilter('priceMax', e.target.value)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>СОРТИРОВКА</label>
          <select
            value={filters.sort}
            onChange={e => setFilter('sort', e.target.value as any)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc' }}
          >
            <option value="new">Сначала новые</option>
            <option value="old">Сначала старые</option>
            <option value="pa">Цена: по возрастанию</option>
            <option value="pd">Цена: по убыванию</option>
            <option value="pop">Популярные</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 10px', fontSize: 13, fontWeight: 700 }}>🗺️ Карта</div>
        <MapView />
      </div>
    </aside>
  )
}
