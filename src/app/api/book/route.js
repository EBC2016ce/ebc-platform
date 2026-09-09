import { supabaseAdmin } from '@/lib/supabase-admin'
import { getBookingConfig } from '@/lib/booking'

export async function POST(request) {
  try {
    const { customerId, bookingDate, bookingTime, appointmentType } = await request.json()

    const config = await getBookingConfig()

    const { data: sameDay } = await supabaseAdmin
      .from('bookings')
      .select('booking_time')
      .eq('booking_date', bookingDate)
      .eq('status', 'Confirmed')

    const alreadyTaken = sameDay.some((b) => b.booking_time === bookingTime)
    if (alreadyTaken) {
      return Response.json({ error: 'That time was just taken. Please pick another.' }, { status: 400 })
    }
    if (sameDay.length >= config.max_per_day) {
      return Response.json({ error: 'That day is fully booked. Please pick another day.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('bookings').insert([
      {
        customer_id: customerId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        appointment_type: appointmentType || 'Initial Consultation',
      },
    ])

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
