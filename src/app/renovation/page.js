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
      image="/projects/renovation/renovation-kitchen-hero.jpg"
      imageAlt="Completed kitchen renovation"
      lockedCategory="Renovation"
      formTitle="Renovating? Let's Talk."
      formSubtitle="Kitchen, bathroom, laundry, or a full home renovation - tell us about your project."
      gallery={[
        { type: 'beforeAfter', before: '/projects/renovation/renovation-kitchen-before.jpg', after: '/projects/renovation/renovation-kitchen-after.jpg', alt: 'Kitchen renovation', caption: 'Kitchen Renovation' },
        { type: 'beforeAfter', before: '/projects/renovation/renovation-wallremoval-before.jpg', after: '/projects/renovation/renovation-wallremoval-after.jpg', alt: 'Wall removal', caption: 'Wall Removal — Open Plan Living' },
        { type: 'beforeAfter', before: '/projects/renovation/renovation-laundry-before.jpg', after: '/projects/renovation/renovation-laundry-after.jpg', alt: 'Laundry renovation', caption: 'Laundry Renovation' },
        { type: 'beforeAfter', before: '/projects/renovation/renovation-deck-m-before.jpg', after: '/projects/renovation/renovation-deck-m-after.jpg', alt: 'Deck renovation', caption: 'Deck Renovation' },
        { type: 'video', src: '/projects/renovation/renovation-bathroom-before.mp4', caption: 'Bathroom Renovation — Before' },
        { type: 'video', src: '/projects/renovation/renovation-bathroom-after.mp4', caption: 'Bathroom Renovation — After' },
      ]}
    />
  )
}
