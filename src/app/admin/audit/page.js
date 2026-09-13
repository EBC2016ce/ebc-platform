'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AuditReportContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!customerId) return
    fetch('/api/admin/audit-report?customerId=' + customerId)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) setError(result.error)
        else setData(result)
      })
  }, [customerId])

  if (!customerId) return <p className="text-[#A23B2E]">Missing customer reference.</p>
  if (error) return <p className="text-[#A23B2E]">{error}</p>
  if (!data) return <p className="text-[#5A5E66]">Loading audit report...</p>

  const { customer, events, generatedAt, generatedBy } = data

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link href={'/admin/lead?customerId=' + customerId} className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">
          ← Back to Lead
        </Link>
        <button onClick={() => window.print()} className="bg-[#E1601F] text-white rounded px-4 py-2 text-sm font-medium hover:opacity-90 transition">
          Print / Save as PDF
        </button>
      </div>

      <div className="bg-white border border-[#D9D6CD] rounded-md p-8 print:border-0 print:p-0">
        <div className="flex justify-between items-start border-b border-[#D9D6CD] pb-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
              Conversation &amp; Activity Audit Report
            </h1>
            <p className="text-sm text-[#5A5E66] mt-1">Easy Building &amp; Construction Pty Ltd.</p>
          </div>
          <div className="text-right text-xs text-[#8A8D94]">
            <p>Generated {new Date(generatedAt).toLocaleString('en-AU')}</p>
            <p>By {generatedBy}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <p className="text-xs text-[#8A8D94] uppercase tracking-wide">Customer</p>
            <p className="font-semibold text-[#1B2A4A]">{customer.first_name} {customer.last_name}</p>
            <p className="text-[#5A5E66]">{customer.email}</p>
            <p className="text-[#5A5E66]">{customer.mobile}</p>
          </div>
          <div>
            <p className="text-xs text-[#8A8D94] uppercase tracking-wide">Project</p>
            <p className="font-semibold text-[#1B2A4A]">{customer.project_type}</p>
            <p className="text-[#5A5E66]">{customer.address}</p>
            <p className="text-[#5A5E66]">Status: {customer.lead_status || 'New'}</p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-[#1B2A4A] uppercase tracking-wide mb-3">Chronological Record</h2>
        <div className="flex flex-col">
          {events.map((e, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-[#EEE] break-inside-avoid">
              <div className="w-36 shrink-0 text-xs text-[#8A8D94]">
                {new Date(e.at).toLocaleString('en-AU', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#E1601F] uppercase tracking-wide">{e.type}</p>
                <p className="text-sm text-[#171A1F] mt-0.5 whitespace-pre-wrap">{e.detail}</p>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-[#8A8D94] py-4">No recorded activity yet.</p>}
        </div>

        <p className="text-xs text-[#8A8D94] mt-8 pt-4 border-t border-[#D9D6CD]">
          This report is a system-generated record of all recorded interactions with this customer and is intended for internal record-keeping and legal reference purposes.
        </p>
      </div>
    </div>
  )
}

export default function AuditReportPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-10 print:bg-white print:py-0">
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <AuditReportContent />
      </Suspense>
    </main>
  )
}
