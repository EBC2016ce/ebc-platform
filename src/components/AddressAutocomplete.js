'use client'
import { useState, useRef } from 'react'

export default function AddressAutocomplete({ value, onChange, required }) {
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef(null)

  const handleInput = (text) => {
    onChange(text)
    clearTimeout(debounceRef.current)

    if (text.length < 3) {
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch('/api/address-search?input=' + encodeURIComponent(text))
      const result = await res.json()
      setSuggestions(result.suggestions || [])
      setShowDropdown(true)
    }, 300)
  }

  const selectSuggestion = (suggestion) => {
    onChange(suggestion.text)
    setSuggestions([])
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        required={required}
        placeholder="Start typing your address..."
        className="w-full border border-[#D9D6CD] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#D9D6CD] rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              type="button"
              onClick={() => selectSuggestion(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#F6F5F1] border-b border-[#EEE] last:border-0"
            >
              {s.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
