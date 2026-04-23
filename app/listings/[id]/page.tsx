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

const CAT_LABELS: Record<string, string> = {
  housing: 'Сдаю жильё', findhousing: 'Сниму жильё',
  jobs: 'Работа', sell: 'Продаю', services: 'Услуга',
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('id,title,description,category,price,metro,city,phone,photos,views,is_urgent,is_premium,status,created_at,user_id,user:users(id,name,avatar_url,rating,city,ads_count,created_at,whatsapp,telegram,vk,max)')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!listing) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:users(name,avatar_url)')
    .eq('reviewed_id', listing.user_id)
    .order('created_at', { ascending: false })
    .limit(5)

  const l = listing as any
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: l.title,
    description: l.description?.slice(0, 300),
    url: `https://mekendesh.site/listings/${id}`,
    datePublished: l.created_at,
    image: l.photos?.[0] || 'https://mekendesh.site/og-image.png',
    inLanguage: 'ru-RU',
    isPartOf: { '@type': 'WebSite', name: 'Мекендеш', url: 'https://mekendesh.site' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Мекендеш', item: 'https://mekendesh.site' },
        { '@type': 'ListItem', position: 2, name: CAT_LABELS[l.category] || l.category, item: `https://mekendesh.site/?cat=${l.category}` },
        { '@type': 'ListItem', position: 3, name: l.title },
      ],
    },
  }
  if (l.price) {
    jsonLd.offers = { '@type': 'Offer', price: l.price, priceCurrency: 'RUB', availability: 'https://schema.org/InStock' }
  }
  if (l.user?.name) {
    jsonLd.author = { '@type': 'Person', name: l.user.name }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ListingDetailClient listing={listing as any} reviews={reviews || []} />
    </>
  )
}
