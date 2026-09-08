import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { verificationEmailHtml } from '@/lib/emailTemplates'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const body = await request.json()
    const code = generateCode()
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    const { data, error } = await supabaseAdmin.from('customers').insert([
      {
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        mobile: body.mobile,
        address: body.address,
        project_type: body.projectType,
        consent_given: body.consent,
        utm_source: body.utmSource || null,
        utm_medium: body.utmMedium || null,
        utm_campaign: body.utmCampaign || null,
        utm_content: body.utmContent || null,
        verification_code: code,
        verification_expires: expires,
      },
    ]).select().single()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

        const { error: emailError } = await resend.emails.send({
      from: 'EBC <onboarding@resend.dev>',
      to: body.email,
      subject: 'Verify your email — Easy Building & Construction',
      html: verificationEmailHtml({ firstName: body.firstName, code, projectType: body.projectType }),
    })

    if (emailError) {
      console.error('Resend send failed:', emailError)
      return Response.json({ error: 'Registration saved, but the email failed to send: ' + emailError.message }, { status: 500 })
    }

    return Response.json({ success: true, customerId: data.id })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
