import Link from 'next/link'
import Footer from './components/Footer'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

// Custom 404: keeps visitors (and their enquiry) on the site instead of
// dead-ending them. Next.js still returns a real 404 status to Google.
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-sm font-semibold text-[#E1601F] tracking-wide mb-3">404</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          We can&apos;t find that page
        </h1>
        <p className="mt-4 text-[#5A5E66] leading-relaxed">
          It may have moved or no longer exists. Here are the places most people are looking for:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link href="/renovation" className="border border-[#D9D6CD] rounded-lg px-5 py-3 text-[#1B2A4A] hover:border-[#E1601F] transition">Home Renovations</Link>
          <Link href="/extension" className="border border-[#D9D6CD] rounded-lg px-5 py-3 text-[#1B2A4A] hover:border-[#E1601F] transition">Home Extensions</Link>
          <Link href="/new-home" className="border border-[#D9D6CD] rounded-lg px-5 py-3 text-[#1B2A4A] hover:border-[#E1601F] transition">New Homes</Link>
          <Link href="/blog" className="border border-[#D9D6CD] rounded-lg px-5 py-3 text-[#1B2A4A] hover:border-[#E1601F] transition">Blog</Link>
        </div>
        <div className="mt-8">
          <Link href="/register" className="inline-block bg-[#0068D8] text-white font-medium rounded px-6 py-3 hover:bg-[#0050B0] transition">
            Get a free quote
          </Link>
          <p className="mt-4 text-sm text-[#5A5E66]">
            or call <a href="tel:1300715840" className="font-semibold text-[#1B2A4A]">1300 715 840</a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
