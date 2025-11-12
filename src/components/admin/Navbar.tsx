'use client'

import { motion } from 'framer-motion'
import { FaSignOutAlt } from 'react-icons/fa'
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
}

export default function Navbar({
  notificationActivity,
  showNotifications,
  setShowNotifications,
  unreadNotifications,
  setUnreadNotifications,
  lastNotificationCheck,
  setLastNotificationCheck
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
      className="border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">Donation Dashboard</h1>
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
            />
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Admin</span>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 group"
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