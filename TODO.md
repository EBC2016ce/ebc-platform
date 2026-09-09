# EBC Platform - Known issues / to fix later

- [ ] Construction milestones on the Project section are the same generic
      list (Site prep, Slab, Frame, Roof...) for EVERY project type.
      A bathroom/kitchen/laundry renovation should have its own relevant
      milestone list instead (e.g. Demolition, Waterproofing, Tiling,
      Fixtures installed, Final clean) - not new-home-building stages.
      Fix: mirror the STEPS_BY_TYPE pattern from src/lib/designSteps.js -
      create a MILESTONES_BY_TYPE lookup keyed by customer.project_type,
      used in src/app/admin/lead/page.js and src/app/api/admin/project/route.js
      instead of the single hardcoded MILESTONES array.

- [ ] Regenerate the Resend API key (the original one was pasted into this
      chat during setup, should be rotated for safety).
