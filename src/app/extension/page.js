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
      image="/projects/extension/extension-hero.jpg"
      imageAlt="Home extension project"
      lockedCategory="Extension"
      formTitle="Extending Your Home? Let's Talk."
      formSubtitle="Tell us about your extension project."
      gallery={[
        { type: 'video', src: '/projects/extension/extension-ad-final.mp4', orientation: 'vertical', caption: 'Extension Project Highlight' },
        { type: 'video', src: '/projects/extension/extension-highlight-vertical.mp4', orientation: 'vertical', caption: 'Extension Walkthrough' },
      ]}
    />
  )
}
