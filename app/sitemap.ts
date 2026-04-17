import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let listings: { id: string; updated_at: string }[] = []
  try {
    const supabase = await createClient()
    // Грузим всё батчами по 1000 чтобы не пропустить ни одного
    let from = 0
    const batchSize = 1000
    while (true) {
      const { data } = await supabase
        .from('listings')
        .select('id,updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(from, from + batchSize - 1)
      if (!data || data.length === 0) break
      listings = listings.concat(data)
      if (data.length < batchSize) break
      from += batchSize
    }
  } catch {
    listings = []
  }

  const listingUrls = listings.map(l => ({
    url: `https://mekendesh.site/listings/${l.id}`,
    lastModified: new Date(l.updated_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://mekendesh.site', lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: 'https://mekendesh.site/profile', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ...listingUrls,
  ]
}
