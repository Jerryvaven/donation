'use client'

import { motion } from 'framer-motion'

interface MonthlyData {
  month: string
  donations: number
  matched: number
}

interface DonorTrendsProps {
  monthlyData: MonthlyData[]
  darkMode: boolean
}

export default function DonorTrends({ monthlyData, darkMode }: DonorTrendsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className={`rounded-xl p-6 shadow-sm border mb-8 ${
        darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Donation Trends</h2>
          <p className={`text-sm ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-500'}`}>Monthly overview of donations and matches</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${darkMode ? 'bg-[#3B82F6]' : 'bg-black'}`}></div>
            <span className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}>donations {monthlyData.length > 0 ? `- $${monthlyData.reduce((sum, m) => sum + m.donations, 0).toFixed(0)}` : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${darkMode ? 'bg-[#808080]' : 'bg-gray-300'}`}></div>
            <span className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}>matched {monthlyData.length > 0 ? `- $${monthlyData.reduce((sum, m) => sum + m.matched, 0).toFixed(0)}` : ''}</span>
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="flex items-end justify-between h-64 gap-2">
        {monthlyData.slice(0, 11).map((data, index) => {
          // Calculate max value for scaling (use actual max from data)
          const maxValue = Math.max(...monthlyData.map(m => Math.max(m.donations, m.matched)))

          // Calculate heights as pixel values instead of percentages
          const chartHeight = 256 // h-64 = 256px
          const donationHeight = maxValue > 0
            ? Math.max((data.donations / maxValue) * chartHeight, data.donations > 0 ? 8 : 0)
            : 0
          const matchedHeight = maxValue > 0
            ? Math.max((data.matched / maxValue) * chartHeight, data.matched > 0 ? 8 : 0)
            : 0

          return (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: '256px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: donationHeight }}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.05 }}
                  className={`flex-1 rounded-t cursor-pointer relative group ${
                    darkMode ? 'bg-[#3B82F6]' : 'bg-black'
                  }`}
                >
                  {data.donations > 0 && (
                    <div
                      className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${
                        darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-900 text-white'
                      }`}
                    >
                      ${data.donations.toFixed(0)}
                    </div>
                  )}
                </motion.div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: matchedHeight }}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.05 }}
                  className={`flex-1 rounded-t cursor-pointer relative group ${
                    darkMode ? 'bg-[#808080]' : 'bg-gray-300'
                  }`}
                >
                  {data.matched > 0 && (
                    <div
                      className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${
                        darkMode ? 'bg-[#1E1E1E] text-white' : 'bg-gray-700 text-white'
                      }`}
                    >
                      ${data.matched.toFixed(0)}
                    </div>
                  )}
                </motion.div>
              </div>
              <span className={`text-xs mt-2 ${darkMode ? 'text-[#808080]' : 'text-gray-500'}`}>{data.month}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}