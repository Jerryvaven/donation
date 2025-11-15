'use client'

import { motion } from 'framer-motion'
import { FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import NotificationIcon from './NotificationIcon'

interface ActivityItem {
  id: string
  type: 'donation' | 'match' | 'update' | 'goal'
  message: string
  timestamp: string
  icon: string
  color: string
}

interface NavbarProps {
  notificationActivity: ActivityItem[]
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
  unreadNotifications: boolean
  setUnreadNotifications: (unread: boolean) => void
  lastNotificationCheck: string
  setLastNotificationCheck: (time: string) => void
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

export default function Navbar({
  notificationActivity,
  showNotifications,
  setShowNotifications,
  unreadNotifications,
  setUnreadNotifications,
  lastNotificationCheck,
  setLastNotificationCheck,
  darkMode,
  setDarkMode
}: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`border-b backdrop-blur-md shadow-sm sticky top-0 z-40 ${
        darkMode ? 'bg-[#1E1E1E]/80 border-[#333333]' : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Donation Dashboard</h1>
          </motion.div>
          <div className="flex items-center gap-3">
            <NotificationIcon
              notificationActivity={notificationActivity}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              unreadNotifications={unreadNotifications}
              setUnreadNotifications={setUnreadNotifications}
              lastNotificationCheck={lastNotificationCheck}
              setLastNotificationCheck={setLastNotificationCheck}
              darkMode={darkMode}
            />
            <div className={`h-8 w-px ${darkMode ? 'bg-[#333333]' : 'bg-gray-300'}`}></div>
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-[#242424] text-white hover:bg-[#333333]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </motion.button>
            <div className={`h-8 w-px ${darkMode ? 'bg-[#333333]' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
              darkMode ? 'bg-[#242424] text-[#B3B3B3] border-[#333333]' : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Admin</span>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 group ${
                darkMode ? 'text-white hover:bg-[#242424]' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaSignOutAlt className="group-hover:translate-x-0.5 transition-transform" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}