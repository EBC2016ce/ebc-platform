import Image from 'next/image'
import Link from 'next/link'

const quickLinks = [
  {
    title: 'New Building Construction',
    desc: 'Custom homes designed and built to suit your lifestyle and budget.',
    href: '/new-home',
    img: '/quicklink-new-building.jpg',
    icon: 'home',
  },
  {
    title: 'Renovations',
    desc: 'Kitchen, bathroom, laundry or full home renovations.',
    href: '/renovation',
    img: '/quicklink-renovation.jpg',
    icon: 'wrench',
  },
  {
    title: 'Extensions',
    desc: 'More space for your growing family and lifestyle.',
    href: '/extension',
    img: '/quicklink-extension.jpg',
    icon: 'expand',
  },
  {
    title: 'Our Projects',
    desc: 'Explore our completed homes, renovations and extensions.',
    href: '#our-work',
    img: '/quicklink-our-projects.jpg',
    icon: 'gallery',
  },
]

const services = [
  { title: 'Home Renovations', desc: 'High-quality renovations designed to improve layout, function and modern living — kitchens, bathrooms, laundries and full homes.', href: '/renovation' },
  { title: 'Home Extensions', desc: 'Seamless extensions that expand your living space and integrate with your existing home.', href: '/extension' },
  { title: 'New Home Building', desc: 'End-to-end home building with a focus on craftsmanship and lasting quality.', href: '/new-home' },
]

const consultationCta = { title: 'Book A Free Consultation', desc: 'Speak with our team to map your project and get a clear, tailored plan.', href: '/register' }

const process = [
  { step: '01', title: 'Register', desc: 'Tell us about your project — takes about a minute.' },
  { step: '02', title: 'Design', desc: 'Work through our Home Design Tool at your own pace.' },
  { step: '03', title: 'Consult', desc: 'Book time with a team member who already knows your project.' },
  { step: '04', title: 'Build', desc: 'Track progress from first site work to handover.' },
]

const reviews = [
  { quote: 'EBC was fantastic. They made sure we were happy and were responsive to feedback and changes as the job progressed.', name: 'Scott', location: 'Croydon' },
  { quote: 'Even though our new house was a small project, it was carried out with care and a reasonable contract. Very happy with the result.', name: 'Li', location: 'Ashwood' },
]

const projects = [
  { img: '/project-kitchen-after.jpg', category: 'Melbourne Home Renovation', title: 'The Kitchen Transformation' },
  { img: '/renovation-after.jpg', category: 'Melbourne Home Renovation', title: 'The Complete Refresh' },
  { img: '/project-renovation-during.jpg', category: 'Melbourne Home Renovation', title: 'Mid-Build Progress' },
  { img: '/renovation-before.jpg', category: 'Melbourne Home Renovation', title: 'Where It Started' },
  { img: '/project-frame-fitout.jpg', category: 'Melbourne Home Renovation', title: 'Frame & Fitout' },
  { img: '/project-kitchen-after.jpg', category: 'Melbourne Home Renovation', title: 'Finished & Handed Over' },
]

const blogPosts = [
  { img: '/project-kitchen-after.jpg', date: 'Coming soon', title: 'Design & Build vs. Hiring Separately: What Actually Matters', excerpt: 'A straight-talking look at the two approaches to planning your renovation or new build.' },
  { img: '/renovation-before.jpg', date: 'Coming soon', title: 'Renovating in Melbourne: The Questions Every Homeowner Asks First', excerpt: 'Permits, timelines, and costs — what to know before your first conversation with a builder.' },
  { img: '/renovation-after.jpg', date: 'Coming soon', title: 'Extension Costs & Timelines: A Practical Guide', excerpt: 'What actually drives the cost and schedule of a home extension in Victoria.' },
]

