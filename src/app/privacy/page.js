import Image from 'next/image'

export default function Privacy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-[#171A1F]">
      <div className="flex items-center gap-3 mb-8">
        <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-12 w-auto" />
        <span className="text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd
        </span>
      </div>
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
          You can ask us to access, correct, or delete your personal information at
          any time by contacting us directly.
        </p>
        <p>
          This policy may be updated from time to time. Last updated: 12 September 2026.
        </p>
      </div>
    </main>
  )
}
