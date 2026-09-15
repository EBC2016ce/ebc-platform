'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AdCreatePassword from '@/components/AdCreatePassword'

// The landing target for the "Activate my account" button in the ad-flow
// booking confirmation email (see adConfirmationEmailHtml in
// src/lib/emailTemplates.js). Auto-verifies using the customerId + code in
// the link so there's nothing to type, then hands off to AdCreatePassword —
// this flow never asked for a password earlier (see /api/ad-register), so
// this is the first real chance to set one. If verification fails (code
// already used, expired, or something odd with the link) it falls back to
// a plain message pointing them at the portal login instead of leaving
// them stuck.
function VerifyContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  const code = searchParams.get('code')
  const [status, setStatus] = useState('checking') // checking | done | already | error
  const [errorMessage, setErrorMessage] = useState('')
  const [customerInfo, setCustomerInfo] = useState(null) // { email, projectType }

  useEffect(() => {
    if (!customerId || !code) {
      setStatus('error')
      setErrorMessage('This activation link is missing some information.')
      return
    }
    fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, code }),
    })
      .then((res) => res.json().then((result) => ({ ok: res.ok, result })))
      .then(({ ok, result }) => {
        if (!ok) {
          setStatus('error')
          setErrorMessage(result.error || 'This link may have already been used.')
        } else {
          setCustomerInfo({ email: result.email, projectType: result.projectType })
          setStatus('done')
        }
      })
      .catch((err) => {
        setStatus('error')
        setErrorMessage('Could not reach the server: ' + err.message)
      })
  }, [customerId, code])

  return (
    <div className="max-w-md w-full text-center">
      {status === 'checking' && <p className="text-[#5A5E66]">Activating your account...</p>}

      {status === 'done' && (
        <AdCreatePassword customerId={customerId} email={customerInfo?.email} projectType={customerInfo?.projectType} />
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Couldn't activate this link</h1>
          <p className="mt-3 text-[#5A5E66]">{errorMessage}</p>
          <p className="mt-3 text-sm text-[#5A5E66]">
            If you already activated your account, just <Link href="/portal/login" className="text-[#1B2A4A] underline">log in here</Link>.
            Otherwise, give us a call and we'll sort it out.
          </p>
        </>
      )}
    </div>
  )
}

export default function AdConsultVerifyPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center px-6 py-16">
      <Link href="/" className="flex flex-col items-center mb-8">
        <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
        <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd.
        </span>
      </Link>
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <VerifyContent />
      </Suspense>
    </main>
  )
}
