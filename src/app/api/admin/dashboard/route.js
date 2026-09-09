import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  const { data: customers } = await supabaseAdmin.from('customers').select('id, lead_status, project_type, created_at')
  const { data: quotes } = await supabaseAdmin.from('quotes').select('amount, status')

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
  })
}
