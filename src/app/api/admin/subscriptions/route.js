import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

// Same restriction as the old Claude-hosted ledger: this is sensitive
// billing info, gated to one admin account regardless of can_manage_leads.
export const dynamic = 'force-dynamic'
export const revalidate = 0

function canView(user) {
  return user.email === 'admin-ebc03@easybcon.com.au'
}

export async function GET() {
  const { authorized, user } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })
  if (!canView(user)) return Response.json({ error: 'Not authorized' }, { status: 403 })

  const { data: rows, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ rows: rows || [] })
}

// Body: { rows: [{ id, name, category, monthly, yearly, sort_order }, ...] }
// Full replace-by-id upsert, plus deletes any row not present anymore.
export async function POST(request) {
  const { authorized, user } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })
  if (!canView(user)) return Response.json({ error: 'Not authorized' }, { status: 403 })

  const { rows } = await request.json()
  if (!Array.isArray(rows)) return Response.json({ error: 'rows must be an array' }, { status: 400 })

  const cleanRows = rows.map((r, i) => ({
    id: String(r.id),
    name: String(r.name || 'Untitled'),
    category: ['Software', 'Hosting', 'Domain', 'Other'].includes(r.category) ? r.category : 'Other',
    monthly: Number(r.monthly) || 0,
    yearly: Number(r.yearly) || 0,
    sort_order: i,
    updated_at: new Date().toISOString(),
  }))

  const keepIds = cleanRows.map((r) => r.id)

  const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert(cleanRows, { onConflict: 'id' })
  if (upsertError) return Response.json({ error: upsertError.message }, { status: 400 })

  if (keepIds.length > 0) {
    const { error: deleteError } = await supabaseAdmin.from('subscriptions').delete().not('id', 'in', `(${keepIds.map((id) => `"${id}"`).join(',')})`)
    if (deleteError) return Response.json({ error: deleteError.message }, { status: 400 })
  }

  return Response.json({ success: true })
}
