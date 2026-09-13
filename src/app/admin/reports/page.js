'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 })

function Card({ label, value, color, sub }) {
  return (
    <div className="bg-white border border-[#D9D6CD] rounded-md p-4">
      <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: color || '#1B2A4A' }}>{value}</div>
      <div className="text-xs text-[#8A8D94] mt-1">{label}</div>
      {sub && <div className="text-xs text-[#B5B8BE] mt-0.5">{sub}</div>}
    </div>
  )
}

function BarRow({ label, count, max, color, suffix }) {
  const pct = max > 0 ? Math.max((count / max) * 100, count > 0 ? 4 : 0) : 0
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-36 shrink-0 text-sm text-[#4A4E56] truncate" title={label}>{label}</div>
      <div className="flex-1 bg-[#F0EEE8] rounded h-5 overflow-hidden">
        <div className="h-full rounded" style={{ width: pct + '%', backgroundColor: color || '#1B2A4A' }} />
      </div>
      <div className="w-14 text-right text-sm font-medium text-[#1B2A4A]">{count}{suffix || ''}</div>
    </div>
  )
}

const TABS = [
  { id: 'pipeline', label: '1. Pipeline & Conversion' },
  { id: 'sources', label: '2. Lead Sources' },
  { id: 'followup', label: '3. Follow-up & Response' },
  { id: 'revenue', label: '4. Quotes & Revenue' },
  { id: 'categories', label: '5. Project Categories' },
]

