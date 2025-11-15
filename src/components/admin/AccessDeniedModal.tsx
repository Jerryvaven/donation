'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

interface AccessDeniedModalProps {
  showAccessDeniedModal: boolean
  setShowAccessDeniedModal: (show: boolean) => void
  darkMode?: boolean
}

export default function AccessDeniedModal({
  showAccessDeniedModal,
  setShowAccessDeniedModal,
  darkMode = false
}: AccessDeniedModalProps) {
  return (
    <AnimatePresence>
      {showAccessDeniedModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-lg p-6 max-w-md w-full mx-4 ${
              darkMode ? 'bg-[#1E1E1E]' : 'bg-white'
            }`}
          >
            <div className="flex items-center mb-4">
              <FaTimes className={`text-xl mr-2 ${
                darkMode ? 'text-[#EF4444]' : 'text-red-500'
              }`} />
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Access Denied</h3>
            </div>
            <p className={`mb-6 ${
              darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'
            }`}>
              You do not have admin privileges to access this dashboard. Admin role is required.
            </p>
            <div className="flex justify-end">
              <motion.button
                onClick={() => setShowAccessDeniedModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  darkMode ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                OK
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}