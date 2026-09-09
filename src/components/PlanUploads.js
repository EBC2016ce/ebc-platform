'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

const CATEGORIES = [
  'Working Drawings Plan', 'Engineering/Structural Plan', 'Landscape Plan',
  'Soil Report', 'Energy Report', 'Planning Permit',
  'Other 01', 'Other 02', 'Other 03', 'Other 04',
]
const MAX_SIZE_MB = 15

export default function PlanUploads({ customerId }) {
  const [uploaded, setUploaded] = useState({})
  const [uploading, setUploading] = useState(null)
  const [error, setError] = useState('')

  const handleFile = async (category, file) => {
    setError('')
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`${file.name} is over ${MAX_SIZE_MB}MB. Please choose a smaller file.`)
      return
    }

    setUploading(category)
    try {
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, category, filename: file.name }),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Could not prepare upload')
        setUploading(null)
        return
      }

      const supabase = createClient()
      const { error: uploadError } = await supabase.storage
        .from('plans')
        .uploadToSignedUrl(result.path, result.token, file)

      if (uploadError) {
        setError('Upload failed: ' + uploadError.message)
      } else {
        setUploaded((prev) => ({ ...prev, [category]: file.name }))
      }
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    }
    setUploading(null)
  }

  return (
    <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
      <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Upload Related Plans
      </h2>
      <p className="text-sm text-[#5A5E66] mt-1">Optional. Max {MAX_SIZE_MB}MB per file.</p>

      {error && (
        <div className="mt-3 text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {CATEGORIES.map((category) => (
          <div key={category} className="flex justify-between items-center border-b border-[#EEE] pb-3">
            <div>
              <p className="text-sm font-medium">{category}</p>
              {uploaded[category] && <p className="text-xs text-[#2E7D4F] mt-1">✓ {uploaded[category]}</p>}
            </div>
            <label className="text-sm bg-[#1B2A4A] text-white rounded px-3 py-1.5 cursor-pointer hover:opacity-90">
              {uploading === category ? 'Uploading...' : uploaded[category] ? 'Replace' : 'Choose File'}
              <input type="file" className="hidden" disabled={uploading === category}
                onChange={(e) => e.target.files[0] && handleFile(category, e.target.files[0])} />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
