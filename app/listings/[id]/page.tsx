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
    title: `${data.title} | Жердеш`,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 160),
      images: data.photos?.[0] ? [{ url: data.photos[0] }] : [],
    },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('*, user:users(*)')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  // Increment views
  await supabase.from('listings').update({ views: (listing.views || 0) + 1 }).eq('id', id)

  // Get seller reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:users(name,avatar_url)')
    .eq('reviewed_id', listing.user_id)
    .order('created_at', { ascending: false })
    .limit(5)

  return <ListingDetailClient listing={listing} reviews={reviews || []} />
}
