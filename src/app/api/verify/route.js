import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendCapiEvent } from '@/lib/metaCapi'

export async function POST(request) {
  try {
    const { customerId, code, fbEventId, pageUrl } = await request.json()

    const { data: customer, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('verification_code, verification_expires, email_verified')
      .eq('id', customerId)
      .single()

    if (fetchError || !customer) {
      return Response.json({ error: 'Could not find your registration. Please try again.' }, { status: 400 })
    }

    if (customer.email_verified) {
      return Response.json({ success: true })
    }

    if (new Date(customer.verification_expires) < new Date()) {
      return Response.json({ error: 'This code has expired. Please request a new one.' }, { status: 400 })
    }

    if (customer.verification_code !== code) {
      return Response.json({ error: "That code doesn't match. Please check and try again." }, { status: 400 })
    }

        const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({ email_verified: true, verification_code: null })
      .eq('id', customerId)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 })
    }

    const { data: fullCustomer } = await supabaseAdmin
      .from('customers')
      .select('email, mobile, first_name, last_name')
      .eq('id', customerId)
      .single()
    const { data: session } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: fullCustomer.email,
    })

    // Server-side backup of the browser Pixel's CompleteRegistration event —
    // the conversion the ad set is actually optimizing toward. Best-effort,
    // never blocks verification. Same dedup approach as the Lead event.
    if (fbEventId && fullCustomer) {
      sendCapiEvent({
        eventName: 'CompleteRegistration',
        eventId: fbEventId,
        eventSourceUrl: pageUrl,
        userData: {
          email: fullCustomer.email,
          phone: fullCustomer.mobile,
          firstName: fullCustomer.first_name,
          lastName: fullCustomer.last_name,
        },
        request,
      }).catch((err) => console.error('Meta CAPI CompleteRegistration event failed:', err))
    }

    return Response.json({ success: true, actionLink: session?.properties?.action_link })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
