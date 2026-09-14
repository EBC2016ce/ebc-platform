'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

const CATEGORY_MAP = {
  'New Building': ['New home'],
  'Renovation': ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation'],
  'Extension': ['Extension'],
}

function categorize(projectType) {
  for (const [category, types] of Object.entries(CATEGORY_MAP)) {
    if (types.includes(projectType)) return category
  }
  return 'Other'
}

const STATUS_COLORS = {
  New: 'bg-[#3C6FB0]/10 text-[#3C6FB0]',
  Contacted: 'bg-[#8A8D94]/10 text-[#5A5E66]',
  Qualified: 'bg-[#8A8D94]/10 text-[#5A5E66]',
  Quoted: 'bg-[#E1601F]/10 text-[#E1601F]',
  Negotiation: 'bg-[#E1601F]/10 text-[#E1601F]',
  Won: 'bg-[#2E7D4F]/10 text-[#2E7D4F]',
  Lost: 'bg-[#A23B2E]/10 text-[#A23B2E]',
}

function LeadsTable({ title, leads, canManageLeads, onArchive, onDelete }) {
  if (leads.length === 0) return null
  return (
    <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden mb-6">
      <div className="px-5 py-3 bg-[#F6F5F1] border-b border-[#D9D6CD] flex items-center justify-between">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
        <span className="text-xs text-[#8A8D94]">{leads.length} lead{leads.length === 1 ? '' : 's'}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[#8A8D94] uppercase tracking-wide">
              <th className="px-5 py-2 font-medium">Name</th>
              <th className="px-5 py-2 font-medium">Email</th>
              <th className="px-5 py-2 font-medium">Mobile</th>
              <th className="px-5 py-2 font-medium">Project</th>
              <th className="px-5 py-2 font-medium">Status</th>
              <th className="px-5 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((c) => (
              <tr key={c.id} className={`border-t border-[#EEE] hover:bg-[#F6F5F1] transition ${c.hasUnread ? 'bg-[#FFF6F0]' : ''}`}>
                <td className="px-5 py-3">
                  <Link href={'/admin/lead?customerId=' + c.id} className="font-medium text-[#1B2A4A] hover:text-[#E1601F] transition flex items-center gap-2">
                    {c.hasUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#E1601F] shrink-0"
                        title={c.hasUnreadMessage ? 'Unread message' : 'New lead — not yet opened'} />
                    )}
                    {c.first_name} {c.last_name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-[#5A5E66]">{c.email}</td>
                <td className="px-5 py-3 text-[#5A5E66]">{c.mobile}</td>
                <td className="px-5 py-3 text-[#5A5E66]">{c.project_type}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[c.lead_status] || 'bg-[#8A8D94]/10 text-[#5A5E66]'}`}>
                    {c.lead_status || 'New'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <Link href={'/admin/audit?customerId=' + c.id} target="_blank"
                      className="text-xs text-[#1B2A4A] underline decoration-[#1B2A4A]/40 hover:decoration-[#1B2A4A] transition">
                      Report
                    </Link>
                    {canManageLeads && (
                      <>
                        <button onClick={() => onArchive(c.id)} className="text-xs text-[#8A8D94] hover:text-[#1B2A4A] transition">
                          Archive
                        </button>
                        <button onClick={() => onDelete(c.id, `${c.first_name} ${c.last_name}`)} className="text-xs text-[#A23B2E] hover:opacity-70 transition">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Leads() {
  const [leads, setLeads] = useState(null)
  const [error, setError] = useState('')
  const [reportBusy, setReportBusy] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [reportEmail, setReportEmail] = useState('')
  const [showReportBox, setShowReportBox] = useState(false)
  const [reportError, setReportError] = useState('')
  const [activeCategory, setActiveCategory] = useState('New Building')
  const [canManageLeads, setCanManageLeads] = useState(false)
  const router = useRouter()

  const load = () => {
    fetch('/api/admin/leads')
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return null }
        return res.json()
      })
      .then((result) => {
        if (!result) return
        if (result.error) setError(result.error)
        else {
          setLeads(result.leads || [])
          setCanManageLeads(!!result.canManageLeads)
        }
      })
  }

  useEffect(() => {
    load()
    // Live-ish refresh so new leads / new messages show up (as an unread
    // dot) without staff having to manually reload the page.
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [router]) // eslint-disable-line

  const archiveLead = async (customerId) => {
    await fetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, action: 'archive' }),
    })
    load()
  }

  const deleteLead = async (customerId, name) => {
    if (!window.confirm(`Permanently delete ${name}? This cannot be undone.`)) return
    await fetch('/api/admin/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, action: 'delete' }),
    })
    load()
  }

  const grouped = useMemo(() => {
    const g = { 'New Building': [], Renovation: [], Extension: [], Other: [] }
    for (const c of leads || []) {
      g[categorize(c.project_type)].push(c)
    }
    return g
  }, [leads])

  const stats = useMemo(() => {
    const all = leads || []
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return {
      total: all.length,
      newThisWeek: all.filter((c) => new Date(c.created_at).getTime() > weekAgo).length,
      won: all.filter((c) => c.lead_status === 'Won').length,
      unread: all.filter((c) => c.hasUnread).length,
      unviewed: all.filter((c) => c.isUnviewed).length,
    }
  }, [leads])

  const emailReport = async () => {
    setReportBusy(true)
    setReportSent(false)
    setReportError('')
    try {
      const res = await fetch('/api/admin/leads-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: reportEmail.trim() || undefined }),
      })
      const result = await res.json()
      if (!res.ok) {
        setReportError(result.error || 'Could not send the report.')
      } else {
        setReportSent(true)
        setShowReportBox(false)
        setReportEmail('')
      }
    } catch (err) {
      setReportError('Could not reach the server: ' + err.message)
    }
    setReportBusy(false)
  }

  const logOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Leads</h1>
            <p className="text-sm text-[#5A5E66] mt-1">All registered projects, grouped by type.</p>
          </div>
          <div className="flex items-center gap-3 relative">
            <Link href="/admin/blog"
              className="bg-white border border-[#D9D6CD] text-[#1B2A4A] font-medium rounded px-4 py-2 text-sm hover:border-[#E1601F] transition">
              Blog
            </Link>
            <Link href="/admin/reports"
              className="bg-white border border-[#D9D6CD] text-[#1B2A4A] font-medium rounded px-4 py-2 text-sm hover:border-[#E1601F] transition">
              Reports
            </Link>
            <button onClick={() => setShowReportBox((v) => !v)}
              className="bg-white border border-[#D9D6CD] text-[#1B2A4A] font-medium rounded px-4 py-2 text-sm hover:border-[#E1601F] transition">
              {reportSent ? 'Report sent ✓' : 'Email this report'}
            </button>
            <button onClick={logOut} className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">Log out</button>

            {showReportBox && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[#D9D6CD] rounded-md shadow-lg p-4 z-10">
                <label className="block text-xs font-medium text-[#4A4E56] mb-1.5">Send the leads report to</label>
                <input type="email" value={reportEmail} onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="you@easybcon.com.au (leave blank for yourself)"
                  className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm mb-3" />
                <button onClick={emailReport} disabled={reportBusy}
                  className="w-full bg-[#0068D8] text-white font-medium rounded py-2 text-sm hover:bg-[#0050B0] disabled:opacity-50 transition">
                  {reportBusy ? 'Sending...' : 'Send report'}
                </button>
                {reportError && (
                  <div className="mt-2 text-xs text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-2 py-1.5">
                    {reportError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && <div className="mb-6 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-4 py-3">{error}</div>}

        {!leads ? (
          <p className="text-sm text-[#5A5E66]">Loading leads...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-[#D9D6CD] rounded-md p-4">
                <div className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.total}</div>
                <div className="text-xs text-[#8A8D94] mt-1">Total leads</div>
              </div>
              <div className="bg-white border border-[#D9D6CD] rounded-md p-4">
                <div className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.newThisWeek}</div>
                <div className="text-xs text-[#8A8D94] mt-1">New this week</div>
              </div>
              <div className="bg-white border border-[#D9D6CD] rounded-md p-4">
                <div className="text-2xl font-semibold text-[#2E7D4F]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.won}</div>
                <div className="text-xs text-[#8A8D94] mt-1">Won</div>
              </div>
              <div className="bg-white border border-[#D9D6CD] rounded-md p-4">
                <div className="text-2xl font-semibold text-[#E1601F]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.unread}</div>
                <div className="text-xs text-[#8A8D94] mt-1">Needs attention ({stats.unviewed} new)</div>
              </div>
            </div>

            {leads.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {['New Building', 'Renovation', 'Extension', 'Other'].map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      activeCategory === cat ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white text-[#1B2A4A] border-[#D9D6CD] hover:border-[#1B2A4A]'
                    }`}>
                    {cat} <span className={activeCategory === cat ? 'text-[#C9D2E3]' : 'text-[#8A8D94]'}>({grouped[cat].length})</span>
                  </button>
                ))}
              </div>
            )}

            <LeadsTable title={activeCategory} leads={grouped[activeCategory] || []} canManageLeads={canManageLeads} onArchive={archiveLead} onDelete={deleteLead} />

            {leads.length > 0 && grouped[activeCategory].length === 0 && (
              <p className="text-sm text-[#8A8D94]">No {activeCategory.toLowerCase()} leads yet.</p>
            )}

            {leads.length === 0 && <p className="text-sm text-[#8A8D94]">No leads yet.</p>}
          </>
        )}
      </div>
    </main>
  )
}
