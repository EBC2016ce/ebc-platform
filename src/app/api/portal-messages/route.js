import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data: customer } = await supabaseAdmin.from('customers').select('id').eq('auth_user_id', user.id).single()
  if (!customer) return Response.json({ error: 'No matching project found' }, { status: 404 })

  const { data: messages } = await supabaseAdmin.from('messages').select('*').eq('customer_id', customer.id).order('created_at', { ascending: true })

  return Response.json({ messages: messages || [] })
}

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data: customer } = await supabaseAdmin.from('customers').select('id').eq('auth_user_id', user.id).single()
  if (!customer) return Response.json({ error: 'No matching project found' }, { status: 404 })

  const { body: messageBody } = await request.json()
  const { error } = await supabase.from('messages').insert([{ customer_id: customer.id, sender: 'customer', body: messageBody }])

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}
