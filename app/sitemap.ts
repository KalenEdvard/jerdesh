import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let listings: { id: string; created_at: string }[] = []
  try {
    const supabase = await createClient()
    let from = 0
    const batchSize = 1000
    while (true) {
      const { data } = await supabase
        .from('listings')
        .select('id,created_at')
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
    lastModified: new Date(l.created_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const categories = ['housing', 'findhousing', 'jobs', 'sell', 'services']
  const categoryUrls = categories.map(cat => ({
    url: `https://mekendesh.site/?cat=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [
    { url: 'https://mekendesh.site', lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 1 },
    ...categoryUrls,
    ...listingUrls,
  ]
}
