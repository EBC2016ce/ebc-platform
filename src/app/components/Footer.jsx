import Link from 'next/link'

// Shared full site footer — used on the homepage and on every landing/form
// page (register, and the ad landing pages via AdLandingPage.jsx) so the
// business info, social links, and nav columns are consistent everywhere,
// not just on "/". Extracted from src/app/page.js's original inline footer.
function SocialIcon({ name }) {
  if (name === 'instagram') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
  )
  if (name === 'linkedin') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.8h4V21H3V9.8Zm7 0h3.8v1.6h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.63 0-1.88 1.27-1.88 2.6V21h-4V9.8Z" /></svg>
  )
  if (name === 'youtube') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.9 2.9 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.9 2.9 0 0 0 2-2c.4-1.5.4-4.7.4-4.7ZM10 15.3V8.7l6 3.3-6 3.3Z" /></svg>
  )
  if (name === 'x') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 3H22l-7.6 8.7L22.9 21H16.5l-5-6.5L5.6 21H2.5l8.1-9.3L2 3h6.6l4.5 5.9L18.9 3Zm-1.1 16.1h1.7L7.3 4.8H5.5l12.3 14.3Z" /></svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35C16.24 4.31 15.35 4.25 14.3 4.25c-2.2 0-3.7 1.34-3.7 3.8v2.45H8.1v3h2.5V21h2.9Z" /></svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-white px-6 py-12 border-t border-[#EAE7E0]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="font-semibold text-[#1B2A4A] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Easy Building &amp; Construction Pty Ltd.</div>
          <p className="text-[#8A8D94] leading-relaxed">New homes, renovations, and extensions across Melbourne — one team from first conversation to final handover.</p>
          <div className="flex items-center gap-3 mt-4 text-[#1B2A4A]">
            <a href="https://www.instagram.com/easybcon.com.au/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E1601F] transition"><SocialIcon name="instagram" /></a>
            <a href="https://www.linkedin.com/company/easybcon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#E1601F] transition"><SocialIcon name="linkedin" /></a>
            <a href="https://www.facebook.com/easybcon.com.au" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#E1601F] transition"><SocialIcon name="facebook" /></a>
            <a href="https://www.youtube.com/@EBC2010AUS" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#E1601F] transition"><SocialIcon name="youtube" /></a>
            <a href="https://x.com/easybcon" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-[#E1601F] transition"><SocialIcon name="x" /></a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-[#1B2A4A] mb-3">Company</div>
          <div className="flex flex-col gap-2 text-[#5A5E66]">
            <Link href="/" className="hover:text-[#E1601F] transition">Home</Link>
            <Link href="/register" className="hover:text-[#E1601F] transition">Register</Link>
            <Link href="/register" className="hover:text-[#E1601F] transition">Contact</Link>
            <Link href="/portal/login" className="hover:text-[#E1601F] transition">Client Login</Link>
            <Link href="/blog" className="hover:text-[#E1601F] transition">Blog</Link>
            <Link href="/privacy" className="hover:text-[#E1601F] transition">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold text-[#1B2A4A] mb-3">Services</div>
          <div className="flex flex-col gap-2 text-[#5A5E66]">
            <Link href="/new-home" className="hover:text-[#E1601F] transition">New Home</Link>
            <Link href="/renovation" className="hover:text-[#E1601F] transition">Renovation</Link>
            <Link href="/extension" className="hover:text-[#E1601F] transition">Extension</Link>
            <Link href="/areas" className="hover:text-[#E1601F] transition">Areas We Serve</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold text-[#1B2A4A] mb-3">Contact</div>
          <div className="flex flex-col gap-2 text-[#5A5E66]">
            <a href="tel:1300715840" className="hover:text-[#E1601F] transition">1300 715 840</a>
            <a href="mailto:info@easybcon.com.au" className="hover:text-[#E1601F] transition">info@easybcon.com.au</a>
            <span>P.O. Box 2014</span>
            <span>Forest Hill VIC 3131</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#EAE7E0] text-xs text-[#8A8D94] text-center">
        <div>© 2026 Easy Building &amp; Construction Pty Ltd.</div>
        <div className="mt-1">Designed by EBC@ASR2010 Group.</div>
      </div>
    </footer>
  )
}
