import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { verificationEmailHtml } from '@/lib/emailTemplates'

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request) {
  try {
    const { customerId } = await request.json()

    if (!customerId) {
      return Response.json({ error: 'Missing customer reference.' }, { status: 400 })
    }

    const { data: customer, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('first_name, email, project_type, email_verified')
      .eq('id', customerId)
      .single()

    if (fetchError || !customer) {
      return Response.json({ error: 'Could not find your registration. Please try again.' }, { status: 400 })
    }

    if (customer.email_verified) {
      return Response.json({ success: true, alreadyVerified: true })
    }

    const code = generateCode()
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({ verification_code: code, verification_expires: expires })
      .eq('id', customerId)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 })
    }

    const { error: emailError } = await resend.emails.send({
      from: 'EBC <noreply@mail.ebc33.com.au>',
      to: customer.email,
      subject: 'Your new verification code — Easy Building & Construction',
      html: verificationEmailHtml({ firstName: customer.first_name, code, projectType: customer.project_type }),
    })

    if (emailError) {
      return Response.json({ error: 'Could not send the email: ' + emailError.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
