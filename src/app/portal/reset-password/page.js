'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase reads the recovery token from the URL and establishes a
    // temporary session automatically — just confirm one exists before
    // letting the customer submit a new password.
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)

    if (error) {
      setError('Could not update your password. The reset link may have expired — please request a new one.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/portal'), 1500)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-sm w-full">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-14 w-auto" />
          <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            Easy Building &amp; Construction Pty Ltd
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-[#1B2A4A] text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          Set a new password
        </h1>

        {done ? (
          <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 text-center">
            <p className="text-sm text-[#2E7D4F]">Your password has been updated. Taking you to your project...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-4">
            {!ready && (
              <p className="text-xs text-[#8A8D94]">
                Verifying your reset link...
              </p>
            )}
            <input placeholder="New password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              className="border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
            <input placeholder="Confirm new password" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required
              className="border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
            {error && <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{error}</div>}
            <button type="submit" disabled={busy}
              className="bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 disabled:opacity-50">
              {busy ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
