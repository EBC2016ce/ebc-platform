import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="bg-[#1B2A4A] text-white px-6 py-20 text-center">
        <Image src="/logo.png" alt="EBC logo" width={72} height={72} className="mx-auto" />
        <h1 className="mt-6 text-3xl md:text-5xl font-semibold max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd.
        </h1>
        <p className="mt-4 text-[#C9D2E3] max-w-xl mx-auto text-lg">
          New homes, renovations, and everything in between — built properly, from first conversation to final handover.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="bg-[#E1601F] text-white font-medium rounded px-6 py-3 hover:opacity-90 transition" style={{ fontFamily: 'var(--font-heading)' }}>
            Register Your Project
          </Link>
          <Link href="/bathroom-renovation" className="bg-transparent border border-white text-white font-medium rounded px-6 py-3 hover:bg-white hover:text-[#1B2A4A] transition" style={{ fontFamily: 'var(--font-heading)' }}>
            Bathroom Renovations
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          See the transformation
        </h2>
        <p className="text-center text-[#5A5E66] mt-2">A real kitchen renovation, start to finish.</p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div>
            <div className="relative w-full h-64 rounded-md overflow-hidden">
              <Image src="/before-1.jpg" alt="Before renovation" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-[#5A5E66] mt-2 font-medium">Before</p>
          </div>
          <div>
            <div className="relative w-full h-64 rounded-md overflow-hidden">
              <Image src="/during-1.jpg" alt="During renovation" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-[#5A5E66] mt-2 font-medium">During</p>
          </div>
          <div>
            <div className="relative w-full h-64 rounded-md overflow-hidden">
              <Image src="/after-1.jpg" alt="After renovation" fill className="object-cover" />
            </div>
            <p className="text-center text-sm text-[#5A5E66] mt-2 font-medium">After</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F5F1] px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Our work
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="relative w-full h-72 rounded-md overflow-hidden">
              <Image src="/project2-after.jpg" alt="Completed kitchen renovation" fill className="object-cover" />
            </div>
            <div className="relative w-full h-72 rounded-md overflow-hidden">
              <Image src="/project2-during.jpg" alt="Kitchen renovation in progress" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          What we build
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 text-center">
          {['New Homes', 'Kitchen Renovations', 'Bathroom Renovations', 'Full Renovations'].map((service) => (
            <div key={service} className="bg-white border border-[#D9D6CD] rounded-md p-6">
              <p className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{service}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1B2A4A] text-white px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Ready to start your project?
        </h2>
        <p className="mt-2 text-[#C9D2E3]">Register your details and we'll be in touch personally.</p>
        <Link href="/register" className="inline-block mt-6 bg-[#E1601F] text-white font-medium rounded px-6 py-3 hover:opacity-90 transition" style={{ fontFamily: 'var(--font-heading)' }}>
          Get Started
        </Link>
      </section>
    </main>
  )
}
