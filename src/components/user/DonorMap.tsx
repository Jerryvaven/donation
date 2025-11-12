'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { LatLngExpression } from 'leaflet'
import type { Donor } from '@/hooks/useDonors'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Simple geocoding mapping for California counties (approximate coordinates)
const countyCoordinates: Record<string, [number, number]> = {
  'Alameda': [37.8044, -122.2711],
  'Alpine': [38.5941, -119.8224],
  'Amador': [38.4458, -120.6560],
  'Butte': [39.6255, -121.5370],
  'Calaveras': [38.1960, -120.6805],
  'Colusa': [39.1041, -122.2330],
  'Contra Costa': [37.8534, -121.9018],
  'Del Norte': [41.7425, -124.1697],
  'El Dorado': [38.7426, -120.4358],
  'Fresno': [36.7378, -119.7871],
  'Glenn': [39.5980, -122.0111],
  'Humboldt': [40.7450, -123.8695],
  'Imperial': [33.0114, -115.4734],
  'Inyo': [36.5588, -118.4201],
  'Kern': [35.3733, -118.3947],
  'Kings': [36.3275, -119.6476],
  'Lake': [39.0846, -122.7633],
  'Lassen': [40.6731, -120.5937],
  'Los Angeles': [34.0522, -118.2437],
  'Madera': [37.2519, -119.6963],
  'Marin': [38.0834, -122.7633],
  'Mariposa': [37.5701, -119.9037],
  'Mendocino': [39.3077, -123.7994],
  'Merced': [37.1894, -120.7213],
  'Modoc': [41.5894, -120.7241],
  'Mono': [37.9219, -118.9529],
  'Monterey': [36.6002, -121.8947],
  'Napa': [38.5025, -122.2654],
  'Nevada': [39.2594, -121.0167],
  'Orange': [33.7175, -117.8311],
  'Placer': [39.0617, -120.7167],
  'Plumas': [39.9927, -120.8039],
  'Riverside': [33.9533, -117.3961],
  'Sacramento': [38.5816, -121.4944],
  'San Benito': [36.5761, -120.9876],
  'San Bernardino': [34.1083, -117.2898],
  'San Diego': [32.7157, -117.1611],
  'San Francisco': [37.7749, -122.4194],
  'San Joaquin': [37.9358, -121.2897],
  'San Luis Obispo': [35.2828, -120.6596],
  'San Mateo': [37.5625, -122.3255],
  'Santa Barbara': [34.4208, -119.6982],
  'Santa Clara': [37.3541, -121.9552],
  'Santa Cruz': [36.9741, -122.0308],
  'Shasta': [40.5865, -122.0405],
  'Sierra': [39.5779, -120.5201],
  'Siskiyou': [41.5914, -122.5405],
  'Solano': [38.3105, -121.8805],
  'Sonoma': [38.2919, -122.4580],
  'Stanislaus': [37.5091, -120.9876],
  'Sutter': [39.2847, -121.6942],
  'Tehama': [40.1255, -122.2374],
  'Trinity': [40.6329, -123.1141],
  'Tulare': [36.2077, -119.3477],
  'Tuolumne': [37.8551, -120.3571],
  'Ventura': [34.3705, -119.1391],
  'Yolo': [38.7646, -121.9018],
  'Yuba': [39.2547, -121.3999]
}

