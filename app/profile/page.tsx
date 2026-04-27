import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'
import type { Listing } from '@/types'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) redirect('/?auth=1')
  const payload = verifyToken(token)
  if (!payload) redirect('/?auth=1')

  const user = await queryOne<any>('SELECT * FROM users WHERE id=$1', [payload.userId])
  if (!user) redirect('/?auth=1')

  const listings = await query<any>(
    "SELECT * FROM listings WHERE user_id=$1 AND status IN ('active','draft') ORDER BY status ASC, created_at DESC",
    [payload.userId]
  )

  const favRows = await query<any>(
    'SELECT l.* FROM favorites f JOIN listings l ON l.id=f.listing_id WHERE f.user_id=$1',
    [payload.userId]
  )

  return (
    <ProfileClient
      profile={{ ...user, email: user.email }}
      initialListings={listings as Listing[]}
      initialFavs={favRows as Listing[]}
    />
  )
}
