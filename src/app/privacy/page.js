import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Easy Building & Construction collects, uses and protects your personal information.',
  alternates: { canonical: '/privacy' },
}

export default function Privacy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-[#171A1F]">
      <Link href="/" className="flex items-center gap-3 mb-8 w-fit">
        <Image src="/logo-icon.png" alt="Easy Building & Construction logo" width={202} height={100} className="h-12 w-auto" />
        <span className="text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd.
        </span>
      </Link>
      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Privacy Policy
      </h1>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-[#333]">
        <p>
          When you register your project with us, we collect your name, email address,
          mobile number, project address, and the type of project you&apos;re planning.
          We use this information to contact you about your project, provide quotes,
          and manage our relationship with you as a customer.
        </p>
        <p>
          We do not sell or share your personal information with third parties for
          marketing purposes. Your details are stored securely and are only accessed
          by our staff for the purpose of following up on your enquiry.
        </p>
        <p>
          Our website uses cookies and similar technologies, including Google Analytics
          and the Meta (Facebook) Pixel, to understand how visitors use the site and to
          measure the effectiveness of our advertising. These tools collect information
          such as the pages you view, the links you click, and technical details about
          your device and browser. You can limit this through your browser settings or
          by opting out of personalised advertising in your Google and Meta account settings.
        </p>
        <p>
          You can ask us to access, correct, or delete your personal information at
          any time by contacting us directly.
        </p>
        <p>
          This policy may be updated from time to time. Last updated: 20 September 2026.
        </p>
      </div>
      <div className="mt-10">
        <Link href="/" className="text-sm font-semibold text-[#1B2A4A] hover:text-[#E1601F] transition">← Back to home</Link>
      </div>
    </main>
  )
}
