import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')

  const { data, error } = await supabaseAdmin
    .from('designs')
    .select('*')
    .eq('customer_id', customerId)
    .maybeSingle()

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
  return Response.json({ design: data })
}

export async function POST(request) {
  try {
    const { customerId, data, submit } = await request.json()

    const patch = {
      customer_id: customerId,
      data,
      updated_at: new Date().toISOString(),
    }
    if (submit) {
      patch.status = 'submitted'
      patch.submitted_at = new Date().toISOString()
    }

    const { error } = await supabaseAdmin
      .from('designs')
      .upsert(patch, { onConflict: 'customer_id' })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
