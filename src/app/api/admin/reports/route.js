import { requireStaff } from '@/lib/checkStaff'
import { buildReportData } from '@/lib/leadsReportData'

export async function GET() {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const data = await buildReportData()
  return Response.json(data)
}
