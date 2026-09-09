'use client'
import { useState } from 'react'
import Image from 'next/image'

const CATEGORIES = {
  'Renovation': ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation'],
  'New Building': ['Knockdown & rebuild', 'Vacant land'],
  'Extension': ['Extension'],
}

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '', address: '', category: '', projectType: '', consent: false, password: ''
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [customerId, setCustomerId] = useState(null)
  const [code, setCode] = useState('')
  const [verifyBusy, setVerifyBusy] = useState(false)
  const [verifyError, setVerifyError] = useState('')

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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(result.error || 'Unknown error')
      } else {
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
        window.location.href = '/design?customerId=' + customerId + '&projectType=' + encodeURIComponent(form.projectType)
      }
    } catch (err) {
      setVerifyError('Could not reach the server: ' + err.message)
    }
    setVerifyBusy(false)
  }

  if (status === 'verifying') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full">
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
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="flex flex-col items-center text-center mb-10">
        <Image src="/logo.png" alt="EBC logo" width={72} height={72} />
        <span className="mt-4 text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd.
        </span>
      </div>

      <div className="max-w-md w-full">
        <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Register your project
        </h1>
        <p className="mt-2 text-sm text-[#5A5E66]">
          Takes about a minute. We'll follow up personally once you submit.
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
            <input id="address" value={form.address} onChange={(e) => field('address', e.target.value)}
              required placeholder="20 Stuart Street, The Basin VIC 3154"
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Create a password</label>
            <input id="password" type="password" value={form.password} onChange={(e) => field('password', e.target.value)}
              required minLength={8} placeholder="At least 8 characters"
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#4A4E56] mb-1.5">What are you planning?</label>
            <select id="category" value={form.category} onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
              <option value="">Select...</option>
              {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

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
    </main>
  )
}
