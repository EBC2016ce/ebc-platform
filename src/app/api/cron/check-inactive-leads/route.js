import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend } from '@/lib/resend'
import { reminderEmailHtml } from '@/lib/emailTemplates'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Not authorized' }, { status: 401 })
  }

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

  const { data: customers } = await supabaseAdmin
    .from('customers')
    .select('id, first_name, email, lead_status, reminded_design, reminded_booking, created_at')
    .not('lead_status', 'in', '(Won,Lost)')

  let designRemindersSent = 0
  let bookingRemindersSent = 0

  for (const customer of customers || []) {
    const { data: design } = await supabaseAdmin.from('designs').select('status, submitted_at').eq('customer_id', customer.id).maybeSingle()
    const { data: bookings } = await supabaseAdmin.from('bookings').select('id').eq('customer_id', customer.id).eq('status', 'Confirmed')
    const hasBooking = bookings && bookings.length > 0

    if (!design && !customer.reminded_design && customer.created_at < threeDaysAgo) {
      await resend.emails.send({
        from: 'EBC <noreply@mail.ebc33.com.au>',
        to: customer.email,
        subject: 'Still thinking about your project? — Easy Building & Construction',
        html: reminderEmailHtml({
          firstName: customer.first_name,
          message: "We noticed you registered your project but haven't finished your design brief yet. It only takes a few minutes, and it helps us prepare properly for when we speak.",
          ctaText: 'Continue My Design Brief',
          ctaUrl: 'https://ebc-platform.vercel.app/portal/login',
        }),
      })
      await supabaseAdmin.from('customers').update({ reminded_design: true }).eq('id', customer.id)
      designRemindersSent++
    }

    if (design?.status === 'submitted' && !hasBooking && !customer.reminded_booking && design.submitted_at < threeDaysAgo) {
      await resend.emails.send({
        from: 'EBC <noreply@mail.ebc33.com.au>',
        to: customer.email,
        subject: 'Ready to book your consultation? — Easy Building & Construction',
        html: reminderEmailHtml({
          firstName: customer.first_name,
          message: "Thanks for submitting your design brief. The next step is booking a time to chat through your project with our team.",
          ctaText: 'Book My Consultation',
          ctaUrl: 'https://ebc-platform.vercel.app/portal/login',
        }),
      })
      await supabaseAdmin.from('customers').update({ reminded_booking: true }).eq('id', customer.id)
      bookingRemindersSent++
    }
  }

  return Response.json({ success: true, designRemindersSent, bookingRemindersSent })
}
