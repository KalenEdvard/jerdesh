'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, X, Send, Tag, FileText, Phone, MapPin, DollarSign, AlertCircle } from 'lucide-react'
import { useStore } from '@/store'
import { CATEGORIES, METRO_STATIONS, CITIES, COUNTRIES } from '@/types'

const DEFAULT_CITY = 'Москва'
const MAX_FILE_SIZE = 4 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{title}</span>
      </div>
      {children}
    </motion.div>
  )
}

export default function CreatePage() {
  const router = useRouter()
  const { user, showToast, setAuthOpen } = useStore()
  const [country, setCountry] = useState('Россия')
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    metro: '',
    city: DEFAULT_CITY,
    address: '',
    phone: '',
    isUrgent: false,
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryError, setCategoryError] = useState(false)

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const onDrop = useCallback((files: File[]) => {
    const valid: File[] = []
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        showToast(`${file.name}: неподдерживаемый формат`, 'error')
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        showToast(`${file.name}: файл больше 4MB`, 'error')
        continue
      }
      valid.push(file)
    }

    setPhotos((prev) => {
      const newFiles = valid.slice(0, Math.max(0, 8 - prev.length))
      setPreviews((pv) => [...pv, ...newFiles.map((f) => URL.createObjectURL(f))])
      return [...prev, ...newFiles]
    })
  }, [showToast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const handleSubmit = async () => {
    if (!user) { setAuthOpen(true); return }
    if (!form.category) { setCategoryError(true); showToast('Выберите категорию', 'error'); return }
    if (!form.title.trim()) { showToast('Введите заголовок', 'error'); return }

    setLoading(true)
    try {
      // 1. Загрузка фото через signed URL (прямой PUT)
      const photoUrls: string[] = []
      for (const photo of photos) {
        const signRes = await fetch('/api/listings/upload-photo-sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: photo.name, fileType: photo.type }),
        })
        const signJson = await signRes.json().catch(() => ({ error: 'Ошибка сервера' }))
        if (!signRes.ok) {
          showToast(`Ошибка фото: ${signJson.error}`, 'error')
          setLoading(false)
          return
        }
        const uploadRes = await fetch(signJson.signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': photo.type },
          body: photo,
        })
        if (!uploadRes.ok) {
          showToast(`Ошибка загрузки фото: ${uploadRes.statusText}`, 'error')
          setLoading(false)
          return
        }
        photoUrls.push(signJson.publicUrl)
      }

      // 2. Создание объявления через серверный API (авторизация + insert на сервере)
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photos: photoUrls }),
      })
      const json = await res.json().catch(() => ({ error: 'Ошибка сервера' }))

      setLoading(false)
      if (!res.ok) {
        showToast(`Ошибка: ${json.error}`, 'error')
        return
      }

      showToast('Объявление опубликовано!', 'ok')
      router.push(`/listings/${json.id}`)
    } catch (e: unknown) {
      setLoading(false)
      showToast(e instanceof Error ? e.message : 'Ошибка публикации', 'error')
    }
  }

  const citiesForCountry = CITIES.filter(c => c.country === country)
  const hasMetro = CITIES.find(c => c.id === form.city)?.metro ?? false

  const CAT_COLORS: Record<string, string> = {
    housing: '#1d4ed8',
    findhousing: '#6366f1',
    jobs: '#059669',
    sell: '#d97706',
    services: '#7c3aed',
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 60px' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>
          Подать объявление
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>Заполните форму — объявление появится сразу после публикации</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Section icon={<Tag size={17} color="#fff" />} title="Категория *">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => {
              const color = CAT_COLORS[c.id] || '#1d4ed8'
              const isActive = form.category === c.id
              return (
                <motion.button
                  key={c.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { set('category', c.id); setCategoryError(false) }}
                  style={{ padding: '9px 16px', borderRadius: 50, border: `2px solid ${isActive ? color : categoryError ? '#ef4444' : '#e2e8f0'}`, background: isActive ? `${color}14` : categoryError ? '#fef2f2' : '#f8fafc', color: isActive ? color : categoryError ? '#ef4444' : '#334155', fontSize: 13, fontWeight: isActive ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {c.icon} {c.label}
                </motion.button>
              )
            })}
          </div>
          {categoryError && (
            <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8, fontWeight: 600 }}>⚠ Выберите категорию объявления</p>
          )}
        </Section>

        <Section icon={<Upload size={17} color="#fff" />} title="Фотографии">
          <div
            {...getRootProps()}
            style={{ border: `2px dashed ${isDragActive ? '#1d4ed8' : '#e2e8f0'}`, borderRadius: 14, padding: 28, textAlign: 'center', cursor: 'pointer', background: isDragActive ? '#eff6ff' : '#f8fafc', transition: 'all 0.2s' }}
          >
            <input {...getInputProps()} />
            <motion.div animate={{ y: isDragActive ? -4 : 0 }} style={{ fontSize: 36, marginBottom: 10 }}>📸</motion.div>
            <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>Перетащите фото или нажмите для выбора</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>JPG, PNG, WEBP до 4MB · максимум 8 фото</p>
          </div>
          {previews.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {previews.map((preview, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative' }}>
                  <img src={preview} alt="" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 12, border: '2px solid #e2e8f0' }} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setPhotos((ph) => ph.filter((_, j) => j !== i))
                      setPreviews((pv) => pv.filter((_, j) => j !== i))
                    }}
                    style={{ position: 'absolute', top: -7, right: -7, width: 22, height: 22, borderRadius: '50%', background: '#ef4444', color: '#fff', border: '2px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}
                  >
                    <X size={11} strokeWidth={3} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        <Section icon={<FileText size={17} color="#fff" />} title="Заголовок">
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Например: Сдаю комнату у м. Выхино"
            maxLength={100}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0f172a', transition: 'border-color 0.15s' }}
            onFocus={(e) => { e.target.style.borderColor = '#1d4ed8' }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
          />
          <div style={{ fontSize: 11, color: form.title.length > 80 ? '#ef4444' : '#94a3b8', marginTop: 6, textAlign: 'right' }}>{form.title.length}/100</div>
        </Section>

        <Section icon={<AlertCircle size={17} color="#fff" />} title="Описание">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Подробно опишите ваше предложение..."
            rows={5}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', color: '#0f172a', lineHeight: 1.6 }}
            onFocus={(e) => { e.target.style.borderColor = '#1d4ed8' }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
          />
        </Section>

        <Section icon={<DollarSign size={17} color="#fff" />} title="Детали">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>ЦЕНА (₽)</label>
              <input
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                type="number"
                placeholder="0 = договорная"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#1d4ed8' }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>
                🌍 СТРАНА
              </label>
              <select
                value={country}
                onChange={(e) => {
                  const newCountry = e.target.value
                  const firstCity = CITIES.find(c => c.country === newCountry)
                  setCountry(newCountry)
                  setForm(f => ({ ...f, city: firstCity?.id ?? '', metro: '' }))
                }}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              >
                {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.id}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>
                <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />ГОРОД
              </label>
              <select
                value={form.city}
                onChange={(e) => setForm(f => ({ ...f, city: e.target.value, metro: '' }))}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              >
                {citiesForCountry.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.id}</option>)}
              </select>
            </div>

            {hasMetro && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>
                🚇 МЕТРО
              </label>
              <select
                value={form.metro}
                onChange={(e) => set('metro', e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">Не выбрано</option>
                {METRO_STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>
                <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />АДРЕС
              </label>
              <input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Улица, дом, район"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#1d4ed8' }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>
                <Phone size={11} style={{ display: 'inline', marginRight: 4 }} />ТЕЛЕФОН
              </label>
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                type="tel"
                placeholder="+7 (___) ___-__-__"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#1d4ed8' }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0' }}
              />
            </div>
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: form.isUrgent ? '#fef2f2' : '#fff', borderRadius: 20, border: `1.5px solid ${form.isUrgent ? '#fecaca' : '#e2e8f0'}`, padding: 20, transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <div
              onClick={() => set('isUrgent', !form.isUrgent)}
              style={{ width: 44, height: 26, borderRadius: 13, background: form.isUrgent ? '#ef4444' : '#e2e8f0', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <motion.div
                animate={{ x: form.isUrgent ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: form.isUrgent ? '#ef4444' : '#334155' }}>🔴 Срочное объявление</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Выделит объявление в списке</div>
            </div>
          </label>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 16px 48px rgba(29,78,216,0.35)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: '17px', borderRadius: 16, background: loading ? '#94a3b8' : 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: loading ? 'none' : '0 8px 24px rgba(29,78,216,0.3)' }}
        >
          {loading ? '⏳ Публикуем...' : <><Send size={18} />Опубликовать объявление</>}
        </motion.button>
      </div>
    </div>
  )
}
