'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATS = ['Software', 'Hosting', 'Domain', 'Other']

const money = (n) =>
  Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })

export default function SubscriptionsPage() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const router = useRouter()
  const saveTimer = useRef(null)
  const statusTimer = useRef(null)

  useEffect(() => {
    fetch('/api/admin/subscriptions')
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return null }
        return res.json()
      })
      .then((result) => {
        if (!result) return
        if (result.error) setError(result.error)
        else setRows(result.rows || [])
      })
  }, [router])

  const totals = useMemo(() => {
    const list = rows || []
    return {
      monthly: list.reduce((s, r) => s + (Number(r.monthly) || 0), 0),
      yearly: list.reduce((s, r) => s + (Number(r.yearly) || 0), 0),
    }
  }, [rows])

  const showStatus = (text) => {
    setStatus(text)
    clearTimeout(statusTimer.current)
    statusTimer.current = setTimeout(() => setStatus(''), 1800)
  }

  const scheduleSave = (nextRows) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/admin/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows: nextRows }),
        })
        if (!res.ok) throw new Error()
        showStatus('Saved')
      } catch {
        showStatus('Not saved — try again')
      }
    }, 900)
  }

  const updateRow = (id, patch) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      scheduleSave(next)
      return next
    })
  }

  const setMonthly = (id, value) => {
    let v = parseFloat(value)
    if (Number.isNaN(v) || v < 0) v = 0
    updateRow(id, { monthly: v, yearly: Math.round((v * 12 + Number.EPSILON) * 100) / 100 })
  }

  const setYearly = (id, value) => {
    let v = parseFloat(value)
    if (Number.isNaN(v) || v < 0) v = 0
    updateRow(id, { yearly: v, monthly: Math.round((v / 12 + Number.EPSILON) * 100) / 100 })
  }

  const removeRow = (id) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id)
      scheduleSave(next)
      return next
    })
  }

  const addRow = () => {
    setRows((prev) => {
      const next = [...prev, { id: `r${Date.now()}`, name: 'New subscription', category: 'Software', monthly: 0, yearly: 0 }]
      scheduleSave(next)
      return next
    })
  }

  if (error) return <main className="min-h-screen bg-[#F6F5F1] p-10 text-[#A23B2E]">{error}</main>
  if (!rows) return <main className="min-h-screen bg-[#F6F5F1] p-10 text-[#5A5E66]">Loading...</main>

  return (
    <main className="min-h-screen bg-[#F6F5F1] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#8A8D94] mb-1">easybcon.com.au — recurring costs</p>
            <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Subscriptions</h1>
            <p className="text-sm text-[#5A5E66] mt-1 max-w-xl">
              Every platform and tool billed monthly or yearly to keep the site, ads tracking and customer notifications running.
            </p>
          </div>
          <Link href="/leads" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to Leads</Link>
        </div>

        <div className="bg-white border border-[#D9D6CD] rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_110px_110px_30px] gap-3 px-4 py-3 bg-[#F0EEE8] text-[10.5px] uppercase tracking-wide text-[#8A8D94] font-medium">
            <span>Service</span>
            <span className="text-right">Monthly</span>
            <span className="text-right">Yearly</span>
            <span />
          </div>

          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_110px_110px_30px] gap-3 px-4 py-3 border-t border-[#EEE] items-center">
              <div className="min-w-0 flex flex-col gap-1.5">
                <input
                  value={r.name}
                  onChange={(e) => updateRow(r.id, { name: e.target.value })}
                  className="font-medium text-sm text-[#1B2A4A] bg-transparent border border-transparent rounded px-1.5 py-0.5 -mx-1.5 hover:bg-[#F6F5F1] focus:bg-[#F6F5F1] focus:border-[#D9D6CD] focus:outline-none"
                />
                <select
                  value={r.category}
                  onChange={(e) => updateRow(r.id, { category: e.target.value })}
                  className="self-start text-[10px] uppercase tracking-wide text-[#B24A18] bg-[#FFF1E7] border-none rounded-full px-2 py-0.5 cursor-pointer"
                >
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center justify-end gap-1 text-sm">
                <span className="text-[#8A8D94]">$</span>
                <input
                  type="number" min="0" step="0.01" inputMode="decimal"
                  value={r.monthly}
                  onChange={(e) => setMonthly(r.id, e.target.value)}
                  className={`w-[76px] text-right font-mono text-sm rounded border border-[#D9D6CD] bg-[#F6F5F1] px-1.5 py-1 focus:outline-none focus:border-[#E1601F] ${!r.monthly ? 'text-[#8A8D94]' : 'text-[#1B2A4A]'}`}
                />
              </label>
              <label className="flex items-center justify-end gap-1 text-sm">
                <span className="text-[#8A8D94]">$</span>
                <input
                  type="number" min="0" step="0.01" inputMode="decimal"
                  value={r.yearly}
                  onChange={(e) => setYearly(r.id, e.target.value)}
                  className={`w-[76px] text-right font-mono text-sm rounded border border-[#D9D6CD] bg-[#F6F5F1] px-1.5 py-1 focus:outline-none focus:border-[#E1601F] ${!r.yearly ? 'text-[#8A8D94]' : 'text-[#1B2A4A]'}`}
                />
              </label>
              <button
                onClick={() => removeRow(r.id)}
                aria-label={`Remove ${r.name}`}
                className="w-6 h-6 rounded text-[#8A8D94] hover:bg-[#F6F5F1] hover:text-[#A23B2E] transition"
              >
                ×
              </button>
            </div>
          ))}

          <button onClick={addRow} className="w-full text-left px-4 py-3 border-t border-dashed border-[#D9D6CD] text-sm text-[#B24A18] hover:bg-[#F6F5F1] transition">
            + Add subscription
          </button>

          <div className="grid grid-cols-[1fr_110px_110px_30px] gap-3 px-4 py-4 bg-[#1B2A4A] items-center">
            <span className="text-sm font-medium text-[#F1EFE9]">Total</span>
            <span className="text-right font-mono text-[15px] text-[#F1EFE9]">${money(totals.monthly)}</span>
            <span className="text-right font-mono text-[15px] text-[#F1EFE9]">${money(totals.yearly)}</span>
            <span />
          </div>
        </div>

        <p className="text-xs text-[#8A8D94] mt-4">
          Tip — enter either column: the Monthly figure fills in Yearly automatically (×12), and typing a Yearly figure fills in its monthly equivalent (÷12). Changes save automatically.
          {status && <span className="ml-2 text-[#2E7D4F]">{status}</span>}
        </p>
      </div>
    </main>
  )
}
