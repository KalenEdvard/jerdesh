'use client'
import Link from 'next/link'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import type { Listing } from '@/types'
import { motion } from 'framer-motion'
import { MapPin, Eye, Star, Heart, Clock } from 'lucide-react'
import { toggleFavorite } from '@/lib/toggleFavorite'

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

function getTimeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600) {
    const m = Math.max(1, Math.floor(diff / 60))
    return `${m} ${plural(m, 'минуту', 'минуты', 'минут')} назад`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return `${h} ${plural(h, 'час', 'часа', 'часов')} назад`
  }
  if (diff < 86400 * 30) {
    const d = Math.floor(diff / 86400)
    return `${d} ${plural(d, 'день', 'дня', 'дней')} назад`
  }
  const mo = Math.floor(diff / (86400 * 30))
  return `${mo} ${plural(mo, 'месяц', 'месяца', 'месяцев')} назад`
}

const CAT_COLORS: Record<string, string> = {
  housing:     '#1d4ed8',
  findhousing: '#6366f1',
  jobs:        '#059669',
  sell:        '#d97706',
  services:    '#7c3aed',
}
const CAT_GRADIENTS: Record<string, string> = {
  housing:     'linear-gradient(135deg,#1d4ed8,#3b82f6)',
  findhousing: 'linear-gradient(135deg,#6366f1,#818cf8)',
  jobs:        'linear-gradient(135deg,#059669,#34d399)',
  sell:        'linear-gradient(135deg,#d97706,#fbbf24)',
  services:    'linear-gradient(135deg,#7c3aed,#a78bfa)',
}
const CAT_LABELS: Record<string, string> = {
  housing:     'Сдаю жильё',
  findhousing: 'Сниму жильё',
  jobs:        'Работа',
  sell:        'Продаю',
  services:    'Услуга',
}
const CAT_ICONS: Record<string, string> = {
  housing: '🏠', findhousing: '🔍', jobs: '💼', sell: '🛍️', services: '🔧',
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const { user, favIds, toggleFav, showToast, setAuthOpen } = useStore()
  const isFav = favIds.includes(listing.id)

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { setAuthOpen(true); return }
    const supabase = createClient()
    const saved = await toggleFavorite(supabase, user.id, listing.id)
    toggleFav(listing.id)
    showToast(saved ? 'Добавлено в избранное ❤️' : 'Удалено из избранного', saved ? 'ok' : 'info')
  }

  const timeAgo = getTimeAgo(listing.created_at)
  const catColor = CAT_COLORS[listing.category] || '#1d4ed8'
  const catGradient = CAT_GRADIENTS[listing.category] || 'linear-gradient(135deg,#1d4ed8,#3b82f6)'
  const catLabel = CAT_LABELS[listing.category] || listing.category
  const catIcon = CAT_ICONS[listing.category] || '📌'
  const photo = listing.photos?.[0]

  return (
    <motion.div
      whileHover={{ boxShadow: '0 8px 32px rgba(15,23,42,0.16)' }}
      transition={{ duration: 0.15 }}
      style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #c8d4e6', boxShadow: '0 2px 12px rgba(15,23,42,0.09)' }}
    >
      <Link href={`/listings/${listing.id}`} style={{ display: 'flex', textDecoration: 'none', position: 'relative', minHeight: 110 }}>

        {/* Left: photo */}
        <div style={{ width: 120, minWidth: 120, position: 'relative', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
          {/* Category accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: catGradient, zIndex: 2 }} />
          {photo ? (
            <img src={photo} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: catGradient + '22' }}>
              <span style={{ fontSize: 36 }}>{catIcon}</span>
            </div>
          )}
          {/* Badges */}
          {(listing.is_premium || listing.is_urgent) && (
            <div style={{ position: 'absolute', bottom: 6, left: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {listing.is_premium && <span style={{ background: '#f59e0b', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>⭐ Топ</span>}
              {listing.is_urgent && <span style={{ background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>🔴 Срочно</span>}
            </div>
          )}
        </div>

        {/* Right: content */}
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          {/* Category + metro */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ background: catGradient, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{catLabel}</span>
            {listing.metro && (
              <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 2 }}>
                <MapPin size={10} /> м. {listing.metro}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
            {listing.title}
          </h3>

          {/* Price */}
          {listing.price ? (
            <div style={{ fontSize: 17, fontWeight: 800, color: catColor, letterSpacing: '-0.3px' }}>
              {listing.price.toLocaleString('ru')} ₽
              <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 3 }}>/мес</span>
            </div>
          ) : (
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Договорная</div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 0, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>
                {listing.user?.name?.[0]?.toUpperCase() || 'У'}
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.user?.name || 'Аноним'}
              </span>
            </div>
            <div style={{ width: 1, height: 12, background: '#e2e8f0', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8', padding: '0 8px' }}>
              <Eye size={11} />
              <span style={{ fontSize: 11 }}>{listing.views ?? 0}</span>
            </div>
            <div style={{ width: 1, height: 12, background: '#e2e8f0', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8', paddingLeft: 8 }}>
              <Clock size={11} />
              <span style={{ fontSize: 11 }}>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Fav button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFav}
          style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 3 }}
        >
          <Heart size={14} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : '#64748b'} />
        </motion.button>

      </Link>
    </motion.div>
  )
}
