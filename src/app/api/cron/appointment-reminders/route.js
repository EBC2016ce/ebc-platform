import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { sendSms } from '@/lib/sms'
import { appointmentReminderEmailHtml } from '@/lib/emailTemplates'

// Runs every 10 minutes (see vercel.json) and sends a reminder — email +
// SMS to the customer, plus a heads-up SMS to the office — for any
// confirmed booking starting in roughly 2 hours. The 105-120 minute window
// is wider than the 10-minute run interval so a booking can never be
// skipped between two runs, and `reminder_sent` stops it from ever being
// sent twice.
export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  function parseBookingDateTime(bookingDate, bookingTime) {
    const [time, meridiem] = bookingTime.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (meridiem === 'PM' && hours !== 12) hours += 12
    if (meridiem === 'AM' && hours === 12) hours = 0
    const dt = new Date(bookingDate)
    dt.setHours(hours, minutes, 0, 0)
    return dt
  }

  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('id, customer_id, booking_date, booking_time, appointment_type')
    .eq('status', 'Confirmed')
    .eq('reminder_sent', false)

  if (error) {
    console.error('appointment-reminders: failed to load bookings', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  const now = new Date()
  let remindersSent = 0
  const adminPhone = process.env.ADMIN_ALERT_PHONE

  for (const booking of bookings || []) {
    let start
    try {
      start = parseBookingDateTime(booking.booking_date, booking.booking_time)
    } catch {
      continue
    }
    const minutesUntil = (start.getTime() - now.getTime()) / 60000
    if (minutesUntil > 120 || minutesUntil <= 105) continue

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('first_name, email, mobile')
      .eq('id', booking.customer_id)
      .single()
    if (!customer) continue

    const dateLabel = start.toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })
    const appointmentType = booking.appointment_type || 'Initial Consultation'

    if (customer.email) {
      try {
        await resend.emails.send({
          from: 'EBC <noreply@mail.ebc33.com.au>',
          to: customer.email,
          subject: 'Reminder: your appointment is in 2 hours — Easy Building & Construction',
          html: appointmentReminderEmailHtml({
            firstName: customer.first_name,
            appointmentType,
            dateLabel,
            time: booking.booking_time,
          }),
        })
      } catch (err) {
        console.error('Reminder email failed for booking', booking.id, err)
      }
    }

    if (customer.mobile) {
      const smsResult = await sendSms({
        to: customer.mobile,
        body: `Hi ${customer.first_name}, reminder: your EBC ${appointmentType.toLowerCase()} is today at ${booking.booking_time} (in about 2 hours). Need to reschedule? Call us ASAP.`,
        purpose: 'appointment_reminder_customer',
        customerId: booking.customer_id,
      })
      if (!smsResult.success) {
        console.error('Reminder SMS to customer failed for booking', booking.id, smsResult.error)
      }
    }

    if (adminPhone) {
      const adminSmsResult = await sendSms({
        to: adminPhone,
        body: `Reminder: ${customer.first_name}'s ${appointmentType.toLowerCase()} is today at ${booking.booking_time} (in ~2 hrs). ${customer.mobile || 'no mobile on file'}.`,
        purpose: 'appointment_reminder_admin',
        customerId: booking.customer_id,
      })
      if (!adminSmsResult.success) {
        console.error('Reminder SMS to admin failed for booking', booking.id, adminSmsResult.error)
      }
    }

    await supabaseAdmin
      .from('bookings')
      .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
      .eq('id', booking.id)
    remindersSent++
  }

  return Response.json({ success: true, remindersSent })
}
