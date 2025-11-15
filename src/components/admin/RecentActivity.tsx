'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ActivityItem {
  id: string
  type: 'donation' | 'match' | 'update' | 'goal'
  message: string
  timestamp: string
  icon: string
  color: string
}

interface RecentActivityProps {
  recentActivity: ActivityItem[]
  darkMode: boolean
}

export default function RecentActivity({ recentActivity, darkMode }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className={`rounded-xl p-6 shadow-sm border ${
        darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>Latest updates</p>

      <div className="space-y-4">
        <AnimatePresence>
          {recentActivity.length === 0 ? (
            <div className={`text-center py-8 text-sm ${
              darkMode ? 'text-[#808080]' : 'text-gray-500'
            }`}>
              No recent activity
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`flex gap-3 pb-4 border-b last:border-0 cursor-pointer ${
                  darkMode ? 'border-[#333333]' : 'border-gray-100'
                }`}
              >
                <motion.div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-100'
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {activity.type === 'donation' && <span className="text-lg">💵</span>}
                  {activity.type === 'match' && <span className="text-lg">🤝</span>}
                  {activity.type === 'goal' && <span className="text-lg">🎯</span>}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {activity.message}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>{activity.timestamp}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}