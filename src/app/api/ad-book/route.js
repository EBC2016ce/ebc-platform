import { supabaseAdmin } from '@/lib/supabase-admin'
import { getBookingConfig } from '@/lib/booking'
import { resend } from '@/lib/resend'
import { adConfirmationEmailHtml, buildGoogleCalendarLink } from '@/lib/emailTemplates'
import { sendSms } from '@/lib/sms'
import { sendCapiEvent } from '@/lib/metaCapi'

// Ad-funnel-only booking step, used by src/app/ad-consult/page.js.
// Mirrors /api/book, but this is also the moment the customer gets their
// one and only email for this flow: booking confirmation + account
// activation combined, since the ad-consult flow deliberately skips
// sending a verification email earlier (see /api/ad-register).
export async function POST(request) {
  try {
    const { customerId, bookingDate, bookingTime, appointmentType, fbEventId, pageUrl } = await request.json()

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

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('first_name, email, mobile, verification_code')
      .eq('id', customerId)
      .single()

    if (customer) {
      const dateLabel = new Date(bookingDate).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      const calendarLink = buildGoogleCalendarLink({
        title: 'EBC ' + (appointmentType || 'Initial Consultation'),
        dateISO: bookingDate,
        timeLabel: bookingTime,
        description: 'Appointment with Easy Building & Construction.',
      })
      const activateUrl = `https://easybcon.com.au/ad-consult/verify?customerId=${customerId}&code=${customer.verification_code}`

      try {
        await resend.emails.send({
          from: 'EBC <noreply@mail.ebc33.com.au>',
          to: customer.email,
          subject: "You're booked in — Easy Building & Construction",
          html: adConfirmationEmailHtml({
            firstName: customer.first_name,
            email: customer.email,
            code: customer.verification_code,
            appointmentType: appointmentType || 'Initial Consultation',
            dateLabel,
            time: bookingTime,
            calendarLink,
            activateUrl,
          }),
        })
      } catch (err) {
        console.error('Ad booking confirmation email failed for customer', customerId, err)
      }

      if (customer.mobile) {
        const shortDate = new Date(bookingDate).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })
        const smsResult = await sendSms({
          to: customer.mobile,
          body: `Hi ${customer.first_name}, your EBC consultation is confirmed for ${shortDate} at ${bookingTime}. Check your email to activate your account.`,
          purpose: 'booking_confirmation',
          customerId,
        })
        if (!smsResult.success) {
          console.error('Booking confirmation SMS failed for customer', customerId, smsResult.error)
        }
      }

      // Booking is the real conversion this ad is chasing — fire it as
      // Meta's standard "Schedule" event (separate from the Lead event
      // already sent at /api/ad-register), backed up server-side the same
      // way as the on-site flow's Lead/CompleteRegistration events.
      if (fbEventId) {
        await sendCapiEvent({
          eventName: 'Schedule',
          eventId: fbEventId,
          eventSourceUrl: pageUrl,
          userData: { email: customer.email, phone: customer.mobile, firstName: customer.first_name },
          request,
        }).catch((err) => console.error('Meta CAPI Schedule event failed:', err))
      }
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
