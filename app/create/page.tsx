'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { useStore } from '@/store'
import { createClient } from '@/lib/supabase-client'
import { CATEGORIES, METRO_STATIONS } from '@/types'

export default function CreatePage() {
  const router = useRouter()
  const { user, showToast, setAuthOpen } = useStore()
  const [form, setForm] = useState({ title: '', description: '', category: 'housing', price: '', metro: '', phone: '', isUrgent: false })
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }))

  const onDrop = useCallback((files: File[]) => {
    const newFiles = files.slice(0, 8 - photos.length)
    setPhotos(prev => [...prev, ...newFiles])
    setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))])
  }, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: true })

  const handleSubmit = async () => {
    if (!user) { setAuthOpen(true); return }
    if (!form.title.trim()) { showToast('Введите заголовок', 'error'); return }

    setLoading(true)
    const supabase = createClient()

    // Upload photos
    const photoUrls: string[] = []
    for (const photo of photos) {
      const ext = photo.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('listings').upload(path, photo)
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(path)
        photoUrls.push(publicUrl)
      }
    }

    const { data, error } = await supabase.from('listings').insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category,
      price: form.price ? parseInt(form.price) : null,
      metro: form.metro || null,
      phone: form.phone || null,
      photos: photoUrls,
      city: 'Москва',
      is_urgent: form.isUrgent,
    }).select().single()

    setLoading(false)

    if (error) { showToast('Ошибка при публикации', 'error'); return }
    showToast('Объявление опубликовано! 🎉', 'ok')
    router.push(`/listings/${data.id}`)
  }

  return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Подать объявление</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>Заполните форму — объявление появится сразу после публикации</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Category */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 12 }}>Категория *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => set('category', c.id)} style={{ padding: '8px 16px', borderRadius: 100, border: `2px solid ${form.category === c.id ? '#1d4ed8' : '#e2e8f0'}`, background: form.category === c.id ? '#eff6ff' : '#fff', color: form.category === c.id ? '#1d4ed8' : '#334155', fontSize: 13, fontWeight: form.category === c.id ? 700 : 500, cursor: 'pointer' }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 12 }}>Фотографии (до 8 штук)</label>
          <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? '#1d4ed8' : '#e2e8f0'}`, borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer', background: isDragActive ? '#eff6ff' : '#f8fafc', transition: 'all 0.15s' }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <p style={{ fontSize: 14, color: '#64748b' }}>Перетащите фото или нажмите для выбора</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>JPG, PNG до 5MB каждое</p>
          </div>
          {previews.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {previews.map((p, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={p} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }} />
                  <button onClick={() => { setPhotos(ph => ph.filter((_,j) => j!==i)); setPreviews(pv => pv.filter((_,j) => j!==i)) }} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>Заголовок *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Например: Сдаю комнату у м. Выхино" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, textAlign: 'right' }}>{form.title.length}/100</div>
        </div>

        {/* Description */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>Описание</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Подробно опишите ваше предложение..." rows={5} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical' }} />
        </div>

        {/* Price + Metro + Phone */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>Цена (₽)</label>
            <input value={form.price} onChange={e => set('price', e.target.value)} type="number" placeholder="0 = договорная" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>Станция метро</label>
            <select value={form.metro} onChange={e => set('metro', e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff' }}>
              <option value="">Выберите...</option>
              {METRO_STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>Телефон</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" placeholder="+7 (___) ___-__-__" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          </div>
        </div>

        {/* Options */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isUrgent} onChange={e => set('isUrgent', e.target.checked)} style={{ width: 18, height: 18, accentColor: '#ef4444' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>🔴 Срочное объявление</span>
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: '16px', borderRadius: 14, background: loading ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer' }}
        >
          {loading ? '⏳ Публикуем...' : '🚀 Опубликовать объявление'}
        </button>
      </div>
    </div>
  )
}
