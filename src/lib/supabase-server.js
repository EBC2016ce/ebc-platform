import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// See supabase-browser.js for why staff and customers need separate cookie
// names — this is the server-side half of the same fix, so a route handler
// reads the cookie that actually belongs to the role calling it instead of
// whichever role happened to log in most recently in that browser.
export async function createClient(role = 'portal') {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions: { name: role === 'staff' ? 'sb-staff-auth' : 'sb-portal-auth' },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ignore — happens when called from a place that can't set cookies
          }
        },
      },
    }
  )
}
