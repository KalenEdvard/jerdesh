import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ListingDetailClient from './ListingDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('listings').select('title,description,photos').eq('id', id).single()
  if (!data) return { title: 'Объявление не найдено' }
  return {
    title: `${data.title} | Мекендеш`,
    description: data.description?.slice(0, 160),
    alternates: { canonical: `https://mekendesh.site/listings/${id}` },
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 160),
      url: `https://mekendesh.site/listings/${id}`,
      siteName: 'Мекендеш',
      images: data.photos?.[0] ? [{ url: data.photos[0] }] : [],
    },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('id,title,description,category,price,metro,city,phone,photos,views,is_urgent,is_premium,status,created_at,user_id,user:users(id,name,avatar_url,rating,city,ads_count,created_at)')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!listing) notFound()

  // Increment views (fire-and-forget, не блокирует рендер)
  supabase.from('listings').update({ views: (listing.views || 0) + 1 }).eq('id', id).then(() => {})

  // Get seller reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:users(name,avatar_url)')
    .eq('reviewed_id', listing.user_id)
    .order('created_at', { ascending: false })
    .limit(5)

  return <ListingDetailClient listing={listing as any} reviews={reviews || []} />
}
