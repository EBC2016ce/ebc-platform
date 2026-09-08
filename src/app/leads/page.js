import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function Leads() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

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
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Address</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px' }}>Project Type</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.first_name} {c.last_name}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.mobile}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.address}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{c.project_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}