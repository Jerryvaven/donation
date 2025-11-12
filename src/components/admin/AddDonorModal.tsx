'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserPlus, FaTimes, FaHandshake, FaSync, FaCheckCircle } from 'react-icons/fa'
import { createClient } from '@/lib/supabase-client'

interface AddDonorModalProps {
  showAddDonorModal: boolean
  setShowAddDonorModal: (show: boolean) => void
  onDataRefresh: () => void
}

export default function AddDonorModal({
  showAddDonorModal,
  setShowAddDonorModal,
  onDataRefresh
}: AddDonorModalProps) {
  const [donorName, setDonorName] = useState('')
  const [amount, setAmount] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [matched, setMatched] = useState(false)
  const [matchedAmount, setMatchedAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Check if donor exists
      const { data: existingDonor } = await supabase
        .from('donors')
        .select('id, total_donated, county, city')
        .eq('name', donorName)
        .single()

      let donorId: string

      if (existingDonor) {
        // Update existing donor
        donorId = existingDonor.id
        const newTotal = parseFloat(existingDonor.total_donated.toString()) + parseFloat(amount)
        
        const updateData: any = { 
          total_donated: newTotal,
          updated_at: new Date().toISOString()
        }
        
        // Add city and county data if provided and not already set
        if (county && !existingDonor.county) {
          updateData.county = county
        }
        if (city && !existingDonor.city) {
          updateData.city = city
        }
        
        await supabase
          .from('donors')
          .update(updateData)
          .eq('id', donorId)
      } else {
        // Create new donor
        const { data: newDonor, error: donorError } = await supabase
          .from('donors')
          .insert([{ 
            name: donorName, 
            total_donated: parseFloat(amount),
            county: county || null,
            city: city || null
          }])
          .select('id')
          .single()

        if (donorError) throw donorError
        donorId = newDonor.id
      }

      // Add donation
      const { error: donationError } = await supabase
        .from('donations')
        .insert([{
          donor_id: donorId,
          amount: parseFloat(amount),
          donation_date: new Date().toISOString().split('T')[0],
          matched,
          matched_amount: matched ? parseFloat(matchedAmount) : null
        }])

      if (donationError) throw donationError

      // Success - reset form and close modal
      alert('Donation added successfully!')
      setDonorName('')
      setAmount('')
      setCity('')
      setCounty('')
      setMatched(false)
      setMatchedAmount('')
      setShowAddDonorModal(false)
      
      // Refresh data
      onDataRefresh()
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }
  return (
    <AnimatePresence>
      {showAddDonorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-black rounded-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaUserPlus className="text-xl text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Donation</h2>
              </div>
              <motion.button
                onClick={() => setShowAddDonorModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </div>

            <form onSubmit={handleAddDonor} className="space-y-4">
              <div>
                <label htmlFor="donorName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Donor Name *
                </label>
                <input
                  type="text"
                  id="donorName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black transition-all"
                  placeholder="Enter donor name"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Donation Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black transition-all"
                  placeholder="Enter city (optional)"
                />
              </div>

              <div>
                <label htmlFor="county" className="block text-sm font-semibold text-gray-700 mb-2">
                  County
                </label>
                <input
                  type="text"
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black transition-all"
                  placeholder="Enter county (optional)"
                />
              </div>

              <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all">
                <input
                  type="checkbox"
                  id="matched"
                  checked={matched}
                  onChange={(e) => setMatched(e.target.checked)}
                  className="w-5 h-5 text-black bg-white border-gray-300 rounded focus:ring-black focus:ring-2 cursor-pointer"
                />
                <label htmlFor="matched" className="text-sm text-gray-700 font-medium flex items-center gap-2 cursor-pointer">
                  <FaHandshake className="text-gray-600" />
                  This donation is matched
                </label>
              </div>

              {matched && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="matchedAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Matched Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="matchedAmount"
                    value={matchedAmount}
                    onChange={(e) => setMatchedAmount(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-black focus:border-black transition-all"
                    placeholder="0.00"
                  />
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowAddDonorModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <FaSync className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Add Donation
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}