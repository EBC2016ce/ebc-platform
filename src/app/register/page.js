'use client'
import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

const PROJECT_TYPES = [
  'New home', 'Knockdown & rebuild', 'Kitchen renovation', 'Bathroom renovation',
  'Laundry renovation', 'Full renovation', 'Extension', 'Townhouse', 'Luxury home', 'Other',
]

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '', address: '', projectType: '', consent: false
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    setErrorMessage('')

    const { error } = await supabase.from('customers').insert([
      {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        project_type: form.projectType,
        consent_given: form.consent,
      },
    ])

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
    } else {
      setStatus('success')
    }
  }

  const field = (key, value) => setForm({ ...form, [key]: value })

  if (status === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Thanks, {form.firstName}
          </h1>
          <p className="mt-3 text-[#5A5E66]">
            We've received your details and will be in touch shortly to talk through your project.
          </p>
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
            <label htmlFor="projectType" className="block text-sm font-medium text-[#4A4E56] mb-1.5">What are you planning?</label>
            <select id="projectType" value={form.projectType} onChange={(e) => field('projectType', e.target.value)}
              required
              className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
              <option value="">Select...</option>
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
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
            {status === 'saving' ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  )
}
