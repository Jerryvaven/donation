'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaUserPlus,
  FaFileExport,
  FaFileUpload,
  FaChartBar,
  FaSync,
  FaCheckCircle,
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import Navbar from '@/components/admin/Navbar'
import WelcomeCards from '@/components/admin/WelcomeCards'
import DonorTrends from '@/components/admin/DonorTrends'
import RecentDonors from '@/components/admin/RecentDonors'
import RecentActivity from '@/components/admin/RecentActivity'
import AddDonorModal from '@/components/admin/AddDonorModal'
import AccessDeniedModal from '@/components/admin/AccessDeniedModal'
import { useDashboard } from '@/hooks/useDashboard'

export default function AdminDashboard() {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const [currentDonation, setCurrentDonation] = useState<any>(null)
  const [darkMode, setDarkMode] = useState(true)

  const {
    // State
    user,
    stats,
    recentDonors,
    recentActivity,
    notificationActivity,
    monthlyData,
    loading,
    showAddDonorModal,
    setShowAddDonorModal,
    showAccessDeniedModal,
    setShowAccessDeniedModal,
    message,
    setMessage,
    showNotifications,
    setShowNotifications,
    unreadNotifications,
    setUnreadNotifications,
    lastNotificationCheck,
    setLastNotificationCheck,
    notificationRef,
    modalRef,

    // Functions
    formatCurrency,
    handleQuickMatch,
    handleExport,
    handleImport,
    handleReport,
    refreshData
  } = useDashboard()

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

  if (!user) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <div className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <FaSync className={`animate-spin text-2xl ${darkMode ? 'text-[#3B82F6]' : 'text-black'}`} />
        <span className="text-lg">Loading...</span>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar
        notificationActivity={notificationActivity}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        lastNotificationCheck={lastNotificationCheck}
        setLastNotificationCheck={setLastNotificationCheck}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeCards stats={stats} formatCurrency={formatCurrency} darkMode={darkMode} />

        <DonorTrends monthlyData={monthlyData} darkMode={darkMode} />

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 shadow-lg ${
                message.type === 'success'
                  ? (darkMode ? 'bg-[#22C55E]/20 border border-[#22C55E]/50' : 'bg-green-50 border border-green-200')
                  : message.type === 'error'
                  ? (darkMode ? 'bg-[#EF4444]/20 border border-[#EF4444]/50' : 'bg-red-50 border border-red-200')
                  : (darkMode ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/50' : 'bg-blue-50 border border-blue-200')
              }`}
            >
              {message.type === 'success' ? (
                <FaCheckCircle className={`text-xl flex-shrink-0 ${darkMode ? 'text-[#22C55E]' : 'text-green-600'}`} />
              ) : message.type === 'error' ? (
                <FaTimes className={`text-xl flex-shrink-0 ${darkMode ? 'text-[#EF4444]' : 'text-red-600'}`} />
              ) : (
                <FaInfoCircle className={`text-xl flex-shrink-0 ${darkMode ? 'text-[#3B82F6]' : 'text-blue-600'}`} />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === 'success'
                    ? (darkMode ? 'text-[#22C55E]' : 'text-green-800')
                    : message.type === 'error'
                    ? (darkMode ? 'text-[#EF4444]' : 'text-red-800')
                    : (darkMode ? 'text-[#3B82F6]' : 'text-blue-800')
                }`}
              >
                {message.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <motion.button
            onClick={() => {
              setModalMode('add')
              setCurrentDonation(null)
              setShowAddDonorModal(true)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-sm group ${
              darkMode ? 'bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white' : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            <motion.div className="group-hover:scale-110 transition-transform duration-200">
              <FaUserPlus />
            </motion.div>
            Add Donor
          </motion.button>
          <motion.button
            onClick={handleQuickMatch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode ? 'bg-[#242424] hover:bg-[#333333] text-white border-[#333333]' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <motion.div className="group-hover:rotate-12 transition-transform duration-200">
              <HiSparkles />
            </motion.div>
            Quick Match
          </motion.button>
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode ? 'bg-[#242424] hover:bg-[#333333] text-white border-[#333333]' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <motion.div className="group-hover:translate-x-1 transition-transform duration-200">
              <FaFileExport />
            </motion.div>
            Export
          </motion.button>
          <motion.button
            onClick={handleImport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode ? 'bg-[#242424] hover:bg-[#333333] text-white border-[#333333]' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <motion.div className="group-hover:-translate-y-1 transition-transform duration-200">
              <FaFileUpload />
            </motion.div>
            Import
          </motion.button>
          <motion.button
            onClick={handleReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode ? 'bg-[#242424] hover:bg-[#333333] text-white border-[#333333]' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <motion.div className="group-hover:scale-110 transition-transform duration-200">
              <FaChartBar />
            </motion.div>
            Report
          </motion.button>
          <motion.button
            onClick={refreshData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border group ${
              darkMode ? 'bg-[#242424] hover:bg-[#333333] text-white border-[#333333]' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            <motion.div
              className="group-hover:rotate-180 transition-transform duration-300"
            >
              <FaSync />
            </motion.div>
            Refresh
          </motion.button>
        </motion.div>

        {/* Recent Donors and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentDonors 
            recentDonors={recentDonors} 
            loading={loading}
            onDataRefresh={refreshData}
            onViewDonation={(donation) => {
              setCurrentDonation(donation)
              setModalMode('view')
              setShowAddDonorModal(true)
            }}
            onEditDonation={(donation) => {
              setCurrentDonation(donation)
              setModalMode('edit')
              setShowAddDonorModal(true)
            }}
            darkMode={darkMode}
          />
          <RecentActivity recentActivity={recentActivity} darkMode={darkMode} />
        </div>
      </main>

      {/* Add Donor Modal */}
      <AddDonorModal
        showAddDonorModal={showAddDonorModal}
        setShowAddDonorModal={setShowAddDonorModal}
        onDataRefresh={refreshData}
        mode={modalMode}
        donation={currentDonation}
        darkMode={darkMode}
      />

      {/* Access Denied Modal */}
      <AccessDeniedModal
        showAccessDeniedModal={showAccessDeniedModal}
        setShowAccessDeniedModal={setShowAccessDeniedModal}
        darkMode={darkMode}
      />
    </div>
  )
}
