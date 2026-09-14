import Image from 'next/image'
import Link from 'next/link'
import { builderProfile } from '@/lib/builderProfile'

export default function MeetYourBuilder() {
  const { name, title, photo, bio, credentials } = builderProfile

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/portal" className="text-sm text-[#8A8D94] hover:text-[#1B2A4A] transition">← Back to your portal</Link>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-8 text-center">
        <div className="w-28 h-28 rounded-full bg-[#F6F5F1] border border-[#D9D6CD] mx-auto flex items-center justify-center overflow-hidden">
          <Image src={photo} alt={name} width={112} height={112} className="object-contain p-3" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>{name}</h1>
        <p className="text-sm font-medium text-[#E1601F] mt-1">{title}</p>
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>About</h2>
        <div className="mt-3 flex flex-col gap-3 text-sm text-[#3A3F4A] leading-relaxed">
          {bio.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6">
        <h2 className="font-semibold text-[#1B2A4A]" style={{ fontFamily: 'var(--font-heading)' }}>Credentials</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-[#3A3F4A]">
          {credentials.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span className="w-5 h-5 shrink-0 rounded-full bg-[#2E7D4F]/15 text-[#2E7D4F] flex items-center justify-center text-xs">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-white border border-[#D9D6CD] rounded-md p-6 text-center">
        <p className="text-sm text-[#5A5E66]">Have a question before your visit?</p>
        <Link href="/portal#message-your-builder" className="inline-block mt-3 bg-[#E1601F] text-white rounded px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
          Message Your Builder
        </Link>
      </div>
    </main>
  )
}
