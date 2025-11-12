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
  setViewMode
}: LeaderboardControlsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by name
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter donor name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* County Filter */}
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by county
          </label>
          <select
            id="county"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSort('total_donated')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                sortBy === 'total_donated'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black hover:bg-gray-100'
              }`}
            >
              Amount {sortBy === 'total_donated' && (sortDirection === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                sortBy === 'name'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black hover:bg-gray-100'
              }`}
            >
              Name {sortBy === 'name' && (sortDirection === 'desc' ? '↓' : '↑')}
            </button>
            <div className="flex space-x-1 ml-4">
              <button
                onClick={() => setViewMode('both')}
                className={`p-2 text-sm rounded-md transition-colors ${
                  viewMode === 'both'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black hover:bg-gray-100'
                }`}
                title="Show both list and map"
              >
                <FaColumns />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 text-sm rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black hover:bg-gray-100'
                }`}
                title="Show list only"
              >
                <FaList />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 text-sm rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black hover:bg-gray-100'
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