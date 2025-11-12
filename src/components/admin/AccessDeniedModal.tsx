'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

interface AccessDeniedModalProps {
  showAccessDeniedModal: boolean
  setShowAccessDeniedModal: (show: boolean) => void
}

export default function AccessDeniedModal({
  showAccessDeniedModal,
  setShowAccessDeniedModal
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
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center mb-4">
              <FaTimes className="text-red-500 text-xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
            </div>
            <p className="text-gray-600 mb-6">
              You do not have admin privileges to access this dashboard. Admin role is required.
            </p>
            <div className="flex justify-end">
              <motion.button
                onClick={() => setShowAccessDeniedModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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