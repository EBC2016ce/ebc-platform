// Central place for Google Analytics 4 / Google Ads tracking.
//
// Nothing here fires until the IDs below are set as environment variables
// (Vercel > Project > Settings > Environment Variables, then redeploy):
//
//   NEXT_PUBLIC_GA_ID                    e.g. G-XXXXXXXXXX   (GA4 Measurement ID)
//   NEXT_PUBLIC_GOOGLE_ADS_ID            e.g. AW-1234567890  (only when Google Ads is set up)
//   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL    e.g. AbC-D_efG-h12  (the "Lead form submitted" conversion label)
//
// With no IDs set the site behaves exactly as before. Every helper is safe to
// call at any time: it silently does nothing if gtag isn't loaded (ad blockers,
// missing ID, server-side render).

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || ''

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params)
  } catch {
    // Tracking must never break the page.
  }
}

// The main conversion: a submitted enquiry / registration form.
// Fires the GA4 recommended "generate_lead" event (mark it as a Key Event in
// GA4) and, once Google Ads is connected, the matching Ads conversion.
export function trackLead(params = {}) {
  trackEvent('generate_lead', { currency: 'AUD', ...params })
  if (ADS_ID && ADS_LEAD_LABEL) {
    trackEvent('conversion', { send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`, ...params })
  }
}
