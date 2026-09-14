import { requireStaff } from '@/lib/checkStaff'
import { buildReportData } from '@/lib/leadsReportData'

// No distinguishing query string at all, so it must never be cached.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const data = await buildReportData()
  return Response.json(data)
}
