import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

    const { data: customers } = await supabaseAdmin.from('customers').select('id, first_name, last_name, email, lead_status, project_type, created_at, reminded_design, reminded_booking')
  const { data: quotes } = await supabaseAdmin.from('quotes').select('amount, status')

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  const needsFollowUp = (customers || []).filter((c) =>
    !['Won', 'Lost'].includes(c.lead_status) && (c.reminded_design || c.reminded_booking) && c.created_at < threeDaysAgo
  )

  const statusCounts = {}
  const typeCounts = {}
  ;(customers || []).forEach((c) => {
    const s = c.lead_status || 'New'
    statusCounts[s] = (statusCounts[s] || 0) + 1
    typeCounts[c.project_type] = (typeCounts[c.project_type] || 0) + 1
  })

  const totalLeads = (customers || []).length
  const won = statusCounts['Won'] || 0
  const lost = statusCounts['Lost'] || 0
  const conversionRate = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : 0

  const acceptedValue = (quotes || []).filter((q) => q.status === 'Accepted').reduce((sum, q) => sum + Number(q.amount), 0)
  const pipelineValue = (quotes || []).filter((q) => ['Draft', 'Sent'].includes(q.status)).reduce((sum, q) => sum + Number(q.amount), 0)

    return Response.json({
    totalLeads,
    statusCounts,
    typeCounts,
    conversionRate,
    acceptedValue,
    pipelineValue,
    needsFollowUp,
  })
}
