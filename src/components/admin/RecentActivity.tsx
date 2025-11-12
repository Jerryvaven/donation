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
}

export default function RecentActivity({ recentActivity }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Activity</h2>
      <p className="text-sm text-gray-500 mb-6">Latest updates</p>

      <div className="space-y-4">
        <AnimatePresence>
          {recentActivity.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-sm">
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
                className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 cursor-pointer"
              >
                <motion.div
                  className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {activity.type === 'donation' && <span className="text-lg">💵</span>}
                  {activity.type === 'match' && <span className="text-lg">🤝</span>}
                  {activity.type === 'goal' && <span className="text-lg">🎯</span>}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium leading-snug mb-1">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}