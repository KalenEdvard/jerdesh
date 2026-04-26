'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/store'
import type { Listing, Review } from '@/types'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import ChatModal from '@/components/chat/ChatModal'
import { toggleFavorite } from '@/lib/toggleFavorite'
import { createClient } from '@/lib/supabase-client'
import { FaWhatsapp, FaTelegram, FaVk, FaPhone } from 'react-icons/fa'
import MetroCard from '@/components/ui/MetroCard'
import { getMetroCardData } from '@/lib/metro-lines'

const CAT_LABELS: Record<string, string> = {
  housing: 'Сдаю жильё', findhousing: 'Сниму жильё',
  jobs: 'Работа', sell: 'Продаю', services: 'Услуга',
}

export default function ListingDetailClient({ listing, reviews: initialReviews }: { listing: Listing; reviews: Review[] }) {
  const { user, favIds, toggleFav, showToast, setAuthOpen, openChat } = useStore()
  const [photoIdx, setPhotoIdx] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const isFav = favIds.includes(listing.id)

  const hasMetroCard = !!(listing.metro && getMetroCardData(listing.metro, listing.city))
  const userPhotos = listing.photos ?? []
  const photoCount = userPhotos.length + (hasMetroCard ? 1 : 0)
  const prevPhoto = () => setPhotoIdx(i => (i - 1 + photoCount) % photoCount)
  const nextPhoto = () => setPhotoIdx(i => (i + 1) % photoCount)

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || photoCount < 2) return
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? nextPhoto() : prevPhoto()
    setTouchStartX(null)
  }

  useEffect(() => {
    const key = `viewed_${listing.id}`
    const last = localStorage.getItem(key)
    if (last && Date.now() - Number(last) < 86400_000) return
    localStorage.setItem(key, String(Date.now()))
    fetch(`/api/listings/${listing.id}/view`, { method: 'POST' }).catch(() => {})
  }, [listing.id])

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
      <div className="listing-detail-grid">

        {/* Left: photos + info */}
        <div>
          {/* Photos */}
          <div style={{ background: '#f1f5f9', borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
            {photoCount > 0 ? (
              <>
                <div
                  style={{ height: 420, position: 'relative', userSelect: 'none', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {hasMetroCard && photoIdx === 0 ? (
                    <MetroCard station={listing.metro!} city={listing.city} width={280} height={300} />
                  ) : (
                    <img src={userPhotos[hasMetroCard ? photoIdx - 1 : photoIdx]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    {listing.is_urgent && <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>🔴 Срочно</span>}
                    {listing.is_premium && <span style={{ background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>⭐ Топ</span>}
                  </div>

                  {/* Counter */}
                  {photoCount > 1 && (
                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                      {photoIdx + 1} / {photoCount}
                    </div>
                  )}

                  {/* Arrows */}
                  {photoCount > 1 && (
                    <>
                      <button onClick={prevPhoto} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#0f172a' }}>‹</button>
                      <button onClick={nextPhoto} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#0f172a' }}>›</button>
                    </>
                  )}
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

          {/* Main content card */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 16 }}>
            {/* Badges — только категория */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{CAT_LABELS[listing.category]}</span>
            </div>

            {/* 1. Заголовок */}
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: 14 }}>{listing.title}</h1>

            {/* 2. Описание */}
            {listing.description && (
              <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: 20 }}>{listing.description}</p>
            )}

            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 20 }} />

            {/* 3. Местоположение */}
            {(listing.city || listing.metro) && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 10 }}>МЕСТОПОЛОЖЕНИЕ</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {listing.city && (
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                      📍 {listing.city}
                    </div>
                  )}
                  {listing.metro && (
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                      🚇 м. {listing.metro}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 20 }} />

            {/* 4. Цена */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 6 }}>СТОИМОСТЬ</div>
              {listing.price ? (
                <div style={{ fontSize: 30, fontWeight: 900, color: '#1d4ed8', letterSpacing: '-0.5px' }}>
                  {listing.price.toLocaleString('ru')} ₽
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#94a3b8', marginLeft: 6 }}>/мес</span>
                </div>
              ) : (
                <div style={{ fontSize: 20, fontWeight: 700, color: '#64748b' }}>Договорная</div>
              )}
            </div>

            {/* Разделитель */}
            <div style={{ height: 1, background: '#f1f5f9', marginBottom: 16 }} />

            {/* 4. Мета: просмотры + дата */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <span style={{ fontSize: 16 }}>👁</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{listing.views}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>просмотров</div>
                </div>
              </div>
              <div style={{ width: 1, height: 36, background: '#f1f5f9' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, paddingLeft: 16 }}>
                <span style={{ fontSize: 16 }}>🕐</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{timeAgo}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>публикация</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Баа берүү ({reviews.length})</h3>

            {reviews.map(r => (
              <div key={r.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#1d4ed8' }}>
                    {(r.reviewer as any)?.name?.[0]?.toUpperCase() || 'У'}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{(r.reviewer as any)?.name || 'Пользователь'}</div>
                    <div style={{ fontSize: 14, color: '#f59e0b', letterSpacing: 2 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  </div>
                </div>
                {r.comment && <p style={{ fontSize: 13, color: '#334155', margin: 0 }}>{r.comment}</p>}
              </div>
            ))}

            {/* Review form */}
            {listing.user_id !== user?.id && (
              reviewDone ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#059669', fontWeight: 600, fontSize: 14 }}>
                  ✓ Баа берилди, рахмат!
                </div>
              ) : (
                <div style={{ borderTop: reviews.length > 0 ? '1px solid #f1f5f9' : 'none', paddingTop: reviews.length > 0 ? 16 : 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Баа бер:</p>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    {[1,2,3,4,5].map(star => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (!user) { setAuthOpen(true); return }
                          setReviewRating(star)
                        }}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: star <= (reviewHover || reviewRating) ? '#f59e0b' : '#e2e8f0', padding: 0, lineHeight: 1 }}
                      >
                        ★
                      </motion.button>
                    ))}
                    {reviewRating > 0 && (
                      <span style={{ fontSize: 12, color: '#64748b', alignSelf: 'center', marginLeft: 4 }}>
                        {['','Начар','Жаман эмес','Жакшы','Абдан жакшы','Мыкты!'][reviewRating]}
                      </span>
                    )}
                  </div>
                  {/* Comment */}
                  {reviewRating > 0 && (
                    <>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Комментарий (милдетсиз)..."
                        rows={3}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 10 }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={reviewLoading}
                        onClick={async () => {
                          if (!user) { setAuthOpen(true); return }
                          setReviewLoading(true)
                          const res = await fetch('/api/reviews', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reviewed_id: listing.user_id, listing_id: listing.id, rating: reviewRating, comment: reviewComment }),
                          })
                          const json = await res.json()
                          setReviewLoading(false)
                          if (!res.ok) { showToast(json.error || 'Ката', 'error'); return }
                          setReviews(prev => [json, ...prev])
                          setReviewDone(true)
                        }}
                        style={{ width: '100%', padding: '11px', borderRadius: 12, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: reviewLoading ? 'default' : 'pointer' }}
                      >
                        {reviewLoading ? 'Жөнөтүлүүдө...' : 'Баа жөнөт'}
                      </motion.button>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right: seller card + actions */}
        <div className="listing-detail-sidebar">
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 16 }}>АВТОР</h3>
            <Link href={`/users/${listing.user_id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                {listing.user?.name?.[0]?.toUpperCase() || 'У'}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{listing.user?.name || 'Пользователь'}</div>
                {listing.user?.rating ? (
                  <div style={{ fontSize: 13, color: '#f59e0b' }}>★ {listing.user.rating}</div>
                ) : null}
                <div style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 600 }}>Профилди көрүү →</div>
              </div>
            </Link>

            {/* Phone */}
            {listing.phone && (
              <a href={`tel:${listing.phone}`}
                style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 10, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                <FaPhone size={16} /> {listing.phone}
              </a>
            )}

            {/* Messengers */}
            {((listing.user as any)?.whatsapp || (listing.user as any)?.telegram || (listing.user as any)?.vk || (listing.user as any)?.max) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                {(listing.user as any)?.whatsapp && (
                  <a href={`https://wa.me/${(listing.user as any).whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: '#dcfce7', color: '#166534', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid #bbf7d0' }}>
                    <FaWhatsapp size={20} color="#25d366" /> WhatsApp
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#4ade80' }}>Написать →</span>
                  </a>
                )}
                {(listing.user as any)?.telegram && (
                  <a href={`https://t.me/${(listing.user as any).telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: '#eff6ff', color: '#1e40af', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                    <FaTelegram size={20} color="#2aabee" /> Telegram
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#60a5fa' }}>Написать →</span>
                  </a>
                )}
                {(listing.user as any)?.vk && (
                  <a href={`https://vk.com/${(listing.user as any).vk}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: '#eff6ff', color: '#1e3a5f', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid #bfdbfe' }}>
                    <FaVk size={20} color="#4680c2" /> ВКонтакте
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#4680c2' }}>Написать →</span>
                  </a>
                )}
                {(listing.user as any)?.max && (
                  <a href={`https://max.ru/${(listing.user as any).max.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: '#fff7ed', color: '#9a3412', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1px solid #fed7aa' }}>
                    <span style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(135deg,#ff6b35,#f7c59f)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0 }}>M</span> Max
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#fb923c' }}>Написать →</span>
                  </a>
                )}
              </div>
            )}

            <button
              onClick={handleChat}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#fff', color: '#1d4ed8', fontSize: 15, fontWeight: 700, border: '2px solid #1d4ed8', marginBottom: 10, cursor: 'pointer' }}
            >
              💬 Написать в чат
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
