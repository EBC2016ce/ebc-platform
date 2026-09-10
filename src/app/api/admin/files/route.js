import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

export async function GET(request) {
  const { authorized } = await requireStaff()
  if (!authorized) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')

  const categories = ['Working Drawings Plan', 'Engineering/Structural Plan', 'Landscape Plan', 'Soil Report', 'Energy Report', 'Planning Permit', 'Other 01', 'Other 02', 'Other 03', 'Other 04']
  const files = []

  for (const category of categories) {
    const { data } = await supabaseAdmin.storage.from('plans').list(customerId + '/' + category)
    if (data && data.length > 0) {
      for (const file of data) {
        const { data: signed } = await supabaseAdmin.storage.from('plans').createSignedUrl(customerId + '/' + category + '/' + file.name, 3600)
        files.push({ category, name: file.name, url: signed?.signedUrl })
      }
    }
  }

  return Response.json({ files })
}
