import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data: listings } = await supabase
    .from('listings')
    .select('id,updated_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1000)

  const listingUrls = (listings || []).map(l => ({
    url: `https://zherdesh.ru/listings/${l.id}`,
    lastModified: new Date(l.updated_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://zherdesh.ru', lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: 'https://zherdesh.ru/create', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...listingUrls,
  ]
}
