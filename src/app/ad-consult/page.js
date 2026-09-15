'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { saveUtmFromUrl, getStoredUtm } from '@/lib/utm'
import AdCreatePassword from '@/components/AdCreatePassword'

// A separate, ad-traffic-only version of the registration + booking flow.
// This deliberately does NOT touch src/components/RegistrationForm.js or
// src/app/renovation/page.js (the on-site form and landing page, which stay
// exactly as they are for organic/on-site visitors). This page exists
// because, after testing the ad, the feedback was: too much scrolling
// content before the form, a confusing "check your email" step mid-flow
// with no explanation of what happens next, and no way to book a time as
// part of the same visit. This flow fixes all three: a one-screen intro
// that says exactly what's about to happen, a handful of short one-question
// screens, then straight into picking a slot — with the confirmation email
// (booking + account activation) sent only once a slot is actually booked.

const STEPS = ['intro', 'contact', 'project', 'location', 'review', 'booking']
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const CATEGORIES = {
  Renovation: ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation'],
  'New Building': ['New home'],
  Extension: ['Extension'],
}
const AUSTRALIAN_STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']

function ProgressBar({ step }) {
  const idx = STEPS.indexOf(step)
  return (
    <div className="flex gap-1.5 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className={`h-1 flex-1 rounded-full ${i <= idx ? 'bg-[#1B2A4A]' : 'bg-[#E4E1D8]'}`} />
      ))}
    </div>
  )
}

function StepShell({ step, onBack, children }) {
  return (
    <div className="max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        {onBack ? (
          <button type="button" onClick={onBack} className="text-[#8A8D94] hover:text-[#1B2A4A] transition text-sm">‹ Back</button>
        ) : <span />}
        <Link href="/" className="text-xs text-[#8A8D94] hover:text-[#1B2A4A] transition">Exit</Link>
      </div>
      <ProgressBar step={step} />
      {children}
    </div>
  )
}

export default function AdConsultPage() {
  const [step, setStep] = useState('intro')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    category: '', projectType: '', suburb: '', state: '', postalCode: '', consent: false,
  })
  const [customerId, setCustomerId] = useState(null)
  const [registerError, setRegisterError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { saveUtmFromUrl() }, [])

  const field = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const goBack = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  // Contact + project + location are all collected client-side across three
  // quick screens, then sent to the server together in one call — the
  // account only actually needs to be created once, right before booking.
  const finishQuestionsAndRegister = async () => {
    setSubmitting(true)
    setRegisterError('')
    try {
      const utm = getStoredUtm()
      const address = `${form.suburb} ${form.state} ${form.postalCode}`.replace(/\s+/g, ' ').trim()
      const fbEventId = crypto.randomUUID()
      const res = await fetch('/api/ad-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, address, ...utm, fbEventId, pageUrl: window.location.href }),
      })
      const result = await res.json()
      if (!res.ok) {
        setRegisterError(result.error || 'Something went wrong')
        setSubmitting(false)
        return
      }
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {}, { eventID: fbEventId })
      }
      setCustomerId(result.customerId)
      setStep('booking')
    } catch (err) {
      setRegisterError('Could not reach the server: ' + err.message)
    }
    setSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-[#F6F5F1] flex flex-col items-center px-6 py-10">
      {step === 'intro' && <IntroStep onNext={() => setStep('contact')} />}

      {step === 'contact' && (
        <StepShell step={step} onBack={goBack}>
          <ContactStep form={form} field={field} onNext={() => setStep('project')} />
        </StepShell>
      )}

      {step === 'project' && (
        <StepShell step={step} onBack={goBack}>
          <ProjectStep form={form} field={field} onNext={() => setStep('location')} />
        </StepShell>
      )}

      {step === 'location' && (
        <StepShell step={step} onBack={goBack}>
          <LocationStep form={form} field={field} onNext={() => setStep('review')} />
        </StepShell>
      )}

      {step === 'review' && (
        <StepShell step={step} onBack={goBack}>
          <ReviewStep
            form={form}
            field={field}
            onNext={finishQuestionsAndRegister}
            submitting={submitting}
            error={registerError}
          />
        </StepShell>
      )}

      {step === 'booking' && (
        <StepShell step={step}>
          <BookingStep customerId={customerId} form={form} />
        </StepShell>
      )}
    </main>
  )
}

