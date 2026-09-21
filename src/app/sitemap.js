import { supabaseAdmin } from '@/lib/supabase-admin'

const base = 'https://easybcon.com.au'

// Regenerated at most hourly, so new blog posts appear in the sitemap on their own.
export const revalidate = 3600

// lastModified is the date each page's content last meaningfully changed.
// Update the date here when you materially edit a page - an honest date helps
// Google decide when to re-crawl; "now" on every build teaches it to ignore the field.
const CONTENT_UPDATED = '2026-09-20'

export default async function sitemap() {
  const pages = [
    { url: `${base}/`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/renovation`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/extension`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/new-home`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/areas`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/register`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: CONTENT_UPDATED, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: '2026-09-12', changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Published blog posts. If the database can't be reached at build time we
  // still return the core pages rather than failing the whole build.
  try {
    const { data } = await supabaseAdmin
      .from('blog_posts')
      .select('slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    for (const post of data || []) {
      pages.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.published_at || CONTENT_UPDATED,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch (err) {
    console.error('sitemap: could not load blog posts:', err.message)
  }

  return pages
}
