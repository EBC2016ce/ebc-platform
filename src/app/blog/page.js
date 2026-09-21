import Image from 'next/image'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import { breadcrumbSchema } from '@/lib/site'

// Server-rendered (was a client component that fetched after load, which meant
// Google saw an empty "Loading articles..." page). Refreshed every 10 minutes.
export const revalidate = 600

export const metadata = {
  title: 'Melbourne Building & Renovation Advice',
  description: 'Practical guides for Melbourne homeowners planning a renovation, extension or new build - costs, timelines, permits and what to ask a builder first.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Melbourne Building & Renovation Advice | EBC Blog',
    description: 'Practical guides for Melbourne homeowners planning a renovation, extension or new build.',
    url: '/blog',
  },
}

async function getPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) {
    console.error('blog index: could not load posts:', error.message)
    return []
  }
  return data || []
}

export default async function BlogIndex() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col">
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />
      <div className="flex-1 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="flex flex-col items-center mb-10">
            <Image src="/logo-icon.png" alt="Easy Building & Construction logo" width={202} height={100} className="h-16 w-auto" />
            <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
              Easy Building &amp; Construction Pty Ltd.
            </span>
          </Link>

          <h1 className="text-3xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Melbourne Building &amp; Renovation Advice
          </h1>
          <p className="text-sm text-[#5A5E66] text-center mt-2 mb-10">
            Building regulations, industry updates and practical guidance for Melbourne homeowners.
          </p>

          {posts.length === 0 ? (
            <p className="text-sm text-[#5A5E66] text-center">No articles yet — check back soon.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((p) => (
                <Link key={p.id} href={'/blog/' + p.slug}
                  className="block bg-white border border-[#D9D6CD] rounded-md p-6 hover:border-[#E1601F] transition">
                  <p className="text-xs text-[#8A8D94] mb-1">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Melbourne' }) : ''}
                  </p>
                  <h2 className="text-lg font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h2>
                  {p.excerpt && <p className="text-sm text-[#5A5E66] mt-2">{p.excerpt}</p>}
                  <span className="inline-block mt-3 text-sm text-[#E1601F] font-medium">Read more →</span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 bg-[#1B2A4A] rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Planning a project?</h2>
            <p className="text-sm text-[#C9D2E3] mt-2">Tell us about it and we&apos;ll get back to you with a clear plan.</p>
            <Link href="/register" data-cta="blog-index-quote" className="inline-block mt-5 bg-[#8FC2FF] text-[#0F1930] font-semibold rounded-md px-7 py-3">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
