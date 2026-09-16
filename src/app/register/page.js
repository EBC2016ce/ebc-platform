import Image from 'next/image'
import Link from 'next/link'
import RegistrationForm from '@/components/RegistrationForm'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Register Your Project',
  description: 'Tell us about your new build, renovation or extension project and get started with Easy Building & Construction.',
  alternates: { canonical: '/register' },
}

const bullets = [
  'Free, no-obligation consultation with our team',
  'Registered building practitioners, 15+ years experience',
  "We'll walk you through your options personally",
]

export default function Register() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-8">
                <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-11 w-auto" priority />
                <span className="font-bold text-[#1B2A4A] text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  Easy Building &amp; Construction Pty Ltd.
                </span>
              </Link>

              <span className="block text-sm font-semibold text-[#E1601F] tracking-wide mb-3">GET A QUOTE</span>
              <h1 className="text-3xl md:text-5xl font-semibold text-[#1B2A4A] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Register your project,<br /><span className="text-[#3C6FB0]">get a clear plan back.</span>
              </h1>
              <p className="mt-5 text-lg text-[#3A3F4A] leading-relaxed max-w-md">
                Whether it&apos;s a new home, a renovation or an extension, tell us a little about your project and
                we&apos;ll personally walk you through what&apos;s next — no call centre, no pressure.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-[#3A3F4A] font-medium">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-[#E1601F]/15 text-[#E1601F] flex items-center justify-center text-xs">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="relative mt-10 rounded-xl overflow-hidden shadow-lg h-64 md:h-96">
                <Image
                  src="/register-hero-builder.jpg"
                  alt="EBC builder reviewing renovation plans with a happy homeowner couple"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="bg-white border border-[#EAE7E0] rounded-2xl shadow-xl p-6 md:p-8 lg:sticky lg:top-8">
              <RegistrationForm hideLogo />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
