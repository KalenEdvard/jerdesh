import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { queryOne, query } from '@/lib/db'
import UserProfileClient from './UserProfileClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const user = await queryOne<any>('SELECT name FROM users WHERE id=$1', [id])
  return { title: user ? `${user.name} | Мекендеш` : 'Профиль | Мекендеш' }
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profileUser = await queryOne<any>('SELECT id,name,avatar_url,city,rating,ads_count,created_at FROM users WHERE id=$1', [id])
  if (!profileUser) notFound()

  const [listings, reviews, listingRatings] = await Promise.all([
    query<any>(`SELECT l.id,l.title,l.category,l.price,l.metro,l.city,l.photos,l.views,l.created_at,l.is_urgent,l.is_premium,l.status,
                json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as user
                FROM listings l JOIN users u ON u.id=l.user_id
                WHERE l.user_id=$1 AND l.status='active' ORDER BY l.created_at DESC LIMIT 20`, [id]),
    query<any>(`SELECT r.id,r.rating,r.comment,r.created_at,r.reviewer_id,
                json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as reviewer
                FROM reviews r LEFT JOIN users u ON u.id=r.reviewer_id
                WHERE r.reviewed_id=$1 ORDER BY r.created_at DESC`, [id]),
    query<any>(`SELECT lr.id,lr.rating,lr.comment,lr.created_at,lr.rater_id,
                l.id as listing_id, l.title as listing_title,
                json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as rater
                FROM listing_ratings lr
                JOIN listings l ON l.id=lr.listing_id
                JOIN users u ON u.id=lr.rater_id
                WHERE l.user_id=$1 ORDER BY lr.created_at DESC`, [id]),
  ])

  return <UserProfileClient profileUser={profileUser as any} listings={listings} reviews={reviews as any} listingRatings={listingRatings as any} />
}
