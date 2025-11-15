import type { SortOption } from '@/hooks/useDonorFilters'
import { FaList, FaMap, FaColumns } from 'react-icons/fa'

interface LeaderboardControlsProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCounty: string
  setSelectedCounty: (county: string) => void
  sortBy: SortOption
  sortDirection: 'asc' | 'desc'
  counties: string[]
  handleSort: (option: SortOption) => void
  viewMode: 'both' | 'list' | 'map'
  setViewMode: (mode: 'both' | 'list' | 'map') => void
  darkMode: boolean
}

export default function LeaderboardControls({
  searchTerm,
  setSearchTerm,
  selectedCounty,
  setSelectedCounty,
  sortBy,
  sortDirection,
  counties,
  handleSort,
  viewMode,
  setViewMode,
  darkMode
}: LeaderboardControlsProps) {
  return (
    <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-200'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
            Search by name
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter donor name..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? 'bg-[#1E1E1E] text-white border-[#333333] placeholder-[#808080] focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
          />
        </div>

        {/* County Filter */}
        <div>
          <label htmlFor="county" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
            Filter by county
          </label>
          <select
            id="county"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? 'bg-[#1E1E1E] text-white border-[#333333] focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
          >
            <option value="">All counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
            Sort by
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSort('total_donated')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                sortBy === 'total_donated'
                  ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                  : (darkMode ? 'bg-[#242424] text-white border border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border border-black hover:bg-gray-100')
              }`}
            >
              Amount {sortBy === 'total_donated' && (sortDirection === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                sortBy === 'name'
                  ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                  : (darkMode ? 'bg-[#242424] text-white border border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border border-black hover:bg-gray-100')
              }`}
            >
              Name {sortBy === 'name' && (sortDirection === 'desc' ? '↓' : '↑')}
            </button>
            <div className="flex space-x-1 ml-4">
              <button
                onClick={() => setViewMode('both')}
                className={`p-2 text-sm rounded-md transition-colors ${
                  viewMode === 'both'
                    ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                    : (darkMode ? 'bg-[#242424] text-white border border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border border-black hover:bg-gray-100')
                }`}
                title="Show both list and map"
              >
                <FaColumns />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm rounded-md transition-colors ${
                  viewMode === 'list'
                    ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                    : (darkMode ? 'bg-[#242424] text-white border border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border border-black hover:bg-gray-100')
                }`}
                title="Show list only"
              >
                <FaList />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 text-sm rounded-md transition-colors ${
                  viewMode === 'map'
                    ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                    : (darkMode ? 'bg-[#242424] text-white border border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border border-black hover:bg-gray-100')
                }`}
                title="Show map only"
              >
                <FaMap />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}