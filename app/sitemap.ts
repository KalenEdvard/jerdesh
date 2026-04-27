import type { MetadataRoute } from 'next'
import { query } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let listings: { id: string; created_at: string }[] = []
  try {
    listings = await query<any>("SELECT id, created_at FROM listings WHERE status='active' ORDER BY created_at DESC LIMIT 5000")
  } catch {}

  const categories = ['housing', 'findhousing', 'jobs', 'sell', 'services']

  return [
    { url: 'https://mekendesh.online', lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    ...categories.map(cat => ({ url: `https://mekendesh.online/?cat=${cat}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 })),
    ...listings.map(l => ({ url: `https://mekendesh.online/listings/${l.id}`, lastModified: new Date(l.created_at), changeFrequency: 'daily' as const, priority: 0.8 })),
  ]
}
