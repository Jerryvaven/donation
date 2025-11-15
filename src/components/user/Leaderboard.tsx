'use client'

import { useState, useEffect } from 'react'
import { useDonors } from '@/hooks/useDonors'
import { useDonorFilters } from '@/hooks/useDonorFilters'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
import LeaderboardControls from './LeaderboardControls'
import DonorListItem from './DonorListItem'
import DonorMap from './DonorMap'
import { FaMoon, FaSun } from 'react-icons/fa'

export default function Leaderboard() {
  const { donors, loading, error } = useDonors()
  const {
    searchTerm,
    setSearchTerm,
    selectedCounty,
    setSelectedCounty,
    sortBy,
    sortDirection,
    counties,
    filteredAndSortedDonors,
    handleSort
  } = useDonorFilters(donors)

  const [viewMode, setViewMode] = useState<'both' | 'list' | 'map'>('both')
  const [currentPage, setCurrentPage] = useState(1)
  const [darkMode, setDarkMode] = useState(true)
  const itemsPerPage = 6

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredAndSortedDonors.length])

  // Apply dark mode to the entire page
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#121212'
      document.documentElement.style.backgroundColor = '#121212'
    } else {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [darkMode])

  // Pagination calculations
  const totalItems = filteredAndSortedDonors.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDonors = filteredAndSortedDonors.slice(startIndex, endIndex)

  if (loading) {
    return <LoadingSpinner message="Loading leaderboard..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  const renderList = () => (
    <div className={`shadow overflow-hidden sm:rounded-md border ${darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-200'}`}>
      <div className={`px-6 py-4 border-b ${darkMode ? 'bg-[#1E1E1E] border-[#333333]' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Donors ({totalItems > 0 ? `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}` : '0'})
        </h3>
      </div>
      <ul className={`divide-y ${darkMode ? 'divide-[#333333]' : 'divide-gray-200'}`}>
        {paginatedDonors.map((donor, index) => (
          <DonorListItem key={donor.id} donor={donor} index={startIndex + index} darkMode={darkMode} />
        ))}
      </ul>
      {filteredAndSortedDonors.length === 0 && (
        <EmptyState message="No donors found matching your criteria." />
      )}
      {totalPages > 1 && (
        <div className={`px-6 py-4 border-t flex items-center justify-between ${darkMode ? 'bg-[#1E1E1E] border-[#333333]' : 'bg-gray-50 border-gray-200'}`}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-[#242424] text-white border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === page
                    ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                    : (darkMode ? 'bg-[#242424] text-white border border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border border-gray-300 hover:bg-gray-50')
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? 'bg-[#242424] text-white border-[#333333] hover:bg-[#333333]' : 'bg-white text-black border-gray-300 hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )

  const renderMap = () => (
    <DonorMap donors={filteredAndSortedDonors} darkMode={darkMode} />
  )

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow ${darkMode ? 'bg-[#1E1E1E] border-b border-[#333333]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Donation Leaderboard</h1>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full shadow-lg transition-colors ${darkMode ? 'bg-[#242424] text-white hover:bg-[#333333]' : 'bg-black text-white hover:bg-gray-800'}`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">

      {/* Controls */}
      <LeaderboardControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCounty={selectedCounty}
        setSelectedCounty={setSelectedCounty}
        sortBy={sortBy}
        sortDirection={sortDirection}
        counties={counties}
        handleSort={handleSort}
        viewMode={viewMode}
        setViewMode={setViewMode}
        darkMode={darkMode}
      />

      {/* Content */}
      {viewMode === 'both' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderList()}
          {renderMap()}
        </div>
      ) : viewMode === 'list' ? (
        renderList()
      ) : (
        renderMap()
      )}
      </main>
    </div>
  )
}