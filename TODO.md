# EBC Platform - Known issues / to fix later

Everything from the original list is closed out, plus:

- [x] Fixed a real security gap: proper staff_users allowlist now controls
      all admin access, not just "is anyone logged in". Fixed 10 Sept 2026.

- [x] Simplified New Home and Renovation design briefs to short, focused
      forms matching the client's sketches. Extension brief still uses the
      earlier, longer version pending a finalized sketch. Fixed 10 Sept 2026.

- [x] Added Google Places address autocomplete (server-side proxy, key
      never exposed to browser) - applies to all registration forms since
      they share one component. Fixed 10 Sept 2026.

- [x] Extracted shared RegistrationForm component + built 3 campaign
      landing pages (/renovation, /new-home, /extension) for social media
      ad traffic, each skipping straight to the right category. Fixed
      10 Sept 2026.

- [ ] Still pending: convert the multi-step wizard design briefs into a
      single-page layout (all questions + 13-item file upload + one
      Submit button, per the client's sketch). Need to clarify exact file
      category count/list before rebuilding.

- [ ] Extension design brief sketch not yet finalized by client - current
      version may need revisiting once that sketch is ready.
