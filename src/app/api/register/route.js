import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { verificationEmailHtml } from '@/lib/emailTemplates'
import { sendSms } from '@/lib/sms'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const body = await request.json()
    const code = generateCode()
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
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

    const { error: emailError } = await resend.emails.send({
      from: 'EBC <noreply@mail.ebc33.com.au>',
      to: body.email,
      subject: 'Verify your email — Easy Building & Construction',
      html: verificationEmailHtml({ firstName: body.firstName, code, projectType: body.projectType }),
    })

    if (emailError) {
      console.error('Resend send failed:', emailError)
      return Response.json({ error: 'Registration saved, but the email failed to send: ' + emailError.message }, { status: 500 })
    }

    // Thank the customer and send them the same code by SMS, in case the email
    // is slow or lands in spam. Failing to send the SMS should never block
    // registration, so errors here are only logged.
    if (body.mobile) {
      sendSms({
        to: body.mobile,
        body: `Hi ${body.firstName}, thanks for registering with Easy Building & Construction Pty Ltd. Your verification code is ${code}. It expires in 15 minutes.`,
      }).catch((err) => console.error('Customer SMS failed:', err))
    }

    // Let the office know a new lead just came in — SMS and email, both
    // best-effort so a failure here never affects the customer's registration.
    const adminPhone = process.env.ADMIN_ALERT_PHONE
    const adminEmail = process.env.ADMIN_ALERT_EMAIL

    if (adminPhone) {
      sendSms({
        to: adminPhone,
        body: `New EBC lead: ${body.firstName} ${body.lastName}, ${body.mobile}, ${body.projectType}. Address: ${body.address}`,
      }).catch((err) => console.error('Admin SMS alert failed:', err))
    }

    if (adminEmail) {
      resend.emails.send({
        from: 'EBC <noreply@mail.ebc33.com.au>',
        to: adminEmail,
        subject: `New lead: ${body.firstName} ${body.lastName} (${body.projectType})`,
        html: `
          <p>A new lead just registered on the website.</p>
          <ul>
            <li><strong>Name:</strong> ${body.firstName} ${body.lastName}</li>
            <li><strong>Email:</strong> ${body.email}</li>
            <li><strong>Mobile:</strong> ${body.mobile}</li>
            <li><strong>Project type:</strong> ${body.projectType}</li>
            <li><strong>Address:</strong> ${body.address}</li>
          </ul>
        `,
      }).catch((err) => console.error('Admin email alert failed:', err))
    }

    return Response.json({ success: true, customerId: data.id })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
