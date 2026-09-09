'use client'
import { useState, useEffect } from 'react'

export default function Portal() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/portal')
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) return <main className="min-h-screen flex items-center justify-center"><p className="text-[#5A5E66]">Loading...</p></main>
  if (data.error) return <main className="min-h-screen flex items-center justify-center px-6"><p className="text-[#A23B2E]">{data.error}</p></main>

  const { customer, design, bookings, project, updates } = data
  const activeBooking = (bookings || []).find((b) => b.status !== 'Cancelled')

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Welcome, {customer.first_name}
      </h1>
      <p className="text-sm text-[#5A5E66] mt-1">{customer.project_type} · {customer.address}</p>

      <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Status</h2>
        <p className="mt-2 text-sm">
          {customer.lead_status === 'Won' ? 'Your project is underway!' :
           customer.lead_status === 'Quoted' ? 'We\'ve sent you a quote — check your email.' :
           activeBooking ? 'Your consultation is booked.' :
           design ? 'We\'ve received your design brief.' :
           'Thanks for registering — we\'ll be in touch soon.'}
        </p>
      </div>

      {project && (
        <div className="mt-6 bg-white border-2 border-[#2E7D4F] rounded-md p-6">
          <h2 className="font-semibold text-[#2E7D4F]" style={{ fontFamily: 'var(--font-heading)' }}>
            Construction Progress — {project.stage}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(project.milestones || {}).filter(([, done]) => done).map(([m]) => (
              <span key={m} className="px-3 py-1 rounded-full bg-[#2E7D4F] text-white text-xs">✓ {m}</span>
            ))}
          </div>
          {(updates || []).length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-[#4A4E56] mb-2">Latest updates</p>
              <div className="flex flex-col gap-2">
                {updates.slice(0, 5).map((u) => (
                  <div key={u.id} className="text-sm border-b border-[#EEE] pb-2">
                    <p>{u.update_text}</p>
                    <p className="text-xs text-[#8B8D89] mt-1">{new Date(u.created_at).toLocaleDateString('en-AU')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeBooking && (
        <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
          <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Your Appointment</h2>
          <p className="mt-2 text-sm">
            {activeBooking.appointment_type} — {new Date(activeBooking.booking_date).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })} at {activeBooking.booking_time}
          </p>
        </div>
      )}

      {design && (
        <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
          <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Your Design Brief</h2>
          <p className="text-xs text-[#8B8D89] mt-1">
            {design.status === 'submitted' ? 'Submitted' : 'Draft in progress'}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {Object.entries(design.data || {}).map(([key, value]) => (
              <div key={key}>
                <span className="text-[#8B8D89]">{key}: </span>
                <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
