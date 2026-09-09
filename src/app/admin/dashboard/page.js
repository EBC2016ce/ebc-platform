'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) return <main className="p-10 text-[#5A5E66]">Loading...</main>
  if (data.error) return <main className="p-10 text-[#A23B2E]">{data.error}</main>

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Dashboard
        </h1>
        <Link href="/leads" className="text-sm text-[#1B2A4A] underline">View all leads</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white border border-[#D9D6CD] rounded-md p-5">
          <p className="text-xs text-[#8B8D89]">Total Leads</p>
          <p className="text-2xl font-semibold text-[#1B2A4A] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{data.totalLeads}</p>
        </div>
        <div className="bg-white border border-[#D9D6CD] rounded-md p-5">
          <p className="text-xs text-[#8B8D89]">Conversion Rate</p>
          <p className="text-2xl font-semibold text-[#1B2A4A] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>{data.conversionRate}%</p>
        </div>
        <div className="bg-white border border-[#D9D6CD] rounded-md p-5">
          <p className="text-xs text-[#8B8D89]">Pipeline Value</p>
          <p className="text-2xl font-semibold text-[#1B2A4A] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>${data.pipelineValue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#D9D6CD] rounded-md p-5">
          <p className="text-xs text-[#8B8D89]">Won Value</p>
          <p className="text-2xl font-semibold text-[#2E7D4F] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>${data.acceptedValue.toLocaleString()}</p>
        </div>
      </div>
      {data.needsFollowUp && data.needsFollowUp.length > 0 && (
        <div className="mt-8 bg-white border-2 border-[#E1601F] rounded-md p-6">
          <h2 className="font-semibold text-[#E1601F]" style={{ fontFamily: 'var(--font-heading)' }}>Needs Follow-Up</h2>
          <p className="text-xs text-[#8B8D89] mt-1">Reminder emails already sent automatically — these leads still haven't responded.</p>
          <div className="mt-4 flex flex-col gap-2">
            {data.needsFollowUp.map((c) => (
              <Link key={c.id} href={'/admin/lead?customerId=' + c.id} className="flex justify-between items-center text-sm border-b border-[#EEE] pb-2 hover:opacity-80">
                <span>{c.first_name} {c.last_name} — {c.project_type}</span>
                <span className="text-xs text-[#8B8D89]">
                  {c.reminded_design ? 'Design reminder sent' : ''}{c.reminded_design && c.reminded_booking ? ' · ' : ''}{c.reminded_booking ? 'Booking reminder sent' : ''}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
          <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Leads by Status</h2>
          <div className="mt-4 flex flex-col gap-2">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span>{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
          <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Leads by Project Type</h2>
          <div className="mt-4 flex flex-col gap-2">
            {Object.entries(data.typeCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span>{type}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
