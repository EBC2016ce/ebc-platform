import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

// No distinguishing query string, so it must never be cached.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data: reports, error } = await supabaseAdmin
    .from('ad_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ reports: reports || [] })
}
