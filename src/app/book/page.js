'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function BookPageContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1) // 1-indexed
  const [calendar, setCalendar] = useState(null)
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1

  useEffect(() => {
    setCalendarLoading(true)
    setSelectedDay(null)
    setSelectedTime(null)
    fetch(`/api/availability?year=${viewYear}&month=${viewMonth}`)
      .then((res) => res.json())
      .then((data) => {
        setCalendar(data)
        setCalendarLoading(false)
      })
  }, [viewYear, viewMonth])

  const goToMonth = (delta) => {
    let m = viewMonth + delta
    let y = viewYear
    if (m > 12) { m = 1; y += 1 }
    if (m < 1) { m = 12; y -= 1 }
    setViewYear(y)
    setViewMonth(m)
  }

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
    const dateLabel = new Date(selectedDay.dateKey).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })
    return (
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">✓</div>
        <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          You&apos;re booked in
        </h1>
        <p className="mt-3 text-[#5A5E66]">
          {dateLabel} at {selectedTime}. We&apos;ll see you then — a confirmation email and SMS have been sent to you.
        </p>
        <div className="mt-6 bg-[#FFF6F0] border border-[#E1601F]/30 rounded-md p-4 text-sm text-[#5A5E66] text-left">
          Need to change this? Just reply to your confirmation email or call us at least <strong className="text-[#1B2A4A]">24 hours</strong> before your appointment and we&apos;ll happily reschedule.
        </div>
      </div>
    )
  }

  const days = calendar?.days || []
  const leadingBlanks = Array.from({ length: calendar?.firstDayOfWeek ?? 0 })

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Book your consultation
      </h1>
      <p className="mt-2 text-sm text-[#5A5E66]">Pick a day and time that works for you.</p>

      <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => goToMonth(-1)} disabled={isCurrentMonth}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#D9D6CD] text-[#1B2A4A] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#E1601F] transition">
            ‹
          </button>
          <p className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
            {calendar?.monthLabel || ''}
          </p>
          <button type="button" onClick={() => goToMonth(1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#D9D6CD] text-[#1B2A4A] hover:border-[#E1601F] transition">
            ›
          </button>
        </div>

        {calendarLoading ? (
          <p className="text-sm text-[#5A5E66] py-8 text-center">Loading availability...</p>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#8A8D94] mb-1">
              {DAY_LABELS.map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {leadingBlanks.map((_, i) => <div key={'b' + i} />)}
              {days.map((d) => {
                const isSelected = selectedDay?.dateKey === d.dateKey
                return (
                  <button
                    key={d.dateKey}
                    type="button"
                    disabled={!d.available}
                    onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                    className={`aspect-square rounded text-sm flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-[#1B2A4A] text-white font-semibold'
                        : d.available
                        ? 'bg-[#FFF6F0] text-[#1B2A4A] font-medium hover:bg-[#E1601F] hover:text-white'
                        : 'text-[#C9CBD1] cursor-not-allowed'
                    }`}
                  >
                    {d.day}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#8A8D94]">
              <span className="w-3 h-3 rounded-sm bg-[#FFF6F0] inline-block border border-[#E1601F]/30" /> Available
              <span className="w-3 h-3 rounded-sm bg-[#1B2A4A] inline-block ml-3" /> Selected
            </div>
          </>
        )}

        {selectedDay && (
          <>
            <label className="block text-sm font-medium text-[#4A4E56] mt-6 mb-2">
              Time on {new Date(selectedDay.dateKey).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })}
            </label>
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
          className="w-full mt-6 bg-[#0068D8] text-white font-medium rounded py-2.5 hover:bg-[#0050B0] disabled:opacity-50 transition"
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
      <Link href="/" className="flex flex-col items-center mb-8">
        <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
        <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd.
        </span>
      </Link>
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <BookPageContent />
      </Suspense>
      <div className="text-center mt-8">
        <Link href="/" className="text-sm font-semibold text-[#1B2A4A] hover:text-[#E1601F] transition">← Back to home</Link>
      </div>
    </main>
  )
}
