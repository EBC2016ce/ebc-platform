import AdLandingPage from '../components/AdLandingPage'

export default function RenovationLanding() {
  return (
    <AdLandingPage
      eyebrow="HOME RENOVATIONS"
      headline="Renovating?"
      highlight="Let's Talk Kitchens & Bathrooms."
      subtext="Kitchen, bathroom, laundry, or a full home renovation — tell us about your project and get a clear plan within days."
      bullets={[
        'Premium finishes, practical layouts',
        'Tight-knit team & careful craftsmanship',
        'Timely, budget-friendly delivery',
      ]}
      image="/project2-after.jpg"
      imageAlt="Completed kitchen renovation"
      lockedCategory="Renovation"
      formTitle="Renovating? Let's Talk."
      formSubtitle="Kitchen, bathroom, laundry, or a full home renovation - tell us about your project."
    />
  )
}
