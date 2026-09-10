import { requireStaff } from '@/lib/checkStaff'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import AvailabilityForm from './AvailabilityForm'

export default async function AvailabilityPage() {
  const { authorized } = await requireStaff()
  if (!authorized) {
    redirect('/login')
  }

  const { data: config } = await supabaseAdmin.from('booking_config').select('*').eq('id', 1).single()

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        Booking availability
      </h1>
      <p className="mt-2 text-sm text-[#5A5E66]">Set which days, times, and how many bookings per day customers can choose from.</p>
      <AvailabilityForm initialConfig={config} />
    </main>
  )
}
