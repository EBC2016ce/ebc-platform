import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

export async function GET(request) {
  const { authorized } = await requireStaff()
  if (!authorized) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')

  const { data: customer } = await supabaseAdmin.from('customers').select('*').eq('id', customerId).single()

  // Opening a lead's detail page marks it as viewed, so it stops showing as
  // an unopened "new" lead on the leads list.
  if (customer && !customer.viewed_by_staff) {
    await supabaseAdmin.from('customers').update({ viewed_by_staff: true }).eq('id', customerId)
    customer.viewed_by_staff = true
  }

  const { data: design } = await supabaseAdmin.from('designs').select('*').eq('customer_id', customerId).maybeSingle()
  const { data: bookings } = await supabaseAdmin.from('bookings').select('*').eq('customer_id', customerId).order('created_at', { ascending: false })
  const { data: notes } = await supabaseAdmin.from('lead_notes').select('*').eq('customer_id', customerId).order('created_at', { ascending: false })
  const { data: quotes } = await supabaseAdmin.from('quotes').select('*').eq('customer_id', customerId).order('created_at', { ascending: false })
  const { data: project } = await supabaseAdmin.from('projects').select('*').eq('customer_id', customerId).maybeSingle()
  const { data: updates } = await supabaseAdmin.from('project_updates').select('*').eq('customer_id', customerId).order('created_at', { ascending: false })
      return Response.json({ customer, design, bookings, notes, quotes, project, updates })
}
