'use client'
import { useEffect } from 'react'
import { useStore } from '@/store'
import type { Listing } from '@/types'
import Hero from '@/components/layout/Hero'
import CategoryGrid from '@/components/listings/CategoryGrid'
import FilterSidebar from '@/components/listings/FilterSidebar'
import ListingCard from '@/components/listings/ListingCard'

const SAMPLE_LISTINGS: Listing[] = [
  { id: '1', user_id: 'u1', title: 'Сдаю комнату у м. Выхино', description: 'Уютная комната в 2-комнатной квартире. Все удобства, интернет включён.', category: 'housing', price: 15000, metro: 'Выхино', city: 'Москва', phone: '', photos: [], views: 234, is_active: true, is_urgent: true, is_premium: false, created_at: new Date(Date.now()-86400000).toISOString(), expires_at: '', user: { id:'u1', name:'Айгуль Бекова', rating:4.8, ads_count:3, city:'Москва', created_at:'2023-03-01' } },
  { id: '2', user_id: 'u2', title: 'Требуется повар — Кыргызская кухня', description: 'Ресторан ищет опытного повара. Опыт от 2 лет. Оформление официальное.', category: 'jobs', price: 60000, metro: 'Кузьминки', city: 'Москва', phone: '', photos: [], views: 87, is_active: true, is_urgent: false, is_premium: true, created_at: new Date(Date.now()-3600000).toISOString(), expires_at: '', user: { id:'u2', name:'Азиз Уулу', rating:5.0, ads_count:1, city:'Москва', created_at:'2024-01-01' } },
  { id: '3', user_id: 'u3', title: 'Продаю iPhone 14 Pro — 128GB', description: 'В отличном состоянии. Полный комплект. Торг уместен.', category: 'sell', price: 65000, metro: 'ВДНХ', city: 'Москва', phone: '', photos: [], views: 156, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-7200000).toISOString(), expires_at: '', user: { id:'u3', name:'Нуржан Асанов', rating:4.5, ads_count:5, city:'Москва', created_at:'2022-06-01' } },
  { id: '4', user_id: 'u4', title: 'Помогу с переводом документов', description: 'Перевод с/на кыргызский, русский. Нотариальное заверение. Быстро и качественно.', category: 'services', metro: 'Комсомольская', city: 'Москва', phone: '', photos: [], views: 42, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-14400000).toISOString(), expires_at: '', user: { id:'u4', name:'Гульназ Токторова', rating:4.9, ads_count:8, city:'Москва', created_at:'2021-09-01' } },
  { id: '5', user_id: 'u5', title: 'Ищу комнату у м. Люблино', description: 'Семья из 2 человек, чистоплотные. Рассмотрим варианты 10-18 тыс/мес.', category: 'findhousing', metro: 'Люблино', city: 'Москва', phone: '', photos: [], views: 31, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-28800000).toISOString(), expires_at: '', user: { id:'u5', name:'Мирлан Джумалиев', rating:4.7, ads_count:2, city:'Москва', created_at:'2023-11-01' } },
  { id: '6', user_id: 'u6', title: 'Медицинские анализы — выезд на дом', description: 'Медсестра с опытом. Забор крови, уколы, капельницы. Доступные цены.', category: 'services', metro: 'Марьино', city: 'Москва', phone: '', photos: [], views: 198, is_active: true, is_urgent: false, is_premium: true, created_at: new Date(Date.now()-172800000).toISOString(), expires_at: '', user: { id:'u6', name:'Зарина Исакова', rating:5.0, ads_count:12, city:'Москва', created_at:'2020-01-01' } },
]

export default function HomeClient({ listings, totalCount }: { listings: Listing[]; totalCount: number }) {
  const { filters } = useStore()

  // Use real data if available, otherwise show samples
  const displayListings = listings.length > 0 ? listings : SAMPLE_LISTINGS

  // Client-side filter (for instant UX without server round-trip)
  const filtered = displayListings.filter(l => {
    if (filters.category !== 'all' && l.category !== filters.category) return false
    if (filters.metro && l.metro !== filters.metro) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      if (!l.title.toLowerCase().includes(q) && !l.description?.toLowerCase().includes(q)) return false
    }
    if (filters.priceMin && l.price && l.price < parseInt(filters.priceMin)) return false
    if (filters.priceMax && l.price && l.price > parseInt(filters.priceMax)) return false
    return true
  }).sort((a, b) => {
    if (filters.sort === 'pa') return (a.price || 0) - (b.price || 0)
    if (filters.sort === 'pd') return (b.price || 0) - (a.price || 0)
    if (filters.sort === 'pop') return b.views - a.views
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <>
      <Hero />
      <CategoryGrid />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <FilterSidebar />

        <div style={{ flex: 1 }}>
          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              {filters.category === 'all' ? 'Все объявления' : ''}
              <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b', marginLeft: 8 }}>
                {filtered.length} объявлений
              </span>
            </h2>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ничего не найдено</h3>
              <p style={{ color: '#64748b' }}>Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
