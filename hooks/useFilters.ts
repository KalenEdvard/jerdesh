'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { DEFAULT_CITY } from '@/types'

export type SortOption = 'new' | 'old' | 'pa' | 'pd' | 'pop'

export interface Filters {
  query: string
  category: string
  metro: string
  city: string
  country: string
  sort: SortOption
}

export function useFilters(): Filters & {
  setFilter: (key: keyof Filters, value: string) => void
  resetFilters: () => void
} {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: Filters = {
    query: searchParams.get('q') ?? '',
    category: searchParams.get('cat') ?? 'all',
    metro: searchParams.get('metro') ?? '',
    city: searchParams.get('city') ?? DEFAULT_CITY,
    country: searchParams.get('country') ?? 'Россия',
    sort: (searchParams.get('sort') ?? 'new') as SortOption,
  }

  const setFilter = useCallback((key: keyof Filters, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const map: Record<keyof Filters, string> = {
      query: 'q',
      category: 'cat',
      metro: 'metro',
      city: 'city',
      country: 'country',
      sort: 'sort',
    }

    const paramKey = map[key]
    if (!value || value === 'all' || value === 'new' || (key === 'city' && value === DEFAULT_CITY)) {
      params.delete(paramKey)
    } else {
      params.set(paramKey, value)
    }

    router.push(`/?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const resetFilters = useCallback(() => {
    router.push('/')
  }, [router])

  return { ...filters, setFilter, resetFilters }
}
