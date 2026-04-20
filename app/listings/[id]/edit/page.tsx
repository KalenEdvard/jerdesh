import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import EditListingClient from './EditListingClient'

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: listing } = await supabase
    .from('listings')
    .select('id,title,description,category,price,metro,city,phone,photos,is_urgent,user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!listing) notFound()

  return <EditListingClient listing={listing as any} />
}
