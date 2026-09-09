import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const { customerId, action, status, note } = await request.json()

    if (action === 'updateStatus') {
      const { error } = await supabaseAdmin.from('customers').update({ lead_status: status }).eq('id', customerId)
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    if (action === 'addNote') {
      const { error } = await supabaseAdmin.from('lead_notes').insert([{ customer_id: customerId, note }])
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
