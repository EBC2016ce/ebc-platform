export function saveUtmFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
  let found = false

  keys.forEach((key) => {
    const value = params.get(key)
    if (value) {
      localStorage.setItem(key, value)
      found = true
    }
  })

  if (found) {
    localStorage.setItem('utm_captured_at', new Date().toISOString())
  }
}

export function getStoredUtm() {
  return {
    utmSource: localStorage.getItem('utm_source') || null,
    utmMedium: localStorage.getItem('utm_medium') || null,
    utmCampaign: localStorage.getItem('utm_campaign') || null,
    utmContent: localStorage.getItem('utm_content') || null,
  }
}
