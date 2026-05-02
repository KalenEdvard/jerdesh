'use client'
import { METRO_BY_CITY, CATEGORIES, CITIES } from '@/types'
import { motion } from 'framer-motion'
import { SlidersHorizontal, RotateCcw, MapPin, Tag, ArrowUpDown } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'

const CAT_COLORS: Record<string, string> = {
  all:         '#64748b',
  housing:     '#1d4ed8',
  findhousing: '#6366f1',
  jobs:        '#059669',
  sell:        '#d97706',
  services:    '#7c3aed',
}

export default function FilterSidebar() {
  const { category, metro, sort, city, country, setFilter, resetFilters } = useFilters()
  const citiesForCountry = CITIES.filter(c => c.country === country)
  const safeCity = citiesForCountry.some(c => c.id === city) ? city : (citiesForCountry[0]?.id ?? city)
  const cityMetroStations = METRO_BY_CITY[safeCity] ?? []
  const validMetro = cityMetroStations.includes(metro) ? metro : ''

  return (
    <aside style={{ width: 260, flexShrink: 0 }}>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlidersHorizontal size={15} color="#fff" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Фильтры</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ef4444', background: '#fee2e2', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '5px 10px', fontWeight: 600 }}
          >
            <RotateCcw size={11} />
            Сбросить
          </motion.button>
        </div>

        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Tag size={13} color="#94a3b8" />
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>КАТЕГОРИЯ</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button
              onClick={() => setFilter('category', 'all')}
              style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, background: category === 'all' ? '#eff6ff' : 'none', color: category === 'all' ? '#1d4ed8' : '#334155', fontWeight: category === 'all' ? 700 : 500, border: category === 'all' ? '1.5px solid #bfdbfe' : '1.5px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              Все категории
            </button>
            {CATEGORIES.map(c => {
              const color = CAT_COLORS[c.id] || '#1d4ed8'
              const isActive = category === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setFilter('category', c.id)}
                  style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 10, fontSize: 13, background: isActive ? color + '12' : 'none', color: isActive ? color : '#334155', fontWeight: isActive ? 700 : 500, border: isActive ? `1.5px solid ${color}33` : '1.5px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {c.icon} {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Metro — показывается только если у города есть метро */}
        {cityMetroStations.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <MapPin size={13} color="#94a3b8" />
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>СТАНЦИЯ МЕТРО</label>
            </div>
            <select
              value={validMetro}
              onChange={e => setFilter('metro', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
            >
              <option value="">Все станции</option>
              {cityMetroStations.map(s => <option key={s} value={s}>🚇 {s}</option>)}
            </select>
          </div>
        )}

        {/* Sort */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <ArrowUpDown size={13} color="#94a3b8" />
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>СОРТИРОВКА</label>
          </div>
          <select
            value={sort}
            onChange={e => setFilter('sort', e.target.value as any)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
          >
            <option value="new">Сначала новые</option>
            <option value="old">Сначала старые</option>
            <option value="pa">Цена: по возрастанию</option>
            <option value="pd">Цена: по убыванию</option>
            <option value="pop">Популярные</option>
          </select>
        </div>
      </motion.div>

    </aside>
  )
}
