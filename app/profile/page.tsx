import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import type { Listing } from '@/types'
import ProfileClient from './ProfileClient'

type FavoriteRow = { listing: Listing | null }

export default async function ProfilePage() {
  const supabase = await createClient()

  // Источник истины — сервер. Нет сессии — редирект до рендера.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/?auth=1')

  // Загружаем профиль
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fallback если профиль не создан в public.users
  const resolvedProfile = profile ?? {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Пользователь',
    email: user.email ?? '',
    city: 'Москва',
    rating: 5,
    avatar_url: null,
    phone: null,
    whatsapp: null,
    telegram: null,
    vk: null,
    created_at: user.created_at,
    ads_count: 0,
  }

  // Загружаем объявления
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'draft'])
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })

  // Загружаем избранное
  const { data: favRows } = await supabase
    .from('favorites')
    .select('listing:listings(*)')
    .eq('user_id', user.id)

  const favListings = (favRows as FavoriteRow[] | null)
    ?.map(f => f.listing)
    .filter(Boolean) as Listing[] ?? []

  return (
    <ProfileClient
      profile={resolvedProfile}
      initialListings={(listings ?? []) as Listing[]}
      initialFavs={favListings}
    />
  )
}
