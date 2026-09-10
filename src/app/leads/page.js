import { requireStaff } from '@/lib/checkStaff'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function Leads() {
  const { authorized } = await requireStaff()
  if (!authorized) {
    redirect('/login')
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('id', { ascending: false })

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Leads</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Mobile</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Project Type</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                <Link href={'/admin/lead?customerId=' + c.id} style={{ color: '#1B2A4A', fontWeight: 600 }}>
                  {c.first_name} {c.last_name}
                </Link>
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.mobile}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.project_type}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.lead_status || 'New'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
