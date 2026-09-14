import RegistrationForm from '@/components/RegistrationForm'

export const metadata = {
  title: 'Register Your Project',
  description: 'Tell us about your new build, renovation or extension project and get started with Easy Building & Construction.',
  alternates: { canonical: '/register' },
}

export default function Register() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <RegistrationForm />
    </main>
  )
}
