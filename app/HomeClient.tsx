'use client'
import { useEffect, useState } from 'react'
import type { Listing } from '@/types'
import Hero from '@/components/layout/Hero'
import CategoryGrid from '@/components/listings/CategoryGrid'
import FilterSidebar from '@/components/listings/FilterSidebar'
import ListingCard from '@/components/listings/ListingCard'
import { motion } from 'framer-motion'
import { useFilters } from '@/hooks/useFilters'

type Stats = { listings: number; users: number; cities: number }

export default function HomeClient({ stats }: { stats?: Stats }) {
  const { category, query, metro, city, sort } = useFilters()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

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

  return (
    <>
      <Hero stats={stats} />
      <CategoryGrid />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <FilterSidebar />

        <div style={{ flex: 1 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => (
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
