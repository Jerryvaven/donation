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

const getDonorCoordinates = (donor: Donor): LatLngExpression | null => {
  // Check if latitude and longitude are stored
  if (donor.latitude && donor.longitude) {
    return [parseFloat(donor.latitude), parseFloat(donor.longitude)];
  }
  // Default to California center for donors without coordinates
  return [36.7783, -119.4179];
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

  // Group donors by coordinates
  const locationGroups: Record<string, Donor[]> = {}
  donorsWithLocation.forEach((donor) => {
    const coordinates = getDonorCoordinates(donor)
    if (!coordinates) return

    const coordArray = coordinates as [number, number]
    const key = `${coordArray[0]},${coordArray[1]}`
    if (!locationGroups[key]) {
      locationGroups[key] = []
    }
    locationGroups[key].push(donor)
  })

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
          {Object.entries(locationGroups).map(([coordKey, groupDonors]) => {
            const [latStr, lngStr] = coordKey.split(',')
            const coordinates: LatLngExpression = [parseFloat(latStr), parseFloat(lngStr)]

            return (
              <Marker key={coordKey} position={coordinates}>
                <Popup>
                  <div className="text-sm max-w-64">
                    <div className="font-semibold mb-2">
                      {groupDonors.length === 1
                        ? `${groupDonors[0].city && groupDonors[0].county
                            ? `${groupDonors[0].city}, ${groupDonors[0].county}`
                            : groupDonors[0].county || groupDonors[0].city}`
                        : `${groupDonors.length} donors at this location`}
                    </div>
                    {groupDonors.map((donor, index) => (
                      <div key={donor.id} className="mb-1 last:mb-0">
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-green-600">
                          Total: ${donor.total_donated.toFixed(2)}
                        </div>
                        {index < groupDonors.length - 1 && <hr className="my-1" />}
                      </div>
                    ))}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Showing {Object.keys(locationGroups).length} locations for {donorsWithLocation.length} donors with location data
      </div>
    </div>
  )
}