import AdLandingPage from '../components/AdLandingPage'

export default function BathroomRenovationLanding() {
  return (
    <AdLandingPage
      eyebrow="BATHROOM RENOVATIONS"
      headline="Thinking About Renovating"
      highlight="Your Bathroom?"
      subtext="Tell us about your project and get expert guidance from Easy Building & Construction — no obligation, just a real conversation about what's possible."
      bullets={[
        'Trusted bathroom renovation specialists across Victoria',
        'Clear process from first chat to finished bathroom',
        'Registered & fully insured builder',
      ]}
      image="/projects/renovation/renovation-bathroom-hero.jpg"
      imageAlt="Completed bathroom renovation"
      lockedCategory="Renovation"
      lockedProjectType="Bathroom renovation"
      formTitle="Renovating Your Bathroom? Let's Talk."
      formSubtitle="Tell us about your bathroom renovation project."
      gallery={[
        { type: 'video', src: '/projects/renovation/renovation-bathroom-before.mp4', caption: 'Bathroom Renovation — Before' },
        { type: 'video', src: '/projects/renovation/renovation-bathroom-after.mp4', caption: 'Bathroom Renovation — After' },
      ]}
    />
  )
}
