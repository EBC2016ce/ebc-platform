'use client'
import RegistrationForm from '@/components/RegistrationForm'

export default function RenovationLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <RegistrationForm
        lockedCategory="Renovation"
        title="Renovating? Let's Talk."
        subtitle="Kitchen, bathroom, laundry, or a full home renovation - tell us about your project."
      />
    </main>
  )
}
