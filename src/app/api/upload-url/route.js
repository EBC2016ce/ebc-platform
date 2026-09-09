import { createClient } from '@/lib/supabase-server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const { customerId, category, filename } = await request.json()
    const path = customerId + '/' + category + '/' + filename

    const { data, error } = await supabase.storage.from('plans').createSignedUploadUrl(path)

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ signedUrl: data.signedUrl, token: data.token, path })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
