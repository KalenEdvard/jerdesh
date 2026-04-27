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

  const [listings, reviews] = await Promise.all([
    query<any>("SELECT id,title,category,price,metro,city,photos,views,created_at FROM listings WHERE user_id=$1 AND status='active' ORDER BY created_at DESC LIMIT 20", [id]),
    query<any>(`SELECT r.id,r.rating,r.comment,r.created_at,r.reviewer_id,
                json_build_object('id',u.id,'name',u.name,'avatar_url',u.avatar_url) as reviewer
                FROM reviews r LEFT JOIN users u ON u.id=r.reviewer_id
                WHERE r.reviewed_id=$1 ORDER BY r.created_at DESC`, [id]),
  ])

  return <UserProfileClient profileUser={profileUser as any} listings={listings} reviews={reviews as any} />
}
