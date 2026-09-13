export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  if (!input || input.length < 3) {
    return Response.json({ suggestions: [] })
  }

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ['au'],
      }),
    })
    const data = await res.json()

        const suggestions = (data.suggestions || []).map((s) => ({
      text: s.placePrediction?.text?.text || '',
      placeId: s.placePrediction?.placeId || '',
    }))

        // TEMP DEBUG: surface Google's raw response when nothing comes back,
        // so we can see the real error instead of a silent empty array.
        // Remove this once the autocomplete issue is confirmed fixed.
        if (suggestions.length === 0) {
          return Response.json({ suggestions, googleDebug: data, hasKey: !!process.env.GOOGLE_PLACES_API_KEY })
        }

        return Response.json({ suggestions })
  } catch (err) {
    return Response.json({ suggestions: [], error: err.message })
  }
}
