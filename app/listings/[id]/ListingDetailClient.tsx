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

  const [listingRating, setListingRating] = useState({ avg: 0, count: 0, mine: 0, hover: 0 })
  const [ratingComments, setRatingComments] = useState<any[]>([])
  const [myRatingComment, setMyRatingComment] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [pendingStar, setPendingStar] = useState(0)
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/listings/rate?listing_id=${listing.id}`)
      .then(r => r.json())
      .then(d => {
        setListingRating(s => ({ ...s, avg: d.avgRating, count: d.ratingCount, mine: d.myRating || 0 }))
        setRatingComments(d.comments || [])
        setMyRatingComment(d.myComment || '')
      })
      .catch(() => {})
  }, [listing.id])

  const handleListingRate = async (star: number, comment = '') => {
    if (!user) { setAuthOpen(true); return }
    setCommentLoading(true)
    const res = await fetch('/api/listings/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listing.id, rating: star, comment }),
    })
    const json = await res.json()
    setCommentLoading(false)
    if (res.ok) {
      setListingRating(s => ({ ...s, avg: json.avgRating, count: json.ratingCount, mine: json.myRating }))
      setRatingComments(json.comments || [])
      setMyRatingComment(json.myComment || comment)
      setShowCommentBox(false)
      setPendingStar(0)
      showToast('Баа берилди!', 'ok')
    } else {
      showToast(json.error || 'Ката', 'error')
    }
  }

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
          <div style={{ position: 'relative', borderRadius: 20, marginBottom: 20, userSelect: 'none' }}>
            {photoCount > 0 ? (
              <>
                {/* Main photo area — overflow:hidden для border-radius, без стрелок */}
                <div
                  style={{ background: '#f1f5f9', borderRadius: 20, overflow: 'hidden' }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div style={{ height: 420, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {hasMetroCard && photoIdx === 0 ? (
                      <MetroCard station={listing.metro!} city={listing.city} width={280} height={300} />
                    ) : (
                      <img src={userPhotos[hasMetroCard ? photoIdx - 1 : photoIdx]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#f8fafc' }} />
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
                  </div>

                  {listing.photos.length > 1 && (
                    <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto', background: '#f1f5f9' }}>
                      {listing.photos.map((p, i) => {
                        const thumbIdx = hasMetroCard ? i + 1 : i
                        return (
                          <img key={i} src={p} onClick={() => setPhotoIdx(thumbIdx)} alt=""
                            style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 10, cursor: 'pointer', flexShrink: 0,
                              border: thumbIdx === photoIdx ? '2px solid #1d4ed8' : '2px solid transparent',
                              opacity: thumbIdx === photoIdx ? 1 : 0.6 }} />
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Стрелки — вне overflow:hidden, позиционируются по обёртке */}
                {photoCount > 1 && (
                  <>
                    <button onClick={prevPhoto} style={{ position: 'absolute', left: 10, top: 210, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.25)', color: '#0f172a', zIndex: 10 }}>‹</button>
                    <button onClick={nextPhoto} style={{ position: 'absolute', right: 10, top: 210, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.25)', color: '#0f172a', zIndex: 10 }}>›</button>
                  </>
                )}
              </>
            ) : (
              <div style={{ height: 300, background: '#f1f5f9', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
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

            {/* Телефон объявления */}
            {listing.phone && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 8 }}>БАЙЛАНЫШ НОМЕРИ</div>
                <a href={`tel:${listing.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1.5px solid #bfdbfe' }}>
                  📞 {listing.phone}
                </a>
              </div>
            )}

            {/* Разделитель */}
            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0 16px' }} />

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

          {/* Блок рейтинга объявления */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              {/* Левая часть: средний рейтинг */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 8 }}>БУЛ ЖАРНАМАНЫ БААЛАҢЫЗ</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: listingRating.count > 0 ? '#f59e0b' : '#e2e8f0', lineHeight: 1 }}>
                    {listingRating.count > 0 ? listingRating.avg.toFixed(1) : '—'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ fontSize: 16, color: s <= Math.round(listingRating.avg) && listingRating.count > 0 ? '#f59e0b' : '#e2e8f0' }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {listingRating.count > 0 ? `${listingRating.count} баа` : 'Баа жок'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая часть: интерактивные звёзды */}
              <div style={{ textAlign: 'center' }}>
                {listing.user_id === user?.id ? (
                  <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Өзүңдүн жарнамаңды баалай албайсың</div>
                ) : (
                  <>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>
                      {listingRating.mine > 0 ? `Сенин баааң: ${listingRating.mine} жылдыз` : 'Жылдыз басып баала:'}
                    </div>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      {[1,2,3,4,5].map(star => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (!user) { setAuthOpen(true); return }
                            setPendingStar(star)
                            setShowCommentBox(true)
                          }}
                          onMouseEnter={() => setListingRating(s => ({ ...s, hover: star }))}
                          onMouseLeave={() => setListingRating(s => ({ ...s, hover: 0 }))}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 36, padding: 0, lineHeight: 1,
                            color: star <= (listingRating.hover || pendingStar || listingRating.mine) ? '#f59e0b' : '#e2e8f0',
                            filter: star <= (listingRating.hover || pendingStar || listingRating.mine) ? 'drop-shadow(0 0 4px #f59e0b88)' : 'none',
                            transition: 'color 0.1s, filter 0.1s',
                          }}
                        >★</motion.button>
                      ))}
                    </div>
                    {listingRating.mine > 0 && !showCommentBox && (
                      <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginTop: 6 }}>✓ Баа берилди — автордун рейтинги жаңыртылды</div>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Comment box — appears after star click */}
            {showCommentBox && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                  Комментарий (милдетсиз):
                </div>
                <textarea
                  value={myRatingComment}
                  onChange={e => setMyRatingComment(e.target.value)}
                  placeholder="Кыскача пикириңизди жазыңыз..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#334155' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => { setShowCommentBox(false); setPendingStar(0); setMyRatingComment('') }}
                    style={{ padding: '9px 18px', borderRadius: 10, background: '#f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                  >
                    Жок кылуу
                  </button>
                  <button
                    disabled={commentLoading}
                    onClick={() => handleListingRate(pendingStar, myRatingComment)}
                    style={{ padding: '9px 22px', borderRadius: 10, background: '#1d4ed8', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: commentLoading ? 'not-allowed' : 'pointer', opacity: commentLoading ? 0.7 : 1 }}
                  >
                    {commentLoading ? 'Жөнөтүлүүдө...' : 'Жөнөтүү'}
                  </button>
                </div>
              </div>
            )}

            {/* Comments list */}
            {ratingComments.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 12 }}>ПИКИРЛЕР</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ratingComments.map((c, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {c.rater?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{c.rater?.name || 'Колдонуучу'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ fontSize: 12, color: s <= c.rating ? '#f59e0b' : '#e2e8f0' }}>★</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{c.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

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

            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0 16px' }} />
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 12, letterSpacing: '0.05em' }}>БАЙЛАНЫШ</h3>

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
