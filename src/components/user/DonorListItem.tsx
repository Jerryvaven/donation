import type { Donor } from '@/hooks/useDonors'

interface DonorListItemProps {
  donor: Donor
  index: number
  darkMode: boolean
}

export default function DonorListItem({ donor, index, darkMode }: DonorListItemProps) {
  return (
    <li
      className={`px-6 py-4 transition-all duration-200 cursor-pointer ${
        darkMode ? 'hover:bg-[rgba(255,255,255,0.08)]' : 'hover:bg-gray-50'
      } ${
        index < 3 ? (darkMode ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-gradient-to-r from-yellow-50 to-transparent') : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold ${
              index === 0 ? 'bg-yellow-400 text-yellow-900' :
              index === 1 ? 'bg-gray-300 text-gray-800' :
              index === 2 ? 'bg-orange-300 text-orange-800' :
              (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-indigo-500 text-white')
            }`}>
              {index + 1}
            </span>
          </div>
          <div className="ml-4">
            <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{donor.name}</div>
            <div className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>
              {donor.city && donor.county ? `${donor.city}, ${donor.county}` : donor.county || donor.city || 'Unknown location'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${darkMode ? 'text-[#22C55E]' : 'text-green-600'}`}>
            ${donor.total_donated.toFixed(2)}
          </div>
          <div className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
            Joined {new Date(donor.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </li>
  )
}