import { redirect } from 'next/navigation'

// There is no separate bathroom-renovation landing page — bathroom
// renovation is just one of the project types on the main Renovation
// landing page. This route only exists in case an old ad or bookmark
// still points here; it sends visitors straight to the real page instead
// of 404ing.
export default function BathroomRenovationRedirect() {
  redirect('/renovation')
}
