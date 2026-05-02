'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useStore } from '@/store'
import { MapPin, MessageSquare, Package } from 'lucide-react'
import ListingCard from '@/components/listings/ListingCard'
import type { Listing } from '@/types'

type ProfileUser = { id: string; name: string; avatar_url?: string; city: string; rating: number; ads_count: number; created_at: string }
type Review = { id: string; rating: number; comment: string; created_at: string; reviewer_id: string; reviewer?: { id: string; name: string; avatar_url?: string } }
type ListingRating = { id: string; rating: number; comment: string; created_at: string; rater_id: string; listing_id: string; listing_title: string; rater?: { id: string; name: string; avatar_url?: string } }

const RATING_LABELS = ['', 'Начар', 'Жаман эмес', 'Жакшы', 'Абдан жакшы', 'Мыкты!']

export default function UserProfileClient({
  profileUser,
  listings: initialListings,
  reviews: initialReviews,
  listingRatings: initialListingRatings,
}: {
  profileUser: ProfileUser
  listings: Listing[]
  reviews: Review[]
  listingRatings: ListingRating[]
}) {
  const { user, setAuthOpen, showToast } = useStore()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [listingRatings] = useState<ListingRating[]>(initialListingRatings)
  const [tab, setTab] = useState<'listings' | 'reviews'>('listings')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const myExisting = user ? reviews.find(r => r.reviewer_id === user.id) : null
  const isOwn = user?.id === profileUser.id
  const memberSince = new Date(profileUser.created_at).toLocaleDateString('ru', { month: 'long', year: 'numeric' })
  const allRatings = [...reviews.map(r => Number(r.rating)), ...listingRatings.map(r => Number(r.rating))]
  const totalRatingsCount = allRatings.length
  const avgRating = totalRatingsCount ? (allRatings.reduce((s, v) => s + v, 0) / totalRatingsCount).toFixed(1) : Number(profileUser.rating || 0).toFixed(1)

  const handleSubmitReview = async () => {
    if (!user) { setAuthOpen(true); return }
    if (!rating) { showToast('Жылдыз тандаңыз', 'error'); return }
    setLoading(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewed_id: profileUser.id, rating, comment }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { showToast(json.error || 'Ката', 'error'); return }
    // Update or insert in local state
    setReviews(prev => {
      const filtered = prev.filter(r => r.reviewer_id !== user.id)
      return [json, ...filtered]
    })
    setSubmitted(true)
    showToast(json.isUpdate ? 'Баа жаңыртылды!' : 'Баа берилди, рахмат!', 'ok')
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px 60px' }}>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 28, marginBottom: 20, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {/* Avatar */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          {profileUser.avatar_url
            ? <Image src={profileUser.avatar_url} alt={profileUser.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
            : profileUser.name?.[0]?.toUpperCase() || 'У'}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{profileUser.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', color: '#64748b', fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{profileUser.city}</span>
            <span>С {memberSince}</span>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>{'★'} {avgRating}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{totalRatingsCount} баа</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1d4ed8' }}>{initialListings.length}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>жарнама</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f1f5f9', borderRadius: 14, padding: 4 }}>
        {([['listings', <Package size={15} />, 'Жарнамалар'], ['reviews', <MessageSquare size={15} />, 'Баалар']] as const).map(([key, icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 700, background: tab === key ? '#fff' : 'transparent', color: tab === key ? '#1d4ed8' : '#64748b', boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}
          >
            {icon} {label}
            {key === 'listings' && <span style={{ background: '#1d4ed8', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>{initialListings.length}</span>}
            {key === 'reviews' && <span style={{ background: '#f59e0b', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>{totalRatingsCount}</span>}
          </button>
        ))}
      </div>

      {/* Listings tab */}
      {tab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {initialListings.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Активдүү жарнамалар жок</div>
          )}
          {initialListings.map(l => (
            <ListingCard key={l.id} listing={l as any} />
          ))}
        </div>
      )}

      {/* Reviews tab */}
      {tab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Leave review form */}
          {!isOwn && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 14 }}>
                {myExisting ? '✏️ Бааңызды жаңыртыңыз' : '⭐ Баа бериңиз'}
              </h3>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: 16, color: '#059669', fontWeight: 700, fontSize: 15 }}>✓ Баа берилди, рахмат!</div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                    {[1,2,3,4,5].map(s => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { if (!user) { setAuthOpen(true); return } setRating(s); setSubmitted(false) }}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 32, color: s <= (hover || rating || (myExisting?.rating ?? 0)) ? '#f59e0b' : '#e2e8f0', padding: 0, lineHeight: 1 }}
                      >★</motion.button>
                    ))}
                    {(rating || (myExisting?.rating ?? 0)) > 0 && (
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{RATING_LABELS[rating || (myExisting?.rating ?? 0)]}</span>
                    )}
                  </div>
                  {(rating > 0 || myExisting) && (
                    <>
                      <textarea
                        value={comment || (myExisting?.comment ?? '')}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Комментарий (милдетсиз)..."
                        rows={3}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 10 }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !rating}
                        onClick={handleSubmitReview}
                        style={{ width: '100%', padding: 12, borderRadius: 12, background: rating ? 'linear-gradient(135deg,#1d4ed8,#7c3aed)' : '#e2e8f0', color: rating ? '#fff' : '#94a3b8', fontSize: 14, fontWeight: 700, border: 'none', cursor: rating ? 'pointer' : 'default' }}
                      >
                        {loading ? 'Жөнөтүлүүдө...' : myExisting ? 'Жаңыртуу' : 'Баа жөнөт'}
                      </motion.button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Reviews list */}
          {totalRatingsCount === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Азырынча баалар жок</div>
          )}

          {/* Direct user reviews */}
          {reviews.map(r => (
            <motion.div
              key={`rev-${r.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: r.comment ? 8 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#1d4ed8', flexShrink: 0 }}>
                  {r.reviewer?.name?.[0]?.toUpperCase() || 'У'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.reviewer?.name || 'Пользователь'}</div>
                  <div style={{ fontSize: 15, color: '#f59e0b', letterSpacing: 2 }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 6, letterSpacing: 0 }}>{RATING_LABELS[r.rating]}</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {new Date(r.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              {r.comment && <p style={{ fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>}
            </motion.div>
          ))}

          {/* Listing ratings */}
          {listingRatings.map(r => (
            <motion.div
              key={`lr-${r.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: r.comment ? 8 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#1d4ed8', flexShrink: 0 }}>
                  {r.rater?.name?.[0]?.toUpperCase() || 'У'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.rater?.name || 'Пользователь'}</div>
                  <div style={{ fontSize: 15, color: '#f59e0b', letterSpacing: 2 }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 6, letterSpacing: 0 }}>{RATING_LABELS[r.rating]}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>📋 {r.listing_title}</div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
                  {new Date(r.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              {r.comment && <p style={{ fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
