import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const { action, customerId, amount, description, quoteId, status } = await request.json()

    if (action === 'create') {
      const { count } = await supabaseAdmin.from('quotes').select('*', { count: 'exact', head: true }).eq('customer_id', customerId)
      const reference = 'EBC-' + new Date().getFullYear() + '-' + String(customerId).padStart(4, '0') + '-' + ((count || 0) + 1)
      const { error } = await supabaseAdmin.from('quotes').insert([{ customer_id: customerId, reference, amount, description }])
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    if (action === 'updateStatus') {
      const { error } = await supabaseAdmin.from('quotes').update({ status }).eq('id', quoteId)
      if (error) return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
