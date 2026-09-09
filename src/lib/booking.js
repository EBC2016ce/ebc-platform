import { supabaseAdmin } from './supabase-admin'

export async function getBookingConfig() {
  const { data } = await supabaseAdmin.from('booking_config').select('*').eq('id', 1).single()
  return data
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

export async function getAvailableDays(numDays = 8) {
  const config = await getBookingConfig()
  const { data: existingBookings } = await supabaseAdmin
    .from('bookings')
    .select('booking_date, booking_time')
    .eq('status', 'Confirmed')

  const days = []
  let offset = 1

  while (days.length < numDays && offset < 45) {
    const day = new Date()
    day.setDate(day.getDate() + offset)
    offset++

    if (!config.weekdays.includes(day.getDay())) continue

    const dateKey = toDateKey(day)
    const bookedOnThisDay = existingBookings.filter((b) => b.booking_date === dateKey)

    if (bookedOnThisDay.length >= config.max_per_day) continue

    const takenTimes = bookedOnThisDay.map((b) => b.booking_time)
    const openSlots = config.slots.filter((s) => !takenTimes.includes(s))

    if (openSlots.length === 0) continue

    days.push({ dateKey, dateLabel: day.toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }), slots: openSlots })
  }

  return days
}
