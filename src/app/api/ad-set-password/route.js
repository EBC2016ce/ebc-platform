import { supabaseAdmin } from '@/lib/supabase-admin'

// Ad-funnel-only — lets the customer set their real password, once, right
// after they've verified their email (see /api/verify). This is the
// deliberately-deferred second half of what /api/ad-register skipped: that
// endpoint creates the account with a throwaway random password so the
// visitor is never asked to invent a login before they've even booked a
// slot. This is where they actually pick one, at the point in the flow
// where it's obvious why (to open their portal).
//
// Gated on email_verified rather than re-checking the (already single-use,
// nulled-out) verification code — matches the trust level the rest of this
// flow already puts on a customerId (e.g. /api/book takes one directly,
// same as the on-site flow), not a stronger bar.
export async function POST(request) {
  try {
    const { customerId, password } = await request.json()

    if (!customerId || !password || password.length < 8) {
      return Response.json({ error: 'A password of at least 8 characters is required.' }, { status: 400 })
    }

    const { data: customer, error: fetchError } = await supabaseAdmin
      .from('customers')
      .select('email_verified, auth_user_id')
      .eq('id', customerId)
      .single()

    if (fetchError || !customer) {
      return Response.json({ error: 'Could not find your registration. Please try again.' }, { status: 400 })
    }

    if (!customer.email_verified) {
      return Response.json({ error: 'Please verify your email first.' }, { status: 400 })
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(customer.auth_user_id, { password })

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
