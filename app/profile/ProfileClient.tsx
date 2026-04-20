'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import type { Listing } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MapPin, Plus, RefreshCw, Settings, Heart, Package, Trash2, Camera, Clock, Archive, Pencil } from 'lucide-react'

type Tab = 'ads' | 'drafts' | 'favs' | 'settings'
type FavoriteRow = { listing: Listing | null }

function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

function memberSince(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 30) return `На сайте ${days} ${plural(days, ['день', 'дня', 'дней'])}`
  const months = Math.floor(days / 30.44)
  if (months < 12) return `На сайте ${months} ${plural(months, ['месяц', 'месяца', 'месяцев'])}`
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const yearStr = `${years} ${plural(years, ['год', 'года', 'лет'])}`
  if (remMonths === 0) return `На сайте ${yearStr}`
  return `На сайте ${yearStr} и ${remMonths} ${plural(remMonths, ['месяц', 'месяца', 'месяцев'])}`
}

export interface ProfileData {
  id: string
  name: string
  email: string
  city?: string
  rating?: number
  avatar_url?: string
  phone?: string
  whatsapp?: string
  telegram?: string
  vk?: string
  created_at: string
  ads_count?: number
}

interface Props {
  profile: ProfileData
  initialListings: Listing[]
  initialFavs: Listing[]
}

