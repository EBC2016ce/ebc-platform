'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { STEPS_BY_TYPE } from '@/lib/designSteps'
import PlanUploads from '@/components/PlanUploads'
import AddressAutocompleteFields from '@/components/AddressAutocompleteFields'

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
        <div className="flex gap-2 flex-wrap">
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

const RENOVATION_TYPES = ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation']
const NEW_BUILD_TYPES = ['New home', 'Knockdown & rebuild', 'Vacant land', 'Townhouse', 'Luxury home']

function DesignPageContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  const projectType = searchParams.get('projectType')

  const effectiveType = NEW_BUILD_TYPES.includes(projectType) ? 'New home'
    : RENOVATION_TYPES.includes(projectType) ? 'Kitchen renovation'
    : projectType
  const uploadCategoryGroup = RENOVATION_TYPES.includes(projectType) ? 'renovation' : 'newbuild'

  const steps = STEPS_BY_TYPE[effectiveType] || []
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
    const [largeFilesLink, setLargeFilesLink] = useState('')
    const [registeredAddress, setRegisteredAddress] = useState('')

    useEffect(() => {
    if (!customerId) return
    fetch('/api/design?customerId=' + customerId)
      .then((res) => res.json())
      .then((result) => {
        if (result.design?.data) setFormData(result.design.data)
        setLoading(false)
      })
    fetch('/api/portal')
      .then((res) => res.json())
      .then((result) => {
        if (result.customer?.large_files_link) setLargeFilesLink(result.customer.large_files_link)
        if (result.customer?.address) setRegisteredAddress(result.customer.address)
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
           if (largeFilesLink.trim()) {
        const linkRes = await fetch('/api/save-large-files-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId, link: largeFilesLink }),
        })
        if (!linkRes.ok) {
          const linkResult = await linkRes.json()
          setErrorMessage('Could not save your link: ' + (linkResult.error || 'Unknown error'))
          setSubmitting(false)
          return
        }
      }
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

  return (
    <div className="max-w-lg w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Project Details
        </h1>
        <span className="text-xs text-[#8B8D89]">
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        </span>
      </div>
      <p className="text-sm text-[#5A5E66] mt-1">Answer the questions below, then upload any related files.</p>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-8">
                {steps.map((step) => {
          const isAddressStep = step.id === 'address'
          const hasRegisteredAddress = isAddressStep && !!registeredAddress
          const sameAsRegistered = hasRegisteredAddress && formData.addressSameAsRegistered === 'Yes'
          const showManualAddress = isAddressStep && (!hasRegisteredAddress || formData.addressSameAsRegistered === 'No')

          return (
            <div key={step.id}>
              <h2 className="text-sm font-semibold text-[#1B2A4A] uppercase tracking-wide mb-3">{step.title}</h2>
              <div className="flex flex-col gap-4">
                {hasRegisteredAddress && (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4E56] mb-1.5">
                      Is the project address the same as the address you registered with?
                    </label>
                    <p className="text-sm text-[#5A5E66] mb-2">{registeredAddress}</p>
                    <div className="flex gap-2 flex-wrap">
                      {['Yes', 'No'].map((o) => (
                        <button key={o} type="button" onClick={() => setField('addressSameAsRegistered', o)}
                          className={`px-3 py-1.5 rounded border text-sm ${formData.addressSameAsRegistered === o ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white border-[#D9D6CD]'}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {showManualAddress && (
                  <AddressAutocompleteFields formData={formData} onFieldChange={setField} />
                )}
                {!sameAsRegistered && step.fields.map((field) => (
                  <Field key={field.key} field={field} value={formData[field.key]} onChange={(v) => setField(field.key, v)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

                  <div className="mt-8 bg-[#FFF6F0] border border-[#E1601F] rounded-md p-5">
        <p className="text-sm font-semibold text-[#1B2A4A]">Please upload your files:</p>
        <ul className="mt-2 text-sm text-[#4A4E56] list-disc list-inside space-y-1">
          <li>Max file size: 15MB per file</li>
          <li>Bigger files? Share them via WeTransfer, Google Drive, or Dropbox, and paste the link below</li>
        </ul>
        <div className="mt-3">
          <input value={largeFilesLink} onChange={(e) => setLargeFilesLink(e.target.value)}
            placeholder="Paste your file-sharing link here (optional)"
            className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="mt-4">
        <PlanUploads customerId={customerId} categoryGroup={uploadCategoryGroup} />
      </div>

      {errorMessage && (
        <div className="mt-4 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
          {errorMessage}
        </div>
      )}

      <button type="button" onClick={submitDesign} disabled={submitting}
        className="w-full mt-6 bg-[#E1601F] text-white font-medium rounded py-2.5 hover:opacity-90 disabled:opacity-50 transition"
        style={{ fontFamily: 'var(--font-heading)' }}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}

export default function DesignPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo-icon.png" alt="EBC logo" width={202} height={100} className="h-16 w-auto" />
        <span className="mt-2 text-base font-bold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Easy Building &amp; Construction Pty Ltd
        </span>
      </div>
      <Suspense fallback={<p className="text-[#5A5E66]">Loading...</p>}>
        <DesignPageContent />
      </Suspense>
    </main>
  )
}
