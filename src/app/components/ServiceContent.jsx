import Link from 'next/link'
import JsonLd from './JsonLd'
import { serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/site'

// Search-friendly content shown under the enquiry form on each service page.
// Server component: everything here is in the HTML Google first receives.
// Copy lives in src/lib/serviceContent.js.
export default function ServiceContent({ content, description }) {
  const { path, serviceName, serviceType, heading, intro, servicesHeading, services, stepsHeading, steps, costHeading, costIntro, costFactors, faqsHeading, faqs, related } = content

  return (
    <>
      <JsonLd data={serviceSchema({ path, name: serviceName, serviceType, description })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: serviceName, path }])} />

      {/* About the service */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16 border-t border-[#EAE7E0]">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{heading}</h2>
        <div className="mt-4 space-y-4 text-[#3A3F4A] leading-relaxed">
          {intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <h3 className="mt-10 text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{servicesHeading}</h3>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.title} className="border border-[#EAE7E0] rounded-xl p-5 bg-white">
              <h4 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{s.title}</h4>
              <p className="mt-1.5 text-sm text-[#5A5E66] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mid-page call to action */}
      <section className="bg-[#1B2A4A] px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div>
            <p className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Free consultation, no obligation.</p>
            <p className="text-sm text-[#C9D2E3] mt-1">Register your project and we&apos;ll walk you through it personally.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#quote" data-cta="service-mid-quote" className="bg-[#8FC2FF] text-[#0F1930] font-semibold rounded-md px-7 py-3 whitespace-nowrap">
              Get a Free Quote
            </a>
            <a href="tel:1300715840" className="text-white font-semibold underline whitespace-nowrap">or call 1300 715 840</a>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h3 className="text-xl md:text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{stepsHeading}</h3>
        <ol className="mt-6 grid sm:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="text-[#E1601F] text-2xl font-semibold shrink-0" style={{ fontFamily: 'var(--font-heading)' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{s.title}</h4>
                <p className="mt-1 text-sm text-[#5A5E66] leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Cost factors */}
      <section className="bg-[#F6F5F1] border-y border-[#EAE7E0] px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{costHeading}</h3>
          <p className="mt-3 text-[#3A3F4A] leading-relaxed">{costIntro}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-[#3A3F4A]">
            {costFactors.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="w-5 h-5 shrink-0 rounded-full bg-[#E1601F]/15 text-[#E1601F] flex items-center justify-center text-xs mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs - native <details> so the answers are in the HTML and work without JavaScript */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h3 className="text-xl md:text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{faqsHeading}</h3>
        <div className="mt-6 divide-y divide-[#EAE7E0] border border-[#EAE7E0] rounded-xl bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-[#1B2A4A]">
                {f.q}
                <span className="text-[#E1601F] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#3A3F4A] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="#quote" data-cta="service-faq-quote" className="inline-block bg-[#0068D8] text-white font-medium rounded px-8 py-3 hover:bg-[#0050B0] transition">
            Still have questions? Get a free quote
          </a>
        </div>
      </section>

      {/* Internal links: helps visitors and passes relevance between our key pages */}
      <section className="max-w-4xl mx-auto px-6 pb-12 md:pb-16">
        <h3 className="text-lg font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Related</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {related.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="text-[#1B2A4A] underline hover:text-[#E1601F] transition">{r.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
