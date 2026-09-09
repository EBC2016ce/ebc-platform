import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  const { data: customer } = await supabaseAdmin.from('customers').select('*').eq('auth_user_id', user.id).single()
  if (!customer) {
    return Response.json({ error: 'No matching project found' }, { status: 404 })
  }

  const { data: design } = await supabaseAdmin.from('designs').select('*').eq('customer_id', customer.id).maybeSingle()
  const { data: bookings } = await supabaseAdmin.from('bookings').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false })
  const { data: project } = await supabaseAdmin.from('projects').select('*').eq('customer_id', customer.id).maybeSingle()
  const { data: updates } = await supabaseAdmin.from('project_updates').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false })

  return Response.json({ customer, design, bookings, project, updates })
}
