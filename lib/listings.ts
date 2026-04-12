import { createClient } from './supabase-client'
import type { Listing, FilterState } from '@/types'

export async function getListings(filters: Partial<FilterState> = {}): Promise<Listing[]> {
  const supabase = createClient()
  let query = supabase
    .from('listings')
    .select('*, user:users(*)')
    .eq('is_active', true)

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }
  if (filters.query) {
    query = query.or(
      `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    )
  }
  if (filters.metro) {
    query = query.eq('metro', filters.metro)
  }
  if (filters.priceMin) {
    query = query.gte('price', parseInt(filters.priceMin))
  }
  if (filters.priceMax) {
    query = query.lte('price', parseInt(filters.priceMax))
  }

  switch (filters.sort) {
    case 'pa':  query = query.order('price', { ascending: true });  break
    case 'pd':  query = query.order('price', { ascending: false }); break
    case 'pop': query = query.order('views', { ascending: false }); break
    case 'old': query = query.order('created_at', { ascending: true }); break
    default:    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(50)
  if (error) throw error
  return data || []
}

export async function getListing(id: string): Promise<Listing | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, user:users(*)')
    .eq('id', id)
    .single()
  if (error) return null
  // Increment views
  await supabase.from('listings').update({ views: (data.views || 0) + 1 }).eq('id', id)
  return data
}

export async function createListing(listing: Partial<Listing>): Promise<Listing> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleFavorite(listingId: string, userId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('listing_id', listingId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('favorites').insert({ listing_id: listingId, user_id: userId })
    return true
  }
}
