// Thin wrapper around ClickSend's SMS API. Uses an alphanumeric sender ID
// ("EBC") so messages arrive from a name rather than an overseas number.
// Fails soft (logs and returns { success: false }) instead of throwing, so a
// missing/misconfigured credential never crashes a build or an API route.

function normalizeAuMobile(raw) {
  const digits = String(raw || '').replace(/[^0-9+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('0')) return '+61' + digits.slice(1)
  if (digits.startsWith('61')) return '+' + digits
  return digits
}

export async function sendSms({ to, body }) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY

  if (!username || !apiKey) {
    console.error('ClickSend is not configured (CLICKSEND_USERNAME / CLICKSEND_API_KEY missing) — SMS not sent.')
    return { success: false, error: 'SMS not configured' }
  }

  const toNumber = normalizeAuMobile(to)
  const auth = Buffer.from(`${username}:${apiKey}`).toString('base64')

  try {
    const res = await fetch('https://rest.clicksend.com/v3/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        messages: [
          { source: 'ebc-platform', body, to: toNumber, from: 'EBC' },
        ],
      }),
    })
    const data = await res.json()

    if (!res.ok || data.response_code !== 'SUCCESS') {
      console.error('ClickSend SMS failed:', JSON.stringify(data))
      return { success: false, error: data.response_msg || 'SMS send failed' }
    }
    return { success: true, data }
  } catch (err) {
    console.error('ClickSend request error:', err)
    return { success: false, error: err.message }
  }
}
