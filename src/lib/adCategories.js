// Shared between src/app/ad-consult/page.js (the ProjectStep picker) and
// src/app/api/ad-consult/resolve-lead/route.js (mapping a Meta Instant
// Form's custom-question answer back to the same category/projectType
// shape). Kept in one place so the two can't drift out of sync — if this
// list changes, the Instant Form's custom question answers need to match
// it exactly (see docs/meta-instant-form-setup for the current wording).
export const CATEGORIES = {
  Renovation: ['Kitchen renovation', 'Bathroom renovation', 'Laundry renovation', 'Powder room', 'Full renovation'],
  'New Building': ['New home'],
  Extension: ['Extension'],
}

// Given a projectType string (e.g. "Kitchen renovation" or "New home"),
// find which top-level category it belongs to. Used to reconstruct the
// category the client-side ProjectStep would have set, from just the
// projectType answer a lead form question gives us.
export function categoryForProjectType(projectType) {
  for (const [category, options] of Object.entries(CATEGORIES)) {
    if (options.includes(projectType)) return category
  }
  return ''
}
