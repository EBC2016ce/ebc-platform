import { supabaseAdmin } from './supabase-admin'

// Thin wrapper around ClickSend's SMS API. Uses an alphanumeric sender ID
// ("EBC") so messages arrive from a name rather than an overseas number.
// Fails soft (logs and returns { success: false }) instead of throwing, so a
// missing/misconfigured credential never crashes a build or an API route.
//
// Every attempt — success or failure — is written to notification_log so an
// intermittent "sometimes I don't get the SMS" report can actually be
// diagnosed from the database instead of guessing, since we don't have
// visibility into Vercel's runtime logs or the ClickSend dashboard from here.

function normalizeAuMobile(raw) {
  const digits = String(raw || '').replace(/[^0-9+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('0')) return '+61' + digits.slice(1)
  if (digits.startsWith('61')) return '+' + digits
  return digits
}

async function logAttempt({ to, success, error, purpose, customerId }) {
  try {
    await supabaseAdmin.from('notification_log').insert([{
      channel: 'sms',
      purpose: purpose || null,
      recipient: to || null,
      customer_id: customerId || null,
      success,
      error: error || null,
    }])
  } catch (err) {
    // Never let logging itself break the caller.
    console.error('Failed to write notification_log row:', err)
  }
}

export async function sendSms({ to, body, purpose, customerId }) {
  const username = process.env.CLICKSEND_USERNAME
  const apiKey = process.env.CLICKSEND_API_KEY

  if (!username || !apiKey) {
    const error = 'SMS not configured (CLICKSEND_USERNAME / CLICKSEND_API_KEY missing)'
    console.error(error, '— SMS not sent.')
    await logAttempt({ to, success: false, error, purpose, customerId })
    return { success: false, error }
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

    // ClickSend can return a "SUCCESS" envelope (the API call was accepted)
    // while the individual message inside it failed to queue — e.g. an
    // invalid/unreachable number, low account balance, or the "EBC"
    // alphanumeric sender ID being rejected by that recipient's carrier.
    // Checking only the top-level response_code (as this used to) reported
    // those as sent when they never actually went out, which matches
    // exactly the "works sometimes" pattern reported.
    const messageResult = data?.data?.messages?.[0]
    const messageFailed = messageResult && messageResult.status && messageResult.status !== 'SUCCESS'

    if (!res.ok || data.response_code !== 'SUCCESS' || messageFailed) {
      const error = (messageResult && (messageResult.status_text || messageResult.status)) || data.response_msg || 'SMS send failed'
      console.error('ClickSend SMS failed:', JSON.stringify(data))
      await logAttempt({ to, success: false, error, purpose, customerId })
      return { success: false, error, data }
    }

    await logAttempt({ to, success: true, purpose, customerId })
    return { success: true, data }
  } catch (err) {
    console.error('ClickSend request error:', err)
    await logAttempt({ to, success: false, error: err.message, purpose, customerId })
    return { success: false, error: err.message }
  }
}
