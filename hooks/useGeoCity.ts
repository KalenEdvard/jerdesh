'use client'
import { useState } from 'react'
import { CITIES } from '@/types'

const GEO_CITY_KEY = 'mekendesh_geo_city'
const GEO_DENIED_KEY = 'mekendesh_geo_denied'
const GEO_TTL = 24 * 60 * 60 * 1000 // 24 hours

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`,
      { headers: { 'User-Agent': 'Mekendesh/1.0 (jerdesh.ru)' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const addr = data.address || {}
    const candidates = [
      addr.city, addr.town, addr.village, addr.municipality, addr.county, addr.state,
    ].filter(Boolean) as string[]

    for (const candidate of candidates) {
      const match = CITIES.find(c =>
        c.id.toLowerCase() === candidate.toLowerCase() ||
        candidate.toLowerCase().includes(c.id.toLowerCase()) ||
        c.id.toLowerCase().includes(candidate.toLowerCase())
      )
      if (match) return match.id
    }
    return null
  } catch {
    return null
  }
}

// Called on manual button click
export function useGeoCity() {
  const [loading, setLoading] = useState(false)

  const detect = (onFound: (city: string) => void, onNotFound?: () => void) => {
    if (!navigator.geolocation) { onNotFound?.(); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        setLoading(false)
        if (city) {
          localStorage.setItem(GEO_CITY_KEY, JSON.stringify({ city, ts: Date.now() }))
          onFound(city)
        } else {
          onNotFound?.()
        }
      },
      () => { setLoading(false); onNotFound?.() },
      { timeout: 8000, maximumAge: 300_000 }
    )
  }

  return { detect, loading }
}

// Called automatically on page load — silent, no UI state
export function autoDetectCity(
  onFound: (city: string) => void,
  options?: { force?: boolean }
) {
  if (typeof window === 'undefined' || !navigator.geolocation) return

  // If denied before, don't ask again
  if (localStorage.getItem(GEO_DENIED_KEY)) return

  // Return cached result if fresh
  if (!options?.force) {
    try {
      const raw = localStorage.getItem(GEO_CITY_KEY)
      if (raw) {
        const { city, ts } = JSON.parse(raw)
        if (Date.now() - ts < GEO_TTL) { onFound(city); return }
      }
    } catch {}
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      if (city) {
        localStorage.setItem(GEO_CITY_KEY, JSON.stringify({ city, ts: Date.now() }))
        onFound(city)
      }
    },
    (err) => {
      // Cache denial so we don't ask again
      if (err.code === 1) localStorage.setItem(GEO_DENIED_KEY, '1')
    },
    { timeout: 8000, maximumAge: 300_000 }
  )
}
