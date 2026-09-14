'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const [mode, setMode] = useState('login') // login | forgot | sent
  const [resetEmail, setResetEmail] = useState('')
  const [resetBusy, setResetBusy] = useState(false)
  const [resetError, setResetError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const supabase = createClient('staff')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)

    if (error) {
      setError('Incorrect email or password.')
    } else {
      router.push('/leads')
      router.refresh()
    }
  }

  const handleResetRequest = async (e) => {
    e.preventDefault()
    setResetBusy(true)
    setResetError('')
    const supabase = createClient('staff')

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/login/reset-password`,
    })

    setResetBusy(false)

    if (error) {
      setResetError('Could not send the reset email. Please try again.')
    } else {
      setMode('sent')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#F6F5F1]">
      <div className="max-w-sm w-full">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-14 w-auto" priority />
          <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Easy Building &amp; Construction Pty Ltd.
          </span>
          <span className="mt-1 text-[11px] font-semibold tracking-wider text-[#8A8D94]">
            STAFF PORTAL
          </span>
        </div>

        {mode === 'login' && (
          <>
            <h1 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Admin Login
            </h1>
            <form onSubmit={handleLogin} className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Email</label>
                <input id="email" placeholder="you@easybcon.com.au" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4A4E56] mb-1.5">Password</label>
                <input id="password" placeholder="Password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              </div>
              {error && <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{error}</div>}
              <button type="submit" disabled={busy}
                className="bg-[#0068D8] text-white font-medium rounded py-2.5 hover:bg-[#0050B0] disabled:opacity-50 transition"
                style={{ fontFamily: 'var(--font-heading)' }}>
                {busy ? 'Logging in...' : 'Log In'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setResetEmail(email); setResetError('') }}
                className="text-sm text-[#1B2A4A] underline decoration-[#1B2A4A]/40 hover:decoration-[#1B2A4A] text-center"
              >
                Forgot your password?
              </button>
            </form>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <h1 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-[#5A5E66] text-center">
              Enter your email and we&apos;ll send you a link to set a new password.
            </p>
            <form onSubmit={handleResetRequest} className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-4">
              <input placeholder="Email" type="email" value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)} required
                className="border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
              {resetError && <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{resetError}</div>}
              <button type="submit" disabled={resetBusy}
                className="bg-[#0068D8] text-white font-medium rounded py-2.5 hover:bg-[#0050B0] disabled:opacity-50 transition">
                {resetBusy ? 'Sending...' : 'Send reset link'}
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-[#1B2A4A] underline decoration-[#1B2A4A]/40 hover:decoration-[#1B2A4A] text-center"
              >
                Back to log in
              </button>
            </form>
          </>
        )}

        {mode === 'sent' && (
          <>
            <h1 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Check your email
            </h1>
            <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 text-center">
              <p className="text-sm text-[#5A5E66]">
                If a staff account exists for <strong>{resetEmail}</strong>, we&apos;ve sent a link to reset your password.
              </p>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="mt-5 text-sm text-[#1B2A4A] underline decoration-[#1B2A4A]/40 hover:decoration-[#1B2A4A]"
              >
                Back to log in
              </button>
            </div>
          </>
        )}

        <div className="text-center mt-5">
          <Link href="/" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to home</Link>
        </div>
      </div>
    </main>
  )
}
