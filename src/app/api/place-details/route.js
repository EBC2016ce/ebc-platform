export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')

  if (!placeId) {
    return Response.json({ error: 'Missing placeId' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'addressComponents',
      },
    })
    const data = await res.json()

    const find = (type) => data.addressComponents?.find((c) => c.types.includes(type))?.longText || ''
    const findShort = (type) => data.addressComponents?.find((c) => c.types.includes(type))?.shortText || ''

    return Response.json({
      streetNo: find('street_number'),
      streetName: find('route'),
      state: findShort('administrative_area_level_1'),
      postalCode: find('postal_code'),
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
