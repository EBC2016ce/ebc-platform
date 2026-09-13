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

        if (suggestions.length === 0 && data.error) {
          // Log the real reason to the server logs (Vercel) without exposing
          // it to the client, so a broken key/config shows up as an empty
          // dropdown for users but is diagnosable from the logs.
          console.error('Google Places autocomplete error:', JSON.stringify(data.error))
        }

        // TEMPORARY DEBUG - remove after diagnosing the "no suggestions" issue
        return Response.json({
          suggestions,
          _debug: {
            hasKey: !!process.env.GOOGLE_PLACES_API_KEY,
            keyLength: process.env.GOOGLE_PLACES_API_KEY ? process.env.GOOGLE_PLACES_API_KEY.length : 0,
            googleError: data.error || null,
            status: res.status,
          },
        })
  } catch (err) {
    console.error('Google Places autocomplete request failed:', err)
    return Response.json({ suggestions: [], error: err.message })
  }
}