function ProfileInner({ profile, initialListings, initialFavs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, showToast } = useStore()
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') ?? 'ads') as Tab)

  const [myListings, setMyListings] = useState<Listing[]>(initialListings)
  const [favListings] = useState<Listing[]>(initialFavs)
  const [name, setName] = useState(profile.name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || '')
  const [telegram, setTelegram] = useState(profile.telegram || '')
  const [vk, setVk] = useState(profile.vk || '')
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)

  const supabase = createClient()

  // Синхронизируем профиль в Zustand для навбара и других компонентов
  useEffect(() => {
    setUser(profile as any)
  }, [profile.id])

  const uploadAvatar = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) { showToast('Файл больше 4MB', 'error'); return }
    setAvatarUploading(true)
    try {
      // Шаг 1: сервер проверяет авторизацию и возвращает signed upload URL
      const signRes = await fetch('/api/profile/upload-avatar-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: file.type }),
      })
      const signJson = await signRes.json().catch(() => ({ error: 'Некорректный ответ сервера' }))
      if (!signRes.ok) {
        showToast(`Ошибка: ${signJson.error || signRes.statusText}`, 'error')
        return
      }

      const { signedUrl, publicUrl } = signJson

      // Шаг 2: прямой PUT по signed URL — надёжнее чем SDK uploadToSignedUrl
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => uploadRes.statusText)
        showToast(`Ошибка загрузки: ${errText}`, 'error')
        return
      }

      const urlWithBust = `${publicUrl}?t=${Date.now()}`

      // Сначала обновляем UI, потом fire-and-forget в БД
      setCurrentProfile(p => ({ ...p, avatar_url: urlWithBust }))
      setUser({ ...profile, avatar_url: urlWithBust } as any)
      showToast('Фото обновлено ✓', 'ok')

      supabase.from('users').update({ avatar_url: publicUrl }).eq('id', profile.id).then(() => {})
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Ошибка загрузки'
      showToast(message, 'error')
    } finally {
      setAvatarUploading(false)
    }
  }

  const deleteListing = async (id: string) => {
    const res = await fetch('/api/listings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'draft' }),
    })
    if (!res.ok) { showToast('Ошибка удаления', 'error'); return }
    setMyListings(prev => prev.map(l => l.id === id ? { ...l, status: 'draft' as const } : l))
    showToast('Объявление перенесено в черновики', 'info')
  }

  const renewListing = async (id: string) => {
    const res = await fetch('/api/listings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'active' }),
    })
    if (!res.ok) { showToast('Ошибка публикации', 'error'); return }
    setMyListings(prev => prev.map(l => l.id === id ? { ...l, status: 'active' as const } : l))
    showToast('Объявление снова активно! ✓', 'ok')
  }

  const saveSettings = async () => {
    setSaving(true)
    await supabase.from('users').update({ name, phone, whatsapp, telegram, vk }).eq('id', profile.id)
    setUser({ ...profile, name, phone, whatsapp, telegram, vk } as any)
    showToast('Профиль обновлён ✓', 'ok')
    setSaving(false)
  }

  const activeListings = myListings.filter(l => l.status === 'active')
  const draftListings = myListings.filter(l => l.status === 'draft')

  const tabs = [
    { id: 'ads', label: 'Мои объявления', icon: <Package size={16} />, count: activeListings.length },
    { id: 'drafts', label: 'Черновики', icon: <Archive size={16} />, count: draftListings.length },
    { id: 'favs', label: 'Избранное', icon: <Heart size={16} />, count: 0 },
    { id: 'settings', label: 'Настройки', icon: <Settings size={16} />, count: 0 },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Hero Header */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #7c3aed 100%)', paddingBottom: 48 }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 0', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 16px' }}>
            <label style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: currentProfile.avatar_url ? 'none' : 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '4px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 36, fontWeight: 900, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                {currentProfile.avatar_url
                  ? <img src={currentProfile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
                  : (avatarUploading ? '⏳' : currentProfile.name?.[0]?.toUpperCase() || 'У')}
              </div>
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', background: '#1d4ed8', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <Camera size={13} color="#fff" />
              </div>
            </label>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            {currentProfile.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={16} style={{ fill: '#fbbf24', color: '#fbbf24' }} /> {currentProfile.rating ?? 5}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={16} /> {currentProfile.city || 'Москва'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Package size={16} /> {myListings.length} объявлений
            </span>
            {currentProfile.created_at && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={16} /> {memberSince(currentProfile.created_at)}
              </span>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/create')}
            style={{ padding: '12px 28px', borderRadius: 14, background: '#fff', color: '#1d4ed8', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          >
            <Plus size={18} /> Подать объявление
          </motion.button>
        </div>

        <div style={{ maxWidth: 900, margin: '32px auto 0', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: 4, display: 'flex', gap: 4 }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id as Tab)}
                  style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1d4ed8' : 'rgba(255,255,255,0.8)', boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
                  {t.icon} {t.label}
                  {t.count > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: tab === t.id ? '#1d4ed8' : 'rgba(255,255,255,0.25)', color: tab === t.id ? '#fff' : '#fff', borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 60px' }}>
        <AnimatePresence mode="wait">

          {tab === 'ads' && (
            <motion.div key="ads" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {activeListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Нет объявлений</h3>
                  <p style={{ color: '#64748b', marginBottom: 24 }}>Подайте первое объявление — это бесплатно</p>
                  <button onClick={() => router.push('/create')} style={{ padding: '12px 28px', borderRadius: 12, background: '#1d4ed8', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                    Подать объявление
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {activeListings.map((l, i) => (
                    <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative' }}>
                      <div style={{ height: 160, background: l.photos?.[0] ? 'none' : 'linear-gradient(135deg,#eff6ff,#dbeafe)', position: 'relative', overflow: 'hidden' }}>
                        {l.photos?.[0] ? <img src={l.photos[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🏷️</div>}
                        {l.is_urgent && (
                          <div style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>СРОЧНО</div>
                        )}
                        <div style={{ position: 'absolute', top: 8, left: l.is_urgent ? 70 : 8, background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>АКТИВНО</div>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l.category}</div>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: '#1d4ed8' }}>{l.price ? `${l.price.toLocaleString('ru')} ₽` : 'Договорная'}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{l.views} просмотров</span>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button onClick={() => router.push(`/listings/${l.id}/edit`)}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteListing(l.id)}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'drafts' && (
            <motion.div key="drafts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {draftListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📁</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Черновиков нет</h3>
                  <p style={{ color: '#64748b' }}>Здесь появятся удалённые или истёкшие объявления</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {draftListings.map((l, i) => (
                    <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      style={{ background: '#fff', borderRadius: 16, border: '1px solid #fed7aa', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', opacity: 0.9 }}>
                      <div style={{ height: 160, background: l.photos?.[0] ? 'none' : 'linear-gradient(135deg,#fff7ed,#ffedd5)', position: 'relative', overflow: 'hidden' }}>
                        {l.photos?.[0] ? <img src={l.photos[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📁</div>}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 13 }}>Снято с публикации</span>
                          <button onClick={() => renewListing(l.id)}
                            style={{ padding: '7px 16px', borderRadius: 10, background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <RefreshCw size={12} /> Опубликовать снова
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l.category}</div>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: '#94a3b8' }}>{l.price ? `${l.price.toLocaleString('ru')} ₽` : 'Договорная'}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{l.views} просмотров</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'favs' && (
            <motion.div key="favs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {favListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🤍</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Нет избранного</h3>
                  <p style={{ color: '#64748b' }}>Добавляйте понравившиеся объявления в избранное</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {favListings.map((l, i) => (
                    <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ height: 160, background: l.photos?.[0] ? 'none' : 'linear-gradient(135deg,#fdf4ff,#ede9fe)', position: 'relative' }}>
                        {l.photos?.[0] ? <img src={l.photos[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>❤️</div>}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8, lineHeight: 1.4 }}>{l.title}</h3>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#1d4ed8' }}>{l.price ? `${l.price.toLocaleString('ru')} ₽` : 'Договорная'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Настройки профиля</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Имя</label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Телефон</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>СОЦСЕТИ</div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>💬</span> WhatsApp
                    </label>
                    <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+7 999 123-45-67" type="tel"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#25d366'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>✈️</span> Telegram
                    </label>
                    <input value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="@username"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#2aabee'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>🔵</span> ВКонтакте
                    </label>
                    <input value={vk} onChange={e => setVk(e.target.value)} placeholder="vk.com/username"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#4680c2'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={saveSettings} disabled={saving}
                    style={{ padding: '13px', borderRadius: 12, background: saving ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: saving ? 'default' : 'pointer', marginTop: 4 }}>
                    {saving ? 'Сохраняем...' : 'Сохранить изменения'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ProfileClient(props: Props) {
  return (
    <Suspense fallback={null}>
      <ProfileInner {...props} />
    </Suspense>
  )
}
