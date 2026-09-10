import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

export async function POST(request) {
  const { authorized } = await requireStaff()
  if (!authorized) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const { weekdays, slots, maxPerDay } = await request.json()

    const { error } = await supabaseAdmin
      .from('booking_config')
      .update({ weekdays, slots, max_per_day: maxPerDay })
      .eq('id', 1)

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
