import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { sendSms } from '@/lib/sms'
import { sendCapiEvent } from '@/lib/metaCapi'
import { categoryForProjectType } from '@/lib/adCategories'

// Landing point for the "Continue to website" button on a Meta Instant
// (Lead) Form's thank-you screen. Facebook appends the submission's
// leadgen_id to that button's URL as ?leadgenId=..., so a visitor who just
// tapped through the ad arrives at /ad-consult?leadgenId=XXXX having
// already given Facebook their name/mobile/email plus an answer to our
// custom "what's your project" question — none of which should be asked
// again. This endpoint is what turns that leadgen_id into an actual
// customer record (mirroring /api/ad-register) so /ad-consult can skip
// straight to the location step.
//
// Deliberately does its own Graph API fetch synchronously, on the first
// request, rather than relying on a webhook + background job: with only
// one advertiser and modest lead volume this is much simpler to run and to
// reason about, at the cost of this one request taking an extra network
// hop to Facebook. If that round trip turns out to add noticeable delay in
// practice, a webhook-based version can pre-ingest the lead instead and
// this route would just become a lookup.
//
// Requires META_PAGE_ACCESS_TOKEN — a Page access token for the EBC Page,
// with the leads_retrieval permission, generated once in Meta's Graph API
// Explorer (or via a System User in Business Manager) and stored as a
// Vercel env var. Without it every lookup fails and the caller falls back
// to the normal manual-entry flow.

const CUSTOM_QUESTION_KEYS = ['project_type', 'what_are_you_planning', 'what_is_your_project']

function splitName(fullName) {
  const trimmed = (fullName || '').trim()
  if (!trimmed) return { firstName: '', lastName: '' }
  const parts = trimmed.split(/\s+/)
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function fieldValue(fieldData, name) {
  const entry = fieldData.find((f) => f.name === name)
  return entry?.values?.[0] || ''
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const leadgenId = searchParams.get('leadgenId')
    if (!leadgenId) {
      return Response.json({ found: false, error: 'Missing leadgenId' }, { status: 400 })
    }

    // Idempotent: a visitor re-opening the same thank-you link (or this
    // request being retried) should return the same customer, not create a
    // second one.
    const { data: existing } = await supabaseAdmin
      .from('customers')
      .select('id, first_name, last_name, email, mobile, project_type')
      .eq('meta_leadgen_id', leadgenId)
      .maybeSingle()

    if (existing) {
      return Response.json({
        found: true,
        customerId: existing.id,
        firstName: existing.first_name,
        lastName: existing.last_name,
        email: existing.email,
        mobile: existing.mobile,
        category: categoryForProjectType(existing.project_type),
        projectType: existing.project_type,
      })
    }

    const accessToken = process.env.META_PAGE_ACCESS_TOKEN
    if (!accessToken) {
      console.error('META_PAGE_ACCESS_TOKEN is not set — cannot resolve Meta lead', leadgenId)
      return Response.json({ found: false, error: 'Lead lookup is not configured yet' }, { status: 500 })
    }

    const graphRes = await fetch(
      `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${accessToken}`
    )
    const graphResult = await graphRes.json()
    if (!graphRes.ok || !graphResult.field_data) {
      console.error('Meta Graph API lead lookup failed for', leadgenId, graphResult)
      return Response.json({ found: false, error: 'Could not retrieve this submission from Meta' }, { status: 400 })
    }

    const fieldData = graphResult.field_data
    const { firstName, lastName } = splitName(fieldValue(fieldData, 'full_name'))
    const email = fieldValue(fieldData, 'email')
    const mobile = fieldValue(fieldData, 'phone_number')
    const projectTypeAnswer = CUSTOM_QUESTION_KEYS
      .map((key) => fieldValue(fieldData, key))
      .find((v) => v) || ''
    const category = categoryForProjectType(projectTypeAnswer)

    if (!email || !mobile) {
      return Response.json({ found: false, error: 'This submission is missing contact details' }, { status: 400 })
    }

    const placeholderPassword = crypto.randomBytes(24).toString('base64url')
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: placeholderPassword,
      email_confirm: true,
    })

    if (authError) {
      // Someone with this email already has an account (maybe a prior ad
      // submission or an on-site registration) — reuse it rather than
      // failing the whole handoff, same spirit as /api/ad-register.
      if (!authError.message.includes('already been registered')) {
        return Response.json({ found: false, error: 'Could not create your account: ' + authError.message }, { status: 400 })
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        mobile,
        project_type: projectTypeAnswer || null,
        consent_given: true, // implicit via Meta's own Instant Form consent + our privacy policy link on the form
        verification_code: code,
        verification_expires: expires,
        auth_user_id: authUser?.user?.id || null,
        meta_leadgen_id: leadgenId,
      }])
      .select()
      .single()

    if (error) {
      return Response.json({ found: false, error: error.message }, { status: 400 })
    }

    await sendCapiEvent({
      eventName: 'Lead',
      eventId: 'leadgen_' + leadgenId, // stable per submission, safe to retry
      eventSourceUrl: 'https://ebc33.com.au/ad-consult',
      userData: { email, phone: mobile, firstName, lastName },
      request,
    }).catch((err) => console.error('Meta CAPI Lead event failed:', err))

    const adminPhone = process.env.ADMIN_ALERT_PHONE
    const adminEmail = process.env.ADMIN_ALERT_EMAIL
    if (adminPhone) {
      sendSms({
        to: adminPhone,
        body: `New EBC ad lead (Instant Form): ${firstName} ${lastName}, ${mobile}, ${projectTypeAnswer || 'unspecified project'}.`,
        purpose: 'admin_new_lead_alert',
        customerId: customer.id,
      }).catch((err) => console.error('Admin SMS alert failed:', err))
    }
    if (adminEmail) {
      resend.emails.send({
        from: 'EBC <noreply@mail.ebc33.com.au>',
        to: adminEmail,
        subject: `New ad lead: ${firstName} ${lastName} (${projectTypeAnswer || 'unspecified'})`,
        html: `
          <p>A new lead just came in through the Meta Instant Form.</p>
          <ul>
            <li><strong>Name:</strong> ${firstName} ${lastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Mobile:</strong> ${mobile}</li>
            <li><strong>Project type:</strong> ${projectTypeAnswer || '—'}</li>
          </ul>
          <p>They're now finishing their location details and picking a consultation time.</p>
        `,
      }).catch((err) => console.error('Admin email alert failed:', err))
    }

    return Response.json({
      found: true,
      customerId: customer.id,
      firstName,
      lastName,
      email,
      mobile,
      category,
      projectType: projectTypeAnswer,
    })
  } catch (err) {
    return Response.json({ found: false, error: 'Server error: ' + err.message }, { status: 500 })
  }
}
