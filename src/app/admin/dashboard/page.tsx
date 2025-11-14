'use client'

import { useState } from 'react'
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

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-900 flex items-center gap-3">
        <FaSync className="animate-spin text-black text-2xl" />
        <span className="text-lg">Loading...</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar
        notificationActivity={notificationActivity}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        lastNotificationCheck={lastNotificationCheck}
        setLastNotificationCheck={setLastNotificationCheck}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeCards stats={stats} formatCurrency={formatCurrency} />

        <DonorTrends monthlyData={monthlyData} />

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 shadow-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : message.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {message.type === 'success' ? (
                <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
              ) : message.type === 'error' ? (
                <FaTimes className="text-red-600 text-xl flex-shrink-0" />
              ) : (
                <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === 'success'
                    ? 'text-green-800'
                    : message.type === 'error'
                    ? 'text-red-800'
                    : 'text-blue-800'
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
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-sm group"
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
            className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border border-gray-300 group"
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
            className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border border-gray-300 group"
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
            className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border border-gray-300 group"
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
            className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border border-gray-300 group"
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
            className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 border border-gray-300 group"
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
          />
          <RecentActivity recentActivity={recentActivity} />
        </div>
      </main>

      {/* Add Donor Modal */}
      <AddDonorModal
        showAddDonorModal={showAddDonorModal}
        setShowAddDonorModal={setShowAddDonorModal}
        onDataRefresh={refreshData}
        mode={modalMode}
        donation={currentDonation}
      />

      {/* Access Denied Modal */}
      <AccessDeniedModal
        showAccessDeniedModal={showAccessDeniedModal}
        setShowAccessDeniedModal={setShowAccessDeniedModal}
      />
    </div>
  )
}
