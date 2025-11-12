import type { Donor } from '@/hooks/useDonors'

interface DonorListItemProps {
  donor: Donor
  index: number
}

export default function DonorListItem({ donor, index }: DonorListItemProps) {
  return (
    <li
      className={`px-6 py-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold ${
              index === 0 ? 'bg-yellow-400 text-yellow-900' :
              index === 1 ? 'bg-gray-300 text-gray-800' :
              index === 2 ? 'bg-orange-300 text-orange-800' :
              'bg-indigo-500 text-white'
            }`}>
              {index + 1}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">{donor.name}</div>
            <div className="text-sm text-gray-500">
              {donor.city && donor.county ? `${donor.city}, ${donor.county}` : donor.county || donor.city || 'Unknown location'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            ${donor.total_donated.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            Joined {new Date(donor.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </li>
  )
}