# EBC Platform - Known issues / to fix later

Everything from the original list is closed out, plus:

- [x] Fixed a real security gap: previously ANY logged-in user (including
      customers) could access staff admin pages/routes. Now a proper
      staff_users allowlist exists (3 real staff accounts), and every
      single admin page + API route checks against it via requireStaff().
      Verified: staff access works, customer access is correctly blocked.
      Fixed 10 Sept 2026.

Future improvements (SMS, deeper analytics, Google Ads integration, SEO,
audit logging) should be driven by real customer/staff usage now that
the platform is live and secure.
