'use client'
import { useState } from 'react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilityForm({ initialConfig }) {
  const [weekdays, setWeekdays] = useState(initialConfig.weekdays || [1, 2, 3, 4, 5])
  const [slots, setSlots] = useState((initialConfig.slots || []).join(', '))
  const [maxPerDay, setMaxPerDay] = useState(initialConfig.max_per_day || 3)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const toggleDay = (dayNum) => {
    setWeekdays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum].sort()
    )
  }

  const handleSave = async () => {
    setStatus('saving')
    setErrorMessage('')
    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekdays,
          slots: slots.split(',').map((s) => s.trim()).filter(Boolean),
          maxPerDay: Number(maxPerDay),
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMessage(result.error)
      } else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('Could not reach the server: ' + err.message)
    }
  }

  return (
    <div className="mt-8 bg-white border border-[#D9D6CD] rounded-md p-6 flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-[#4A4E56] mb-2">Available days</label>
        <div className="flex flex-wrap gap-2">
          {DAY_NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              onClick={() => toggleDay(i)}
              className={`px-3 py-1.5 rounded border text-sm ${
                weekdays.includes(i) ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]' : 'bg-white text-[#333] border-[#D9D6CD]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="slots" className="block text-sm font-medium text-[#4A4E56] mb-2">
          Available time slots (comma separated)
        </label>
        <input
          id="slots"
          value={slots}
          onChange={(e) => setSlots(e.target.value)}
          placeholder="9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM"
          className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
        />
      </div>

      <div>
        <label htmlFor="maxPerDay" className="block text-sm font-medium text-[#4A4E56] mb-2">
          Max bookings per day
        </label>
        <input
          id="maxPerDay"
          type="number"
          value={maxPerDay}
          onChange={(e) => setMaxPerDay(e.target.value)}
          className="w-32 border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
        />
      </div>

      {status === 'error' && (
        <div className="text-sm text-[#A23B2E] bg-[#FBEAE6] border border-[#EFCFC5] rounded px-3 py-2">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={status === 'saving'}
        className="bg-[#E1601F] text-white font-medium rounded py-2.5 px-6 hover:opacity-90 disabled:opacity-50 transition self-start"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save changes'}
      </button>
    </div>
  )
}