function IntroStep({ onNext }) {
  return (
    <div className="max-w-md w-full text-center">
      <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto mx-auto" />
      <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Book your free consultation
      </h1>
      <p className="mt-3 text-[#5A5E66]">Here's exactly what happens next — it takes about 2 minutes:</p>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-5 text-left flex flex-col gap-4">
        {[
          ['1', "Answer 3 quick questions", "Your details, your project, and roughly where you're based."],
          ['2', 'Pick a time that suits you', 'Choose a day and time straight away — no waiting on a callback.'],
          ['3', "You'll get a confirmation email", "It'll have your booking details and a link to log into your customer portal, where you can message your builder directly."],
        ].map(([n, title, sub]) => (
          <div key={n} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-[#1B2A4A] text-white text-sm font-semibold flex items-center justify-center">{n}</span>
            <div>
              <p className="text-sm font-semibold text-[#1B2A4A]">{title}</p>
              <p className="text-sm text-[#5A5E66] mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full mt-6 bg-[#0068D8] text-white font-medium rounded py-3 hover:bg-[#0050B0] transition"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Let's get started
      </button>
      <Link href="/" className="block mt-4 text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">Not now, take me to the website</Link>
    </div>
  )
}

function ContactStep({ form, field, onNext }) {
  const valid = form.firstName && form.lastName && form.email && form.mobile

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext() }} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Your contact details</h2>
      <p className="text-sm text-[#5A5E66] -mt-2">So we know who we're talking to, and can send your confirmation.</p>

      <div className="grid grid-cols-2 gap-3">
        <input value={form.firstName} onChange={(e) => field('firstName', e.target.value)} required placeholder="First name"
          className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
        <input value={form.lastName} onChange={(e) => field('lastName', e.target.value)} required placeholder="Last name"
          className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
      </div>
      <input type="email" value={form.email} onChange={(e) => field('email', e.target.value)} required placeholder="Email"
        className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
      <input value={form.mobile} onChange={(e) => field('mobile', e.target.value)} required placeholder="Mobile — 04xx xxx xxx"
        className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />

      <button type="submit" disabled={!valid}
        className="w-full mt-2 bg-[#0068D8] text-white font-medium rounded py-3 hover:bg-[#0050B0] disabled:opacity-50 transition"
        style={{ fontFamily: 'var(--font-heading)' }}>
        Continue
      </button>
    </form>
  )
}

function ProjectStep({ form, field, onNext }) {
  const options = form.category ? CATEGORIES[form.category] : []
  const needsType = form.category && options.length > 1
  const valid = form.category && (options.length === 1 || form.projectType)

  const setCategory = (category) => {
    const opts = CATEGORIES[category] || []
    field('category', category)
    field('projectType', opts.length === 1 ? opts[0] : '')
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>What are you planning?</h2>
      <p className="text-sm text-[#5A5E66] -mt-2">Pick the option that best describes your project.</p>

      <div className="flex flex-col gap-2">
        {Object.keys(CATEGORIES).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`text-left px-4 py-3 rounded border text-sm font-medium transition ${
              form.category === c ? 'border-[#1B2A4A] bg-[#EEF1F7] text-[#1B2A4A]' : 'border-[#D9D6CD] bg-white text-[#4A4E56] hover:border-[#1B2A4A]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {needsType && (
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-sm font-medium text-[#4A4E56]">Which type of {form.category.toLowerCase()}?</p>
          {options.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => field('projectType', t)}
              className={`text-left px-4 py-2.5 rounded border text-sm transition ${
                form.projectType === t ? 'border-[#E1601F] bg-[#FFF6F0] text-[#1B2A4A] font-medium' : 'border-[#D9D6CD] bg-white text-[#4A4E56] hover:border-[#E1601F]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <button type="button" onClick={onNext} disabled={!valid}
        className="w-full mt-2 bg-[#0068D8] text-white font-medium rounded py-3 hover:bg-[#0050B0] disabled:opacity-50 transition"
        style={{ fontFamily: 'var(--font-heading)' }}>
        Continue
      </button>
    </div>
  )
}

function LocationStep({ form, field, onNext }) {
  const valid = form.suburb && form.state && form.postalCode

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Where's the property?</h2>
      <p className="text-sm text-[#5A5E66] -mt-2">Just the suburb and postcode — enough to know if we cover your area.</p>

      <input value={form.suburb} onChange={(e) => field('suburb', e.target.value)} required placeholder="Suburb"
        className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
      <div className="grid grid-cols-2 gap-3">
        <select value={form.state} onChange={(e) => field('state', e.target.value)} required
          className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]">
          <option value="">State...</option>
          {AUSTRALIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input value={form.postalCode} onChange={(e) => field('postalCode', e.target.value)} required placeholder="Postcode"
          className="w-full border border-[#D9D6CD] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
      </div>

      <button type="button" onClick={onNext} disabled={!valid}
        className="w-full mt-2 bg-[#0068D8] text-white font-medium rounded py-3 hover:bg-[#0050B0] disabled:opacity-50 transition"
        style={{ fontFamily: 'var(--font-heading)' }}>
        Continue
      </button>
    </div>
  )
}

// Matches the AOB reference screenshots' "Contact information" step: a
// final read-only review of everything just entered (name, email, mobile,
// etc.), each with a green checkmark, before the visitor commits. Consent
// lives here too, right next to what they're actually consenting to share,
// instead of being buried under the address fields on the previous screen.
function ReviewField({ label, value }) {
  return (
    <div className="border border-[#D9D6CD] rounded-md px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-[#8A8D94] uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-[#1B2A4A] truncate">{value}</p>
      </div>
      <span className="shrink-0 w-5 h-5 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center text-xs">✓</span>
    </div>
  )
}

function ReviewStep({ form, field, onNext, submitting, error }) {
  const valid = form.consent

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Review your details</h2>
      <p className="text-sm text-[#5A5E66] -mt-2">Quick check before we move on to booking a time.</p>

      <div className="flex flex-col gap-2">
        <ReviewField label="Name" value={`${form.firstName} ${form.lastName}`} />
        <ReviewField label="Email" value={form.email} />
        <ReviewField label="Mobile" value={form.mobile} />
        <ReviewField label="Project" value={form.projectType || form.category} />
        <ReviewField label="Location" value={`${form.suburb}, ${form.state} ${form.postalCode}`} />
      </div>

      <label className="flex items-start gap-2 text-sm text-[#5A5E66] mt-1">
        <input type="checkbox" checked={form.consent} onChange={(e) => field('consent', e.target.checked)} required className="mt-1" />
        <span>
          I agree to EBC collecting and using my details as described in the{' '}
          <a href="/privacy" target="_blank" className="text-[#1B2A4A] underline">Privacy Policy</a>.
        </span>
      </label>

      {error && (
        <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{error}</div>
      )}

      <button type="button" onClick={onNext} disabled={!valid || submitting}
        className="w-full mt-2 bg-[#0068D8] text-white font-medium rounded py-3 hover:bg-[#0050B0] disabled:opacity-50 transition"
        style={{ fontFamily: 'var(--font-heading)' }}>
        {submitting ? 'One moment...' : 'Continue to booking'}
      </button>
    </div>
  )
}

function BookingStep({ customerId, form }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
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
      .then((data) => { setCalendar(data); setCalendarLoading(false) })
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
      const fbEventId = crypto.randomUUID()
      const res = await fetch('/api/ad-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          bookingDate: selectedDay.dateKey,
          bookingTime: selectedTime,
          appointmentType: 'Initial Consultation',
          fbEventId,
          pageUrl: window.location.href,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMessage(result.error)
      } else {
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Schedule', {}, { eventID: fbEventId })
        }
        setStatus('success')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Could not reach the server: ' + err.message)
    }
  }

  if (status === 'success') {
    return <BookedSuccess customerId={customerId} form={form} selectedDay={selectedDay} selectedTime={selectedTime} />
  }

  const days = calendar?.days || []
  const leadingBlanks = Array.from({ length: calendar?.firstDayOfWeek ?? 0 })

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Pick a time</h2>
      <p className="text-sm text-[#5A5E66] mt-1 mb-4">Last step — choose a day and time that works for you.</p>

      <div className="bg-white border border-[#D9D6CD] rounded-md p-5">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => goToMonth(-1)} disabled={isCurrentMonth}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#D9D6CD] text-[#1B2A4A] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#E1601F] transition">‹</button>
          <p className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{calendar?.monthLabel || ''}</p>
          <button type="button" onClick={() => goToMonth(1)}
            className="w-8 h-8 flex items-center justify-center rounded border border-[#D9D6CD] text-[#1B2A4A] hover:border-[#E1601F] transition">›</button>
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
                  <button key={d.dateKey} type="button" disabled={!d.available}
                    onClick={() => { setSelectedDay(d); setSelectedTime(null) }}
                    className={`aspect-square rounded text-sm flex items-center justify-center transition ${
                      isSelected ? 'bg-[#1B2A4A] text-white font-semibold'
                        : d.available ? 'bg-[#FFF6F0] text-[#1B2A4A] font-medium hover:bg-[#E1601F] hover:text-white'
                        : 'text-[#C9CBD1] cursor-not-allowed'
                    }`}>
                    {d.day}
                  </button>
                )
              })}
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
                <button key={t} onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded border text-sm ${selectedTime === t ? 'bg-[#E1601F] text-white border-[#E1601F]' : 'bg-white text-[#333] border-[#D9D6CD]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </>
        )}

        {status === 'error' && (
          <div className="mt-4 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{errorMessage}</div>
        )}

        <button onClick={confirmBooking} disabled={!selectedDay || !selectedTime || status === 'booking'}
          className="w-full mt-6 bg-[#0068D8] text-white font-medium rounded py-2.5 hover:bg-[#0050B0] disabled:opacity-50 transition"
          style={{ fontFamily: 'var(--font-heading)' }}>
          {status === 'booking' ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>
    </div>
  )
}

