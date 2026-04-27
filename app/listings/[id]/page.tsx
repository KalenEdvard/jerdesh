import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { queryOne, query } from '@/lib/db'
import ListingDetailClient from './ListingDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const listing = await queryOne<any>('SELECT title, description, photos FROM listings WHERE id=$1', [id])
  if (!listing) return { title: 'Объявление не найдено' }
  return {
    title: `${listing.title} | Мекендеш`,
    description: listing.description?.slice(0, 160),
    alternates: { canonical: `https://mekendesh.online/listings/${id}` },
    openGraph: { title: listing.title, description: listing.description?.slice(0, 160), images: listing.photos?.[0] ? [{ url: listing.photos[0] }] : [] },
  }
}

const CAT_LABELS: Record<string, string> = {
  housing: 'Батир берем', findhousing: 'Батир издейм', jobs: 'Жумуш', sell: 'Сатам/Алам', services: 'Кызматтар',
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const listing = await queryOne<any>(
    `SELECT l.*, json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url,'rating',u.rating,'city',u.city,'ads_count',u.ads_count,'created_at',u.created_at,'whatsapp',u.whatsapp,'telegram',u.telegram,'vk',u.vk) as user
     FROM listings l LEFT JOIN users u ON u.id=l.user_id
     WHERE l.id=$1 AND l.status='active'`,
    [id]
  )
  if (!listing) notFound()

  const reviews = await query<any>(
    `SELECT r.*, json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as reviewer
     FROM reviews r LEFT JOIN users u ON u.id=r.reviewer_id
     WHERE r.reviewed_id=$1 ORDER BY r.created_at DESC LIMIT 10`,
    [listing.user_id]
  )

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ItemPage',
    name: listing.title, description: listing.description?.slice(0, 300),
    url: `https://mekendesh.online/listings/${id}`,
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Мекендеш', item: 'https://mekendesh.online' },
      { '@type': 'ListItem', position: 2, name: CAT_LABELS[listing.category] || listing.category },
      { '@type': 'ListItem', position: 3, name: listing.title },
    ]},
    ...(listing.price ? { offers: { '@type': 'Offer', price: listing.price, priceCurrency: 'RUB' } } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ListingDetailClient listing={listing} reviews={reviews} />
    </>
  )
}
