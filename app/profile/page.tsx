import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import type { Listing } from '@/types'
import { DEFAULT_CITY } from '@/types'
import ProfileClient from './ProfileClient'

type FavoriteRow = { listing: Listing | null }

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/?auth=1')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const resolvedProfile = profile ?? {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Пользователь',
    email: user.email ?? '',
    city: DEFAULT_CITY,
    rating: 5,
    avatar_url: null,
    phone: null,
    whatsapp: null,
    telegram: null,
    vk: null,
    created_at: user.created_at,
    ads_count: 0,
  }

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'draft'])
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })

  const { data: favRows } = await supabase
    .from('favorites')
    .select('listing:listings(*)')
    .eq('user_id', user.id)

  const favListings = (favRows as FavoriteRow[] | null)
    ?.map((f) => f.listing)
    .filter(Boolean) as Listing[] ?? []

  return (
    <ProfileClient
      profile={resolvedProfile}
      initialListings={(listings ?? []) as Listing[]}
      initialFavs={favListings}
    />
  )
}
