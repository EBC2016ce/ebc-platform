import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireStaff } from '@/lib/checkStaff'

// Compiles a full, chronological audit trail for one customer/lead — every
// registration detail, message, booking, quote, note and project update —
// for legal/record-keeping purposes. Read-only; nothing here is editable.
export async function GET(request) {
  const { authorized, user } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')
  if (!customerId) return Response.json({ error: 'Missing customerId' }, { status: 400 })

  const { data: customer } = await supabaseAdmin.from('customers').select('*').eq('id', customerId).single()
  if (!customer) return Response.json({ error: 'Lead not found' }, { status: 404 })

  const { data: design } = await supabaseAdmin.from('designs').select('*').eq('customer_id', customerId).maybeSingle()
  const { data: bookings } = await supabaseAdmin.from('bookings').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })
  const { data: notes } = await supabaseAdmin.from('lead_notes').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })
  const { data: quotes } = await supabaseAdmin.from('quotes').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })
  const { data: project } = await supabaseAdmin.from('projects').select('*').eq('customer_id', customerId).maybeSingle()
  const { data: updates } = await supabaseAdmin.from('project_updates').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })
  const { data: messages } = await supabaseAdmin.from('messages').select('*').eq('customer_id', customerId).order('created_at', { ascending: true })

  const events = []

  events.push({
    at: customer.created_at,
    type: 'Registration',
    detail: `${customer.first_name} ${customer.last_name} registered a "${customer.project_type || 'project'}" enquiry via the website. Email: ${customer.email}, Mobile: ${customer.mobile || '—'}, Address: ${customer.address || '—'}.`,
  })

  if (customer.email_verified) {
    events.push({ at: customer.created_at, type: 'Verification', detail: 'Email address verified by the customer.' })
  }

  if (customer.consent_given) {
    events.push({ at: customer.created_at, type: 'Consent', detail: 'Customer agreed to EBC collecting and using their details as described in the Privacy Policy.' })
  }

  if (design) {
    events.push({
      at: design.created_at,
      type: 'Design Brief Started',
      detail: 'Customer began the project design brief.',
    })
    if (design.submitted_at) {
      events.push({
        at: design.submitted_at,
        type: 'Design Brief Submitted',
        detail: 'Design brief submitted: ' + Object.entries(design.data || {}).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; '),
      })
    }
  }

  for (const b of bookings || []) {
    events.push({
      at: b.created_at,
      type: 'Booking',
      detail: `${b.appointment_type} booked for ${new Date(b.booking_date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${b.booking_time}. Status: ${b.status}.`,
    })
  }

  for (const q of quotes || []) {
    events.push({
      at: q.created_at,
      type: 'Quote',
      detail: `Quote ${q.reference} for $${Number(q.amount).toLocaleString()}${q.description ? ' — ' + q.description : ''}. Status: ${q.status}.`,
    })
  }

  for (const m of messages || []) {
    events.push({
      at: m.created_at,
      type: m.sender === 'staff' ? 'Message (EBC to Customer)' : 'Message (Customer to EBC)',
      detail: m.body,
    })
  }

  for (const n of notes || []) {
    events.push({ at: n.created_at, type: 'Internal Note', detail: n.note })
  }

  if (project) {
    events.push({ at: project.created_at, type: 'Project Started', detail: `Lead marked as Won and moved into construction, starting at stage "${project.stage}".` })
  }

  for (const u of updates || []) {
    events.push({ at: u.created_at, type: 'Progress Update', detail: u.update_text })
  }

  events.sort((a, b) => new Date(a.at) - new Date(b.at))

  return Response.json({
    customer,
    events,
    generatedAt: new Date().toISOString(),
    generatedBy: user.email,
  })
}
