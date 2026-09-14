import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'
import { resend } from '@/lib/resend'
import { blogPostEmailHtml } from '@/lib/emailTemplates'

// Publishes a draft blog post and emails everyone in the customers table
// (deduped by email, excluding Lost leads and anyone who has unsubscribed)
// an announcement with a link to the article.
export async function POST(request) {
  const { authorized } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return Response.json({ error: 'Missing post id' }, { status: 400 })

  const { data: post } = await supabaseAdmin.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (!post) return Response.json({ error: 'Post not found' }, { status: 404 })

  const origin = new URL(request.url).origin
  const postUrl = `${origin}/blog/${post.slug}`

  // Publish first, regardless of email outcome — the article being live
  // shouldn't depend on the email send succeeding.
  const now = new Date().toISOString()
  await supabaseAdmin.from('blog_posts').update({ status: 'published', published_at: post.published_at || now }).eq('id', id)

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ success: true, published: true, emailed: false, emailError: 'Email is not configured on the server (missing API key).' })
  }

  const { data: customers } = await supabaseAdmin
    .from('customers')
    .select('id, email, first_name, lead_status, marketing_opt_out')
    .not('email', 'is', null)

  const seen = new Set()
  const recipients = (customers || []).filter((c) => {
    if (!c.email) return false
    if (c.lead_status === 'Lost') return false
    if (c.marketing_opt_out) return false
    const key = c.email.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  let sent = 0
  const failures = []
  for (const c of recipients) {
    const unsubscribeUrl = `${origin}/unsubscribe?customerId=${c.id}&email=${encodeURIComponent(c.email)}`
    const html = blogPostEmailHtml({ title: post.title, excerpt: post.excerpt, url: postUrl, unsubscribeUrl })
    try {
      const { error } = await resend.emails.send({
        from: 'EBC <noreply@mail.ebc33.com.au>',
        to: c.email,
        subject: `New from EBC: ${post.title}`,
        html,
      })
      if (error) failures.push({ email: c.email, error: error.message })
      else sent += 1
    } catch (err) {
      failures.push({ email: c.email, error: err.message })
    }
  }

  await supabaseAdmin.from('blog_posts').update({ emailed_at: now, emailed_count: sent }).eq('id', id)

  return Response.json({ success: true, published: true, emailed: true, sent, attempted: recipients.length, failures })
}
