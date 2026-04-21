'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EditListingClient from './EditListingClient'

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try sessionStorage first (instant, no server round trip)
    const cached = sessionStorage.getItem(`listing_edit_${id}`)
    if (cached) {
      try {
        setListing(JSON.parse(cached))
        setLoading(false)
        return
      } catch {}
    }

    // Fallback: fetch from server
    fetch(`/api/listings/${id}/own`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { router.push('/profile'); return }
        setListing(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[200, 120, 300, 200, 200].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 20, background: '#f1f5f9', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
        </div>
      </div>
    )
  }

  return <EditListingClient listing={listing} />
}
