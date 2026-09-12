import AdLandingPage from '../components/AdLandingPage'

export default function ExtensionLanding() {
  return (
    <AdLandingPage
      eyebrow="HOME EXTENSIONS"
      headline="Need More Space?"
      highlight="Extend, Don't Move."
      subtext="Seamless extensions that expand your living space and blend naturally with your existing home."
      bullets={[
        'Extensions designed to match your existing home',
        'Clear process from design through to handover',
        'Registered & fully insured builder',
      ]}
      image="/before-1.jpg"
      imageAlt="Home extension project"
      lockedCategory="Extension"
      formTitle="Extending Your Home? Let's Talk."
      formSubtitle="Tell us about your extension project."
    />
  )
}
