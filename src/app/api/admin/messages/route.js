import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')

  const { data: messages } = await supabaseAdmin.from('messages').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })

  return Response.json({ messages: messages || [] })
}

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { customerId, body } = await request.json()
  const { error } = await supabaseAdmin.from('messages').insert([{ customer_id: customerId, sender: 'staff', body }])

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}
