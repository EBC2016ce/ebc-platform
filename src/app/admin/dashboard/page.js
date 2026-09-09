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
