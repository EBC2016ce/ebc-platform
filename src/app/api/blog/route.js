import { supabaseAdmin } from '@/lib/supabase-admin'

// Public endpoint — only ever returns published posts.
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ posts: data || [] })
}
