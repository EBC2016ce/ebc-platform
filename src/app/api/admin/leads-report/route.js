import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'
import { resend } from '@/lib/resend'

// Sends a summary "leads report" email to the requesting staff member.
// Suggested report types bundled into one email for now: new leads this
// week, breakdown by status, breakdown by project type, and any leads with
// unread customer messages that need a reply.
export async function POST() {
  const { authorized, user, staffRecord } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data: customers } = await supabaseAdmin.from('customers').select('*').order('id', { ascending: false })
  const { data: unread } = await supabaseAdmin.from('messages').select('customer_id').eq('sender', 'customer').eq('read_by_staff', false)
  const unreadIds = new Set((unread || []).map((m) => m.customer_id))

  const all = customers || []
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const newThisWeek = all.filter((c) => new Date(c.created_at).getTime() > weekAgo)
  const byStatus = {}
  for (const c of all) {
    const s = c.lead_status || 'New'
    byStatus[s] = (byStatus[s] || 0) + 1
  }
  const unreadLeads = all.filter((c) => unreadIds.has(c.id))

  const statusRows = Object.entries(byStatus).map(([s, n]) => `<tr><td style="padding:4px 12px;">${s}</td><td style="padding:4px 12px;">${n}</td></tr>`).join('')
  const newLeadRows = newThisWeek.map((c) => `<tr><td style="padding:4px 12px;">${c.first_name} ${c.last_name}</td><td style="padding:4px 12px;">${c.project_type || ''}</td><td style="padding:4px 12px;">${c.email}</td></tr>`).join('') || '<tr><td style="padding:4px 12px;" colspan="3">None this week</td></tr>'
  const unreadRows = unreadLeads.map((c) => `<tr><td style="padding:4px 12px;">${c.first_name} ${c.last_name}</td><td style="padding:4px 12px;">${c.email}</td></tr>`).join('') || '<tr><td style="padding:4px 12px;" colspan="2">No unread messages</td></tr>'

  const html = `
    <div style="font-family: sans-serif; color: #171A1F; max-width: 600px;">
      <h2 style="color:#1B2A4A;">EBC Leads Report</h2>
      <p style="color:#5A5E66; font-size:14px;">Total leads: <strong>${all.length}</strong> · New this week: <strong>${newThisWeek.length}</strong> · Unread messages: <strong>${unreadLeads.length}</strong></p>

      <h3 style="color:#1B2A4A; font-size:15px; margin-top:24px;">By status</h3>
      <table style="border-collapse:collapse; font-size:14px;">${statusRows}</table>

      <h3 style="color:#1B2A4A; font-size:15px; margin-top:24px;">New leads this week</h3>
      <table style="border-collapse:collapse; font-size:14px;">${newLeadRows}</table>

      <h3 style="color:#1B2A4A; font-size:15px; margin-top:24px;">Leads with unread messages</h3>
      <table style="border-collapse:collapse; font-size:14px;">${unreadRows}</table>

      <p style="color:#8A8D94; font-size:12px; margin-top:24px;">Sent from the EBC admin leads dashboard.</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'EBC Admin <noreply@mail.ebc33.com.au>',
      to: user.email,
      subject: `EBC Leads Report — ${new Date().toLocaleDateString('en-AU')}`,
      html,
    })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
