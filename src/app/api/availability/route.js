import { getAvailableDays } from '@/lib/booking'

export async function GET() {
  try {
    const days = await getAvailableDays()
    return Response.json({ days })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
