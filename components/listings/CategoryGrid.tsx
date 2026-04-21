'use client'
import { CATEGORIES } from '@/types'
import { motion } from 'framer-motion'
import { useFilters } from '@/hooks/useFilters'

const BG_COLORS: Record<string, string> = {
  housing:     'linear-gradient(135deg,#1d4ed8,#3b82f6)',
  findhousing: 'linear-gradient(135deg,#6366f1,#818cf8)',
  jobs:        'linear-gradient(135deg,#059669,#34d399)',
  sell:        'linear-gradient(135deg,#d97706,#fbbf24)',
  services:    'linear-gradient(135deg,#7c3aed,#a78bfa)',
}

const SHADOW_COLORS: Record<string, string> = {
  housing:     'rgba(29,78,216,0.35)',
  findhousing: 'rgba(99,102,241,0.35)',
  jobs:        'rgba(5,150,105,0.35)',
  sell:        'rgba(217,119,6,0.35)',
  services:    'rgba(124,58,237,0.35)',
}

export default function CategoryGrid() {
  const { category, setFilter } = useFilters()

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 0' }}>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}
      >
        Категории
      </motion.h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {CATEGORIES.map((cat, i) => {
          const isActive = category === cat.id
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -5, boxShadow: `0 12px 32px ${SHADOW_COLORS[cat.id] || 'rgba(0,0,0,0.2)'}` }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter('category', isActive ? 'all' : cat.id)}
              style={{
                padding: '22px 12px',
                borderRadius: 18,
                background: BG_COLORS[cat.id],
                color: '#fff',
                textAlign: 'center',
                cursor: 'pointer',
                border: isActive ? '3px solid #fff' : '3px solid transparent',
                boxShadow: isActive
                  ? `0 0 0 3px ${SHADOW_COLORS[cat.id]?.replace('0.35', '0.8') || 'rgba(0,0,0,0.4)'}, 0 8px 24px ${SHADOW_COLORS[cat.id] || 'rgba(0,0,0,0.2)'}`
                  : `0 4px 16px ${SHADOW_COLORS[cat.id] || 'rgba(0,0,0,0.1)'}`,
                outline: 'none',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 9 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{cat.label}</div>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 4,
                  borderRadius: 2,
                  background: '#fff',
                  boxShadow: `0 2px 8px ${SHADOW_COLORS[cat.id] || 'rgba(0,0,0,0.3)'}`,
                }} />
              )}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
