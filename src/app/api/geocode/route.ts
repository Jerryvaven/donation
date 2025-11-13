import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { city, county } = await request.json()

    if (!city || !county) {
      return NextResponse.json({ error: 'City and county are required' }, { status: 400 })
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&county=${encodeURIComponent(county)}&state=California&country=USA&format=json&limit=1`
    )

    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const data = await response.json()

    if (data.length === 0) {
      return NextResponse.json({ latitude: null, longitude: null })
    }

    return NextResponse.json({
      latitude: data[0].lat,
      longitude: data[0].lon
    })
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ error: 'Failed to fetch coordinates' }, { status: 500 })
  }
}