function QuickIcon({ name }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (name === 'home') return (<svg {...common}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9.5a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" /></svg>)
  if (name === 'wrench') return (<svg {...common}><path d="M14.7 6.3a4 4 0 0 0-5.6 5.1L3 17.5V21h3.5l6.1-6.1a4 4 0 0 0 5.1-5.6l-2.8 2.8-2.1-2.1 2.9-2.8Z" /></svg>)
  if (name === 'expand') return (<svg {...common}><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>)
  return (<svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5-9 9" /></svg>)
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
    </svg>
  )
}

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

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header: logo + tagline, nav, phone CTA */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-[#EAE7E0] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-14 w-auto" priority />
            <span className="text-center md:text-left">
              <span className="block font-bold text-[#1B2A4A] text-base sm:text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Easy Building &amp; Construction Pty Ltd.
              </span>
              <span className="block text-[11px] font-semibold tracking-wider text-[#8A8D94]">
                REGISTERED BUILDING PRACTITIONERS
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1B2A4A]">
            <Link href="/" className="border-b-2 border-[#E1601F] pb-1">Home</Link>
            <Link href="#why-us" className="border-b-2 border-[#E1601F] pb-1 hover:text-[#E1601F] transition">About Us</Link>
            <Link href="#services" className="border-b-2 border-[#E1601F] pb-1 hover:text-[#E1601F] transition">Services</Link>
            <Link href="#our-work" className="border-b-2 border-[#E1601F] pb-1 hover:text-[#E1601F] transition">Projects</Link>
            <Link href="/register" className="border-b-2 border-[#E1601F] pb-1 hover:text-[#E1601F] transition">Contact Us</Link>
          </nav>
          <a href="tel:1300715840" className="inline-flex items-center gap-2 bg-[#0068D8] text-white text-base font-semibold rounded-full px-6 py-3 hover:bg-[#0050B0] transition">
            <PhoneIcon /> 1300 715 840
          </a>
        </div>
      </header>

      {/* Hero: single full-bleed photo, light overlay for readability */}
      <section className="relative h-[560px] md:h-[640px] overflow-hidden">
        <Image src="/hero-melbourne-home-build.jpg" alt="Modern EBC home build in Melbourne" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/5" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.45))]">
            <span className="block text-sm font-semibold text-[#FFB088] tracking-wide mb-3">YOUR VISION &middot; OUR EXPERTISE</span>
            <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="grid" style={{ gridTemplateColumns: 'auto auto' }}>
                <span>Quality&nbsp;</span><span className="border-b-2 border-[#E1601F] pb-1 w-fit">New Buildings</span>
                <span></span><span className="border-b-2 border-[#E1601F] pb-1 w-fit">Extensions</span>
                <span></span><span className="border-b-2 border-[#E1601F] pb-1 w-fit">Renovations</span>
              </span>
              <span className="block mt-1 text-[#8FC2FF] text-xl md:text-3xl whitespace-nowrap">Across Melbourne (Eastern Suburbs)</span>
            </h1>
            <p className="mt-5 text-lg text-white/90 leading-relaxed">
              From new builds to renovations and extensions, EBC delivers high-quality workmanship with a commitment to finish on time.
            </p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 w-fit bg-[#E1601F] text-white font-medium rounded-full px-7 py-3.5 hover:opacity-90 hover:shadow-xl hover:shadow-[#E1601F]/30 hover:-translate-y-0.5 transition-all" style={{ fontFamily: 'var(--font-heading)' }}>
              Get a Free Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links: 4 cards, photo + overlapping icon */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {quickLinks.map((q) => (
            <Link key={q.title} href={q.href} className="group text-center">
              <div className="relative rounded-xl overflow-hidden shadow-md h-40">
                <Image src={q.img} alt={q.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative -mt-6 flex justify-center">
                <span className="w-12 h-12 rounded-full bg-white shadow-md border border-[#EAE7E0] flex items-center justify-center text-[#1B2A4A] group-hover:bg-[#E1601F] group-hover:text-white group-hover:border-[#E1601F] transition-colors">
                  <QuickIcon name={q.icon} />
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{q.title}</h3>
              <p className="mt-1 text-sm text-[#5A5E66] leading-relaxed px-2">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust / contact strip */}
      <section className="bg-[#F6F5F1] border-y border-[#EAE7E0] px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6 text-sm">
          <a href="https://www.bpc.vic.gov.au/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <span className="w-10 h-10 shrink-0 rounded-full bg-white border border-[#D9D6CD] flex items-center justify-center p-1.5 group-hover:border-[#E1601F] transition-colors">
              <Image src="/bpc-logo.png" alt="Building and Plumbing Commission" width={211} height={120} className="w-full h-auto object-contain" />
            </span>
            <div className="leading-tight">
              <div className="font-semibold text-[#1B2A4A] group-hover:text-[#E1601F] transition-colors">Building and Plumbing Commission</div>
            </div>
          </a>
          <a href="https://www.mbav.com.au/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
            <span className="w-10 h-10 shrink-0 rounded-full bg-white border border-[#D9D6CD] flex items-center justify-center p-1.5 group-hover:border-[#E1601F] transition-colors">
              <Image src="/mbav-logo.png" alt="MBV" width={230} height={120} className="w-full h-auto object-contain" />
            </span>
            <div className="font-semibold text-[#1B2A4A] group-hover:text-[#E1601F] transition-colors">Master Builders Victoria</div>
          </a>
          <div className="flex items-center gap-3 text-[#1B2A4A]">
            <a href="https://www.instagram.com/easybcon.com.au/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#E1601F] transition"><SocialIcon name="instagram" /></a>
            <a href="https://www.linkedin.com/company/easybcon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#E1601F] transition"><SocialIcon name="linkedin" /></a>
            <a href="https://www.facebook.com/easybcon.com.au" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#E1601F] transition"><SocialIcon name="facebook" /></a>
            <a href="https://www.youtube.com/@EBC2010AUS" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#E1601F] transition"><SocialIcon name="youtube" /></a>
            <a href="https://x.com/easybcon" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-[#E1601F] transition"><SocialIcon name="x" /></a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#F6F5F1] border-b border-[#EAE7E0] px-6 py-14">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">CHOOSE A BUILDER WITH A PROVEN TRACK RECORD</p>
          <div className="flex justify-center gap-16 mt-6 flex-wrap">
            <div>
              <div className="text-5xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>15+</div>
              <div className="text-sm text-[#5A5E66] mt-1">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>100%</div>
              <div className="text-sm text-[#5A5E66] mt-1">Locally Licensed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand tagline */}
      <section className="px-6 py-16 text-center bg-white">
        <p className="max-w-3xl mx-auto text-3xl md:text-5xl font-semibold text-[#1B2A4A] leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
          <span className="block">Construction is a craft.</span>
          <span className="block">Building relationships is an art.</span>
          <span className="block">Doing both is EBC.</span>
        </p>
      </section>

      {/* Services grid */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">BUILDING SERVICES</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Expert Solutions for Every Construction Need
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group block rounded-xl p-7 transition-all border border-[#EAE7E0] bg-white hover:shadow-xl hover:shadow-[#1B2A4A]/5 hover:-translate-y-1 hover:border-[#E1601F]/30"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-colors bg-[#1B2A4A] group-hover:bg-[#E1601F]">
                <div className="w-5 h-5 rounded-sm bg-white/90" />
              </div>
              <h3 className="font-semibold mb-2 text-lg text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed mb-4 text-[#5A5E66]">{s.desc}</p>
              <span className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-[#E1601F]">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 max-w-md mx-auto">
          <Link
            href={consultationCta.href}
            className="group block rounded-xl p-7 text-center transition-all bg-[#1B2A4A] hover:shadow-xl"
          >
            <h3 className="font-semibold mb-2 text-lg text-white" style={{ fontFamily: 'var(--font-heading)' }}>{consultationCta.title}</h3>
            <p className="text-sm leading-relaxed mb-4 text-[#C9D2E3]">{consultationCta.desc}</p>
            <span className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-[#FFB088]">
              Get A Quote →
            </span>
          </Link>
        </div>
      </section>

      {/* Promo banner strip */}
      <section className="relative overflow-hidden">
        <div className="relative h-64">
          <Image src="/project-renovation-during.jpg" alt="Renovation in progress" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#1B2A4A]/85" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Free consultation, no obligation.
              </h3>
              <p className="text-[#C9D2E3] mt-2">Register your project and we&apos;ll walk you through it personally.</p>
            </div>
            <Link href="/register" className="bg-[#E1601F] text-white font-medium rounded px-7 py-3.5 hover:opacity-90 hover:shadow-xl hover:shadow-[#E1601F]/30 transition whitespace-nowrap">
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#1B2A4A] px-6 py-24 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">OUR PROCESS</p>
            <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Our Approach to Every Build</h2>
            <p className="mt-3 text-[#C9D2E3] text-sm leading-relaxed">
              A clear, structured process so every renovation, extension and new build is delivered with precision from first conversation to final handover.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                <div className="text-[#E1601F] text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{p.step}</div>
                <h3 className="font-semibold mb-2 text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</h3>
                <p className="text-sm text-[#C9D2E3] leading-relaxed">{p.desc}</p>
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-4 -right-4 w-8 h-px bg-[#E1601F]/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why-us" className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">WHY CHOOSE US</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1B2A4A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Projects Built On Quality, Trust &amp; Clear Communication
          </h2>
          <p className="text-[#5A5E66] leading-relaxed mb-6">
            From bathrooms and kitchens to full renovations and new homes, we focus on transparency, reliability, and a build experience that feels organised and genuinely enjoyable.
          </p>
          <ul className="space-y-3 text-sm text-[#3A3F4A] font-medium">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E1601F]/15 text-[#E1601F] flex items-center justify-center text-xs">✓</span>
              Tight-knit team &amp; premium craftsmanship
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E1601F]/15 text-[#E1601F] flex items-center justify-center text-xs">✓</span>
              Fast quotes with no surprise costs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E1601F]/15 text-[#E1601F] flex items-center justify-center text-xs">✓</span>
              Timely and budget-friendly delivery
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group">
            <Image src="/renovation-before.jpg" alt="Before renovation" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mt-8 group">
            <Image src="/renovation-after.jpg" alt="After renovation" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Why choose us - video slots */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">SEE US IN ACTION</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Watch How We Build
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* VIDEO SLOT 1 — replace the src below with your hosted video URL (YouTube/Vimeo embed or an .mp4 file in /public) */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-[#0F1930] flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/videoseries?list=UULF..."
              title="EBC - Why Choose Us"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {/* VIDEO SLOT 2 — replace the src below with your hosted video URL */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-[#0F1930] flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/videoseries?list=UULF..."
              title="EBC - Client Walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <p className="text-xs text-[#8A8D94] text-center mt-4">
          Video placeholders — swap the iframe src for a real YouTube/Vimeo link from your channel when ready.
        </p>
      </section>

      {/* Projects - full 6 item grid */}
      <section id="our-work" className="bg-[#F6F5F1] border-y border-[#EAE7E0] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">OUR PROJECTS</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>See the Projects We&apos;ve Built</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <div key={i} className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                <Image src={p.img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[#FFB088] text-xs font-semibold mb-1">{p.category}</p>
                  <p className="text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">OUR REVIEWS</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="border border-[#EAE7E0] rounded-xl p-8 hover:shadow-lg transition-shadow bg-white relative">
              <div className="text-5xl text-[#E1601F]/20 font-serif leading-none mb-2">&ldquo;</div>
              <p className="text-[#3A3F4A] leading-relaxed -mt-4">{r.quote}</p>
              <p className="mt-4 text-sm font-semibold text-[#1B2A4A]">{r.name} — {r.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog teaser */}
      <section className="bg-[#F6F5F1] border-y border-[#EAE7E0] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">OUR BLOG</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Insights &amp; Expert Advice</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.title} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="relative w-full h-44 overflow-hidden">
                  <Image src={post.img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-[#8A8D94] mb-2">{post.date}</p>
                  <h3 className="font-semibold text-[#1B2A4A] mb-2 leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h3>
                  <p className="text-sm text-[#5A5E66] leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8A8D94] text-center mt-6">
            New articles are on the way — check back soon.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-6 py-16 text-center">
        <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">A BUILDER YOU CAN TRUST</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1B2A4A] mb-7" style={{ fontFamily: 'var(--font-heading)' }}>Fully Licensed And Insured</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <a href="https://www.mbav.com.au/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 border border-[#D9D6CD] rounded-lg px-6 py-4 bg-white shadow-sm hover:border-[#E1601F] transition-colors">
            <Image src="/mbav-logo.png" alt="Master Builders Victoria" width={230} height={120} className="h-10 w-auto" />
            <span className="text-sm text-[#1B2A4A] font-semibold">Master Builders Victoria</span>
          </a>
          <a href="https://www.bpc.vic.gov.au/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 border border-[#D9D6CD] rounded-lg px-6 py-4 bg-white shadow-sm hover:border-[#E1601F] transition-colors">
            <Image src="/bpc-logo.png" alt="Building and Plumbing Commission" width={211} height={120} className="h-10 w-auto" />
            <span className="text-sm text-[#1B2A4A] font-semibold">Building and Plumbing Commission</span>
          </a>
        </div>
      </section>

      {/* Final CTA banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-80">
          <Image src="/renovation-after.jpg" alt="Completed home" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0F1930]/85" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
            <p className="text-sm font-semibold text-[#E1601F] mb-2 tracking-wide">GET IN TOUCH</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Ready to Start Your Project?</h2>
            <Link href="/register" className="inline-block mt-7 bg-[#E1601F] text-white font-medium rounded px-8 py-4 hover:opacity-90 hover:shadow-xl hover:shadow-[#E1601F]/30 hover:-translate-y-0.5 transition-all" style={{ fontFamily: 'var(--font-heading)' }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <Link href="/privacy" className="hover:text-[#E1601F] transition">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <div className="font-semibold text-[#1B2A4A] mb-3">Services</div>
            <div className="flex flex-col gap-2 text-[#5A5E66]">
              <Link href="/new-home" className="hover:text-[#E1601F] transition">New Home</Link>
              <Link href="/renovation" className="hover:text-[#E1601F] transition">Renovation</Link>
              <Link href="/extension" className="hover:text-[#E1601F] transition">Extension</Link>
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
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#EAE7E0] text-xs text-[#8A8D94]">
          © 2026 Easy Building &amp; Construction Pty Ltd.
        </div>
      </footer>
    </main>
  )
}
