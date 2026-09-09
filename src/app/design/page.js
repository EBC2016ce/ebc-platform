'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { STEPS_BY_TYPE } from '@/lib/designSteps'

function Field({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-[#4A4E56] mb-1.5">{field.label}</label>
        <select value={value || ''} onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm">
          <option value="">Select...</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  if (field.type === 'radio') {
    return (
      <div>
        <label className="block text-sm font-medium text-[#4A4E56] mb-1.5">{field.label}</label>
        <div className="flex gap-2">
          {field.options.map((o) => (
            <button key={o} type="button" onClick={() => onChange(o)}
              className={`px-3 py-1.5 rounded border text-sm ${value === o ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white border-[#D9D6CD]'}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
    )
  }
  if (field.type === 'multiselect') {
    const arr = value || []
    const toggle = (o) => onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o])
    return (
      <div>
        <label className="block text-sm font-medium text-[#4A4E56] mb-1.5">{field.label}</label>
        <div className="flex gap-2 flex-wrap">
          {field.options.map((o) => (
            <button key={o} type="button" onClick={() => toggle(o)}
              className={`px-3 py-1.5 rounded border text-sm ${arr.includes(o) ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white border-[#D9D6CD]'}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
    )
  }
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-[#4A4E56] mb-1.5">{field.label}</label>
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
      </div>
    )
  }
  return (
    <div>
      <label className="block text-sm font-medium text-[#4A4E56] mb-1.5">{field.label}</label>
      <input type={field.type === 'number' ? 'number' : 'text'} value={value || ''} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
    </div>
  )
}

function DesignPageContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  const projectType = searchParams.get('projectType')

    const NEW_BUILD_LIKE = ['New home', 'Knockdown & rebuild', 'Townhouse', 'Luxury home', 'Full renovation']
  const effectiveType = NEW_BUILD_LIKE.includes(projectType) ? 'New home' : projectType
  const steps = STEPS_BY_TYPE[effectiveType] || []
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!customerId) return
    fetch('/api/design?customerId=' + customerId)
      .then((res) => res.json())
      .then((result) => {
        if (result.design?.data) setFormData(result.design.data)
        setLoading(false)
      })
  }, [customerId])

  useEffect(() => {
    if (loading) return
    setSaveStatus('editing')
    const timer = setTimeout(async () => {
      setSaveStatus('saving')
      await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, data: formData, submit: false }),
      })
      setSaveStatus('saved')
    }, 700)
    return () => clearTimeout(timer)
  }, [formData]) // eslint-disable-line

  const setField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }))

  const submitDesign = async () => {
    setSubmitting(true)
    setErrorMessage('')
    try {
      const res = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, data: formData, submit: true }),
      })
      if (!res.ok) {
        const result = await res.json()
        setErrorMessage(result.error || 'Unknown error')
        setSubmitting(false)
        return
      }
      window.location.href = '/book?customerId=' + customerId
    } catch (err) {
      setErrorMessage('Could not reach the server: ' + err.message)
      setSubmitting(false)
    }
  }

  if (!customerId || !projectType) {
    return <p className="text-[#A23B2E]">Missing customer or project details. Please use the link from your verification email.</p>
  }
  if (loading) {
    return <p className="text-[#5A5E66]">Loading your design brief...</p>
  }

  if (steps.length === 0) {
    return (
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Thanks for registering
        </h1>
        <p className="mt-3 text-[#5A5E66]">
          We don't have a detailed design brief for this project type just yet - one of our team will contact you directly to discuss it. In the meantime, let's book you a time to chat.
        </p>
        <a href={'/book?customerId=' + customerId}
          className="inline-block mt-6 bg-[#E1601F] text-white font-medium rounded px-6 py-2.5 hover:opacity-90">
          Book a consultation
        </a>
      </div>
    )
  }

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  return (
    <div className="max-w-lg w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Home Design Brief
        </h1>
        <span className="text-xs text-[#8B8D89]">
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        </span>
      </div>
      <p className="text-sm text-[#5A5E66] mt-1">Step {stepIndex + 1} of {steps.length}: {step.title}</p>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-5">
        {step.fields.map((field) => (
          <Field key={field.key} field={field} value={formData[field.key]} onChange={(v) => setField(field.key, v)} />
        ))}

        {errorMessage && (
          <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}
            className="px-4 py-2 rounded border border-[#D9D6CD] text-sm disabled:opacity-40">
            Back
          </button>
          {isLastStep ? (
            <button type="button" onClick={submitDesign} disabled={submitting}
              className="bg-[#E1601F] text-white font-medium rounded px-6 py-2 hover:opacity-90 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Brief'}
            </button>
          ) : (
            <button type="button" onClick={() => setStepIndex((i) => i + 1)}
              className="bg-[#1B2A4A] text-white font-medium rounded px-6 py-2 hover:opacity-90">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DesignPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <DesignPageContent />
      </Suspense>
    </main>
  )
}
