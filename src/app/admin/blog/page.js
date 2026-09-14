'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [resultById, setResultById] = useState({})
  const router = useRouter()

  const load = () => {
    fetch('/api/admin/blog')
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return null }
        return res.json()
      })
      .then((result) => {
        if (!result) return
        if (result.error) setError(result.error)
        else setPosts(result.posts || [])
      })
  }

  useEffect(() => { load() }, []) // eslint-disable-line

  const publish = async (id) => {
    if (!confirm('Publish this article and email it to every eligible client? This can\'t be undone.')) return
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/blog-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await res.json()
      if (!res.ok) {
        setResultById((prev) => ({ ...prev, [id]: { error: result.error || 'Could not publish.' } }))
      } else {
        setResultById((prev) => ({ ...prev, [id]: { success: true, sent: result.sent, attempted: result.attempted, emailError: result.emailError } }))
        load()
      }
    } catch (err) {
      setResultById((prev) => ({ ...prev, [id]: { error: 'Could not reach the server: ' + err.message } }))
    }
    setBusyId(null)
  }

  const drafts = (posts || []).filter((p) => p.status === 'draft')
  const published = (posts || []).filter((p) => p.status === 'published')

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/leads" className="inline-flex items-center gap-1 text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to Leads</Link>
        <h1 className="text-2xl font-semibold text-[#1B2A4A] mt-2 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Blog</h1>
        <p className="text-sm text-[#5A5E66] mb-8">
          New articles are researched and drafted automatically every two weeks. Review a draft below, then publish it to send it live and email it to your clients.
        </p>

        {error && <div className="mb-6 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-4 py-3">{error}</div>}

        {!posts ? (
          <p className="text-sm text-[#5A5E66]">Loading...</p>
        ) : (
          <>
            <h2 className="font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Drafts awaiting review ({drafts.length})
            </h2>
            {drafts.length === 0 ? (
              <p className="text-sm text-[#8A8D94] mb-8">No drafts right now.</p>
            ) : (
              <div className="flex flex-col gap-4 mb-10">
                {drafts.map((p) => (
                  <div key={p.id} className="bg-white border border-[#D9D6CD] rounded-md p-5">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <span className="inline-block text-xs font-semibold text-[#E1601F] bg-[#FFF6F0] rounded-full px-2.5 py-0.5 mb-2">DRAFT</span>
                        <h3 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h3>
                        {p.topic && <p className="text-xs text-[#8A8D94] mt-1">Topic: {p.topic}</p>}
                        {p.excerpt && <p className="text-sm text-[#5A5E66] mt-2">{p.excerpt}</p>}
                      </div>
                      <div className="flex flex-col gap-2 items-end shrink-0">
                        <a href={'/api/admin/blog-preview?id=' + p.id} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-[#1B2A4A] underline decoration-[#1B2A4A]/40 hover:decoration-[#1B2A4A]">
                          Preview
                        </a>
                        <button onClick={() => publish(p.id)} disabled={busyId === p.id}
                          className="bg-[#0068D8] text-white font-medium rounded px-4 py-2 text-sm hover:bg-[#0050B0] disabled:opacity-50 transition">
                          {busyId === p.id ? 'Publishing...' : 'Publish & Email'}
                        </button>
                      </div>
                    </div>
                    {resultById[p.id]?.error && (
                      <div className="mt-3 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{resultById[p.id].error}</div>
                    )}
                    {resultById[p.id]?.success && (
                      <div className="mt-3 text-sm text-[#2E7D4F] bg-[#EAF6EE] border border-[#CDE9D6] rounded px-3 py-2">
                        Published{resultById[p.id].sent != null ? ` and emailed to ${resultById[p.id].sent} of ${resultById[p.id].attempted} clients` : ''}.
                        {resultById[p.id].emailError && <span className="block text-[#A23B2E] mt-1">Email issue: {resultById[p.id].emailError}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Published ({published.length})
            </h2>
            {published.length === 0 ? (
              <p className="text-sm text-[#8A8D94]">Nothing published yet.</p>
            ) : (
              <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[#8A8D94] uppercase tracking-wide bg-[#F6F5F1]">
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-5 py-3 font-medium">Published</th>
                      <th className="px-5 py-3 font-medium">Emailed to</th>
                      <th className="px-5 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {published.map((p) => (
                      <tr key={p.id} className="border-t border-[#EEE]">
                        <td className="px-5 py-3 font-medium text-[#1B2A4A]">{p.title}</td>
                        <td className="px-5 py-3 text-[#5A5E66]">{p.published_at ? new Date(p.published_at).toLocaleDateString('en-AU') : ''}</td>
                        <td className="px-5 py-3 text-[#5A5E66]">{p.emailed_count != null ? p.emailed_count + ' clients' : '—'}</td>
                        <td className="px-5 py-3 text-right">
                          <a href={'/blog/' + p.slug} target="_blank" rel="noopener noreferrer" className="text-[#1B2A4A] underline text-xs">View live</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
