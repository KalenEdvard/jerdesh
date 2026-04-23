'use client'
import Link from 'next/link'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import type { Listing } from '@/types'
import { motion } from 'framer-motion'
import { MapPin, Eye, Star, Heart } from 'lucide-react'
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
      whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(15,23,42,0.18)' }}
      transition={{ duration: 0.2 }}
      style={{ borderRadius: 18, overflow: 'hidden', background: '#fff', border: '1px solid #c8d4e6', boxShadow: '0 4px 20px rgba(15,23,42,0.13)' }}
    >
      <Link href={`/listings/${listing.id}`} style={{ display: 'block', textDecoration: 'none', position: 'relative' }}>
        {/* Category accent bar */}
        <div style={{ height: 4, background: catGradient }} />
        {/* Photo */}
        <div style={{ height: 160, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
          {photo ? (
            <img src={photo} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: catGradient, opacity: 0.12 }}>
              <span style={{ fontSize: 52, opacity: 0.6 }}>{catIcon}</span>
            </div>
          )}
          {!photo && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 52 }}>{catIcon}</span>
            </div>
          )}

          {/* Gradient overlay bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
            {listing.is_premium && (
              <span style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>⭐ Топ</span>
            )}
            {listing.is_urgent && (
              <span style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>🔴 Срочно</span>
            )}
          </div>

          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFav}
            style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          >
            <Heart size={16} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : '#64748b'} />
          </motion.button>

          {/* Category pill on photo */}
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <span style={{ background: catGradient, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, boxShadow: `0 2px 8px ${catColor}55` }}>
              {catLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px' }}>
          {/* Metro */}
          {listing.metro && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <MapPin size={11} color="#94a3b8" />
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>м. {listing.metro}</span>
            </div>
          )}

          {/* Title */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {listing.title}
          </h3>

          {/* Price */}
          {listing.price ? (
            <div style={{ fontSize: 19, fontWeight: 800, color: catColor, marginBottom: 10, letterSpacing: '-0.5px' }}>
              {listing.price.toLocaleString('ru')} ₽
              <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8', marginLeft: 4 }}>/мес</span>
            </div>
          ) : (
            <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Договорная</div>
          )}

          {/* Footer */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Author + rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: catGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {listing.user?.name?.[0]?.toUpperCase() || 'У'}
              </div>
              <span style={{ fontSize: 12, color: '#334155', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.user?.name || 'Пользователь'}
              </span>
              {listing.user?.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#fffbeb', borderRadius: 8, padding: '2px 7px' }}>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: 11, color: '#d97706', fontWeight: 700 }}>{listing.user.rating}</span>
                </div>
              )}
            </div>
            {/* Views + time */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8' }}>
                <Eye size={12} />
                <span style={{ fontSize: 11 }}>{listing.views ?? 0} просмотров</span>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{timeAgo}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
