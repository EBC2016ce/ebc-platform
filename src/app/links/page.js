export default function LinksHub() {
  const Section = ({ title, links }) => (
    <div className="bg-white border border-[#D9D6CD] rounded-md p-6">
      <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#1B2A4A] underline">
            {l.label} <span className="text-[#8B8D89]">({l.href})</span>
          </a>
        ))}
      </div>
    </div>
  )

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>
        EBC Platform - Quick Links
      </h1>
      <p className="text-sm text-[#5A5E66] mt-1">Internal reference page, not linked from the public site.</p>

      <div className="mt-8 flex flex-col gap-6">
        <Section title="Customer Registration (create test users here)" links={[
          { label: 'Main site registration', href: '/register' },
          { label: 'Renovation campaign page', href: '/renovation' },
          { label: 'New Home campaign page', href: '/new-home' },
          { label: 'Extension campaign page', href: '/extension' },
        ]} />

        <Section title="Customer-Facing" links={[
          { label: 'Homepage', href: '/' },
          { label: 'Customer portal login', href: '/portal/login' },
          { label: 'Customer portal (once logged in)', href: '/portal' },
          { label: 'Privacy Policy', href: '/privacy' },
        ]} />

        <Section title="Staff / Admin" links={[
          { label: 'Staff login', href: '/login' },
          { label: 'Leads list', href: '/leads' },
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Availability settings', href: '/admin/availability' },
        ]} />
      </div>
    </main>
  )
}
