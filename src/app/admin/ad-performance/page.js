'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 2 })

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
      <div className="w-40 shrink-0 text-sm text-[#4A4E56] truncate" title={label}>{label}</div>
      <div className="flex-1 bg-[#F0EEE8] rounded h-5 overflow-hidden">
        <div className="h-full rounded" style={{ width: pct + '%', backgroundColor: color || '#1B2A4A' }} />
      </div>
      <div className="w-16 text-right text-sm font-medium text-[#1B2A4A]">{count}{suffix || ''}</div>
    </div>
  )
}

export default function AdPerformancePage() {
  const [reports, setReports] = useState(null)
  const [error, setError] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)

  useEffect(() => {
    fetch('/api/admin/ad-performance')
      .then((res) => res.json())
      .then((result) => {
        if (result.error) setError(result.error)
        else setReports(result.reports || [])
      })
  }, [])

  if (error) return <main className="p-10 text-[#A23B2E]">{error}</main>
  if (!reports) return <main className="p-10 text-[#5A5E66]">Loading...</main>

  const report = reports[selectedIdx]
  const m = report?.metrics || {}
  const placements = m.placement_breakdown || []
  const maxPlacement = Math.max(...placements.map((p) => p.clicks || 0), 1)
  const ads = m.ad_variants || []
  const leadSummary = report?.lead_summary || {}
  const bySuburb = leadSummary.by_suburb || []
  const maxSuburb = Math.max(...bySuburb.map((s) => s.count || 0), 1)

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
              Ad Performance
            </h1>
            <p className="text-sm text-[#5A5E66] mt-1">
              Meta (Facebook &amp; Instagram) ad results, cross-referenced with actual leads, and what to tighten next.
            </p>
          </div>
          <Link href="/leads" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to Leads</Link>
        </div>

        {reports.length === 0 && (
          <div className="bg-white border border-[#D9D6CD] rounded-md p-8 text-center">
            <p className="text-[#1B2A4A] font-medium">No ad performance reports yet.</p>
            <p className="text-sm text-[#8A8D94] mt-2 max-w-md mx-auto">
              Once the Facebook/Instagram campaign has been running for a few days, ask Claude to
              &quot;refresh the ad performance report&quot; — it will pull the latest numbers from
              Meta Ads and your leads data, and a report will appear here.
            </p>
          </div>
        )}

        {reports.length > 0 && (
          <>
            {reports.length > 1 && (
              <div className="flex gap-2 mb-6 flex-wrap">
                {reports.map((r, i) => (
                  <button key={r.id} onClick={() => setSelectedIdx(i)}
                    className={`px-3 py-1.5 rounded border text-xs font-medium transition ${i === selectedIdx ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white border-[#D9D6CD] text-[#4A4E56]'}`}>
                    {r.period_start} → {r.period_end}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card label="Spend" value={money(m.spend)} />
              <Card label="Clicks" value={m.clicks ?? '—'} />
              <Card label="Cost / Click" value={money(m.cpc)} />
              <Card label="Registrations" value={m.results ?? '—'} color="#2E7D4F" />
              <Card label="Cost / Registration" value={money(m.cost_per_result)} color="#2E7D4F" />
            </div>

            {placements.length > 0 && (
              <div className="bg-white border border-[#D9D6CD] rounded-md p-6 mb-6">
                <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Clicks by Placement</h2>
                {placements.map((p) => (
                  <BarRow key={p.placement} label={p.placement} count={p.clicks} max={maxPlacement} />
                ))}
              </div>
            )}

            {ads.length > 0 && (
              <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-[#8A8D94] uppercase tracking-wide bg-[#F6F5F1]">
                      <th className="px-5 py-3 font-medium">Ad Variant</th>
                      <th className="px-5 py-3 font-medium">Clicks</th>
                      <th className="px-5 py-3 font-medium">CTR</th>
                      <th className="px-5 py-3 font-medium">Cost / Click</th>
                      <th className="px-5 py-3 font-medium">Registrations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((a) => (
                      <tr key={a.name} className="border-t border-[#EEE]">
                        <td className="px-5 py-3 font-medium text-[#1B2A4A]">{a.name}</td>
                        <td className="px-5 py-3">{a.clicks}</td>
                        <td className="px-5 py-3">{a.ctr}%</td>
                        <td className="px-5 py-3">{money(a.cpc)}</td>
                        <td className="px-5 py-3 text-[#2E7D4F]">{a.registrations ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {bySuburb.length > 0 && (
              <div className="bg-white border border-[#D9D6CD] rounded-md p-6 mb-6">
                <h2 className="font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Leads by Suburb</h2>
                {bySuburb.map((s) => (
                  <BarRow key={s.suburb} label={s.suburb} count={s.count} max={maxSuburb} color="#2E7D4F" />
                ))}
              </div>
            )}

            {report.recommendations && (
              <div className="bg-[#FFF6F0] border border-[#E1601F] rounded-md p-6">
                <h2 className="font-semibold text-[#E1601F] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Suggested Next Step</h2>
                <p className="text-sm text-[#4A4E56] whitespace-pre-line">{report.recommendations}</p>
              </div>
            )}

            <p className="text-xs text-[#B5B8BE] mt-6">
              Report generated {new Date(report.created_at).toLocaleString('en-AU')}
            </p>
          </>
        )}
      </div>
    </main>
  )
}
