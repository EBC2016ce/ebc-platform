import Image from 'next/image'

export const metadata = {
  title: 'Easy Building & Construction Pty Ltd',
  description: 'Melbourne residential builder — new homes, renovations and extensions. Website refresh in progress.',
}

export default function HoldingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#F6F5F1]">
      <div className="max-w-md w-full text-center">
        <Image
          src="/logo-icon.png"
          alt="EBC logo"
          width={202}
          height={100}
          className="h-20 w-auto mx-auto"
          priority
        />
        <h1 className="mt-5 text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd
        </h1>
        <p className="mt-1 text-xs font-semibold tracking-wider text-[#8A8D94]">
          REGISTERED BUILDING PRACTITIONERS
        </p>

        <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-8">
          <h2 className="text-lg font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            We&apos;re refreshing our website
          </h2>
          <p className="mt-3 text-sm text-[#5A5E66] leading-relaxed">
            Thanks for visiting. Our site is being updated — for new home builds,
            renovations or extensions, please get in touch directly and our team
            will be happy to help.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="tel:1300715840"
              className="w-full bg-[#1B2A4A] text-white font-medium rounded py-2.5 hover:opacity-90 transition"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Call 1300 715 840
            </a>
            <a
              href="mailto:info@easybcon.com.au"
              className="w-full border border-[#D9D6CD] text-[#1B2A4A] font-medium rounded py-2.5 hover:bg-[#F6F5F1] transition"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              info@easybcon.com.au
            </a>
            <a
              href="https://ebc33.com.au/register"
              className="w-full bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 transition"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Register Your Project
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-[#8A8D94]">
          Melbourne, Victoria
        </p>
      </div>
    </main>
  )
}