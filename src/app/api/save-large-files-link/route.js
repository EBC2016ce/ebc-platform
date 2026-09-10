import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { customerId, link } = await request.json()

  const { data: customer } = await supabaseAdmin.from('customers').select('id').eq('auth_user_id', user.id).single()
   if (!customer || String(customer.id) !== String(customerId)) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  const { error } = await supabaseAdmin.from('customers').update({ large_files_link: link }).eq('id', customerId)
  if (error) return Response.json({ error: error.message }, { status: 400 })

  return Response.json({ success: true })
}
