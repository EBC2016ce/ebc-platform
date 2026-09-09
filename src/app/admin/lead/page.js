'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Quoted', 'Negotiation', 'Won', 'Lost']

function LeadDetailContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusSaving, setStatusSaving] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  const load = () => {
    fetch('/api/admin/lead?customerId=' + customerId)
      .then((res) => res.json())
      .then((result) => {
        setData(result)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [customerId]) // eslint-disable-line

  const changeStatus = async (newStatus) => {
    setStatusSaving(true)
    await fetch('/api/admin/lead-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, action: 'updateStatus', status: newStatus }),
    })
    load()
    setStatusSaving(false)
  }

  const addNote = async () => {
    if (!noteText.trim()) return
    setAddingNote(true)
    await fetch('/api/admin/lead-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, action: 'addNote', note: noteText }),
    })
    setNoteText('')
    load()
    setAddingNote(false)
  }

  if (!customerId) return <p className="text-[#A23B2E]">Missing customer reference.</p>
  if (loading) return <p className="text-[#5A5E66]">Loading...</p>
  if (!data?.customer) return <p className="text-[#A23B2E]">Lead not found.</p>

  const { customer, design, bookings, notes } = data

  return (
    <div className="max-w-2xl w-full">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            {customer.first_name} {customer.last_name}
          </h1>
          <p className="text-sm text-[#5A5E66] mt-1">{customer.email} · {customer.mobile}</p>
          <p className="text-sm text-[#5A5E66]">{customer.address}</p>
          <p className="text-sm text-[#5A5E66] mt-1">Project: {customer.project_type}</p>
        </div>
        <select value={customer.lead_status || 'New'} disabled={statusSaving}
          onChange={(e) => changeStatus(e.target.value)}
          className="border border-[#D9D6CD] rounded px-3 py-2 text-sm h-fit">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Design Brief</h2>
        {!design ? (
          <p className="text-sm text-[#5A5E66] mt-2">No design brief submitted yet.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {Object.entries(design.data || {}).map(([key, value]) => (
              <div key={key}>
                <span className="text-[#8B8D89]">{key}: </span>
                <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
              </div>
            ))}
            <div className="col-span-2 text-xs text-[#8B8D89] mt-2">
              Status: {design.status} {design.submitted_at ? '· Submitted ' + new Date(design.submitted_at).toLocaleDateString('en-AU') : ''}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Bookings</h2>
        {(!bookings || bookings.length === 0) ? (
          <p className="text-sm text-[#5A5E66] mt-2">No bookings yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {bookings.map((b) => (
              <div key={b.id} className="text-sm">
                {b.appointment_type} — {new Date(b.booking_date).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })} at {b.booking_time} ({b.status})
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Internal Notes</h2>
        <div className="flex gap-2 mt-3">
          <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note..."
            className="flex-1 border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          <button onClick={addNote} disabled={addingNote}
            className="bg-[#1B2A4A] text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            Add
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {(notes || []).map((n) => (
            <div key={n.id} className="text-sm border-b border-[#EEE] pb-2">
              <p>{n.note}</p>
              <p className="text-xs text-[#8B8D89] mt-1">{new Date(n.created_at).toLocaleString('en-AU')}</p>
            </div>
          ))}
          {(!notes || notes.length === 0) && <p className="text-sm text-[#8B8D89]">No notes yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default function LeadDetailPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <LeadDetailContent />
      </Suspense>
    </main>
  )
}
