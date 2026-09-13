import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

export async function GET(request) {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')

  const { data: messages } = await supabaseAdmin.from('messages').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })

  // Opening a lead's messages marks any unread customer messages as read.
  await supabaseAdmin.from('messages').update({ read_by_staff: true }).eq('customer_id', customerId).eq('sender', 'customer').eq('read_by_staff', false)

  return Response.json({ messages: messages || [] })
}

export async function POST(request) {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { customerId, body } = await request.json()
  const { error } = await supabaseAdmin.from('messages').insert([{ customer_id: customerId, sender: 'staff', body, read_by_staff: true }])

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ success: true })
}
