import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

export async function GET() {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, topic, status, created_at, published_at, emailed_at, emailed_count')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ posts: data || [] })
}
