import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Toggle favorite for a listing.
 * Returns true if added, false if removed.
 */
export async function toggleFavorite(
  supabase: SupabaseClient,
  userId: string,
  listingId: string
): Promise<boolean> {
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .maybeSingle()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return false
  }

  await supabase.from('favorites').insert({ user_id: userId, listing_id: listingId })
  return true
}
