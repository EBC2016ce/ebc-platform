'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/blog/' + slug)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) setError(result.error)
        else setPost(result.post)
      })
  }, [slug])

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex flex-col items-center mb-10">
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
        </Link>

        {error && (
          <div className="text-center">
            <p className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-4 py-3 inline-block">Article not found.</p>
            <p className="mt-6"><Link href="/blog" className="text-sm text-[#1B2A4A] underline">← Back to the blog</Link></p>
          </div>
        )}

        {!error && !post && <p className="text-sm text-[#5A5E66] text-center">Loading...</p>}

        {post && (
          <article className="bg-white border border-[#D9D6CD] rounded-md p-8">
            <p className="text-xs text-[#8A8D94] mb-2">
              {post.published_at ? new Date(post.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </p>
            <h1 className="text-2xl font-semibold text-[#1B2A4A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h1>
            <div className="prose-ebc text-sm text-[#333] leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content_html }} />
          </article>
        )}

        <div className="text-center mt-8">
          <Link href="/blog" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to the blog</Link>
        </div>
      </div>
    </main>
  )
}
