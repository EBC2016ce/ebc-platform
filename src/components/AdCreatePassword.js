'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

// The one point in the /ad-consult flow where a password is actually asked
// for — right after email verification, once it's clear why: to open the
// portal. The flow never asks the visitor to invent one during the quick
// questions (see src/app/api/ad-register/route.js). Shared by both
// src/app/ad-consult/page.js (inline "activate now" path) and
// src/app/ad-consult/verify/page.js (the link from the confirmation email).
export default function AdCreatePassword({ customerId, email, projectType }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/ad-set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, password }),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Unknown error')
        setBusy(false)
        return
      }
      const supabase = createClient()
      await supabase.auth.signInWithPassword({ email, password })
      window.location.href = '/design?customerId=' + customerId + '&projectType=' + encodeURIComponent(projectType || '')
    } catch (err) {
      setError('Could not reach the server: ' + err.message)
      setBusy(false)
    }
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">✓</div>
      <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Your email is verified</h1>
      <p className="mt-3 text-[#5A5E66]">Last step — create a password so you can log back into your portal any time.</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-5 text-left flex flex-col gap-3">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
          placeholder="Create a password (8+ characters)" autoFocus
          className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
        {error && (
          <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{error}</div>
        )}
        <button type="submit" disabled={busy || password.length < 8}
          className="w-full bg-[#0068D8] text-white font-medium rounded py-2.5 hover:bg-[#0050B0] disabled:opacity-50 transition"
          style={{ fontFamily: 'var(--font-heading)' }}>
          {busy ? 'Setting up...' : 'Save & view my plan'}
        </button>
      </form>
    </div>
  )
}
