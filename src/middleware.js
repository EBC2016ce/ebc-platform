import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Keeps the Supabase auth session(s) fresh on every request. Without this,
// an access token can expire while a customer/staff member is sitting on
// the portal or leads page, and the very next fetch to an API route fails
// to identify the user — showing up as "No matching project found" or
// "Lead not found" and forcing a re-login.
//
// Staff and customers are two independent sessions that can both be present
// in the same browser (different cookie names — see supabase-browser.js /
// supabase-server.js), so both are refreshed here, each against its own
// cookie namespace. A naive single refresh would only ever see one of them
// and, worse, a shared cookie name previously meant refreshing one session
// could clobber the other's cookie entirely.
export async function middleware(request) {
  let response = NextResponse.next({ request })

  async function refresh(cookieName) {
    // Skip the round-trip to Supabase entirely if this role isn't even
    // logged in on this request — most requests only carry one of the two.
    const hasCookie = request.cookies.getAll().some((c) => c.name.startsWith(cookieName))
    if (!hasCookie) return

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookieOptions: { name: cookieName },
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            // Rebuild the response from the updated request, but carry
            // forward any cookies already queued by a previous refresh()
            // pass — otherwise this pass's fresh NextResponse.next() would
            // silently drop the other role's refreshed cookie.
            const already = response.cookies.getAll()
            response = NextResponse.next({ request })
            already.forEach((c) => response.cookies.set(c.name, c.value))
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      }
    )

    // Touching getUser() is what actually triggers a refresh-token exchange
    // when the access token has expired, and writes the renewed cookies onto
    // the response above.
    await supabase.auth.getUser()
  }

  await refresh('sb-staff-auth')
  await refresh('sb-portal-auth')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mov|ico|css|js)$).*)',
  ],
}
