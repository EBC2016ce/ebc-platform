import { supabaseAdmin } from '@/lib/supabase-admin'

// Public endpoint — only ever returns a published post.
export async function GET(request, { params }) {
  const { slug } = await params

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('title, slug, excerpt, content_html, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  if (!data) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ post: data })
}
