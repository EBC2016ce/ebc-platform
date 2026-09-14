'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BlogIndex() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((result) => {
        if (result.error) setError(result.error)
        else setPosts(result.posts || [])
      })
  }, [])

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex flex-col items-center mb-10">
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
          <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Easy Building &amp; Construction Pty Ltd.
          </span>
        </Link>

        <h1 className="text-3xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          EBC Blog
        </h1>
        <p className="text-sm text-[#5A5E66] text-center mt-2 mb-10">
          Building regulations, industry updates and practical guidance for Melbourne homeowners.
        </p>

        {error && <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-4 py-3">{error}</div>}

        {!posts ? (
          <p className="text-sm text-[#5A5E66] text-center">Loading articles...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-[#5A5E66] text-center">No articles yet — check back soon.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((p) => (
              <Link key={p.id} href={'/blog/' + p.slug}
                className="block bg-white border border-[#D9D6CD] rounded-md p-6 hover:border-[#E1601F] transition">
                <p className="text-xs text-[#8A8D94] mb-1">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
                <h2 className="text-lg font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h2>
                {p.excerpt && <p className="text-sm text-[#5A5E66] mt-2">{p.excerpt}</p>}
                <span className="inline-block mt-3 text-sm text-[#E1601F] font-medium">Read more →</span>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to home</Link>
        </div>
      </div>
    </main>
  )
}
