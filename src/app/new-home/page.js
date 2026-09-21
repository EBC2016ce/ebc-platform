import AdLandingPage from '../components/AdLandingPage'
import ServiceContent from '../components/ServiceContent'
import { NEW_HOME } from '@/lib/serviceContent'

export const metadata = {
  title: 'New Home Builders Melbourne | Knockdown Rebuilds & Custom Homes',
  description: 'Registered Melbourne builder for knockdown rebuilds and custom new homes in the Eastern Suburbs. Clear quotes and a free consultation - register your project online.',
  alternates: { canonical: '/new-home' },
  openGraph: {
    title: 'New Home Builders Melbourne | Easy Building & Construction',
    description: 'Registered Melbourne builder for knockdown rebuilds and custom new homes in the Eastern Suburbs. Clear quotes and a free consultation - register your project online.',
    url: '/new-home',
  },
}

export default function NewHomeLanding() {
  return (
    <AdLandingPage
      eyebrow="NEW HOME BUILDS · MELBOURNE EASTERN SUBURBS"
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
    >
      <ServiceContent content={NEW_HOME} description={metadata.description} />
    </AdLandingPage>
  )
}
