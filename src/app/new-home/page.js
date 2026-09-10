'use client'
import RegistrationForm from '@/components/RegistrationForm'

export default function NewHomeLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <RegistrationForm
        lockedCategory="New Building"
        title="Building New? Let's Talk."
        subtitle="Knockdown & rebuild or a vacant block - tell us about your project."
      />
    </main>
  )
}
