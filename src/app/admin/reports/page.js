'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function Card({ label, value, color }) {
  return (
    <div className="bg-white border border-[#D9D6CD] rounded-md p-4">
      <div className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: color || '#1B2A4A' }}>{value}</div>
      <div className="text-xs text-[#8A8D94] mt-1">{label}</div>
    </div>
  )
}

function BarRow({ label, count, max, color }) {
  const pct = max > 0 ? Math.max((count / max) * 100, count > 0 ? 4 : 0) : 0
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-32 shrink-0 text-sm text-[#4A4E56]">{label}</div>
      <div className="flex-1 bg-[#F0EEE8] rounded h-5 overflow-hidden">
        <div className="h-full rounded" style={{ width: pct + '%', backgroundColor: color || '#1B2A4A' }} />
      </div>
      <div className="w-8 text-right text-sm font-medium text-[#1B2A4A]">{count}</div>
    </div>
  )
}

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 })

export default function ReportsPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/leads" className="inline-flex items-center gap-1 text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to Leads</Link>
            <h1 className="text-2xl font-semibold text-[#1B2A4A] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>Reports</h1>
            <p className="text-sm text-[#5A5E66] mt-1">A snapshot of your pipeline, sources and revenue.</p>
          </div>
        </div>

        {error && <div className="mb-6 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-4 py-3">{error}</div>}

        {!data ? (
          <p className="text-sm text-[#5A5E66]">Loading reports...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card label="Total leads" value={data.totals.total} />
              <Card label="New this week" value={data.totals.newThisWeek} />
              <Card label="New this month" value={data.totals.newThisMonth} />
              <Card label="Win rate" value={data.totals.winRate === null ? '—' : data.totals.winRate + '%'} color="#2E7D4F" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card label="Won" value={data.totals.won} color="#2E7D4F" />
              <Card label="Lost" value={data.totals.lost} color="#A23B2E" />
              <Card label="Active in pipeline" value={data.totals.active} color="#3C6FB0" />
            </div>

            <div className="bg-white border border-[#D9D6CD] rounded-md p-6 mb-6">
              <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Pipeline by stage</h2>
              {data.byStatus.map((s) => (
                <BarRow key={s.status} label={s.status} count={s.count}
                  max={Math.max(...data.byStatus.map((x) => x.count), 1)}
                  color={s.status === 'Won' ? '#2E7D4F' : s.status === 'Lost' ? '#A23B2E' : '#1B2A4A'} />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
                <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Leads by project type</h2>
                {data.byCategory.map((c) => (
                  <BarRow key={c.category} label={c.category} count={c.count}
                    max={Math.max(...data.byCategory.map((x) => x.count), 1)} color="#E1601F" />
                ))}
              </div>

              <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
                <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Leads by source</h2>
                {data.bySource.length === 0 ? (
                  <p className="text-sm text-[#8A8D94]">No source data yet.</p>
                ) : data.bySource.map((s) => (
                  <BarRow key={s.source} label={s.source} count={s.count}
                    max={Math.max(...data.bySource.map((x) => x.count), 1)} color="#3C6FB0" />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
                <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Quotes &amp; revenue pipeline</h2>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#5A5E66]">Total quoted</span><span className="font-semibold text-[#1B2A4A]">{money(data.quoteStats.totalQuoted)}</span></div>
                  <div className="flex justify-between"><span className="text-[#5A5E66]">Accepted ({data.quoteStats.acceptedCount})</span><span className="font-semibold text-[#2E7D4F]">{money(data.quoteStats.accepted)}</span></div>
                  <div className="flex justify-between"><span className="text-[#5A5E66]">Awaiting response (sent)</span><span className="font-semibold text-[#E1601F]">{money(data.quoteStats.outstanding)}</span></div>
                  <div className="flex justify-between"><span className="text-[#5A5E66]">Draft (not sent)</span><span className="font-semibold text-[#8A8D94]">{money(data.quoteStats.draft)}</span></div>
                </div>
              </div>

              <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
                <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Needs your attention</h2>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#5A5E66]">Unread customer messages</span><span className="font-semibold text-[#E1601F]">{data.needsAttention.unreadMessages}</span></div>
                  <div className="flex justify-between"><span className="text-[#5A5E66]">New leads not yet opened</span><span className="font-semibold text-[#E1601F]">{data.needsAttention.unviewedLeads}</span></div>
                  <div className="flex justify-between"><span className="text-[#5A5E66]">Sitting in &quot;New&quot; over 7 days</span><span className="font-semibold text-[#A23B2E]">{data.needsAttention.staleNew}</span></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
