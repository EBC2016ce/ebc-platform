import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

// GET has no distinguishing query string by default and returns the
// per-viewer canManageLeads permission flag, so it must never be cached —
// a cached response could leak archive/delete permission to the wrong staff
// member, or leads data to a stale caller.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  const { authorized, canManageLeads } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const includeArchived = searchParams.get('includeArchived') === '1'

  let query = supabaseAdmin.from('customers').select('*').order('id', { ascending: false })
  if (!includeArchived) query = query.eq('archived', false)
  const { data: customers, error } = await query

  if (error) return Response.json({ error: error.message }, { status: 400 })

  const { data: unread } = await supabaseAdmin
    .from('messages')
    .select('customer_id')
    .eq('sender', 'customer')
    .eq('read_by_staff', false)

  const unreadIds = new Set((unread || []).map((m) => m.customer_id))

  const leads = (customers || []).map((c) => ({
    ...c,
    hasUnread: unreadIds.has(c.id) || !c.viewed_by_staff,
    hasUnreadMessage: unreadIds.has(c.id),
    isUnviewed: !c.viewed_by_staff,
  }))

  return Response.json({ leads, canManageLeads })
}

// Archive / unarchive / permanently delete a lead. Only staff members with
// can_manage_leads (currently admin-ebc03@easybcon.com.au) are allowed.
export async function POST(request) {
  const { authorized, canManageLeads } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })
  if (!canManageLeads) return Response.json({ error: 'You do not have permission to manage leads.' }, { status: 403 })

  const { customerId, action } = await request.json()
  if (!customerId || !action) return Response.json({ error: 'Missing customerId or action' }, { status: 400 })

  if (action === 'archive') {
    const { error } = await supabaseAdmin.from('customers').update({ archived: true, archived_at: new Date().toISOString() }).eq('id', customerId)
    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ success: true })
  }

  if (action === 'unarchive') {
    const { error } = await supabaseAdmin.from('customers').update({ archived: false, archived_at: null }).eq('id', customerId)
    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ success: true })
  }

  if (action === 'delete') {
    // Clean up dependent rows first since there are no cascading deletes on
    // these foreign keys.
    await supabaseAdmin.from('messages').delete().eq('customer_id', customerId)
    await supabaseAdmin.from('lead_notes').delete().eq('customer_id', customerId)
    await supabaseAdmin.from('quotes').delete().eq('customer_id', customerId)
    await supabaseAdmin.from('project_updates').delete().eq('customer_id', customerId)
    await supabaseAdmin.from('projects').delete().eq('customer_id', customerId)
    await supabaseAdmin.from('bookings').delete().eq('customer_id', customerId)
    await supabaseAdmin.from('designs').delete().eq('customer_id', customerId)

    const { data: customer } = await supabaseAdmin.from('customers').select('auth_user_id').eq('id', customerId).maybeSingle()
    const { error } = await supabaseAdmin.from('customers').delete().eq('id', customerId)
    if (error) return Response.json({ error: error.message }, { status: 400 })

    if (customer?.auth_user_id) {
      await supabaseAdmin.auth.admin.deleteUser(customer.auth_user_id).catch((err) => console.error('Failed to delete auth user:', err))
    }

    return Response.json({ success: true })
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 })
}
