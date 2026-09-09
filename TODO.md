# EBC Platform - Known issues / to fix later

- [x] Construction milestones now use MILESTONES_BY_TYPE, matched to each
      customer's actual project type. Fixed 9 Sept 2026.

- [ ] Regenerate the Resend API key (the original one was pasted into this
      chat during setup, should be rotated for safety).

- [ ] Only 4 of the 10 project types in the registration dropdown have a
      real Home Design Brief built (New home, Kitchen/Bathroom/Laundry
      renovation). The other 6 (Knockdown & rebuild, Extension, Townhouse,
      Luxury home, Full renovation, Other) now show a graceful fallback
      message instead of crashing - but they still need either:
      (a) their own real design brief sections in src/lib/designSteps.js, or
      (b) the registration dropdown trimmed to only the 4 built types.

- [ ] Customer portal is mid-build: database linked, security policy in
      place, registration creates a real login account, login page at
      /portal/login exists - but the actual /portal page (status, design
      brief, booking, construction progress) still needs to be built.
