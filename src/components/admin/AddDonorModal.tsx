'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserPlus, FaTimes, FaHandshake, FaSync, FaCheckCircle } from 'react-icons/fa'
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
  matched_amount?: number
}

interface AddDonorModalProps {
  showAddDonorModal: boolean
  setShowAddDonorModal: (show: boolean) => void
  onDataRefresh: () => void
  mode?: 'add' | 'edit' | 'view'
  donation?: RecentDonor | null
  darkMode?: boolean
}

export default function AddDonorModal({
  showAddDonorModal,
  setShowAddDonorModal,
  onDataRefresh,
  mode = 'add',
  donation = null,
  darkMode = false
}: AddDonorModalProps) {
  const [donorName, setDonorName] = useState('')
  const [amount, setAmount] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [matched, setMatched] = useState(false)
  const [matchedAmount, setMatchedAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const fetchCoordinates = async (city: string, county: string) => {
    if (!city || !county) return;
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, county }),
      });
      const data = await response.json();
      if (data.latitude && data.longitude) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  useEffect(() => {
    fetchCoordinates(city, county);
  }, [city, county]);

  useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && donation) {
      setDonorName(donation.donorName)
      setAmount(donation.amount.toString())
      setCity(donation.city)
      setCounty(donation.county)
      setMatched(donation.status === 'MATCHED')
      setMatchedAmount(donation.matched_amount?.toString() || '')
    } else if (mode === 'add') {
      // Reset form for add
      setDonorName('')
      setAmount('')
      setCity('')
      setCounty('')
      setLatitude('')
      setLongitude('')
      setMatched(false)
      setMatchedAmount('')
    }
    setMessage(null)
  }, [mode, donation, showAddDonorModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (mode === 'edit' && donation) {
        // Get current donation amount
        const { data: currentDonation } = await supabase
          .from('donations')
          .select('amount')
          .eq('id', donation.id)
          .single()

        const currentAmount = currentDonation ? parseFloat(currentDonation.amount.toString()) : 0
        const newAmount = parseFloat(amount)
        const amountDifference = newAmount - currentAmount

        // Update donor
        const { data: currentDonor } = await supabase
          .from('donors')
          .select('total_donated')
          .eq('id', donation.donorId)
          .single()

        const currentTotal = currentDonor ? parseFloat(currentDonor.total_donated.toString()) : 0
        const newTotal = currentTotal + amountDifference

        const { error: donorError } = await supabase
          .from('donors')
          .update({
            name: donorName,
            city: city || null,
            county: county || null,
            total_donated: newTotal
          })
          .eq('id', donation.donorId)

        if (donorError) throw donorError

        // Update donation
        const { error } = await supabase
          .from('donations')
          .update({
            amount: newAmount,
            donation_date: new Date(donation.date).toISOString().split('T')[0],
            matched: matched || false,
            matched_amount: matched ? (parseFloat(matchedAmount) || newAmount) : null
          })
          .eq('id', donation.id)

        if (error) throw error

        setMessage({ type: 'success', text: 'Donation updated successfully!' })
        
        // Refresh data
        onDataRefresh()
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowAddDonorModal(false)
        }, 1500)
      } else if (mode === 'add') {
        // Original add logic
        // Check if donor exists
        const { data: existingDonor } = await supabase
          .from('donors')
          .select('id, total_donated, county, city, latitude, longitude')
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
          if (latitude && !existingDonor.latitude) {
            updateData.latitude = latitude
          }
          if (longitude && !existingDonor.longitude) {
            updateData.longitude = longitude
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
              city: city || null,
              latitude: latitude || null,
              longitude: longitude || null
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
            matched_amount: matched ? (parseFloat(matchedAmount) || parseFloat(amount)) : null
          }])

        if (donationError) throw donationError

        setMessage({ type: 'success', text: 'Donation added successfully!' })
        
        // Refresh data
        onDataRefresh()
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowAddDonorModal(false)
        }, 1500)
      }

      // Reset form
      setDonorName('')
      setAmount('')
      setCity('')
      setCounty('')
      setLatitude('')
      setLongitude('')
      setMatched(false)
      setMatchedAmount('')
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
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
            className={`${darkMode ? 'bg-[#1E1E1E]' : 'bg-white'} rounded-2xl max-w-md w-full p-8 shadow-2xl`}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-2 ${darkMode ? 'bg-[#3B82F6]' : 'bg-black'} rounded-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaUserPlus className="text-xl text-white" />
                </motion.div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mode === 'add' ? 'Add New Donation' : mode === 'edit' ? 'Edit Donation' : 'View Donation'}
                </h2>
              </div>
              <motion.button
                onClick={() => setShowAddDonorModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`${darkMode ? 'text-[#808080] hover:text-white hover:bg-[#242424]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-lg p-2 transition-all`}
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </div>

            {/* Message Display */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success'
                      ? darkMode ? 'bg-[#22C55E]/20 border border-[#22C55E]/30' : 'bg-green-50 border border-green-200'
                      : darkMode ? 'bg-[#EF4444]/20 border border-[#EF4444]/30' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                  ) : (
                    <FaTimes className="text-red-600 text-xl flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      message.type === 'success' 
                        ? darkMode ? 'text-[#22C55E]' : 'text-green-800' 
                        : darkMode ? 'text-[#EF4444]' : 'text-red-800'
                    }`}
                  >
                    {message.text}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="donorName" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Donor Name *
                </label>
                <input
                  type="text"
                  id="donorName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                  readOnly={mode === 'view'}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none`}
                  placeholder="Enter donor name"
                />
              </div>

              <div>
                <label htmlFor="amount" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  Donation Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  readOnly={mode === 'view'}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="city" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  readOnly={mode === 'view'}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none`}
                  placeholder="Enter city (optional)"
                />
              </div>

              <div>
                <label htmlFor="county" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                  County
                </label>
                <input
                  type="text"
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  readOnly={mode === 'view'}
                  className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none`}
                  placeholder="Enter county (optional)"
                />
              </div>

              <div className={`flex items-center gap-3 py-3 px-4 ${darkMode ? 'bg-[#242424] border-[#333333] hover:bg-[#2A2A2A]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-lg border transition-all`}>
                <input
                  type="checkbox"
                  id="matched"
                  checked={matched}
                  onChange={(e) => {
                    setMatched(e.target.checked)
                    if (e.target.checked && matchedAmount === '') {
                      setMatchedAmount(amount)
                    }
                  }}
                  disabled={mode === 'view'}
                  className={`w-5 h-5 ${darkMode ? 'text-[#3B82F6] bg-[#1E1E1E] border-[#333333] focus:ring-[#3B82F6]' : 'text-black bg-white border-gray-300 focus:ring-black'} rounded focus:ring-2 cursor-pointer disabled:cursor-not-allowed`}
                />
                <label htmlFor="matched" className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} font-medium flex items-center gap-2 cursor-pointer`}>
                  <FaHandshake className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'} />
                  This donation is matched
                </label>
              </div>

              {matched && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="matchedAmount" className={`block text-sm font-semibold ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'} mb-2`}>
                    Matched Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="matchedAmount"
                    value={matchedAmount}
                    onChange={(e) => setMatchedAmount(e.target.value)}
                    required
                    readOnly={mode === 'view'}
                    className={`w-full px-4 py-2.5 ${darkMode ? 'bg-[#242424] border-[#333333] text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 ${darkMode ? 'focus:ring-[#3B82F6] focus:border-[#3B82F6]' : 'focus:ring-black focus:border-black'} transition-all outline-none`}
                    placeholder="0.00"
                  />
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                {mode !== 'edit' && (
                  <motion.button
                    type="button"
                    onClick={() => setShowAddDonorModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 px-5 py-2.5 ${darkMode ? 'bg-[#242424] hover:bg-[#2A2A2A] text-[#B3B3B3]' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-lg font-semibold transition-all duration-200`}
                  >
                    {mode === 'view' ? 'Close' : 'Cancel'}
                  </motion.button>
                )}
                {mode !== 'view' && (
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${mode === 'edit' ? 'w-full' : 'flex-1'} px-5 py-2.5 ${darkMode ? 'bg-[#3B82F6] hover:bg-[#2563EB]' : 'bg-black hover:bg-gray-800'} text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {saving ? (
                      <>
                        <FaSync className="animate-spin" />
                        {mode === 'edit' ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        {mode === 'edit' ? 'Update Donation' : 'Add Donation'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}