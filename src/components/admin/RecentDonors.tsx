'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaSync } from 'react-icons/fa'
import { createClient } from '@/lib/supabase-client'

interface RecentDonor {
  id: string
  donorId: string
  donorName: string
  amount: number
  city: string
  county: string
  date: string
  status: 'MATCHED' | 'PENDING'
}

interface RecentDonorsProps {
  recentDonors: RecentDonor[]
  loading: boolean
  onDataRefresh: () => void
}

export default function RecentDonors({ recentDonors, loading, onDataRefresh }: RecentDonorsProps) {
  const [searchQuery, setSearchQuery] = useState('')
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

      alert('Donation matched successfully!')
      
      // Refresh data
      onDataRefresh()
    } catch (error: any) {
      alert('Error matching donation: ' + error.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Donors</h2>
          <p className="text-sm text-gray-500">Manage and track your donors</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donors..."
            className="bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black focus:outline-none w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600 text-center py-12 flex items-center justify-center gap-3">
          <FaSync className="animate-spin text-black text-xl" />
          <span>Loading donors...</span>
        </div>
      ) : recentDonors.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          No donations yet. Click "Add Donor" to get started.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Donor</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
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
                    .map((donor, index) => (
                      <motion.tr
                        key={donor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold"
                            >
                              {donor.donorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </motion.div>
                            <div>
                              <div className="font-semibold text-gray-900">{donor.donorName}</div>
                              <div className="text-xs text-gray-500">
                                {donor.city}, {donor.county}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900">
                            ${donor.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            <div>{donor.city}</div>
                            <div className="text-xs text-gray-400">{donor.county}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(donor.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                                donor.status === 'MATCHED'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {donor.status === 'MATCHED' ? '●' : '○'} {donor.status === 'MATCHED' ? 'Matched' : 'Pending'}
                            </motion.span>
                            {donor.status === 'PENDING' && (
                              <motion.button
                                onClick={() => handleMatchDonation(donor.id, donor.amount)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded transition-colors duration-200"
                              >
                                Match
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {recentDonors.filter(donor =>
                searchQuery === '' ||
                donor.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                donor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                donor.county.toLowerCase().includes(searchQuery.toLowerCase())
              ).length} of {recentDonors.length} results
            </div>
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 rounded bg-black text-white text-sm font-semibold"
              >
                1
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 rounded bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
              >
                Next
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}