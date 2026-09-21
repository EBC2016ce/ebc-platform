import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Footer from '../../components/Footer'
import JsonLd from '../../components/JsonLd'
import { SITE_URL, ORG_ID, BUSINESS, breadcrumbSchema } from '@/lib/site'

// Server-rendered and cached, refreshed every 10 minutes. Each post now has its
// own <title>, description, canonical URL and Article structured data, and a
// missing slug returns a real 404 (previously a "not found" message on a 200 page).
export const revalidate = 600

// Cover images that already exist in /public/blog. Posts without one fall back to the site image.
const COVER = {
  'design-build-vs-hiring-separately': '/blog/design-build-vs-hiring.jpg',
  'renovating-in-melbourne-questions': '/blog/renovating-melbourne-questions.jpg',
  'extension-costs-timelines-guide': '/blog/extension-costs-timelines.jpg',
}

const getPost = cache(async (slug) => {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('title, slug, excerpt, content_html, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) console.error('blog post: could not load', slug, error.message)
  return data || null
})

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Article not found', robots: { index: false } }

  const url = `/blog/${post.slug}`
  const image = COVER[post.slug] || '/hero-melbourne-home-build.jpg'
  const description = post.excerpt || undefined
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      publishedTime: post.published_at || undefined,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const image = COVER[post.slug] || '/hero-melbourne-home-build.jpg'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    image: `${SITE_URL}${image}`,
    datePublished: post.published_at || undefined,
    inLanguage: 'en-AU',
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: BUSINESS.name, url: SITE_URL },
    publisher: { '@id': ORG_ID },
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
      ])} />

      <div className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="flex flex-col items-center mb-10">
            <Image src="/logo-icon.png" alt="Easy Building & Construction logo" width={202} height={100} className="h-16 w-auto" />
          </Link>

          <article className="bg-white border border-[#D9D6CD] rounded-md p-8">
            <p className="text-xs text-[#8A8D94] mb-2">
              {post.published_at ? new Date(post.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Melbourne' }) : ''}
            </p>
            <h1 className="text-2xl font-semibold text-[#1B2A4A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h1>
            <div className="prose-ebc text-sm text-[#333] leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content_html }} />
          </article>

          {/* Next steps: turns readers into enquiries and passes link value to the service pages */}
          <div className="mt-8 bg-[#1B2A4A] rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Thinking about your own project?</h2>
            <p className="text-sm text-[#C9D2E3] mt-2">Tell us about it — free consultation, no obligation.</p>
            <Link href="/register" data-cta="blog-post-quote" className="inline-block mt-5 bg-[#8FC2FF] text-[#0F1930] font-semibold rounded-md px-7 py-3">
              Get a Free Quote
            </Link>
            <p className="mt-4 text-sm text-[#C9D2E3]">
              or call <a href="tel:1300715840" className="font-semibold text-white underline">1300 715 840</a>
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-[#5A5E66]">
            Learn more about our{' '}
            <Link href="/renovation" className="text-[#1B2A4A] underline">home renovations</Link>,{' '}
            <Link href="/extension" className="text-[#1B2A4A] underline">home extensions</Link> and{' '}
            <Link href="/new-home" className="text-[#1B2A4A] underline">new home builds</Link>.
          </div>

          <div className="text-center mt-6">
            <Link href="/blog" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to the blog</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
