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

// Returns availability for every day in a given month (1-indexed month),
// so the client can render a real calendar grid rather than a flat list of
// the next few open days. Weekends/non-working days and past days are
// still included in the result (with available: false) so the calendar
// can grey them out instead of hiding them.
export async function getMonthAvailability(year, month) {
  const config = await getBookingConfig()
  const { data: existingBookings } = await supabaseAdmin
    .from('bookings')
    .select('booking_date, booking_time')
    .eq('status', 'Confirmed')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstOfMonth = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()

  const days = []
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month - 1, d)
    const dateKey = toDateKey(day)
    const isPast = day < today
    const isWorkingDay = config.weekdays.includes(day.getDay())

    const bookedOnThisDay = (existingBookings || []).filter((b) => b.booking_date === dateKey)
    const takenTimes = bookedOnThisDay.map((b) => b.booking_time)
    const openSlots = isWorkingDay && !isPast ? config.slots.filter((s) => !takenTimes.includes(s)) : []
    const fullyBooked = isWorkingDay && bookedOnThisDay.length >= config.max_per_day

    days.push({
      dateKey,
      day: d,
      dayOfWeek: day.getDay(),
      isPast,
      isWorkingDay,
      available: isWorkingDay && !isPast && !fullyBooked && openSlots.length > 0,
      slots: openSlots,
    })
  }

  return { days, firstDayOfWeek: firstOfMonth.getDay(), monthLabel: firstOfMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }) }
}
