'use client'
import { useEffect } from 'react'
import Script from 'next/script'
import { GA_ID, ADS_ID, trackEvent } from '@/lib/analytics'

// Loads Google Analytics 4 (and the Google Ads tag when configured) and
// records the interactions that matter for lead generation:
//
//   phone_click  - any tel: link (header, footer, landing pages)
//   email_click  - any mailto: link
//   cta_click    - any link to /register, /register?..., or an in-page #quote anchor
//                  (also anything with a data-cta="name" attribute)
//
// Form events (form_start, generate_lead, sign_up) are fired from the forms
// themselves - see RegistrationForm.js and the ad-consult page.
//
// Renders nothing and loads nothing if NEXT_PUBLIC_GA_ID isn't set.
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return

    function onClick(e) {
      const el = e.target instanceof Element ? e.target.closest('a[href], [data-cta]') : null
      if (!el) return

      const href = el.getAttribute('href') || ''
      const where = window.location.pathname
      const label = (el.getAttribute('data-cta') || el.textContent || '').trim().slice(0, 80)

      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { link_url: href, page_path: where })
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { link_url: href, page_path: where })
      } else if (el.hasAttribute('data-cta') || /^\/register(\?|#|$)/.test(href) || href.startsWith('#quote')) {
        trackEvent('cta_click', { cta_text: label, link_url: href, page_path: where })
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!GA_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
        `}
      </Script>
    </>
  )
}
