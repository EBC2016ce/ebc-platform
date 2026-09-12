'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-browser'

export default function PortalLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Incorrect email or password.')
    } else {
      router.push('/portal')
      router.refresh()
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
          Log in to your project
        </h1>
        <form onSubmit={handleLogin} className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-4">
          <input placeholder="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          <input placeholder="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
          {error && <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{error}</div>}
          <button type="submit" className="bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90">
            Log In
          </button>
        </form>
      </div>
    </main>
  )
}
