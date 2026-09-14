import { createBrowserClient } from '@supabase/ssr'

// Staff (admin/leads) and customers (portal) are two independent Supabase
// Auth identities that can both be logged in in the SAME browser at once —
// e.g. a staff member testing the customer portal in another tab. Both
// used to share the default "sb-<project-ref>-auth-token" cookie (and the
// @supabase/ssr browser client's internal singleton instance), so logging
// into one silently overwrote the other's session cookie. That's what was
// behind "No matching project found" for the customer right after staff
// logged in, and staff being randomly signed out — each was clobbering the
// other's session cookie.
//
// Giving each role its own cookie name, and disabling the singleton cache
// (which would otherwise hand back whichever client was created first,
// ignoring the cookie name passed on a later call), keeps the two sessions
// fully independent.
export function createClient(role = 'portal') {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      isSingleton: false,
      cookieOptions: { name: role === 'staff' ? 'sb-staff-auth' : 'sb-portal-auth' },
    }
  )
}
