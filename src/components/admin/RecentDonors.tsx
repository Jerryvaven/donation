'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaSync, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { createClient } from '@/lib/supabase-client'
import DeleteConfirmModal from './DeleteConfirmModal'

interface RecentDonor {
  id: string
  donorId: string
  donorName: string
  amount: number
  city: string
  county: string
  date: string
  status: 'MATCHED' | 'PENDING'
  matched_amount?: number
}

interface RecentDonorsProps {
  recentDonors: RecentDonor[]
  loading: boolean
  onDataRefresh: () => void
  onViewDonation?: (donation: RecentDonor) => void
  onEditDonation?: (donation: RecentDonor) => void
  darkMode: boolean
}

export default function RecentDonors({ recentDonors, loading, onDataRefresh, onViewDonation, onEditDonation, darkMode }: RecentDonorsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [donationToDelete, setDonationToDelete] = useState<RecentDonor | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const itemsPerPage = 5
  const supabase = createClient()

  const handleMatchDonation = async (donationId: string, amount: number) => {
    try {
      // Update donation to matched with matched_amount equal to donation amount
      const { error } = await supabase
        .from('donations')
        .update({ 
          matched: true,
          matched_amount: amount
        })
        .eq('id', donationId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Donation matched successfully!' })
      
      // Refresh data
      onDataRefresh()
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error matching donation: ' + error.message })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleDeleteClick = (donation: RecentDonor) => {
    setDonationToDelete(donation)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!donationToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/donations/${donationToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete donation')

      setMessage({ type: 'success', text: 'Donation deleted successfully!' })
      setShowDeleteModal(false)
      setDonationToDelete(null)
      
      // Refresh data
      onDataRefresh()
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error deleting donation: ' + error.message })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={`lg:col-span-2 rounded-xl p-6 shadow-sm border ${
        darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Donors</h2>
          <p className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>Manage and track your donors</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donors..."
            className={`border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:outline-none w-full sm:w-64 transition-all ${
              darkMode 
                ? 'bg-[#1E1E1E] border-[#333333] text-white placeholder-[#808080] focus:ring-[#3B82F6] focus:border-[#3B82F6]'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
            }`}
          />
        </div>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? (darkMode ? 'bg-[#22C55E]/20 border border-[#22C55E]/50' : 'bg-green-50 border border-green-200')
                : (darkMode ? 'bg-[#EF4444]/20 border border-[#EF4444]/50' : 'bg-red-50 border border-red-200')
            }`}
          >
            {message.type === 'success' ? (
              <FaCheckCircle className={`text-xl flex-shrink-0 ${darkMode ? 'text-[#22C55E]' : 'text-green-600'}`} />
            ) : (
              <FaTimes className={`text-xl flex-shrink-0 ${darkMode ? 'text-[#EF4444]' : 'text-red-600'}`} />
            )}
            <p
              className={`text-sm font-medium ${
                message.type === 'success' 
                  ? (darkMode ? 'text-[#22C55E]' : 'text-green-800')
                  : (darkMode ? 'text-[#EF4444]' : 'text-red-800')
              }`}
            >
              {message.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className={`text-center py-12 flex items-center justify-center gap-3 ${
          darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'
        }`}>
          <FaSync className={`animate-spin text-xl ${darkMode ? 'text-[#3B82F6]' : 'text-black'}`} />
          <span>Loading donors...</span>
        </div>
      ) : recentDonors.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
          No donations yet. Click "Add Donor" to get started.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-[#333333]' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Donor</th>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Amount</th>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Location</th>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Date</th>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Status</th>
                  <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {recentDonors
                    .filter(donor =>
                      searchQuery === '' ||
                      donor.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      donor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      donor.county.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((donor, index) => (
                      <motion.tr
                        key={donor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={`border-b transition-colors duration-200 cursor-pointer ${
                          darkMode ? 'border-[#333333] hover:bg-[#1E1E1E]' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                                darkMode ? 'bg-[#3B82F6] text-white' : 'bg-gray-900 text-white'
                              }`}
                            >
                              {donor.donorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </motion.div>
                            <div>
                              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{donor.donorName}</div>
                              <div className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                                {donor.city}, {donor.county}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${donor.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                            <div>{donor.city}</div>
                            <div className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}>{donor.county}</div>
                          </div>
                        </td>
                        <td className={`py-4 px-4 text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                          {new Date(donor.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center gap-2">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                                donor.status === 'MATCHED'
                                  ? (darkMode ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-green-100 text-green-700')
                                  : (darkMode ? 'bg-[#808080]/20 text-[#B3B3B3]' : 'bg-gray-100 text-gray-700')
                              }`}
                            >
                              {donor.status === 'MATCHED' ? '●' : '○'} {donor.status === 'MATCHED' ? 'Matched' : 'Pending'}
                            </motion.span>
                            {donor.status === 'PENDING' && (
                              <motion.button
                                onClick={() => handleMatchDonation(donor.id, donor.amount)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-2 py-1 text-xs font-semibold rounded transition-colors duration-200 ${
                                  darkMode ? 'bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6]' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                }`}
                              >
                                Match
                              </motion.button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => onViewDonation?.(donor)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`p-2 transition-colors duration-200 ${
                                darkMode ? 'text-[#808080] hover:text-[#3B82F6]' : 'text-gray-400 hover:text-blue-600'
                              }`}
                              title="View"
                            >
                              <FaEye />
                            </motion.button>
                            <motion.button
                              onClick={() => onEditDonation?.(donor)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`p-2 transition-colors duration-200 ${
                                darkMode ? 'text-[#808080] hover:text-[#FACC15]' : 'text-gray-400 hover:text-yellow-600'
                              }`}
                              title="Edit"
                            >
                              <FaEdit />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteClick(donor)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`p-2 transition-colors duration-200 ${
                                darkMode ? 'text-[#808080] hover:text-[#EF4444]' : 'text-gray-400 hover:text-red-600'
                              }`}
                              title="Delete"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(() => {
            const filteredDonors = recentDonors.filter(donor =>
              searchQuery === '' ||
              donor.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              donor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
              donor.county.toLowerCase().includes(searchQuery.toLowerCase())
            )
            const totalPages = Math.ceil(filteredDonors.length / itemsPerPage)
            const startIndex = (currentPage - 1) * itemsPerPage + 1
            const endIndex = Math.min(currentPage * itemsPerPage, filteredDonors.length)

            return (
              <div className="flex justify-between items-center mt-6">
                <div className={`text-sm ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>
                  Showing {filteredDonors.length > 0 ? startIndex : 0}-{endIndex} of {filteredDonors.length} results
                </div>
                {totalPages > 1 && (
                  <div className="flex gap-1">
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                      whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === 1
                          ? (darkMode ? 'bg-[#1E1E1E] text-[#808080] cursor-not-allowed' : 'bg-gray-50 text-gray-400 cursor-not-allowed')
                          : (darkMode ? 'bg-[#242424] text-[#B3B3B3] hover:bg-[#333333]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                      }`}
                    >
                      Previous
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <motion.button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? (darkMode ? 'bg-[#3B82F6] text-white' : 'bg-black text-white')
                            : (darkMode ? 'bg-[#242424] text-[#B3B3B3] hover:bg-[#333333]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                      whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentPage === totalPages
                          ? (darkMode ? 'bg-[#1E1E1E] text-[#808080] cursor-not-allowed' : 'bg-gray-50 text-gray-400 cursor-not-allowed')
                          : (darkMode ? 'bg-[#242424] text-[#B3B3B3] hover:bg-[#333333]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                      }`}
                    >
                      Next
                    </motion.button>
                  </div>
                )}
              </div>
            )
          })()}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDonationToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        donorName={donationToDelete?.donorName}
        amount={donationToDelete?.amount}
        isDeleting={isDeleting}
        darkMode={darkMode}
      />
    </motion.div>
  )
}