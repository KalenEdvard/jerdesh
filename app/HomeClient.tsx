'use client'
import { useEffect, useState } from 'react'
import type { Listing } from '@/types'
import Hero from '@/components/layout/Hero'
import CategoryGrid from '@/components/listings/CategoryGrid'
import FilterSidebar from '@/components/listings/FilterSidebar'
import MobileFilterBar from '@/components/listings/MobileFilterBar'
import ListingCard from '@/components/listings/ListingCard'
import { motion } from 'framer-motion'
import { useFilters } from '@/hooks/useFilters'
import { autoDetectCity } from '@/hooks/useGeoCity'
import { useStore } from '@/store'

type Stats = { listings: number; users: number; cities: number }
type MetroStat = { name: string; count: number }

export default function HomeClient({ stats, metroStats }: { stats?: Stats; metroStats?: MetroStat[] }) {
  const { category, query, metro, city, sort, setFilter } = useFilters()
  const { showToast } = useStore()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

  // Auto-detect city on first visit (silent — no button needed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // Don't override if user already chose a city manually via URL
    if (params.has('city')) return

    autoDetectCity((detected) => {
      setFilter('city', detected)
      showToast(`📍 ${detected}`, 'ok')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false

    const fetchListings = async () => {
      if (listings.length === 0) setLoading(true)
      else setFetching(true)

      const params = new URLSearchParams()
      if (category && category !== 'all') params.set('category', category)
      if (query) params.set('query', query)
      if (metro) params.set('metro', metro)
      if (city) params.set('city', city)
      if (sort) params.set('sort', sort)

      const res = await fetch(`/api/listings/search?${params.toString()}`)
      const data = res.ok ? await res.json() : []

      if (!cancelled) {
        setListings(data as Listing[])
        setLoading(false)
        setFetching(false)
      }
    }

    fetchListings()
    return () => { cancelled = true }
  }, [category, query, metro, city, sort])

  const skeletons = Array.from({ length: 6 })

  return (
    <>
      <Hero stats={stats} />

      {/* Mobile filter bar — visible only on mobile */}
      <div className="mobile-only">
        <MobileFilterBar />
      </div>

      {/* Category grid — hidden on mobile (covered by MobileFilterBar) */}
      <div className="category-grid-section desktop-only">
        <CategoryGrid />
      </div>

      <div
        className="listing-layout"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px', display: 'flex', gap: 24, alignItems: 'flex-start' }}
      >
        <div className="listing-sidebar desktop-only">
          <FilterSidebar />
        </div>

        <div className="listing-main" style={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              {category === 'all' ? 'Все объявления' : ''}
              {!loading && (
                <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b', marginLeft: 8 }}>
                  {listings.length} объявлений
                </span>
              )}
            </h2>
          </motion.div>

          {loading ? (
            <div className="listing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {skeletons.map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#f1f5f9', height: 280, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
            </div>
          ) : listings.length === 0 && !fetching ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ничего не найдено</h3>
              <p style={{ color: '#64748b' }}>Попробуйте изменить фильтры или поисковый запрос</p>
            </motion.div>
          ) : (
            <div style={{ position: 'relative' }}>
              {fetching && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,250,252,0.6)', zIndex: 10, borderRadius: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 24 }}>
                  <div style={{ width: 28, height: 28, border: '3px solid #e2e8f0', borderTopColor: '#1d4ed8', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}
              <div className="listing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metro section */}
      {metroStats && metroStats.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '0 auto 60px', padding: '0 20px' }}>
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '28px 24px' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>
              Объявления по станциям метро
            </h2>
            <div style={{ columns: 'auto 200px', columnGap: 0 }}>
              {metroStats.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => setFilter('metro', name)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', background: 'none', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', borderRadius: 0 }}
                >
                  {/* Metro M icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="10" fill="#E4002B"/>
                    <path d="M3.5 14.5V6.5L10 12.5L16.5 6.5V14.5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span style={{ fontSize: 13, color: '#1d4ed8', fontWeight: 500, flex: 1 }}>{name}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', flexShrink: 0 }}>{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
