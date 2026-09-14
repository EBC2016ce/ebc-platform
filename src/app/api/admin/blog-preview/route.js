import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

// Renders a draft (or published) post as a plain HTML page for staff to
// preview before publishing — not a JSON API, so it opens directly in a tab.
export async function GET(request) {
  const { authorized } = await requireStaff()
  if (!authorized) return new Response('Not authorized', { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })

  const { data: post } = await supabaseAdmin.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!post) return new Response('Not found', { status: 404 })

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Preview: ${post.title}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background:#F6F5F1; margin:0; padding:40px 20px; }
    .wrap { max-width: 640px; margin: 0 auto; background:#fff; border:1px solid #D9D6CD; border-radius:6px; padding:32px; }
    h1 { color:#1B2A4A; font-size:24px; }
    .badge { display:inline-block; font-size:11px; font-weight:bold; color:#E1601F; background:#FFF6F0; border-radius:12px; padding:3px 10px; margin-bottom:14px; }
    .excerpt { color:#5A5E66; font-style:italic; margin-bottom:24px; }
    .content { color:#333; line-height:1.7; }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="badge">${post.status === 'draft' ? 'DRAFT PREVIEW' : 'PUBLISHED'}</span>
    <h1>${post.title}</h1>
    ${post.excerpt ? `<p class="excerpt">${post.excerpt}</p>` : ''}
    <div class="content">${post.content_html}</div>
  </div>
</body>
</html>
  `

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
