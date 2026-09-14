import crypto from 'crypto'

// The Meta Pixel installed on the site (src/app/layout.js). Kept in one
// place so the server-side Conversions API events always target the same
// pixel the browser-side fbq() calls report to — required for Meta to
// dedupe a browser event and its server-side backup into a single result.
const PIXEL_ID = '1065732779519840'

function hash(value) {
  if (!value) return undefined
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex')
}

// Sends a server-side copy of a conversion event to Meta's Conversions API,
// as a backup to the browser-side Pixel call. This matters most on mobile,
// where Facebook/Instagram's in-app browser can occasionally drop or delay
// client-side Pixel events (ad blockers, restrictive in-app cookie/storage
// behavior). Passing the same eventId used in the matching fbq() call lets
// Meta deduplicate the two into one event rather than double-counting.
export async function sendCapiEvent({ eventName, eventId, eventSourceUrl, userData = {}, request }) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!accessToken) {
    console.error('META_CAPI_ACCESS_TOKEN is not set — skipping Conversions API event:', eventName)
    return null
  }

  const cookieHeader = request?.headers?.get?.('cookie') || ''
  const fbp = cookieHeader.match(/_fbp=([^;]+)/)?.[1]
  const fbc = cookieHeader.match(/_fbc=([^;]+)/)?.[1]
  const clientIp = request?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim()
  const userAgent = request?.headers?.get?.('user-agent') || undefined

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: {
          ...(userData.email ? { em: [hash(userData.email)] } : {}),
          ...(userData.phone ? { ph: [hash(userData.phone.replace(/\D/g, ''))] } : {}),
          ...(userData.firstName ? { fn: [hash(userData.firstName)] } : {}),
          ...(userData.lastName ? { ln: [hash(userData.lastName)] } : {}),
          ...(clientIp ? { client_ip_address: clientIp } : {}),
          ...(userAgent ? { client_user_agent: userAgent } : {}),
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        },
      },
    ],
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (!res.ok) {
      console.error('Meta Conversions API error for', eventName, ':', result)
    }
    return result
  } catch (err) {
    console.error('Meta Conversions API request failed for', eventName, ':', err.message)
    return null
  }
}
