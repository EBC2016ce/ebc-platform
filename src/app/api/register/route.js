import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const body = await request.json()

    const { error } = await supabaseAdmin.from('customers').insert([
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
      },
    ])

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
