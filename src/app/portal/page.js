'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function Portal() {
  const [data, setData] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const loadMessages = () => {
    fetch('/api/portal-messages')
      .then((res) => {
        if (res.status === 401) { router.push('/portal/login'); return null }
        return res.json()
      })
      .then((r) => { if (r) setMessages(r.messages || []) })
  }

  useEffect(() => {
    fetch('/api/portal')
      .then((res) => {
        if (res.status === 401) { router.push('/portal/login'); return null }
        return res.json()
      })
      .then((result) => { if (result) setData(result) })
    loadMessages()
  }, []) // eslint-disable-line

  // Live updates: as soon as a staff reply is inserted, it appears here
  // without the customer needing to refresh the page.
  useEffect(() => {
    if (!data?.customer?.id) return
    const supabase = createClient()
    const channel = supabase
      .channel('portal-messages-' + data.customer.id)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'customer_id=eq.' + data.customer.id,
      }, () => loadMessages())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [data?.customer?.id]) // eslint-disable-line

  const sendMessage = async () => {
    if (!messageInput.trim()) return
    setSending(true)
    await fetch('/api/portal-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: messageInput }),
    })
    setMessageInput('')
    loadMessages()
    setSending(false)
  }

  const logOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  if (!data) return <main className="min-h-screen flex items-center justify-center"><p className="text-[#5A5E66]">Loading...</p></main>
  if (data.error) return <main className="min-h-screen flex items-center justify-center px-6"><p className="text-[#A23B2E]">{data.error}</p></main>

  const { customer, design, bookings, project, updates } = data
  const activeBooking = (bookings || []).find((b) => b.status !== 'Cancelled')

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/" className="flex flex-col items-center">
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-14 w-auto" />
          <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Easy Building &amp; Construction Pty Ltd.
          </span>
        </Link>
      </div>

      <div className="bg-white border border-[#D9D6CD] rounded-md p-7 text-center">
        <p className="text-sm text-[#8A8D94]">Welcome back</p>
        <h1 className="text-3xl font-semibold text-[#1B2A4A] mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
          {customer.first_name} {customer.last_name}
        </h1>
        <p className="mt-3 text-base font-semibold text-[#1B2A4A]">{customer.project_type}</p>
        <p className="text-sm text-[#5A5E66]">{customer.address}</p>
        <div className="mt-3 pt-3 border-t border-[#EEE] flex flex-col sm:flex-row sm:justify-center gap-1 sm:gap-4 text-xs text-[#8A8D94]">
          <span>{customer.email}</span>
          <span className="hidden sm:inline">·</span>
          <span>{customer.mobile}</span>
        </div>
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Status</h2>
        <p className="mt-2 text-sm">
          {customer.lead_status === 'Won' ? 'Your project is underway!' :
           customer.lead_status === 'Quoted' ? 'We\'ve sent you a quote — check your email.' :
           activeBooking ? 'Your consultation is booked.' :
           design ? 'We\'ve received your design brief.' :
           'Thanks for registering — we\'ll be in touch soon.'}
        </p>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Link href={'/design?customerId=' + customer.id + '&projectType=' + encodeURIComponent(customer.project_type)}
          className="bg-white border border-[#D9D6CD] rounded-md p-5 hover:border-[#E1601F] transition group">
          <div className="w-10 h-10 rounded-full bg-[#E1601F]/10 text-[#E1601F] flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 21h14" /></svg>
          </div>
          <p className="font-semibold text-[#1B2A4A] group-hover:text-[#E1601F] transition-colors">Upload Plans &amp; Files</p>
          <p className="text-xs text-[#8A8D94] mt-1">Add or update your design brief and project documents.</p>
        </Link>
        <a href="#message-your-builder"
          className="bg-white border border-[#D9D6CD] rounded-md p-5 hover:border-[#E1601F] transition group">
          <div className="w-10 h-10 rounded-full bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <p className="font-semibold text-[#1B2A4A] group-hover:text-[#E1601F] transition-colors">Message Your Builder</p>
          <p className="text-xs text-[#8A8D94] mt-1">Have a question? Send it straight to the EBC team.</p>
        </a>
        <Link href="/portal/builder"
          className="bg-white border border-[#D9D6CD] rounded-md p-5 hover:border-[#E1601F] transition group sm:col-span-2">
          <div className="w-10 h-10 rounded-full bg-[#2E7D4F]/10 text-[#2E7D4F] flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></svg>
          </div>
          <p className="font-semibold text-[#1B2A4A] group-hover:text-[#E1601F] transition-colors">Meet Your Builder</p>
          <p className="text-xs text-[#8A8D94] mt-1">See who from EBC will be meeting you onsite.</p>
        </Link>
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

      <div id="message-your-builder" className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 scroll-mt-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Message Your Builder</h2>
        <p className="text-xs text-[#8A8D94] mt-1">Send a question directly to the EBC team — we'll reply here and you'll see it next time you check in.</p>
        <div className="mt-3 flex flex-col gap-3 max-h-80 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={`text-sm p-3 rounded-md max-w-[80%] ${m.sender === 'customer' ? 'bg-[#1B2A4A] text-white self-end' : 'bg-[#F6F5F1] text-[#171A1F] self-start'}`}>
              {m.body}
              <p className={`text-xs mt-1 ${m.sender === 'customer' ? 'text-[#C9D2E3]' : 'text-[#8B8D89]'}`}>
                {new Date(m.created_at).toLocaleString('en-AU')}
              </p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-[#8B8D89]">No messages yet.</p>}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message..."
            className="flex-1 border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          <button onClick={sendMessage} disabled={sending}
            className="bg-[#E1601F] text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            Send
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <button onClick={logOut} className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">Log out</button>
      </div>
    </main>
  )
}
