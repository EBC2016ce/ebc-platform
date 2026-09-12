'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

function BookPageContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')

  const [days, setDays] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => setDays(data.days || []))
  }, [])

  const confirmBooking = async () => {
    setStatus('booking')
    setErrorMessage('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          bookingDate: selectedDay.dateKey,
          bookingTime: selectedTime,
          appointmentType: 'Initial Consultation',
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMessage(result.error)
      } else {
        setStatus('success')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Could not reach the server: ' + err.message)
    }
  }

  if (!customerId) {
    return <p className="text-[#A23B2E]">Missing customer reference. Please use the link from your verification email.</p>
  }

  if (status === 'success') {
    return (
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">OK</div>
        <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          You&apos;re booked in
        </h1>
        <p className="mt-3 text-[#5A5E66]">
          {selectedDay.dateLabel} at {selectedTime}. We&apos;ll see you then - a confirmation has been noted on your file.
        </p>
      </div>
    )
  }

  if (!days) {
    return <p className="text-[#5A5E66]">Loading available times...</p>
  }

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Book your consultation
      </h1>
      <p className="mt-2 text-sm text-[#5A5E66]">Pick a day and time that works for you.</p>

      <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6">
        <label className="block text-sm font-medium text-[#4A4E56] mb-2">Day</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => (
            <button
              key={d.dateKey}
              onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
              className={`px-4 py-2 rounded border text-sm whitespace-nowrap ${
                selectedDay?.dateKey === d.dateKey
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-[#333] border-[#D9D6CD]'
              }`}
            >
              {d.dateLabel}
            </button>
          ))}
        </div>

        {selectedDay && (
          <>
            <label className="block text-sm font-medium text-[#4A4E56] mt-6 mb-2">Time</label>
            <div className="flex gap-2 flex-wrap">
              {selectedDay.slots.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded border text-sm ${
                    selectedTime === t
                      ? 'bg-[#E1601F] text-white border-[#E1601F]'
                      : 'bg-white text-[#333] border-[#D9D6CD]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <div className="mt-4 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
            {errorMessage}
          </div>
        )}

        <button
          onClick={confirmBooking}
          disabled={!selectedDay || !selectedTime || status === 'booking'}
          className="w-full mt-6 bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 disabled:opacity-50 transition"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {status === 'booking' ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
        <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd
        </span>
      </div>
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <BookPageContent />
      </Suspense>
    </main>
  )
}
