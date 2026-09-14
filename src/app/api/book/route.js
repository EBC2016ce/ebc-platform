import { supabaseAdmin } from '@/lib/supabase-admin'
import { getBookingConfig } from '@/lib/booking'
import { resend } from '@/lib/resend'
import { bookingConfirmationEmailHtml, buildGoogleCalendarLink } from '@/lib/emailTemplates'
import { sendSms } from '@/lib/sms'

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

        const { data: customer } = await supabaseAdmin.from('customers').select('first_name, email, mobile').eq('id', customerId).single()
    if (customer) {
      const dateLabel = new Date(bookingDate).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      const calendarLink = buildGoogleCalendarLink({
        title: 'EBC ' + (appointmentType || 'Initial Consultation'),
        dateISO: bookingDate,
        timeLabel: bookingTime,
        description: 'Appointment with Easy Building & Construction.',
      })

      // Email and SMS are sent independently — previously the SMS was only
      // reached if the email send resolved without throwing, so a single
      // failed/slow email (a Resend error, a bad address) silently meant
      // the customer never got the confirmation text either. Each is now
      // best-effort on its own and failures are logged instead of swallowed.
      try {
        await resend.emails.send({
          from: 'EBC <noreply@mail.ebc33.com.au>',
          to: customer.email,
          subject: 'Your appointment is confirmed — Easy Building & Construction',
          html: bookingConfirmationEmailHtml({
            firstName: customer.first_name,
            appointmentType: appointmentType || 'Initial Consultation',
            dateLabel,
            time: bookingTime,
            calendarLink,
          }),
        })
      } catch (err) {
        console.error('Booking confirmation email failed for customer', customerId, err)
      }

      if (customer.mobile) {
        const shortDate = new Date(bookingDate).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })
        const smsResult = await sendSms({
          to: customer.mobile,
          body: `Hi ${customer.first_name}, your EBC consultation is confirmed for ${shortDate} at ${bookingTime}. Need to reschedule? Just call us at least 24 hours ahead.`,
          purpose: 'booking_confirmation',
          customerId,
        })
        if (!smsResult.success) {
          console.error('Booking confirmation SMS failed for customer', customerId, smsResult.error)
        }
      }
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
