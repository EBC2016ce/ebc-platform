'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  const email = searchParams.get('email')
  const [status, setStatus] = useState('working') // working | done | error

  useEffect(() => {
    if (!customerId || !email) { setStatus('error'); return }
    fetch(`/api/unsubscribe?customerId=${encodeURIComponent(customerId)}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((result) => setStatus(result.success ? 'done' : 'error'))
      .catch(() => setStatus('error'))
  }, [customerId, email])

  return (
    <div className="max-w-sm w-full text-center">
      {status === 'working' && <p className="text-[#5A5E66]">Updating your preferences...</p>}
      {status === 'done' && (
        <>
          <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">✓</div>
          <h1 className="mt-6 text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>You're unsubscribed</h1>
          <p className="mt-3 text-sm text-[#5A5E66]">You won't receive blog updates or marketing emails from EBC anymore. You'll still get emails directly about your own project.</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-xl font-semibold text-[#A23B2E]" style={{ fontFamily: 'var(--font-heading)' }}>Couldn't process that</h1>
          <p className="mt-3 text-sm text-[#5A5E66]">This unsubscribe link looks invalid or has expired. Please contact us directly if you'd like to be removed from our mailing list.</p>
        </>
      )}
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#F6F5F1]">
      <Link href="/" className="flex flex-col items-center mb-8">
        <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-14 w-auto" />
      </Link>
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <UnsubscribeContent />
      </Suspense>
    </main>
  )
}
