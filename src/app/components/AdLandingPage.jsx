'use client'
import Image from 'next/image'
import Link from 'next/link'
import RegistrationForm from '@/components/RegistrationForm'

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
    </svg>
  )
}

export default function AdLandingPage({
  eyebrow,
  headline,
  highlight,
  subtext,
  bullets,
  image,
  imageAlt,
  lockedCategory,
  formTitle,
  formSubtitle,
}) {
  return (
    <main className="min-h-screen bg-white">
      {/* Minimal header: logo + phone only, no nav, to keep focus on the form */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#EAE7E0] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-11 w-auto" priority />
            <span className="hidden sm:block font-bold text-[#1B2A4A] text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Easy Building &amp; Construction Pty Ltd
            </span>
          </Link>
          <a href="tel:1300715840" className="inline-flex items-center gap-2 bg-[#1B2A4A] text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-[#13203A] transition whitespace-nowrap">
            <PhoneIcon /> 1300 715 840
          </a>
        </div>
      </header>

      {/* Hero: headline + trust bullets + photo on the left, form on the right */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="block text-sm font-semibold text-[#E1601F] tracking-wide mb-3">{eyebrow}</span>
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1B2A4A] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {headline} <span className="text-[#3C6FB0]">{highlight}</span>
            </h1>
            <p className="mt-5 text-lg text-[#3A3F4A] leading-relaxed max-w-md">{subtext}</p>

            <ul className="mt-7 space-y-3 text-sm text-[#3A3F4A] font-medium">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-[#E1601F]/15 text-[#E1601F] flex items-center justify-center text-xs">✓</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="relative mt-10 rounded-xl overflow-hidden shadow-lg h-64 md:h-80">
              <Image src={image} alt={imageAlt} fill className="object-cover" priority />
            </div>
          </div>

          <div className="bg-white border border-[#EAE7E0] rounded-2xl shadow-xl p-6 md:p-8 lg:sticky lg:top-24">
            <RegistrationForm
              lockedCategory={lockedCategory}
              title={formTitle}
              subtitle={formSubtitle}
              hideLogo
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#F6F5F1] border-y border-[#EAE7E0] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-4">
          <span className="border border-[#D9D6CD] rounded-lg px-6 py-3 bg-white shadow-sm text-sm font-semibold text-[#1B2A4A]">
            MBV — Master Builders Victoria
          </span>
          <span className="border border-[#D9D6CD] rounded-lg px-6 py-3 bg-white shadow-sm text-sm font-semibold text-[#1B2A4A]">
            BPC — Registered Building Practitioner
          </span>
          <span className="border border-[#D9D6CD] rounded-lg px-6 py-3 bg-white shadow-sm text-sm font-semibold text-[#1B2A4A]">
            15+ Years Experience
          </span>
        </div>
      </section>
    </main>
  )
}
