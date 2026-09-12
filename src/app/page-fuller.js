import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#17130F]">
      {/* Hero */}
      <section className="bg-[#17130F] text-white px-6 py-20 text-center border-b border-[#2E2620]">
        <Image src="/logo.png" alt="EBC logo" width={72} height={72} className="mx-auto" />
        <h1 className="mt-6 text-3xl md:text-5xl font-semibold max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd.
        </h1>
        <p className="mt-4 text-[#C9BFB2] max-w-xl mx-auto text-lg">
          New homes, renovations, and everything in between — built properly, from first conversation to final handover.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="bg-[#C1622D] text-white font-medium rounded px-6 py-3 hover:opacity-90 transition" style={{ fontFamily: 'var(--font-heading)' }}>
            Register Your Project
          </Link>
          <Link href="/bathroom-renovation" className="bg-transparent border border-[#4A3B2E] text-white font-medium rounded px-6 py-3 hover:bg-white hover:text-[#17130F] transition" style={{ fontFamily: 'var(--font-heading)' }}>
            Bathroom Renovations
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#1F1912] border-b border-[#2E2620] px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[#C9BFB2] font-medium">
          <span>Master Builders Victoria member</span>
          <span className="text-[#4A3B2E]">•</span>
          <span>Registered Building Practitioner</span>
          <span className="text-[#4A3B2E]">•</span>
          <span>Eastern Melbourne builders</span>
        </div>
      </section>

      {/* Three-path picker */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-[#C1622D] text-sm font-semibold mb-2">What are you planning?</div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Every project starts the same way
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Link href="/new-home" className="group relative h-72 rounded-md overflow-hidden flex items-end bg-gradient-to-br from-[#2A241C] to-[#17130F] border border-[#2E2620]">
            <div className="relative z-10 p-6 text-white">
              <span className="block text-xs font-semibold text-[#9A8F81] mb-1.5">NEW HOME</span>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Building from the ground up</h3>
              <span className="text-sm font-semibold text-[#C1622D] group-hover:text-white transition">Get started →</span>
            </div>
          </Link>
          <Link href="/renovation" className="group relative h-72 rounded-md overflow-hidden flex items-end border border-[#2E2620]">
            <Image src="/project2-after.jpg" alt="Renovation project" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
            <div className="relative z-10 p-6 text-white">
              <span className="block text-xs font-semibold text-white/70 mb-1.5">RENOVATION</span>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Kitchens, bathrooms &amp; more</h3>
              <span className="text-sm font-semibold text-[#C1622D] group-hover:text-white transition">Get started →</span>
            </div>
          </Link>
          <Link href="/extension" className="group relative h-72 rounded-md overflow-hidden flex items-end bg-gradient-to-br from-[#2A241C] to-[#17130F] border border-[#2E2620]">
            <div className="relative z-10 p-6 text-white">
              <span className="block text-xs font-semibold text-[#9A8F81] mb-1.5">EXTENSION</span>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>More room to grow into</h3>
              <span className="text-sm font-semibold text-[#C1622D] group-hover:text-white transition">Get started →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* See the transformation */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-white text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          See the transformation
        </h2>
        <p className="text-center text-[#9A8F81] mt-2">A real kitchen renovation, start to finish.</p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div>
            <div className="relative w-full h-64 rounded-md overflow-hidden border border-[#2E2620]">
              <Image src="/before-1.jpg" alt="Before renovation" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-[#9A8F81] mt-2 font-medium">Before</p>
          </div>
          <div>
            <div className="relative w-full h-64 rounded-md overflow-hidden border border-[#2E2620]">
              <Image src="/during-1.jpg" alt="During renovation" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-[#9A8F81] mt-2 font-medium">During</p>
          </div>
          <div>
            <div className="relative w-full h-64 rounded-md overflow-hidden border border-[#2E2620]">
              <Image src="/after-1.jpg" alt="After renovation" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-[#9A8F81] mt-2 font-medium">After</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#1F1912] border-y border-[#2E2620] px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            How it works
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {[
              { step: '01', title: 'Register', desc: 'Tell us about your project — takes about a minute.' },
              { step: '02', title: 'Design', desc: 'Work through our Home Design Tool at your own pace.' },
              { step: '03', title: 'Consult', desc: 'Book time with a team member who already knows your project.' },
              { step: '04', title: 'Build', desc: 'Track progress from first site work to handover.' },
            ].map((item) => (
              <div key={item.step}>
                <div className="text-[#C1622D] text-sm font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{item.step}</div>
                <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                <p className="text-sm text-[#9A8F81] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our work */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Our work
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="relative w-full h-72 rounded-md overflow-hidden border border-[#2E2620]">
              <Image src="/project2-after.jpg" alt="Completed kitchen renovation" fill className="object-cover" />
            </div>
            <div className="relative w-full h-72 rounded-md overflow-hidden border border-[#2E2620]">
              <Image src="/project2-during.jpg" alt="Kitchen renovation in progress" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-white text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          What we build
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 text-center">
          {['New Homes', 'Kitchen Renovations', 'Bathroom Renovations', 'Full Renovations'].map((service) => (
            <div key={service} className="bg-[#1F1912] border border-[#3A2E24] rounded-md p-6">
              <p className="font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{service}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#1F1912] border-y border-[#2E2620] px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center mb-10" style={{ fontFamily: 'var(--font-heading)' }}>
            What our clients say
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-[#E3D3C4] text-lg leading-relaxed">
                &ldquo;EBC was fantastic. They made sure we were happy and were responsive to feedback and changes as the job progressed.&rdquo;
              </p>
              <div className="mt-4 text-sm text-[#9A8F81] font-semibold">Scott — Croydon</div>
            </div>
            <div>
              <p className="text-[#E3D3C4] text-lg leading-relaxed">
                &ldquo;Even though our new house was a small project, it was carried out with care and a reasonable contract. Very happy with the result.&rdquo;
              </p>
              <div className="mt-4 text-sm text-[#9A8F81] font-semibold">Li — Ashwood</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#17130F] text-white px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Ready to start your project?
        </h2>
        <p className="mt-2 text-[#C9BFB2]">Register your details and we'll be in touch personally.</p>
        <Link href="/register" className="inline-block mt-6 bg-[#C1622D] text-white font-medium rounded px-6 py-3 hover:opacity-90 transition" style={{ fontFamily: 'var(--font-heading)' }}>
          Get Started
        </Link>
      </section>
    </main>
  )
}
