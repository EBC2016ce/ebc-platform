import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

const CATEGORY_MAP = {
  'New Building': ['New home'],
  'Renovation': ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation'],
  'Extension': ['Extension'],
}

function categorize(projectType) {
  for (const [category, types] of Object.entries(CATEGORY_MAP)) {
    if (types.includes(projectType)) return category
  }
  return 'Other'
}

export async function GET() {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data: customers } = await supabaseAdmin.from('customers').select('*').order('id', { ascending: false })
  const { data: quotes } = await supabaseAdmin.from('quotes').select('*')
  const { data: unreadRows } = await supabaseAdmin.from('messages').select('customer_id').eq('sender', 'customer').eq('read_by_staff', false)

  const all = customers || []
  const now = Date.now()
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000
  const unreadIds = new Set((unreadRows || []).map((m) => m.customer_id))

  // --- Totals ---
  const totals = {
    total: all.length,
    newThisWeek: all.filter((c) => new Date(c.created_at).getTime() > weekAgo).length,
    newThisMonth: all.filter((c) => new Date(c.created_at).getTime() > monthAgo).length,
    won: all.filter((c) => c.lead_status === 'Won').length,
    lost: all.filter((c) => c.lead_status === 'Lost').length,
    active: all.filter((c) => !['Won', 'Lost'].includes(c.lead_status || 'New')).length,
  }
  totals.winRate = (totals.won + totals.lost) > 0 ? Math.round((totals.won / (totals.won + totals.lost)) * 100) : null

  // --- By status (pipeline funnel) ---
  const STATUS_ORDER = ['New', 'Contacted', 'Qualified', 'Quoted', 'Negotiation', 'Won', 'Lost']
  const byStatus = STATUS_ORDER.map((s) => ({
    status: s,
    count: all.filter((c) => (c.lead_status || 'New') === s).length,
  }))

  // --- By project category ---
  const byCategory = ['New Building', 'Renovation', 'Extension', 'Other'].map((cat) => ({
    category: cat,
    count: all.filter((c) => categorize(c.project_type) === cat).length,
  }))

  // --- By marketing source ---
  const sourceCounts = {}
  for (const c of all) {
    const key = c.utm_source ? c.utm_source : 'Direct / Unknown'
    sourceCounts[key] = (sourceCounts[key] || 0) + 1
  }
  const bySource = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)

  // --- Quotes / revenue pipeline ---
  const q = quotes || []
  const sum = (arr) => arr.reduce((t, x) => t + Number(x.amount || 0), 0)
  const quoteStats = {
    totalQuoted: sum(q),
    accepted: sum(q.filter((x) => x.status === 'Accepted')),
    outstanding: sum(q.filter((x) => x.status === 'Sent')),
    draft: sum(q.filter((x) => x.status === 'Draft')),
    count: q.length,
    acceptedCount: q.filter((x) => x.status === 'Accepted').length,
  }

  // --- Needs attention ---
  const needsAttention = {
    unreadMessages: unreadIds.size,
    unviewedLeads: all.filter((c) => !c.viewed_by_staff).length,
    staleNew: all.filter((c) => (c.lead_status || 'New') === 'New' && new Date(c.created_at).getTime() < weekAgo).length,
  }

  return Response.json({ totals, byStatus, byCategory, bySource, quoteStats, needsAttention })
}
