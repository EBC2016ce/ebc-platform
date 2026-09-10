import { createClient } from './supabase-server'
import { supabaseAdmin } from './supabase-admin'

export async function requireStaff() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { authorized: false, error: 'Not authorized' }

  const { data: staffRecord } = await supabaseAdmin.from('staff_users').select('*').eq('id', user.id).maybeSingle()
  if (!staffRecord) return { authorized: false, error: 'Not authorized' }

  return { authorized: true, user, staffRecord }
}
