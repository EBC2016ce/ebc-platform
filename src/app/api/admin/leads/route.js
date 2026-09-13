import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

export async function GET() {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data: customers, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .order('id', { ascending: false })

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

  return Response.json({ leads })
}
