'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Quoted', 'Negotiation', 'Won', 'Lost']
const QUOTE_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired']
const PROJECT_STAGES = ['Won / Converted', 'Contract Signed', 'Pre-Construction', 'Construction Started', 'Practical Completion', 'Handover', 'Warranty','Completed']

function LeadDetailContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusSaving, setStatusSaving] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteDescription, setQuoteDescription] = useState('')
  const [creatingQuote, setCreatingQuote] = useState(false)
  const [updateText, setUpdateText] = useState('')
  const [addingUpdate, setAddingUpdate] = useState(false)
  const [files, setFiles] = useState([])
  const [filesLoading, setFilesLoading] = useState(true)
  const [milestonesList, setMilestonesList] = useState([])
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const loadMessages = () => {
    fetch('/api/admin/messages?customerId=' + customerId)
      .then((res) => res.json())
      .then((r) => setMessages(r.messages || []))
  }

  const load = () => {
    fetch('/api/admin/lead?customerId=' + customerId)
      .then((res) => res.json())
      .then((result) => {
        setData(result)
        setLoading(false)
        if (result.customer?.project_type) {
          fetch('/api/admin/project?projectType=' + encodeURIComponent(result.customer.project_type))
            .then((res) => res.json())
            .then((r) => setMilestonesList(r.milestonesList || []))
        }
      })
    fetch('/api/admin/files?customerId=' + customerId)
      .then((res) => res.json())
      .then((result) => {
        setFiles(result.files || [])
        setFilesLoading(false)
      })
    loadMessages()
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

  const createQuote = async () => {
    if (!quoteAmount) return
    setCreatingQuote(true)
    await fetch('/api/admin/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', customerId, amount: Number(quoteAmount), description: quoteDescription }),
    })
    setQuoteAmount('')
    setQuoteDescription('')
    load()
    setCreatingQuote(false)
  }

  const changeQuoteStatus = async (quoteId, status) => {
    await fetch('/api/admin/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateStatus', quoteId, status }),
    })
    load()
  }

  const changeStage = async (stage) => {
    await fetch('/api/admin/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateStage', customerId, stage }),
    })
    load()
  }

  const toggleMilestone = async (milestone) => {
    await fetch('/api/admin/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleMilestone', customerId, milestone }),
    })
    load()
  }

  const addUpdate = async () => {
    if (!updateText.trim()) return
    setAddingUpdate(true)
    await fetch('/api/admin/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addUpdate', customerId, updateText }),
    })
    setUpdateText('')
    load()
    setAddingUpdate(false)
  }

  const sendMessage = async () => {
    if (!messageInput.trim()) return
    setSendingMessage(true)
    await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, body: messageInput }),
    })
    setMessageInput('')
    loadMessages()
    setSendingMessage(false)
  }

  if (!customerId) return <p className="text-[#A23B2E]">Missing customer reference.</p>
  if (loading) return <p className="text-[#5A5E66]">Loading...</p>
  if (!data?.customer) return <p className="text-[#A23B2E]">Lead not found.</p>

  const { customer, design, bookings, notes, quotes, project, updates } = data

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

      {project && (
        <div className="mt-8 bg-white border-2 border-[#2E7D4F] rounded-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[#2E7D4F]" style={{ fontFamily: 'var(--font-heading)' }}>Project (Won)</h2>
            <select value={project.stage} onChange={(e) => changeStage(e.target.value)}
              className="border border-[#D9D6CD] rounded px-3 py-2 text-sm">
              {PROJECT_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-[#4A4E56] mb-2">Construction milestones</p>
            <div className="flex flex-wrap gap-2">
              {milestonesList.map((m) => {
                const done = !!(project.milestones || {})[m]
                return (
                  <button key={m} onClick={() => toggleMilestone(m)}
                    className={`px-3 py-1.5 rounded border text-xs ${done ? 'bg-[#2E7D4F] text-white border-[#2E7D4F]' : 'bg-white border-[#D9D6CD]'}`}>
                    {done ? '✓ ' : ''}{m}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-[#4A4E56] mb-2">Progress updates</p>
            <div className="flex gap-2">
              <input value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder="e.g. Framing complete, roof next"
                className="flex-1 border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
              <button onClick={addUpdate} disabled={addingUpdate}
                className="bg-[#2E7D4F] text-white rounded px-4 py-2 text-sm disabled:opacity-50">
                Post
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {(updates || []).map((u) => (
                <div key={u.id} className="text-sm border-b border-[#EEE] pb-2">
                  <p>{u.update_text}</p>
                  <p className="text-xs text-[#8B8D89] mt-1">{new Date(u.created_at).toLocaleString('en-AU')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Messages</h2>
        <div className="mt-3 flex flex-col gap-3 max-h-80 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={`text-sm p-3 rounded-md max-w-[80%] ${m.sender === 'staff' ? 'bg-[#1B2A4A] text-white self-end' : 'bg-[#F6F5F1] text-[#171A1F] self-start'}`}>
              {m.body}
              <p className={`text-xs mt-1 ${m.sender === 'staff' ? 'text-[#C9D2E3]' : 'text-[#8B8D89]'}`}>
                {m.sender === 'staff' ? 'You' : customer.first_name} · {new Date(m.created_at).toLocaleString('en-AU')}
              </p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-[#8B8D89]">No messages yet.</p>}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Reply to customer..."
            className="flex-1 border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          <button onClick={sendMessage} disabled={sendingMessage}
            className="bg-[#E1601F] text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            Send
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Uploaded Plans</h2>
        {filesLoading ? (
          <p className="text-sm text-[#5A5E66] mt-2">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-[#5A5E66] mt-2">No files uploaded yet.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b border-[#EEE] pb-2">
                <div>
                  <span className="text-[#8B8D89]">{f.category}: </span>
                  <span>{f.name}</span>
                </div>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-[#1B2A4A] underline text-xs">
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
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
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Quotes</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <input type="number" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="Amount ($)"
            className="border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          <input value={quoteDescription} onChange={(e) => setQuoteDescription(e.target.value)} placeholder="Description"
            className="border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          <button onClick={createQuote} disabled={creatingQuote}
            className="bg-[#E1601F] text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            New Quote
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {(quotes || []).map((q) => (
            <div key={q.id} className="flex justify-between items-center text-sm border-b border-[#EEE] pb-2">
              <div>
                <span className="font-semibold">{q.reference}</span> — ${Number(q.amount).toLocaleString()}
                {q.description && <span className="text-[#8B8D89]"> · {q.description}</span>}
              </div>
              <select value={q.status} onChange={(e) => changeQuoteStatus(q.id, e.target.value)}
                className="border border-[#D9D6CD] rounded px-2 py-1 text-xs">
                {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
          {(!quotes || quotes.length === 0) && <p className="text-sm text-[#8B8D89]">No quotes yet.</p>}
        </div>
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
