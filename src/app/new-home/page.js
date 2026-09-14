import AdLandingPage from '../components/AdLandingPage'

export default function NewHomeLanding() {
  return (
    <AdLandingPage
      eyebrow="NEW HOME BUILDS"
      headline="Building New?"
      highlight="Let's Build It Right."
      subtext="Knockdown & rebuild or a vacant block — get a clear plan and a fixed quote from a licensed Melbourne builder."
      bullets={[
        'Fixed-price quotes, no surprise costs',
        '15+ years building homes across Victoria',
        'Registered & fully insured builder',
      ]}
      image="/projects/new-home/new-home-hero.jpg"
      imageAlt="New home slab under construction"
      lockedCategory="New Building"
      formTitle="Building New? Let's Talk."
      formSubtitle="Knockdown & rebuild or a vacant block - tell us about your project."
      gallery={[
        { type: 'video', src: '/projects/new-home/new-home-waffle-work.mp4', caption: 'Waffle Pod Slab — Foundation Stage' },
      ]}
    />
  )
}
