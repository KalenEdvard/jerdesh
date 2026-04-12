'use client'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import { CATEGORIES } from '@/types'

const BG_COLORS: Record<string, string> = {
  housing:     'linear-gradient(135deg,#1d4ed8,#3b82f6)',
  findhousing: 'linear-gradient(135deg,#6366f1,#818cf8)',
  jobs:        'linear-gradient(135deg,#059669,#34d399)',
  sell:        'linear-gradient(135deg,#d97706,#fbbf24)',
  services:    'linear-gradient(135deg,#7c3aed,#a78bfa)',
}

export default function CategoryGrid() {
  const router = useRouter()
  const { setFilter } = useStore()

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 0' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Категории</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setFilter('category', cat.id); router.push(`/?cat=${cat.id}`) }}
            style={{ padding: '20px 12px', borderRadius: 16, background: BG_COLORS[cat.id], color: '#fff', textAlign: 'center', cursor: 'pointer', border: 'none', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{cat.label}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
