import { supabaseAdmin } from '@/lib/supabase-admin'

// One-click unsubscribe from marketing emails (blog announcements etc.),
// required under Australia's Spam Act for commercial electronic messages.
// customerId + email must both match so a guessed id alone can't opt someone
// else out.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')
  const email = searchParams.get('email')

  if (!customerId || !email) {
    return Response.json({ error: 'Missing customerId or email' }, { status: 400 })
  }

  const { data: customer } = await supabaseAdmin.from('customers').select('id, email').eq('id', customerId).maybeSingle()

  if (!customer || customer.email?.toLowerCase() !== email.toLowerCase()) {
    return Response.json({ error: 'Could not verify that request.' }, { status: 400 })
  }

  await supabaseAdmin.from('customers').update({ marketing_opt_out: true }).eq('id', customerId)

  return Response.json({ success: true })
}