// City coordinates for major California cities
const cityCoordinates: Record<string, [number, number]> = {
  'Beverly Hills': [34.0736, -118.4004],
  'Los Angeles': [34.0522, -118.2437],
  'San Francisco': [37.7749, -122.4194],
  'San Diego': [32.7157, -117.1611],
  'San Jose': [37.3382, -121.8863],
  'Sacramento': [38.5816, -121.4944],
  'Fresno': [36.7378, -119.7871],
  'Long Beach': [33.7701, -118.1937],
  'Oakland': [37.8044, -122.2712],
  'Bakersfield': [35.3733, -119.0187],
  'Anaheim': [33.8366, -117.9143],
  'Santa Ana': [33.7455, -117.8677],
  'Riverside': [33.9533, -117.3962],
  'Stockton': [37.9577, -121.2908],
  'Irvine': [33.6846, -117.8265],
  'Chula Vista': [32.6401, -117.0842],
  'Fremont': [37.5485, -121.9886],
  'San Bernardino': [34.1083, -117.2898],
  'Modesto': [37.6391, -120.9969],
  'Fontana': [34.0922, -117.4350],
  'Oxnard': [34.1975, -119.1771],
  'Moreno Valley': [33.9425, -117.2297],
  'Huntington Beach': [33.6603, -117.9992],
  'Glendale': [34.1425, -118.2551],
  'Santa Clarita': [34.3917, -118.5426],
  'Garden Grove': [33.7739, -117.9414],
  'Oceanside': [33.1959, -117.3795],
  'Rancho Cucamonga': [34.1064, -117.5931],
  'Santa Rosa': [38.4404, -122.7141],
  'Ontario': [34.0633, -117.6509],
  'Elk Grove': [38.4088, -121.3716],
  'Corona': [33.8753, -117.5664],
  'Lancaster': [34.6868, -118.1542],
  'Palmdale': [34.5794, -118.1165],
  'Salinas': [36.6777, -121.6555],
  'Pomona': [34.0551, -117.7500],
  'Hayward': [37.6688, -122.0808],
  'Escondido': [33.1192, -117.0864],
  'Torrance': [33.8358, -118.3406],
  'Sunnyvale': [37.3688, -122.0363],
  'Pasadena': [34.1478, -118.1445],
  'Orange': [33.7879, -117.8531],
  'Fullerton': [33.8704, -117.9242],
  'Thousand Oaks': [34.1706, -118.8376],
  'Visalia': [36.3302, -119.2921],
  'Roseville': [38.7521, -121.2880],
  'Concord': [37.9780, -122.0311],
  'Simi Valley': [34.2694, -118.7815],
  'Santa Clara': [37.3541, -121.9552],
  'Vallejo': [38.1041, -122.2566]
}

const getDonorCoordinates = (donor: Donor): LatLngExpression | null => {
  // First try to match city
  if (donor.city && cityCoordinates[donor.city]) {
    return cityCoordinates[donor.city]
  }
  // Then try to match county
  if (donor.county && countyCoordinates[donor.county]) {
    return countyCoordinates[donor.county]
  }
  // Default to California center if no match
  return [36.7783, -119.4179] // California center
}

interface DonorMapProps {
  donors: Donor[]
}

export default function DonorMap({ donors }: DonorMapProps) {
  const [isClient, setIsClient] = useState(false)

  // Fix for Leaflet icons in Next.js
  useEffect(() => {
    setIsClient(true)

    // Only run on client side
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
    }
  }, [])

  if (!isClient) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Donor Locations Map
        </h3>
        <div className="h-96 w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Loading map...</span>
        </div>
      </div>
    )
  }

  const donorsWithLocation = donors.filter(donor => donor.city || donor.county)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Donor Locations Map
      </h3>
      <div className="h-96 w-full rounded-lg overflow-hidden">
        <MapContainer
          center={[36.7783, -119.4179]} // California center
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {donorsWithLocation.map((donor) => {
            const coordinates = getDonorCoordinates(donor)
            if (!coordinates) return null

            return (
              <Marker key={donor.id} position={coordinates}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{donor.name}</div>
                    <div className="text-gray-600">
                      {donor.city && donor.county
                        ? `${donor.city}, ${donor.county}`
                        : donor.county || donor.city}
                    </div>
                    <div className="text-green-600 font-medium">
                      ${donor.total_donated.toFixed(2)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Showing locations for {donorsWithLocation.length} donors with location data
      </div>
    </div>
  )
}