'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { saveUtmFromUrl, getStoredUtm } from '@/lib/utm'

export default function BathroomRenovationLanding() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '', address: '', consent: false
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    saveUtmFromUrl()
  }, [])

  const field = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    setErrorMessage('')

    try {
      const utm = getStoredUtm()
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectType: 'Bathroom renovation', ...utm }),
      })
      const result = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(result.error || 'Unknown error')
      } else {
        setStatus('success')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Could not reach the server: ' + err.message)
    }
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">✓</div>
          <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Thanks, {form.firstName}
          </h1>
          <p className="mt-3 text-[#5A5E66]">
            We've received your details and will be in touch shortly to talk through your bathroom renovation.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#1B2A4A] text-white px-6 py-16 text-center">
        <Image src="/logo.png" alt="EBC logo" width={60} height={60} className="mx-auto" />
        <h1 className="mt-6 text-3xl md:text-4xl font-semibold max-w-2xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Thinking About Renovating Your Bathroom?
        </h1>
        <p className="mt-4 text-[#C9D2E3] max-w-xl mx-auto">
          Tell us about your project and get expert guidance from Easy Building &amp; Construction — no obligation, just a real conversation about what's possible.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-[#E1601F] font-semibold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Experienced</div>
          <p className="text-sm text-[#5A5E66] mt-2">Trusted bathroom renovation specialists across Victoria.</p>
        </div>
        <div>
          <div className="text-[#E1601F] font-semibold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Clear process</div>
          <p className="text-sm text-[#5A5E66] mt-2">From first chat to finished bathroom, you'll know what's happening every step.</p>
        </div>
        <div>
          <div className="text-[#E1601F] font-semibold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>No pressure</div>
          <p className="text-sm text-[#5A5E66] mt-2">Register your details and we'll reach out to talk through your project — that's it.</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 pb-16">
        <form onSubmit={handleSubmit} className="bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-5 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Get started
          </h2>

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
            <label htmlFor="address" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Suburb</label>
            <input id="address" value={form.address} onChange={(e) => field('address', e.target.value)}
              required placeholder="e.g. The Basin VIC"
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          </div>

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

          <button type="submit" disabled={status === 'saving'}
            className="w-full bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 disabled:opacity-50 transition"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {status === 'saving' ? 'Submitting...' : 'Get My Free Consultation'}
          </button>
        </form>
      </div>
    </main>
  )
}
