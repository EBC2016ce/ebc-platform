import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { sendSms } from '@/lib/sms'
import { sendCapiEvent } from '@/lib/metaCapi'

// Ad-funnel-only registration step, used by src/app/ad-consult/page.js.
// Deliberately mirrors /api/register but does NOT email or text the
// customer a verification code here — this is the step right after the
// short question flow and right before booking a slot in the same visit,
// so sending a "check your email" message now would just repeat the
// confusing mid-flow interruption the on-site /register flow has. The code
// is generated and stored the same way, but only gets emailed once the
// customer actually books (see /api/ad-book), combined into one email with
// the booking confirmation.
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const body = await request.json()
    const code = generateCode()
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour — enough to finish picking a slot

    // Unlike /api/register, this flow never asks the visitor to invent a
    // password during the quick questions — being asked to create a login
    // before you've even booked a time is exactly the kind of pointless
    // friction this rebuild was meant to remove. Supabase's admin API still
    // needs *some* password to create the account, so a random one is
    // generated here and thrown away; the customer sets their own real
    // password later, in /api/ad-set-password, once their email is verified
    // and it's obvious why they need one (to open their portal).
    const placeholderPassword = crypto.randomBytes(24).toString('base64url')

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: placeholderPassword,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return Response.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 400 })
      }
      return Response.json({ error: 'Could not create your account: ' + authError.message }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from('customers').insert([
      {
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        mobile: body.mobile,
        address: body.address,
        suburb: body.suburb || null,
        project_type: body.projectType,
        consent_given: body.consent,
        utm_source: body.utmSource || null,
        utm_medium: body.utmMedium || null,
        utm_campaign: body.utmCampaign || null,
        utm_content: body.utmContent || null,
        verification_code: code,
        verification_expires: expires,
        auth_user_id: authUser.user.id,
      },
    ]).select().single()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    // Server-side backup of the browser Pixel's Lead event — same dedup
    // approach as the on-site /register flow.
    if (body.fbEventId) {
      await sendCapiEvent({
        eventName: 'Lead',
        eventId: body.fbEventId,
        eventSourceUrl: body.pageUrl,
        userData: { email: body.email, phone: body.mobile, firstName: body.firstName, lastName: body.lastName },
        request,
      }).catch((err) => console.error('Meta CAPI Lead event failed:', err))
    }

    // Let the office know a new ad lead is mid-flow — best-effort, never
    // blocks the visitor's progress toward booking.
    const adminPhone = process.env.ADMIN_ALERT_PHONE
    const adminEmail = process.env.ADMIN_ALERT_EMAIL

    if (adminPhone) {
      sendSms({
        to: adminPhone,
        body: `New EBC ad lead: ${body.firstName} ${body.lastName}, ${body.mobile}, ${body.projectType}.`,
        purpose: 'admin_new_lead_alert',
        customerId: data.id,
      }).catch((err) => console.error('Admin SMS alert failed:', err))
    }

    if (adminEmail) {
      resend.emails.send({
        from: 'EBC <noreply@mail.ebc33.com.au>',
        to: adminEmail,
        subject: `New ad lead: ${body.firstName} ${body.lastName} (${body.projectType})`,
        html: `
          <p>A new lead just came in through the ad-specific booking flow.</p>
          <ul>
            <li><strong>Name:</strong> ${body.firstName} ${body.lastName}</li>
            <li><strong>Email:</strong> ${body.email}</li>
            <li><strong>Mobile:</strong> ${body.mobile}</li>
            <li><strong>Project type:</strong> ${body.projectType}</li>
            <li><strong>Suburb:</strong> ${body.suburb || '—'}</li>
          </ul>
          <p>They're now picking a consultation time — you'll get a follow-up alert once they book.</p>
        `,
      }).catch((err) => console.error('Admin email alert failed:', err))
    }

    return Response.json({ success: true, customerId: data.id })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
