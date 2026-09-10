'use client'
import RegistrationForm from '@/components/RegistrationForm'

export default function ExtensionLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <RegistrationForm
        lockedCategory="Extension"
        title="Extending Your Home? Let's Talk."
        subtitle="Tell us about your extension project."
      />
    </main>
  )
}
