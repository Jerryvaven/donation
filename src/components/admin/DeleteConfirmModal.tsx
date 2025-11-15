'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  donorName?: string
  amount?: number
  isDeleting?: boolean
  darkMode?: boolean
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  donorName,
  amount,
  isDeleting = false,
  darkMode = false
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`rounded-2xl max-w-md w-full p-8 shadow-2xl ${
              darkMode ? 'bg-[#1E1E1E]' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-lg ${
                    darkMode ? 'bg-[#EF4444]/20' : 'bg-red-100'
                  }`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <FaExclamationTriangle className={`text-2xl ${
                    darkMode ? 'text-[#EF4444]' : 'text-red-600'
                  }`} />
                </motion.div>
                <div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Donation</h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>This action cannot be undone</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-lg p-2 transition-all ${
                  darkMode ? 'text-[#808080] hover:text-[#B3B3B3] hover:bg-[#242424]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                disabled={isDeleting}
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </div>

            <div className="mb-6">
              <p className={`mb-4 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-700'}`}>
                Are you sure you want to delete this donation?
              </p>
              {donorName && (
                <div className={`rounded-lg p-4 border ${
                  darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-[#808080]' : 'text-gray-600'}`}>Donor:</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{donorName}</span>
                  </div>
                  {amount !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold ${darkMode ? 'text-[#808080]' : 'text-gray-600'}`}>Amount:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isDeleting}
                className={`flex-1 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode ? 'bg-[#242424] hover:bg-[#333333] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                No, Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isDeleting}
                className={`flex-1 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {isDeleting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaTrash />
                    </motion.div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Yes, Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
