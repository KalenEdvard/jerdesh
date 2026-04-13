'use client'
import { useStore } from '@/store'
import type { Listing } from '@/types'
import Hero from '@/components/layout/Hero'
import CategoryGrid from '@/components/listings/CategoryGrid'
import FilterSidebar from '@/components/listings/FilterSidebar'
import ListingCard from '@/components/listings/ListingCard'

const SAMPLE_LISTINGS: Listing[] = [
  { id: '1', user_id: 'u1', title: 'Хиджама жасайм, массаж жасайм. Сулук коем.', description: 'Хиджама жасайм, картасы менен керектуу точкаларына коюп берем. Бесплодиеге жардам берем. Стаж 15 лет.', category: 'services', metro: 'Лобня', city: 'Москва', phone: '+79266943357', photos: [], views: 5997, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-3600000).toISOString(), expires_at: '', user: { id:'u1', name:'Динара', rating:4.8, ads_count:3, city:'Москва', created_at:'2023-03-01' } },
  { id: '2', user_id: 'u2', title: 'Мц "РИАЛЬ" — Уролог, терапевт, аллерголог, лор, гинеколог, стоматолог, УЗИ, анализы', description: 'КЛИНИКА "РИАЛЬ" широкопрофильный мед центр для трудовых мигрантов. Оказывает следующие услуги: Гинекологи, УЗИ, анализы и многое другое.', category: 'services', metro: 'Беговая', city: 'Москва', phone: '+79253887486', photos: [], views: 14863, is_active: true, is_urgent: false, is_premium: true, created_at: new Date(Date.now()-7200000).toISOString(), expires_at: '', user: { id:'u2', name:'Кыял', rating:5.0, ads_count:1, city:'Москва', created_at:'2024-01-01' } },
  { id: '3', user_id: 'u3', title: 'АРЗАН РЕМОНТ — стиральная машина', description: 'СТИРАЛЬНАЯ МАШИНА ОНДОЙМ АРЗАН БААДА. АЛАМ САТАМ БУ САНТЕХНИКА ДЕЗИНФЕКЦИЯ КЫЛАМ. Акчасы келишим баада.', category: 'sell', metro: 'Выставочная', city: 'Москва', phone: '+79309633275', photos: [], views: 1634, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-10800000).toISOString(), expires_at: '', user: { id:'u3', name:'Syimyk', rating:4.5, ads_count:5, city:'Москва', created_at:'2022-06-01' } },
  { id: '4', user_id: 'u4', title: 'АВТОСЕРВИС ПРАЖСКАЯ', description: 'ДОСТОР! АЙДОЧУЛАР! ПРАЖСКАЯ МЕТРОДО АВТОСЕРВИС ИШТЕЙТ! КЕЛИНИЗДЕР, баардык услугаларды корсотконго даярбыз.', category: 'services', metro: 'Пражская', city: 'Москва', phone: '+79851818314', photos: [], views: 5770, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-14400000).toISOString(), expires_at: '', user: { id:'u4', name:'Алмаз', rating:4.9, ads_count:8, city:'Москва', created_at:'2021-09-01' } },
  { id: '5', user_id: 'u5', title: 'ДЕЗИНФЕКЦИЯ БЕЗ ЗАПАХА — КЛОПЫ И ТАРАКАНЫ', description: 'Ассаламу алйкум мекенжештер! Дезинфекция. ЗАБУДЬТЕ О КЛОПАХ И ТАРАКАНАХ НАВСЕГДА! Оказываем профессиональные услуги. Ватсаптан жазыныз.', category: 'services', metro: 'Сокольники', city: 'Москва', phone: '+79773748582', photos: ['http://jerdesh.ru/oc-content/uploads/18908/719861_thumbnail.jpg'], views: 2071, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-18000000).toISOString(), expires_at: '', user: { id:'u5', name:'Жусуп', rating:4.7, ads_count:2, city:'Москва', created_at:'2023-11-01' } },
  { id: '6', user_id: 'u6', title: 'Такси Москва — Казахстан без посредника', description: 'Ассалом алейкум жердештер! Москва Казахстан границага каттайбыз каждый день. Жолдон и границадан жардам берем.', category: 'services', metro: 'Проспект Мира', city: 'Москва', phone: '+79269291820', photos: ['http://jerdesh.ru/oc-content/uploads/18423/693441_thumbnail.jpg'], views: 1641, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-21600000).toISOString(), expires_at: '', user: { id:'u6', name:'Ачылбек', rating:5.0, ads_count:12, city:'Москва', created_at:'2020-01-01' } },
  { id: '7', user_id: 'u7', title: 'Такси МОСКВА — КЫРГЫЗСТАН каждый день', description: 'Ассалому алейкум жердештер! Границага чыгабыз ар кун сайын без посредник. Жолдо и границада жардам берем.', category: 'services', metro: 'Проспект Мира', city: 'Москва', phone: '+79269291820', photos: ['http://jerdesh.ru/oc-content/uploads/18495/665967_thumbnail.jpg'], views: 3754, is_active: true, is_urgent: true, is_premium: false, created_at: new Date(Date.now()-25200000).toISOString(), expires_at: '', user: { id:'u7', name:'Ачылбек', rating:4.9, ads_count:4, city:'Москва', created_at:'2023-01-01' } },
  { id: '8', user_id: 'u8', title: 'Жук Жеткируу — Кыргызстандын баардык аймактарына', description: 'Урматтуу мекендештер! Кыргызстандын баардык аймактарына жук жеткиребиз тез жана ишеничтуу. Келишим баада.', category: 'services', metro: 'Печатники', city: 'Москва', phone: '+79654031010', photos: ['http://jerdesh.ru/oc-content/uploads/19398/715272_thumbnail.jpg'], views: 33813, is_active: true, is_urgent: false, is_premium: true, created_at: new Date(Date.now()-28800000).toISOString(), expires_at: '', user: { id:'u8', name:'Бексултан', rating:5.0, ads_count:6, city:'Москва', created_at:'2022-01-01' } },
  { id: '9', user_id: 'u9', title: 'ЖУК ЖЕТКИРУУ КЫЗМАТЫ МОСКВА — КЫРГЫЗСТАН', description: 'Урматтуу мекендештер! Кыргызстандын баардык аймактарына жук жеткиребиз тез жана ишеничтуу. Келишим баада.', category: 'services', metro: 'Кожуховская', city: 'Москва', phone: '+79265528080', photos: ['http://jerdesh.ru/oc-content/uploads/17363/678403_thumbnail.jpg'], views: 26776, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-32400000).toISOString(), expires_at: '', user: { id:'u9', name:'Актилек', rating:4.8, ads_count:9, city:'Москва', created_at:'2021-05-01' } },
  { id: '10', user_id: 'u10', title: 'Гинекология, дерматолог, хирург, маммолог, педиатр', description: '+7977 770 00 62 Гинеколог/УЗИ спец/Маммолог. +7977 777 00 62 Регистратура 24/7. Интимные операции. Больничные листы, медицинские справки, мед книжка.', category: 'services', metro: 'Беговая', city: 'Москва', phone: '+79777700062', photos: ['http://jerdesh.ru/oc-content/uploads/19167/717838_thumbnail.png'], views: 541, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-36000000).toISOString(), expires_at: '', user: { id:'u10', name:'Айпери', rating:4.9, ads_count:7, city:'Москва', created_at:'2022-03-01' } },
  { id: '11', user_id: 'u11', title: 'Сдаю комнату у м. Выхино — 14000 руб', description: 'Уютная комната в 2-комнатной квартире. Все удобства, интернет включён. Только кыргызам.', category: 'housing', price: 14000, metro: 'Выхино', city: 'Москва', phone: '', photos: [], views: 234, is_active: true, is_urgent: true, is_premium: false, created_at: new Date(Date.now()-40000000).toISOString(), expires_at: '', user: { id:'u11', name:'Айгуль', rating:4.8, ads_count:3, city:'Москва', created_at:'2023-03-01' } },
  { id: '12', user_id: 'u12', title: 'Жумуш берилет — Кафе, повар', description: 'Кафеге повар керек. Тажрыйбасы бар болсо жакшы. Иш акы келишим боюнча. Жашоо камсыз кылынат.', category: 'jobs', price: 55000, metro: 'Кузьминки', city: 'Москва', phone: '', photos: [], views: 87, is_active: true, is_urgent: false, is_premium: false, created_at: new Date(Date.now()-43200000).toISOString(), expires_at: '', user: { id:'u12', name:'Азиз', rating:5.0, ads_count:1, city:'Москва', created_at:'2024-01-01' } },
]

export default function HomeClient({ listings, totalCount: _totalCount }: { listings: Listing[]; totalCount: number }) {
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
