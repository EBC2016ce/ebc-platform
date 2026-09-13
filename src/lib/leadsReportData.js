import { supabaseAdmin } from '@/lib/supabase-admin'

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

const DAY = 24 * 60 * 60 * 1000

// Builds the data behind all five leads reports (pipeline & conversion,
// lead sources, follow-up/response, quotes & revenue, project category
// performance) — shared by the /admin/reports dashboard and the emailed
// report, so both always show the same numbers.
export async function buildReportData() {
  const { data: customers } = await supabaseAdmin.from('customers').select('*').order('id', { ascending: false })
  const { data: quotes } = await supabaseAdmin.from('quotes').select('*')
  const { data: messages } = await supabaseAdmin.from('messages').select('customer_id, sender, read_by_staff, created_at')
  const { data: notes } = await supabaseAdmin.from('lead_notes').select('customer_id, created_at')

  const all = customers || []
  const now = Date.now()
  const weekAgo = now - 7 * DAY
  const monthAgo = now - 30 * DAY

  const unreadIds = new Set((messages || []).filter((m) => m.sender === 'customer' && !m.read_by_staff).map((m) => m.customer_id))

  // Last staff activity (a note or a staff reply) per customer, used for the
  // follow-up / response-time report.
  const lastActivity = {}
  for (const n of notes || []) {
    const t = new Date(n.created_at).getTime()
    if (!lastActivity[n.customer_id] || t > lastActivity[n.customer_id]) lastActivity[n.customer_id] = t
  }
  for (const m of messages || []) {
    if (m.sender !== 'staff') continue
    const t = new Date(m.created_at).getTime()
    if (!lastActivity[m.customer_id] || t > lastActivity[m.customer_id]) lastActivity[m.customer_id] = t
  }

  // =========================================================
  // Report 1: Pipeline & Conversion
  // =========================================================
  const STATUS_ORDER = ['New', 'Contacted', 'Qualified', 'Quoted', 'Negotiation', 'Won', 'Lost']
  const byStatus = STATUS_ORDER.map((s) => ({ status: s, count: all.filter((c) => (c.lead_status || 'New') === s).length }))
  const won = all.filter((c) => c.lead_status === 'Won').length
  const lost = all.filter((c) => c.lead_status === 'Lost').length
  const active = all.filter((c) => !['Won', 'Lost'].includes(c.lead_status || 'New')).length

  const pipeline = {
    total: all.length,
    newThisWeek: all.filter((c) => new Date(c.created_at).getTime() > weekAgo).length,
    newThisMonth: all.filter((c) => new Date(c.created_at).getTime() > monthAgo).length,
    won,
    lost,
    active,
    winRate: (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : null,
    byStatus,
  }

  // =========================================================
  // Report 2: Lead Source & Marketing Performance
  // =========================================================
  const sourceMap = {}
  for (const c of all) {
    const key = c.utm_source ? c.utm_source : 'Direct / Unknown'
    if (!sourceMap[key]) sourceMap[key] = { source: key, total: 0, won: 0, lost: 0 }
    sourceMap[key].total += 1
    if (c.lead_status === 'Won') sourceMap[key].won += 1
    if (c.lead_status === 'Lost') sourceMap[key].lost += 1
  }
  const sources = Object.values(sourceMap)
    .map((s) => ({ ...s, winRate: (s.won + s.lost) > 0 ? Math.round((s.won / (s.won + s.lost)) * 100) : null }))
    .sort((a, b) => b.total - a.total)

  // =========================================================
  // Report 3: Follow-up & Response Time
  // =========================================================
  const needsFollowUp = all
    .filter((c) => !['Won', 'Lost'].includes(c.lead_status || 'New'))
    .map((c) => {
      const last = lastActivity[c.id]
      const daysSinceCreated = Math.floor((now - new Date(c.created_at).getTime()) / DAY)
      const daysSinceContact = last ? Math.floor((now - last) / DAY) : daysSinceCreated
      return { id: c.id, name: `${c.first_name} ${c.last_name}`, projectType: c.project_type, status: c.lead_status || 'New', daysSinceContact, everContacted: !!last }
    })
    .filter((c) => c.daysSinceContact >= 3)
    .sort((a, b) => b.daysSinceContact - a.daysSinceContact)

  const followUp = {
    unreadMessages: unreadIds.size,
    unviewedLeads: all.filter((c) => !c.viewed_by_staff).length,
    staleNew: all.filter((c) => (c.lead_status || 'New') === 'New' && new Date(c.created_at).getTime() < weekAgo).length,
    neverContacted: all.filter((c) => !lastActivity[c.id] && !['Won', 'Lost'].includes(c.lead_status || 'New')).length,
    needsFollowUp: needsFollowUp.slice(0, 10),
    needsFollowUpCount: needsFollowUp.length,
  }

  // =========================================================
  // Report 4: Quotes & Revenue
  // =========================================================
  const q = quotes || []
  const sum = (arr) => arr.reduce((t, x) => t + Number(x.amount || 0), 0)
  const accepted = q.filter((x) => x.status === 'Accepted')
  const sent = q.filter((x) => x.status === 'Sent')
  const draft = q.filter((x) => x.status === 'Draft')
  const revenue = {
    totalQuoted: sum(q),
    accepted: sum(accepted),
    acceptedCount: accepted.length,
    outstanding: sum(sent),
    outstandingCount: sent.length,
    draft: sum(draft),
    draftCount: draft.length,
    count: q.length,
    avgQuote: q.length > 0 ? Math.round(sum(q) / q.length) : 0,
    quoteWinRate: (accepted.length + q.filter((x) => x.status === 'Rejected').length) > 0
      ? Math.round((accepted.length / (accepted.length + q.filter((x) => x.status === 'Rejected').length)) * 100)
      : null,
  }

  // =========================================================
  // Report 5: Project Category Performance
  // =========================================================
  const quotesByCustomer = {}
  for (const x of q) {
    if (!quotesByCustomer[x.customer_id]) quotesByCustomer[x.customer_id] = []
    quotesByCustomer[x.customer_id].push(x)
  }
  const catMap = {}
  for (const c of all) {
    const cat = categorize(c.project_type)
    if (!catMap[cat]) catMap[cat] = { category: cat, total: 0, won: 0, lost: 0, active: 0, acceptedValue: 0 }
    catMap[cat].total += 1
    if (c.lead_status === 'Won') catMap[cat].won += 1
    else if (c.lead_status === 'Lost') catMap[cat].lost += 1
    else catMap[cat].active += 1
    const custQuotes = quotesByCustomer[c.id] || []
    catMap[cat].acceptedValue += sum(custQuotes.filter((x) => x.status === 'Accepted'))
  }
  const categories = ['New Building', 'Renovation', 'Extension', 'Other']
    .map((cat) => catMap[cat] || { category: cat, total: 0, won: 0, lost: 0, active: 0, acceptedValue: 0 })
    .map((c) => ({ ...c, winRate: (c.won + c.lost) > 0 ? Math.round((c.won / (c.won + c.lost)) * 100) : null }))

  return {
    generatedAt: new Date().toISOString(),
    pipeline,
    sources,
    followUp,
    revenue,
    categories,
  }
}
