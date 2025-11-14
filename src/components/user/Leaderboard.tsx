'use client'

import { useState, useEffect } from 'react'
import { useDonors } from '@/hooks/useDonors'
import { useDonorFilters } from '@/hooks/useDonorFilters'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
import LeaderboardControls from './LeaderboardControls'
import DonorListItem from './DonorListItem'
import DonorMap from './DonorMap'

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
  const itemsPerPage = 6

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredAndSortedDonors.length])

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
    <div className="bg-white shadow overflow-hidden sm:rounded-md border">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Top Donors ({totalItems > 0 ? `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}` : '0'})
        </h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {paginatedDonors.map((donor, index) => (
          <DonorListItem key={donor.id} donor={donor} index={startIndex + index} />
        ))}
      </ul>
      {filteredAndSortedDonors.length === 0 && (
        <EmptyState message="No donors found matching your criteria." />
      )}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )

  const renderMap = () => (
    <DonorMap donors={filteredAndSortedDonors} />
  )

  return (
    <div className="space-y-6">
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
    </div>
  )
}