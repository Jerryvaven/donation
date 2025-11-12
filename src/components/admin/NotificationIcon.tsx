'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell } from 'react-icons/fa'

interface ActivityItem {
  id: string
  type: 'donation' | 'match' | 'update' | 'goal'
  message: string
  timestamp: string
  icon: string
  color: string
}

interface NotificationIconProps {
  notificationActivity: ActivityItem[]
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
  unreadNotifications: boolean
  setUnreadNotifications: (unread: boolean) => void
  lastNotificationCheck: string
  setLastNotificationCheck: (time: string) => void
}

export default function NotificationIcon({
  notificationActivity,
  showNotifications,
  setShowNotifications,
  unreadNotifications,
  setUnreadNotifications,
  lastNotificationCheck,
  setLastNotificationCheck
}: NotificationIconProps) {
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications, setShowNotifications])

  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        onClick={() => {
          setShowNotifications(!showNotifications)
          if (!showNotifications) {
            setUnreadNotifications(false)
            // Save current timestamp as last check
            const now = new Date().toISOString()
            localStorage.setItem('lastNotificationCheck', now)
            setLastNotificationCheck(now)
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FaBell className="text-lg" />
        {unreadNotifications && notificationActivity.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          />
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {notificationActivity.length > 0 && (
                  <button
                    onClick={() => {
                      // This would need to be passed as a prop or handled differently
                      // For now, we'll just close the dropdown
                      setShowNotifications(false)
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificationActivity.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notificationActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="p-4 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          {activity.type === 'donation' && <span className="text-xl">💵</span>}
                          {activity.type === 'match' && <span className="text-xl">🤝</span>}
                          {activity.type === 'goal' && <span className="text-xl">🎯</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium leading-snug mb-1">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {notificationActivity.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}