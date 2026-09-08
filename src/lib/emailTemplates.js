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
            <td style="background-color:#1B2A4A; padding: 32px 40px; text-align:center;">
              <img src="https://ebc-platform.vercel.app/logo.png" alt="EBC" width="56" height="56" style="display:block; margin: 0 auto;" />
              <div style="color:#ffffff; font-size:18px; font-weight:bold; margin-top:14px;">
                Easy Building &amp; Construction Pty Ltd.
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
                Easy Building &amp; Construction Pty Ltd. — this is a transactional email regarding your registration.
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
