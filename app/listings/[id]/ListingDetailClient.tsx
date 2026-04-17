'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import type { Listing, Review } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import ChatModal from '@/components/chat/ChatModal'
import { toggleFavorite } from '@/lib/toggleFavorite'
import { createClient } from '@/lib/supabase-client'

const CAT_LABELS: Record<string, string> = {
  housing: 'Сдаю жильё', findhousing: 'Сниму жильё',
  jobs: 'Работа', sell: 'Продаю', services: 'Услуга',
}

export default function ListingDetailClient({ listing, reviews }: { listing: Listing; reviews: Review[] }) {
  const { user, favIds, toggleFav, showToast, setAuthOpen, openChat } = useStore()
  const [photoIdx, setPhotoIdx] = useState(0)
  const isFav = favIds.includes(listing.id)

  const handleFav = async () => {
    if (!user) { setAuthOpen(true); return }
    const supabase = createClient()
    const saved = await toggleFavorite(supabase, user.id, listing.id)
    toggleFav(listing.id)
    showToast(saved ? 'Добавлено в избранное ❤️' : 'Удалено из избранного', saved ? 'ok' : 'info')
  }

  const handleChat = () => {
    if (!user) { setAuthOpen(true); return }
    openChat(listing.id)
  }

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: ru })

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Left: photos + info */}
        <div>
          {/* Photos */}
          <div style={{ background: '#f1f5f9', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
            {listing.photos?.length ? (
              <>
                <div style={{ height: 420, position: 'relative' }}>
                  <img src={listing.photos[photoIdx]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    {listing.is_urgent && <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>🔴 Срочно</span>}
                    {listing.is_premium && <span style={{ background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>⭐ Топ</span>}
                  </div>
                </div>
                {listing.photos.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto' }}>
                    {listing.photos.map((p, i) => (
                      <img key={i} src={p} onClick={() => setPhotoIdx(i)} alt="" style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 10, cursor: 'pointer', border: i === photoIdx ? '2px solid #1d4ed8' : '2px solid transparent', opacity: i === photoIdx ? 1 : 0.6 }} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                {listing.category === 'housing' ? '🏠' : listing.category === 'jobs' ? '💼' : '🔧'}
              </div>
            )}
          </div>

          {/* Title + meta */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{CAT_LABELS[listing.category]}</span>
              {listing.metro && <span style={{ background: '#f8fafc', color: '#334155', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>🚇 {listing.metro}</span>}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{listing.title}</h1>
            {listing.price ? (
              <div style={{ fontSize: 28, fontWeight: 900, color: '#1d4ed8', marginBottom: 12 }}>
                {listing.price.toLocaleString('ru')} ₽<span style={{ fontSize: 16, fontWeight: 500, color: '#64748b' }}>/мес</span>
              </div>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Договорная</div>
            )}
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
              <span>👁 {listing.views} просмотров</span>
              <span>🕐 {timeAgo}</span>
              <span>📍 {listing.city}</span>
            </div>
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Отзывы о продавце</h3>
              {reviews.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#1d4ed8' }}>
                      {(r.reviewer as any)?.name?.[0]?.toUpperCase() || 'У'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{(r.reviewer as any)?.name || 'Пользователь'}</div>
                      <div style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#334155' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: seller card + actions */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 16 }}>ПРОДАВЕЦ</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                {listing.user?.name?.[0]?.toUpperCase() || 'У'}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{listing.user?.name || 'Пользователь'}</div>
                {listing.user?.rating && (
                  <div style={{ fontSize: 13, color: '#f59e0b' }}>★ {listing.user.rating} · {listing.user.ads_count} объявлений</div>
                )}
                <div style={{ fontSize: 11, color: '#94a3b8' }}>На сайте с {new Date(listing.user?.created_at || '').toLocaleDateString('ru', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            <button
              onClick={() => listing.phone ? window.open(`tel:${listing.phone}`) : showToast('Телефон скрыт', 'info')}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 10, cursor: 'pointer', border: 'none' }}
            >
              📞 Позвонить
            </button>
            <button
              onClick={handleChat}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#fff', color: '#1d4ed8', fontSize: 15, fontWeight: 700, border: '2px solid #1d4ed8', marginBottom: 10, cursor: 'pointer' }}
            >
              💬 Написать
            </button>
            <button
              onClick={handleFav}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#fff', color: isFav ? '#ef4444' : '#64748b', fontSize: 14, fontWeight: 600, border: '1.5px solid #e2e8f0', cursor: 'pointer' }}
            >
              {isFav ? '❤️ В избранном' : '🤍 В избранное'}
            </button>
          </div>

          {/* Safety tips */}
          <div style={{ background: '#f0fdf4', borderRadius: 16, border: '1px solid #bbf7d0', padding: 18 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 10 }}>🛡️ Безопасность</h4>
            {['Встречайтесь в людных местах', 'Проверьте жильё перед оплатой', 'Не переводите деньги заранее', 'Не давайте личные данные'].map(tip => (
              <div key={tip} style={{ fontSize: 12, color: '#166534', marginBottom: 6 }}>✓ {tip}</div>
            ))}
          </div>
        </div>
      </div>

      <ChatModal listingId={listing.id} receiverId={listing.user_id} />
    </div>
  )
}
