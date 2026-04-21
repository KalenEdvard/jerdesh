'use client'
import { useState } from 'react'
import { CITIES } from '@/types'

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`,
      { headers: { 'User-Agent': 'Mekendesh/1.0 (jerdesh.ru)' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const addr = data.address || {}

    // Try different address levels: city > town > village > county
    const candidates = [
      addr.city, addr.town, addr.village, addr.municipality, addr.county, addr.state
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

export function useGeoCity() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const detect = (onFound: (city: string) => void, onNotFound?: () => void) => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается браузером')
      return
    }
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        setLoading(false)
        if (city) {
          onFound(city)
        } else {
          setError('Город не найден в списке')
          onNotFound?.()
        }
      },
      (err) => {
        setLoading(false)
        if (err.code === 1) setError('Доступ к геолокации запрещён')
        else setError('Не удалось определить местоположение')
        onNotFound?.()
      },
      { timeout: 8000, maximumAge: 300_000 }
    )
  }

  return { detect, loading, error }
}
