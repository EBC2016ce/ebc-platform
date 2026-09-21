import Image from 'next/image'
import Link from 'next/link'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import { SERVICE_AREAS, breadcrumbSchema } from '@/lib/site'

const description = 'Easy Building & Construction builds, extends and renovates homes in Ringwood, Croydon, Boronia, Blackburn, Glen Waverley, Mitcham, Rowville and across Melbourne’s Eastern Suburbs.'

export const metadata = {
  title: 'Areas We Serve | Eastern Suburbs Melbourne Builder',
  export const metadata = {
  robots: { index: false, follow: false },
  title: 'Areas We Serve | Eastern Suburbs Melbourne Builder',
  description,
  alternates: { canonical: '/areas' },
  openGraph: {
    title: 'Areas We Serve | Easy Building & Construction',
    description,
    url: '/areas',
  },
}

const services = [
  { href: '/renovation', title: 'Home renovations', desc: 'Kitchens, bathrooms, laundries, open-plan changes and full-home renovations.' },
  { href: '/extension', title: 'Home extensions', desc: 'More living space, designed to blend with your existing home.' },
  { href: '/new-home', title: 'New home builds', desc: 'Knockdown rebuilds and custom homes on vacant blocks.' },
]

// One page covering every suburb we work in, rather than a separate thin page
// per suburb. The suburb list lives in src/lib/site.js (SERVICE_AREAS).
export default function Areas() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Areas we serve', path: '/areas' }])} />

      <div className="flex-1">
        <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <Image src="/logo-icon.png" alt="Easy Building & Construction logo" width={202} height={100} className="h-11 w-auto" priority />
            <span className="font-bold text-[#1B2A4A] text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Easy Building &amp; Construction Pty Ltd.
            </span>
          </Link>

          <span className="block text-sm font-semibold text-[#E1601F] tracking-wide mb-3">AREAS WE SERVE</span>
          <h1 className="text-3xl md:text-5xl font-semibold text-[#1B2A4A] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Builders across Melbourne&apos;s <span className="text-[#3C6FB0]">Eastern Suburbs</span>
          </h1>
          <p className="mt-5 text-lg text-[#3A3F4A] leading-relaxed">
            Easy Building &amp; Construction is a registered Melbourne builder. We renovate, extend and build new homes in the suburbs below, from Glen Waverley and Blackburn through to Ringwood, Croydon, Boronia and Rowville.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/register" data-cta="areas-hero-quote" className="inline-block bg-[#E1601F] text-white font-semibold rounded-md px-7 py-3.5 hover:bg-[#C9541A] transition-colors">
              Get a Free Quote
            </Link>
            <a href="tel:1300715840" className="text-[#1B2A4A] font-semibold underline">or call 1300 715 840</a>
          </div>
        </section>

        <section className="bg-[#F6F5F1] border-y border-[#EAE7E0] px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Suburbs we work in</h2>
            <ul className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {SERVICE_AREAS.map((a) => (
                <li key={a.name} className="bg-white border border-[#EAE7E0] rounded-lg px-4 py-3 flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-[#1B2A4A] text-sm">{a.name}</span>
                  <span className="text-xs text-[#8A8D94]">{a.postcode}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-[#5A5E66] leading-relaxed">
              Don&apos;t see your suburb? Nearby areas are often possible. Register your project with your address and we&apos;ll confirm whether we can help.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>What we build in these suburbs</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="block border border-[#EAE7E0] rounded-xl p-5 hover:border-[#E1601F]/40 hover:shadow-lg transition">
                <h3 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{s.title}</h3>
                <p className="mt-1.5 text-sm text-[#5A5E66] leading-relaxed">{s.desc}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#E1601F]">Learn more →</span>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Why local matters when you build</h2>
          <div className="mt-4 space-y-4 text-[#3A3F4A] leading-relaxed">
            <p>
              Every council has its own planning requirements, and every street has its own character, block shape and access. A builder who works across these suburbs regularly knows what to expect, and can tell you early what approvals your project is likely to need.
            </p>
            <p>
              You can read more in our guides on <Link href="/blog/renovating-in-melbourne-questions" className="text-[#1B2A4A] underline hover:text-[#E1601F]">renovating in Melbourne</Link> and <Link href="/blog/extension-costs-timelines-guide" className="text-[#1B2A4A] underline hover:text-[#E1601F]">extension costs and timelines</Link>.
            </p>
          </div>

          <div className="mt-10 bg-[#1B2A4A] rounded-xl p-8 text-center">
            <p className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Planning a project in one of these suburbs?</p>
            <p className="text-sm text-[#C9D2E3] mt-2">Free consultation, no obligation.</p>
            <Link href="/register" data-cta="areas-bottom-quote" className="inline-block mt-5 bg-[#8FC2FF] text-[#0F1930] font-semibold rounded-md px-8 py-3">
              Register Your Project
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