export default function ReportsPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('pipeline')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/reports')
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return null }
        return res.json()
      })
      .then((result) => {
        if (!result) return
        if (result.error) setError(result.error)
        else setData(result)
      })
  }, [router])

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/leads" className="inline-flex items-center gap-1 text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to Leads</Link>
          <h1 className="text-2xl font-semibold text-[#1B2A4A] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>Reports</h1>
          <p className="text-sm text-[#5A5E66] mt-1">Five views into your pipeline — pick one below.</p>
        </div>

        {error && <div className="mb-6 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-4 py-3">{error}</div>}

        {!data ? (
          <p className="text-sm text-[#5A5E66]">Loading reports...</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                    tab === t.id ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white text-[#1B2A4A] border-[#D9D6CD] hover:border-[#1B2A4A]'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'pipeline' && (
              <>
                <p className="text-sm text-[#5A5E66] mb-4">How many leads you have, where they sit in the sales process, and how many turn into wins.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card label="Total leads" value={data.pipeline.total} />
                  <Card label="New this week" value={data.pipeline.newThisWeek} />
                  <Card label="New this month" value={data.pipeline.newThisMonth} />
                  <Card label="Win rate" value={data.pipeline.winRate === null ? '—' : data.pipeline.winRate + '%'} color="#2E7D4F" sub={`${data.pipeline.won} won / ${data.pipeline.lost} lost`} />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card label="Won" value={data.pipeline.won} color="#2E7D4F" />
                  <Card label="Lost" value={data.pipeline.lost} color="#A23B2E" />
                  <Card label="Active in pipeline" value={data.pipeline.active} color="#3C6FB0" />
                </div>
                <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
                  <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Leads by stage</h2>
                  {data.pipeline.byStatus.map((s) => (
                    <BarRow key={s.status} label={s.status} count={s.count}
                      max={Math.max(...data.pipeline.byStatus.map((x) => x.count), 1)}
                      color={s.status === 'Won' ? '#2E7D4F' : s.status === 'Lost' ? '#A23B2E' : '#1B2A4A'} />
                  ))}
                </div>
              </>
            )}

            {tab === 'sources' && (
              <>
                <p className="text-sm text-[#5A5E66] mb-4">Which marketing channels bring in leads, and which ones actually convert to won jobs — use this to decide where to spend.</p>
                <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[#8A8D94] uppercase tracking-wide bg-[#F6F5F1]">
                        <th className="px-5 py-3 font-medium">Source</th>
                        <th className="px-5 py-3 font-medium">Leads</th>
                        <th className="px-5 py-3 font-medium">Won</th>
                        <th className="px-5 py-3 font-medium">Lost</th>
                        <th className="px-5 py-3 font-medium">Win rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sources.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-4 text-[#8A8D94]">No source data yet.</td></tr>
                      )}
                      {data.sources.map((s) => (
                        <tr key={s.source} className="border-t border-[#EEE]">
                          <td className="px-5 py-3 font-medium text-[#1B2A4A]">{s.source}</td>
                          <td className="px-5 py-3">{s.total}</td>
                          <td className="px-5 py-3 text-[#2E7D4F]">{s.won}</td>
                          <td className="px-5 py-3 text-[#A23B2E]">{s.lost}</td>
                          <td className="px-5 py-3">{s.winRate === null ? '—' : s.winRate + '%'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'followup' && (
              <>
                <p className="text-sm text-[#5A5E66] mb-4">Leads that are waiting on you — the longer these sit, the more likely you lose them to a competitor.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card label="Unread messages" value={data.followUp.unreadMessages} color="#E1601F" />
                  <Card label="New, not opened" value={data.followUp.unviewedLeads} color="#E1601F" />
                  <Card label="Never contacted" value={data.followUp.neverContacted} color="#A23B2E" />
                  <Card label="Stuck in 'New' 7+ days" value={data.followUp.staleNew} color="#A23B2E" />
                </div>
                <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden">
                  <div className="px-5 py-3 bg-[#F6F5F1] border-b border-[#D9D6CD] font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Leads needing follow-up ({data.followUp.needsFollowUpCount})
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[#8A8D94] uppercase tracking-wide">
                        <th className="px-5 py-2 font-medium">Name</th>
                        <th className="px-5 py-2 font-medium">Project</th>
                        <th className="px-5 py-2 font-medium">Status</th>
                        <th className="px-5 py-2 font-medium">Days since contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.followUp.needsFollowUp.length === 0 && (
                        <tr><td colSpan={4} className="px-5 py-4 text-[#8A8D94]">Nothing overdue — you're on top of it.</td></tr>
                      )}
                      {data.followUp.needsFollowUp.map((c) => (
                        <tr key={c.id} className="border-t border-[#EEE]">
                          <td className="px-5 py-3">
                            <Link href={'/admin/lead?customerId=' + c.id} className="font-medium text-[#1B2A4A] hover:text-[#E1601F] transition">{c.name}</Link>
                          </td>
                          <td className="px-5 py-3 text-[#5A5E66]">{c.projectType}</td>
                          <td className="px-5 py-3 text-[#5A5E66]">{c.status}</td>
                          <td className="px-5 py-3 font-medium" style={{ color: c.daysSinceContact >= 7 ? '#A23B2E' : '#E1601F' }}>
                            {c.daysSinceContact} day{c.daysSinceContact === 1 ? '' : 's'}{!c.everContacted ? ' (never contacted)' : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'revenue' && (
              <>
                <p className="text-sm text-[#5A5E66] mb-4">The dollar value moving through your pipeline right now, and how efficiently quotes turn into signed work.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card label="Total quoted" value={money(data.revenue.totalQuoted)} />
                  <Card label="Accepted" value={money(data.revenue.accepted)} color="#2E7D4F" sub={`${data.revenue.acceptedCount} quote${data.revenue.acceptedCount === 1 ? '' : 's'}`} />
                  <Card label="Awaiting response" value={money(data.revenue.outstanding)} color="#E1601F" sub={`${data.revenue.outstandingCount} sent`} />
                  <Card label="Quote win rate" value={data.revenue.quoteWinRate === null ? '—' : data.revenue.quoteWinRate + '%'} />
                </div>
                <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
                  <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Quote breakdown</h2>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#5A5E66]">Total quotes issued</span><span className="font-semibold text-[#1B2A4A]">{data.revenue.count}</span></div>
                    <div className="flex justify-between"><span className="text-[#5A5E66]">Average quote value</span><span className="font-semibold text-[#1B2A4A]">{money(data.revenue.avgQuote)}</span></div>
                    <div className="flex justify-between"><span className="text-[#5A5E66]">Draft (not yet sent)</span><span className="font-semibold text-[#8A8D94]">{money(data.revenue.draft)} ({data.revenue.draftCount})</span></div>
                  </div>
                </div>
              </>
            )}

            {tab === 'categories' && (
              <>
                <p className="text-sm text-[#5A5E66] mb-4">Which type of project — new build, renovation or extension — brings in the most leads and converts best, so you know where to focus.</p>
                <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[#8A8D94] uppercase tracking-wide bg-[#F6F5F1]">
                        <th className="px-5 py-3 font-medium">Category</th>
                        <th className="px-5 py-3 font-medium">Leads</th>
                        <th className="px-5 py-3 font-medium">Won</th>
                        <th className="px-5 py-3 font-medium">Lost</th>
                        <th className="px-5 py-3 font-medium">Active</th>
                        <th className="px-5 py-3 font-medium">Win rate</th>
                        <th className="px-5 py-3 font-medium">Accepted value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.categories.map((c) => (
                        <tr key={c.category} className="border-t border-[#EEE]">
                          <td className="px-5 py-3 font-medium text-[#1B2A4A]">{c.category}</td>
                          <td className="px-5 py-3">{c.total}</td>
                          <td className="px-5 py-3 text-[#2E7D4F]">{c.won}</td>
                          <td className="px-5 py-3 text-[#A23B2E]">{c.lost}</td>
                          <td className="px-5 py-3 text-[#3C6FB0]">{c.active}</td>
                          <td className="px-5 py-3">{c.winRate === null ? '—' : c.winRate + '%'}</td>
                          <td className="px-5 py-3 font-medium">{money(c.acceptedValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
