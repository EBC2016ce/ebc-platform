export function buildGoogleCalendarLink({ title, dateISO, timeLabel, durationMinutes = 60, description, location }) {
  const [time, meridiem] = timeLabel.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0

  const start = new Date(dateISO)
  start.setHours(hours, minutes, 0, 0)
  const end = new Date(start.getTime() + durationMinutes * 60000)

  const format = (d) => d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${format(start)}/${format(end)}`,
    details: description || '',
    location: location || '',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
export function verificationEmailHtml({ firstName, code, projectType }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#F6F5F1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #D9D6CD; border-radius:4px; overflow:hidden;">

          <tr>
            <td style="background-color:#ffffff; padding: 28px 40px 20px 40px; text-align:center; border-bottom:1px solid #EAE7E0;">
              <img src="https://easybcon.com.au/logo-icon.png" alt="EBC" width="110" height="54" style="display:block; margin: 0 auto;" />
              <div style="color:#1B2A4A; font-size:19px; font-weight:bold; margin-top:14px; font-family: Arial, Helvetica, sans-serif;">
                Easy Building &amp; Construction Pty Ltd
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <p style="font-size:16px; color:#171A1F; margin:0 0 16px 0;">Hi ${firstName},</p>
              <p style="font-size:15px; color:#333333; line-height:1.6; margin:0 0 24px 0;">
                Thanks for registering your <strong>${projectType || 'project'}</strong> with EBC.
                Enter the code below to confirm your email and keep things moving.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <div style="display:inline-block; border:2px dashed #1B2A4A; border-radius:6px; padding: 16px 32px;">
                      <span style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#E1601F; font-family: 'Courier New', monospace;">${code}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px; color:#8B8D89; text-align:center; margin:0 0 24px 0;">
                This code expires in 15 minutes.
              </p>

              <p style="font-size:14px; color:#5A5E66; line-height:1.6; margin:0;">
                Once you're verified, one of our team will be in touch personally to talk through your project —
                no call centres, just a real conversation about what you're planning.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#F6F5F1; padding: 20px 40px; text-align:center; border-top:1px solid #D9D6CD;">
              <p style="font-size:12px; color:#8B8D89; margin:0;">
                This is a transactional email regarding your registration.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function bookingConfirmationEmailHtml({ firstName, appointmentType, dateLabel, time, calendarLink }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#F6F5F1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #D9D6CD; border-radius:4px; overflow:hidden;">

          <tr>
            <td style="background-color:#ffffff; padding: 28px 40px 20px 40px; text-align:center; border-bottom:1px solid #EAE7E0;">
              <img src="https://easybcon.com.au/logo-icon.png" alt="EBC" width="110" height="54" style="display:block; margin: 0 auto;" />
              <div style="color:#1B2A4A; font-size:19px; font-weight:bold; margin-top:14px; font-family: Arial, Helvetica, sans-serif;">
                Easy Building &amp; Construction Pty Ltd
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <p style="font-size:16px; color:#171A1F; margin:0 0 16px 0;">Hi ${firstName},</p>
              <p style="font-size:15px; color:#333333; line-height:1.6; margin:0 0 24px 0;">
                You're confirmed for your ${appointmentType.toLowerCase()}. Here are the details:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <div style="display:inline-block; border:2px solid #1B2A4A; border-radius:6px; padding: 16px 32px; text-align:center;">
                      <span style="font-size:18px; font-weight:bold; color:#1B2A4A;">${dateLabel}</span><br/>
                      <span style="font-size:16px; color:#E1601F;">${time}</span>
                    </div>
                  </td>
                </tr>
              </table>

                            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="${calendarLink}" style="display:inline-block; background-color:#0068D8; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:4px; font-size:14px;">
                      Add to Google Calendar
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:14px; color:#5A5E66; line-height:1.6; margin:0 0 20px 0;">
                An EBC team member will be in touch ahead of time. You'll also get a text message reminder closer to the date.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#FFF6F0; border:1px solid #E1601F33; border-radius:6px; padding:14px 18px;">
                    <p style="font-size:13px; color:#5A5E66; line-height:1.6; margin:0;">
                      <strong style="color:#1B2A4A;">Need to reschedule or cancel?</strong><br/>
                      Just reply to this email or call us at least <strong>24 hours</strong> before your appointment and we'll happily find a new time.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#F6F5F1; padding: 20px 40px; text-align:center; border-top:1px solid #D9D6CD;">
              <p style="font-size:12px; color:#8B8D89; margin:0;">
                This is a transactional email regarding your booking.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Sent ~2 hours before an appointment, by the cron job at
// /api/cron/appointment-reminders — the "text message reminder closer to
// the date" the booking confirmation email already promises.
export function appointmentReminderEmailHtml({ firstName, appointmentType, dateLabel, time }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#F6F5F1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #D9D6CD; border-radius:4px; overflow:hidden;">

          <tr>
            <td style="background-color:#ffffff; padding: 28px 40px 20px 40px; text-align:center; border-bottom:1px solid #EAE7E0;">
              <img src="https://easybcon.com.au/logo-icon.png" alt="EBC" width="110" height="54" style="display:block; margin: 0 auto;" />
              <div style="color:#1B2A4A; font-size:19px; font-weight:bold; margin-top:14px; font-family: Arial, Helvetica, sans-serif;">
                Easy Building &amp; Construction Pty Ltd
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <p style="font-size:16px; color:#171A1F; margin:0 0 16px 0;">Hi ${firstName},</p>
              <p style="font-size:15px; color:#333333; line-height:1.6; margin:0 0 24px 0;">
                Just a reminder — your ${appointmentType.toLowerCase()} with Easy Building &amp; Construction is coming up in about 2 hours.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <div style="display:inline-block; border:2px solid #1B2A4A; border-radius:6px; padding: 16px 32px; text-align:center;">
                      <span style="font-size:18px; font-weight:bold; color:#1B2A4A;">${dateLabel}</span><br/>
                      <span style="font-size:16px; color:#E1601F;">${time}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; color:#5A5E66; line-height:1.6; margin:0;">
                See you soon! If you need to reschedule, just reply to this email or give us a call as soon as you can.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#F6F5F1; padding: 20px 40px; text-align:center; border-top:1px solid #D9D6CD;">
              <p style="font-size:12px; color:#8B8D89; margin:0;">
                This is a transactional email regarding your upcoming appointment.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function reminderEmailHtml({ firstName, message, ctaText, ctaUrl }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#F6F5F1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #D9D6CD; border-radius:4px; overflow:hidden;">

          <tr>
            <td style="background-color:#ffffff; padding: 28px 40px 20px 40px; text-align:center; border-bottom:1px solid #EAE7E0;">
              <img src="https://easybcon.com.au/logo-icon.png" alt="EBC" width="110" height="54" style="display:block; margin: 0 auto;" />
              <div style="color:#1B2A4A; font-size:19px; font-weight:bold; margin-top:14px; font-family: Arial, Helvetica, sans-serif;">
                Easy Building &amp; Construction Pty Ltd
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <p style="font-size:16px; color:#171A1F; margin:0 0 16px 0;">Hi ${firstName},</p>
              <p style="font-size:15px; color:#333333; line-height:1.6; margin:0 0 24px 0;">
                ${message}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="${ctaUrl}" style="display:inline-block; background-color:#0068D8; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:4px; font-size:14px;">
                      ${ctaText}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#F6F5F1; padding: 20px 40px; text-align:center; border-top:1px solid #D9D6CD;">
              <p style="font-size:12px; color:#8B8D89; margin:0;">
                Melbourne, Victoria — reply to this email any time.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// A branded "new blog post" announcement email, sent to clients when a
// staff member publishes an article from /admin/blog.
export function blogPostEmailHtml({ title, excerpt, url, unsubscribeUrl }) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#F6F5F1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #D9D6CD; border-radius:4px; overflow:hidden;">

          <tr>
            <td style="background-color:#ffffff; padding: 28px 40px 20px 40px; text-align:center; border-bottom:1px solid #EAE7E0;">
              <img src="https://easybcon.com.au/logo-icon.png" alt="EBC" width="110" height="54" style="display:block; margin: 0 auto;" />
              <div style="color:#1B2A4A; font-size:19px; font-weight:bold; margin-top:14px; font-family: Arial, Helvetica, sans-serif;">
                Easy Building &amp; Construction Pty Ltd
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 40px 24px 40px;">
              <p style="font-size:12px; color:#8A8D94; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 8px 0;">New from the EBC blog</p>
              <h1 style="font-size:21px; color:#1B2A4A; margin:0 0 14px 0; font-family: Arial, Helvetica, sans-serif;">${title}</h1>
              <p style="font-size:15px; color:#333333; line-height:1.6; margin:0 0 24px 0;">${excerpt || ''}</p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <a href="${url}" style="display:inline-block; background-color:#0068D8; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 28px; border-radius:4px; font-size:14px;">
                      Read the full article
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#F6F5F1; padding: 20px 40px; text-align:center; border-top:1px solid #D9D6CD;">
              <p style="font-size:12px; color:#8B8D89; margin:0;">
                Melbourne, Victoria — you're receiving this because you've registered a project with EBC.
                ${unsubscribeUrl ? `<br/><a href="${unsubscribeUrl}" style="color:#8B8D89;">Unsubscribe from these emails</a>` : ''}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

function statCard(label, value, color) {
  return `
    <td width="25%" valign="top" style="padding:4px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; border-radius:6px;">
        <tr>
          <td style="padding:14px 10px; text-align:center;">
            <div style="font-size:20px; font-weight:bold; color:${color || '#1B2A4A'}; font-family: Arial, Helvetica, sans-serif;">${value}</div>
            <div style="font-size:11px; color:#8A8D94; margin-top:2px;">${label}</div>
          </td>
        </tr>
      </table>
    </td>
  `
}

function barRow(label, count, max, color) {
  const pct = max > 0 ? Math.max(Math.round((count / max) * 100), count > 0 ? 6 : 0) : 0
  return `
    <tr>
      <td style="padding:5px 0; font-size:13px; color:#4A4E56; width:110px;">${label}</td>
      <td style="padding:5px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEE8; border-radius:4px;">
          <tr>
            <td style="background-color:${color || '#1B2A4A'}; width:${pct}%; height:14px; border-radius:4px; font-size:1px; line-height:14px;">&nbsp;</td>
            <td></td>
          </tr>
        </table>
      </td>
      <td style="padding:5px 0 5px 10px; font-size:13px; font-weight:bold; color:#1B2A4A; text-align:right; width:30px;">${count}</td>
    </tr>
  `
}

function sectionHeading(title, subtitle) {
  return `
    <tr>
      <td style="padding: 28px 0 10px 0;">
        <div style="font-size:15px; font-weight:bold; color:#1B2A4A; font-family: Arial, Helvetica, sans-serif;">${title}</div>
        ${subtitle ? `<div style="font-size:12px; color:#8A8D94; margin-top:2px;">${subtitle}</div>` : ''}
      </td>
    </tr>
  `
}

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { maximumFractionDigits: 0 })

// A polished, five-section leads report email — pipeline, sources,
// follow-up/response, quotes & revenue, and project category performance —
// with a link through to the live dashboard for the full drill-down.
export function leadsReportEmailHtml(data, reportUrl) {
  const { pipeline, sources, followUp, revenue, categories } = data
  const maxStatus = Math.max(...pipeline.byStatus.map((s) => s.count), 1)
  const statusColor = (s) => (s === 'Won' ? '#2E7D4F' : s === 'Lost' ? '#A23B2E' : '#1B2A4A')

  const topSources = sources.slice(0, 5)
  const maxSource = Math.max(...topSources.map((s) => s.count), 1)

  const followUpRows = (followUp.needsFollowUp || []).slice(0, 5).map((c) => `
    <tr>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#1B2A4A;">${c.name}</td>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#5A5E66;">${c.projectType || ''}</td>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; font-weight:bold; color:${c.daysSinceContact >= 7 ? '#A23B2E' : '#E1601F'}; text-align:right;">${c.daysSinceContact}d</td>
    </tr>
  `).join('') || `<tr><td colspan="3" style="padding:8px 0; font-size:13px; color:#8A8D94;">Nothing overdue — great work.</td></tr>`

  const catRows = categories.map((c) => `
    <tr>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#1B2A4A; font-weight:bold;">${c.category}</td>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#5A5E66; text-align:center;">${c.total}</td>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#2E7D4F; text-align:center;">${c.won}</td>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#5A5E66; text-align:center;">${c.winRate === null ? '—' : c.winRate + '%'}</td>
      <td style="padding:6px 0; border-top:1px solid #EEE; font-size:13px; color:#1B2A4A; text-align:right; font-weight:bold;">${money(c.acceptedValue)}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#F6F5F1; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F5F1; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #D9D6CD; border-radius:6px; overflow:hidden;">

          <tr>
            <td style="background-color:#1B2A4A; padding: 26px 40px; text-align:center;">
              <img src="https://easybcon.com.au/logo-icon.png" alt="EBC" width="100" height="49" style="display:block; margin: 0 auto;" />
              <div style="color:#ffffff; font-size:18px; font-weight:bold; margin-top:12px; font-family: Arial, Helvetica, sans-serif;">
                Leads &amp; Pipeline Report
              </div>
              <div style="color:#C9D2E3; font-size:12px; margin-top:4px;">
                ${new Date(data.generatedAt).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px 10px 40px;">

              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionHeading('1. Pipeline &amp; Conversion', 'Where every lead currently sits, and how many convert to won jobs.')}
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${statCard('Total leads', pipeline.total)}
                  ${statCard('New this week', pipeline.newThisWeek)}
                  ${statCard('Win rate', pipeline.winRate === null ? '—' : pipeline.winRate + '%', '#2E7D4F')}
                  ${statCard('Active', pipeline.active, '#3C6FB0')}
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                ${pipeline.byStatus.map((s) => barRow(s.status, s.count, maxStatus, statusColor(s.status))).join('')}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionHeading('2. Lead Sources', 'Which marketing channels bring in the most (and best-converting) leads.')}
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${topSources.length === 0
                  ? '<tr><td style="font-size:13px; color:#8A8D94; padding:6px 0;">No source data yet.</td></tr>'
                  : topSources.map((s) => barRow(`${s.source}${s.winRate !== null ? ' (' + s.winRate + '%)' : ''}`, s.count, maxSource, '#3C6FB0')).join('')}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionHeading('3. Follow-up &amp; Response', 'Leads waiting on a reply — the longer these sit, the more likely you lose them.')}
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${statCard('Unread messages', followUp.unreadMessages, '#E1601F')}
                  ${statCard('New, not opened', followUp.unviewedLeads, '#E1601F')}
                  ${statCard('Never contacted', followUp.neverContacted, '#A23B2E')}
                  ${statCard("Stale 'New' 7d+", followUp.staleNew, '#A23B2E')}
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
                <tr>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px;">Name</td>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px;">Project</td>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px; text-align:right;">Waiting</td>
                </tr>
                ${followUpRows}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionHeading('4. Quotes &amp; Revenue', 'The dollar value moving through your pipeline right now.')}
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${statCard('Total quoted', money(revenue.totalQuoted))}
                  ${statCard('Accepted', money(revenue.accepted), '#2E7D4F')}
                  ${statCard('Awaiting reply', money(revenue.outstanding), '#E1601F')}
                  ${statCard('Quote win rate', revenue.quoteWinRate === null ? '—' : revenue.quoteWinRate + '%')}
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionHeading('5. Project Category Performance', 'Which project type brings in the most leads and converts best.')}
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px;">Category</td>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px; text-align:center;">Leads</td>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px; text-align:center;">Won</td>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px; text-align:center;">Win %</td>
                  <td style="font-size:11px; color:#8A8D94; text-transform:uppercase; padding-bottom:4px; text-align:right;">Accepted $</td>
                </tr>
                ${catRows}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0 10px 0;">
                    <a href="${reportUrl}" style="display:inline-block; background-color:#0068D8; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 28px; border-radius:4px; font-size:14px;">
                      View full report &amp; manage leads
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color:#F6F5F1; padding: 18px 40px; text-align:center; border-top:1px solid #D9D6CD;">
              <p style="font-size:11px; color:#8B8D89; margin:0;">
                Sent from your EBC admin dashboard.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
