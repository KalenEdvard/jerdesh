'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import type { Listing } from '@/types'
import ListingCard from '@/components/listings/ListingCard'

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, showToast } = useStore()
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [favListings, setFavListings] = useState<Listing[]>([])
  const [tab, setTab] = useState<'ads'|'favs'|'settings'>('ads')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!user) { router.push('/'); return }
    setName(user.name || '')
    setPhone(user.phone || '')
    loadMyListings()
    loadFavListings()
  }, [user])

  const loadMyListings = async () => {
    if (!user) return
    const { data } = await supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setMyListings(data || [])
  }

  const loadFavListings = async () => {
    if (!user) return
    const { data } = await supabase.from('favorites').select('listing:listings(*, user:users(*))').eq('user_id', user.id)
    setFavListings(data?.map((f: any) => f.listing).filter(Boolean) || [])
  }

  const saveSettings = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('users').update({ name, phone }).eq('id', user.id)
    setUser({ ...user, name, phone })
    showToast('Профиль обновлён ✓', 'ok')
    setSaving(false)
  }

  const deleteListing = async (id: string) => {
    await supabase.from('listings').update({ is_active: false }).eq('id', id)
    setMyListings(prev => prev.filter(l => l.id !== id))
    showToast('Объявление удалено', 'info')
  }

  if (!user) return null

  const tabStyle = (t: string) => ({
    padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: tab === t ? 700 : 500,
    background: tab === t ? '#1d4ed8' : 'transparent', color: tab === t ? '#fff' : '#64748b',
  })

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      {/* Profile header */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 900 }}>
          {user.name?.[0]?.toUpperCase() || 'У'}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h1>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            ★ {user.rating} · {myListings.length} объявлений · {user.city}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {(['ads','favs','settings'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
              {t === 'ads' ? '📋 Мои объявления' : t === 'favs' ? '❤️ Избранное' : '⚙️ Настройки'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs content */}
      {tab === 'ads' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Мои объявления ({myListings.length})</h2>
          {myListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ color: '#64748b' }}>У вас пока нет объявлений</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {myListings.map(l => (
                <div key={l.id} style={{ position: 'relative' }}>
                  <ListingCard listing={l} />
                  <button onClick={() => deleteListing(l.id)} style={{ position: 'absolute', top: 8, right: 50, padding: '4px 10px', borderRadius: 8, background: '#fee2e2', color: '#ef4444', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'favs' && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Избранное ({favListings.length})</h2>
          {favListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
              <p style={{ color: '#64748b' }}>Вы ещё ничего не добавили в избранное</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {favListings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, maxWidth: 480 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Настройки профиля</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Имя</label>
              <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>Телефон</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <button onClick={saveSettings} disabled={saving} style={{ padding: '12px', borderRadius: 12, background: '#1d4ed8', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
