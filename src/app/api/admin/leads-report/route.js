import { requireStaff } from '@/lib/checkStaff'
import { resend } from '@/lib/resend'
import { leadsReportEmailHtml } from '@/lib/emailTemplates'
import { buildReportData } from '@/lib/leadsReportData'

// Sends the same five-report pipeline summary shown on /admin/reports
// (pipeline & conversion, lead sources, follow-up/response, quotes &
// revenue, project category performance) as a branded email, with a link
// back to the live dashboard for the full drill-down.
export async function POST(request) {
  const { authorized, user } = await requireStaff()
  if (!authorized) return Response.json({ error: 'Not authorized' }, { status: 401 })

  let recipient = user.email
  try {
    const body = await request.json()
    if (body?.to && String(body.to).trim()) recipient = String(body.to).trim()
  } catch {
    // no JSON body sent — fall back to the requesting staff member's own email
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Leads report email failed: RESEND_API_KEY is not set in this environment.')
    return Response.json({ error: 'Email is not configured on the server (missing API key). Contact your developer.' }, { status: 500 })
  }

  const data = await buildReportData()
  const reportUrl = new URL(request.url).origin + '/admin/reports'
  const html = leadsReportEmailHtml(data, reportUrl)

  try {
    // The Resend SDK does not throw on API-level failures (bad domain,
    // invalid recipient, etc.) — it resolves with { data, error }, so that
    // has to be checked explicitly or failures are silently swallowed.
    const { data: sendResult, error } = await resend.emails.send({
      from: 'EBC Admin <noreply@mail.ebc33.com.au>',
      to: recipient,
      subject: `EBC Leads & Pipeline Report — ${new Date().toLocaleDateString('en-AU')}`,
      html,
    })

    if (error) {
      console.error('Leads report email failed:', JSON.stringify(error))
      return Response.json({ error: error.message || 'Resend rejected the email.' }, { status: 500 })
    }

    return Response.json({ success: true, sentTo: recipient, id: sendResult?.id })
  } catch (err) {
    console.error('Leads report email threw:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
