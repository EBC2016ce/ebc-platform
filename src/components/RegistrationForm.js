'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'
import { saveUtmFromUrl, getStoredUtm } from '@/lib/utm'
import AddressAutocomplete from './AddressAutocomplete'

const CATEGORIES = {
  'Renovation': ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation'],
  'New Building': ['New home'],
  'Extension': ['Extension'],
}

export default function RegistrationForm({ lockedCategory, title, subtitle, hideLogo }) {
  const initialCategory = lockedCategory || ''
  const initialOptions = lockedCategory ? CATEGORIES[lockedCategory] : []
  const initialType = initialOptions.length === 1 ? initialOptions[0] : ''

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '', address: '',
    category: initialCategory, projectType: initialType, consent: false, password: ''
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [customerId, setCustomerId] = useState(null)
  const [code, setCode] = useState('')
  const [verifyBusy, setVerifyBusy] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [resendStatus, setResendStatus] = useState('idle') // idle | sending | sent
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    saveUtmFromUrl()
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const field = (key, value) => setForm({ ...form, [key]: value })

  const setCategory = (category) => {
    const options = CATEGORIES[category] || []
    setForm({ ...form, category, projectType: options.length === 1 ? options[0] : '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    setErrorMessage('')

    try {
      const utm = getStoredUtm()
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...utm }),
      })
      const result = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(result.error || 'Unknown error')
      } else {
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead')
        }
        setCustomerId(result.customerId)
        setStatus('verifying')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Could not reach the server: ' + err.message)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setVerifyBusy(true)
    setVerifyError('')

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, code }),
      })
      const result = await res.json()

      if (!res.ok) {
        setVerifyError(result.error || 'Unknown error')
      } else {
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'CompleteRegistration')
        }
        const supabase = createClient()
        await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        window.location.href = '/design?customerId=' + customerId + '&projectType=' + encodeURIComponent(form.projectType)
      }
    } catch (err) {
      setVerifyError('Could not reach the server: ' + err.message)
    }
    setVerifyBusy(false)
  }

  const handleResend = async () => {
    setResendStatus('sending')
    setVerifyError('')
    try {
      const res = await fetch('/api/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      })
      const result = await res.json()

      if (!res.ok) {
        setVerifyError(result.error || 'Could not resend the code.')
        setResendStatus('idle')
      } else {
        setResendStatus('sent')
        setResendCooldown(30)
      }
    } catch (err) {
      setVerifyError('Could not reach the server: ' + err.message)
      setResendStatus('idle')
    }
  }

  if (status === 'verifying') {
    return (
      <div className="max-w-md w-full">
        {!hideLogo && (
          <div className="flex flex-col items-center text-center mb-8">
            <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
            <span className="mt-3 text-xl font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
              Easy Building &amp; Construction Pty Ltd
            </span>
          </div>
        )}

        <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Check your email
        </h1>
        <p className="mt-2 text-sm text-[#5A5E66]">
          We've sent a 6-digit code to {form.email}. Enter it below to confirm your details.
        </p>

        <form onSubmit={handleVerify} className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-5">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Verification code</label>
            <input id="code" value={code} onChange={(e) => setCode(e.target.value)}
              required placeholder="123456" maxLength={6}
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          </div>

          <div className="text-center -mt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendStatus === 'sending' || resendCooldown > 0}
              className="text-sm font-medium text-[#1B2A4A] underline decoration-[#1B2A4A]/40 hover:decoration-[#1B2A4A] disabled:opacity-50 disabled:no-underline transition"
            >
              {resendCooldown > 0
                ? `Resend code (${resendCooldown}s)`
                : resendStatus === 'sending'
                ? 'Sending...'
                : "Didn't receive a code? Resend code"}
            </button>
            {resendStatus === 'sent' && (
              <p className="mt-1.5 text-xs text-[#2E7D4F]">A new code has been sent to {form.email}.</p>
            )}
          </div>

          {verifyError && (
            <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
              {verifyError}
            </div>
          )}

          <button type="submit" disabled={verifyBusy}
            className="w-full bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 disabled:opacity-50 transition"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {verifyBusy ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-md w-full">
      {!hideLogo && (
        <div className="flex flex-col items-center text-center mb-10">
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
          <span className="mt-3 text-xl font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Easy Building &amp; Construction Pty Ltd
          </span>
          <span className="mt-1 text-[11px] font-semibold tracking-wider text-[#8A8D94]">
            REGISTERED BUILDING PRACTITIONERS
          </span>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        {title || 'Register your project'}
      </h1>
      <p className="mt-2 text-sm text-[#5A5E66]">
        {subtitle || "Takes about a minute. We'll follow up personally once you submit."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[#4A4E56] mb-1.5">First name</label>
            <input id="firstName" value={form.firstName} onChange={(e) => field('firstName', e.target.value)}
              required placeholder="Jordan"
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Last name</label>
            <input id="lastName" value={form.lastName} onChange={(e) => field('lastName', e.target.value)}
              required placeholder="Smith"
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => field('email', e.target.value)}
            required placeholder="you@email.com"
            className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Mobile</label>
          <input id="mobile" value={form.mobile} onChange={(e) => field('mobile', e.target.value)}
            required placeholder="04xx xxx xxx"
            className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
        </div>

                <div>
          <label htmlFor="address" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Project address</label>
          <AddressAutocomplete value={form.address} onChange={(v) => field('address', v)} required />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Create a password</label>
          <input id="password" type="password" value={form.password} onChange={(e) => field('password', e.target.value)}
            required minLength={8} placeholder="At least 8 characters"
            className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
        </div>

        {!lockedCategory && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#4A4E56] mb-1.5">What are you planning?</label>
            <select id="category" value={form.category} onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
              <option value="">Select...</option>
              {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {form.category && CATEGORIES[form.category].length > 1 && (
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Which type?</label>
            <select id="projectType" value={form.projectType} onChange={(e) => field('projectType', e.target.value)}
              required
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
              <option value="">Select...</option>
              {CATEGORIES[form.category].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        <label className="flex items-start gap-2 text-sm text-[#5A5E66]">
          <input type="checkbox" checked={form.consent}
            onChange={(e) => field('consent', e.target.checked)} required
            className="mt-1" />
          <span>
            I agree to EBC collecting and using my details as described in the{' '}
            <a href="/privacy" target="_blank" className="text-[#1B2A4A] underline">Privacy Policy</a>.
          </span>
        </label>

        {status === 'error' && (
          <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
            Something went wrong: {errorMessage}
          </div>
        )}

        <button type="submit" disabled={status === 'saving' || !form.projectType}
          className="w-full bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 disabled:opacity-50 transition"
          style={{ fontFamily: 'var(--font-heading)' }}>
          {status === 'saving' ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