// Shown right after booking. Testing this flow surfaced a real problem:
// putting a bare "enter your code" field straight in front of someone who
// just booked a renovation consult is jarring — they have no idea a code
// was even coming, since nothing before this point mentioned one. That's
// the same "confusing mid-flow email step" complaint this whole rebuild
// was meant to fix, just moved one screen later. So this screen now does
// what the AOB reference screenshots did: state plainly what happens next
// and stop there. No action is required here — activation happens with a
// single tap in the email. A manual code entry is still available, but
// tucked behind an explicit "I'd rather not wait for the email" toggle
// instead of presented as something the visitor has to deal with right now.
function BookedSuccess({ customerId, form, selectedDay, selectedTime }) {
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [code, setCode] = useState('')
  const [verifyBusy, setVerifyBusy] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [verified, setVerified] = useState(false)

  const dateLabel = new Date(selectedDay.dateKey).toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })

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
        // Verified, but there's no password to sign in with yet — this flow
        // never asked for one during the quick questions. Now's the moment
        // it actually makes sense to ask, so hand off to CreatePassword
        // instead of trying to sign in here.
        setVerified(true)
      }
    } catch (err) {
      setVerifyError('Could not reach the server: ' + err.message)
    }
    setVerifyBusy(false)
  }

  if (verified) {
    return <AdCreatePassword customerId={customerId} email={form.email} projectType={form.projectType} />
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mx-auto text-xl">✓</div>
      <h1 className="mt-6 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>You're booked in</h1>
      <p className="mt-3 text-[#5A5E66]">
        {dateLabel} at {selectedTime}. We'll see you then.
      </p>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-5 text-left">
        <p className="text-sm text-[#333333] leading-relaxed">
          We've sent a confirmation email to <strong className="text-[#1B2A4A]">{form.email}</strong> with your booking details
          and a link to log into your customer portal — that's where you can message your builder directly and track your project.
        </p>
        <p className="text-sm text-[#5A5E66] mt-3">
          Just open the email and tap the button in it whenever suits — nothing else to do right now.
        </p>
      </div>

      {!showCodeEntry ? (
        <button
          type="button"
          onClick={() => setShowCodeEntry(true)}
          className="mt-4 text-sm text-[#8A8D94] hover:text-[#1B2A4A] underline transition"
        >
          Rather not wait for the email? Activate now instead
        </button>
      ) : (
        <form onSubmit={handleVerify} className="mt-4 bg-white border border-[#D9D6CD] rounded-md p-5 text-left flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#1B2A4A]">Enter the code from your email</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" maxLength={6}
            className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
          {verifyError && (
            <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">{verifyError}</div>
          )}
          <button type="submit" disabled={verifyBusy || code.length < 6}
            className="w-full bg-[#0068D8] text-white font-medium rounded py-2.5 hover:bg-[#0050B0] disabled:opacity-50 transition"
            style={{ fontFamily: 'var(--font-heading)' }}>
            {verifyBusy ? 'Activating...' : 'Continue'}
          </button>
        </form>
      )}

      <Link href="/" className="block mt-5 text-sm font-semibold text-[#1B2A4A] hover:text-[#E1601F] transition">← Back to home</Link>
    </div>
  )
}
