'use client'
import Link from 'next/link'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import type { Listing } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

const CAT_COLORS: Record<string, string> = {
  housing:     '#1d4ed8',
  findhousing: '#6366f1',
  jobs:        '#059669',
  sell:        '#d97706',
  services:    '#7c3aed',
}
const CAT_LABELS: Record<string, string> = {
  housing:     'Сдаю жильё',
  findhousing: 'Сниму жильё',
  jobs:        'Работа',
  sell:        'Продаю',
  services:    'Услуга',
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const { user, favIds, toggleFav, showToast, setAuthOpen } = useStore()

  const isFav = favIds.includes(listing.id)

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { setAuthOpen(true); return }
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('favorites').select('id').eq('listing_id', listing.id).eq('user_id', user.id).single()
    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id)
      toggleFav(listing.id)
      showToast('Удалено из избранного', 'info')
    } else {
      await supabase.from('favorites').insert({ listing_id: listing.id, user_id: user.id })
      toggleFav(listing.id)
      showToast('Добавлено в избранное ❤️', 'ok')
    }
  }

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: ru })
  const catColor = CAT_COLORS[listing.category] || '#1d4ed8'
  const catLabel = CAT_LABELS[listing.category] || listing.category
  const photo = listing.photos?.[0]

  return (
    <Link
      href={`/listings/${listing.id}`}
      style={{ display: 'block', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none', position: 'relative' }}
      className="listing-card"
    >
      {/* Photo */}
      <div style={{ height: 180, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <img src={photo} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#cbd5e1' }}>
            {listing.category === 'housing' || listing.category === 'findhousing' ? '🏠' : listing.category === 'jobs' ? '💼' : listing.category === 'sell' ? '🛍️' : '🔧'}
          </div>
        )}
        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          {listing.is_urgent && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>Срочно</span>
          )}
          {listing.is_premium && (
            <span style={{ background: '#f59e0b', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>⭐ Топ</span>
          )}
        </div>
        {/* Favorite button */}
        <button
          onClick={handleFav}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer', backdropFilter: 'blur(4px)' }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        {/* Category + metro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: catColor, background: catColor + '18', padding: '2px 8px', borderRadius: 20 }}>
            {catLabel}
          </span>
          {listing.metro && (
            <span style={{ fontSize: 11, color: '#64748b' }}>🚇 {listing.metro}</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {listing.title}
        </h3>

        {/* Price */}
        {listing.price ? (
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1d4ed8', marginBottom: 8 }}>
            {listing.price.toLocaleString('ru')} ₽<span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>/мес</span>
          </div>
        ) : (
          <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Договорная</div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: catColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: catColor }}>
              {listing.user?.name?.[0]?.toUpperCase() || 'У'}
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>{listing.user?.name || 'Пользователь'}</span>
            {listing.user?.rating && (
              <span style={{ fontSize: 11, color: '#f59e0b' }}>★ {listing.user.rating}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94a3b8' }}>
            <span>👁 {listing.views}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
