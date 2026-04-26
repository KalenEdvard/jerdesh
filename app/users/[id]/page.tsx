import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import UserProfileClient from './UserProfileClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('users').select('name').eq('id', id).single()
  return { title: data ? `${data.name} | Мекендеш` : 'Профиль | Мекендеш' }
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profileUser } = await supabase
    .from('users')
    .select('id,name,avatar_url,city,rating,ads_count,created_at')
    .eq('id', id)
    .single()

  if (!profileUser) notFound()

  const { data: listings } = await supabase
    .from('listings')
    .select('id,title,category,price,metro,city,photos,views,created_at,status')
    .eq('user_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id,rating,comment,created_at,reviewer_id,reviewer:users(id,name,avatar_url)')
    .eq('reviewed_id', id)
    .order('created_at', { ascending: false })

  return (
    <UserProfileClient
      profileUser={profileUser as any}
      listings={listings || []}
      reviews={reviews || []}
    />
  )
}
