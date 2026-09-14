import { getAvailableDays, getMonthAvailability } from '@/lib/booking'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    if (year && month) {
      const result = await getMonthAvailability(Number(year), Number(month))
      return Response.json(result)
    }

    const days = await getAvailableDays()
    return Response.json({ days })
  } catch (err) {
    return Response.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
