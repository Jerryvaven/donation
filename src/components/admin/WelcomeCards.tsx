"use client";

import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaUsers,
  FaHandshake,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface DashboardStats {
  totalDonations: number;
  totalDonors: number;
  matchedFunds: number;
  countiesReached: number;
  todaysDonations: number;
  newDonorsToday: number;
  averageDonation: number;
  goalProgress: number;
  donationsGrowth: number;
  newDonorsGrowth: number;
  matchRate: number;
  californiaPercentage: number;
}

interface WelcomeCardsProps {
  stats: DashboardStats;
  formatCurrency: (amount: number) => string;
  darkMode: boolean;
}

export default function WelcomeCards({
  stats,
  formatCurrency,
  darkMode,
}: WelcomeCardsProps) {
  return (
    <>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, Admin
        </h2>
        <p className={darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}>
          Here's what's happening with your donations today.
        </p>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border group ${
            darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaMoneyBillWave className={`text-2xl group-hover:text-green-500 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              </motion.div>
              <div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                  Total Donations
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}>from last month</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-green-500 text-sm font-semibold flex items-center gap-1"
            >
              ↑ +6%
            </motion.div>
          </div>
          <motion.div
            className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {formatCurrency(stats.totalDonations)}
          </motion.div>
        </motion.div>

        {/* Total Donors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5 }}
          className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border group ${
            darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaUsers className={`text-2xl group-hover:text-blue-500 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              </motion.div>
              <div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                  Total Donors
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}>new this month</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-green-500 text-sm font-semibold flex items-center gap-1"
            >
              ↑ +2
            </motion.div>
          </div>
          <motion.div
            className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {stats.totalDonors}
          </motion.div>
        </motion.div>

        {/* Matched Funds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5 }}
          className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border group ${
            darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaHandshake className={`text-2xl group-hover:text-purple-500 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              </motion.div>
              <div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                  Matched Funds
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}>match rate</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-green-500 text-sm font-semibold flex items-center gap-1"
            >
              ↑ +100%
            </motion.div>
          </div>
          <motion.div
            className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {formatCurrency(stats.matchedFunds)}
          </motion.div>
        </motion.div>

        {/* Counties Reached */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ y: -5 }}
          className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border group ${
            darkMode ? 'bg-[#242424] border-[#333333]' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-lg ${darkMode ? 'bg-[#1E1E1E]' : 'bg-gray-50'}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaMapMarkerAlt className={`text-2xl group-hover:text-red-500 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              </motion.div>
              <div>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-[#B3B3B3]' : 'text-gray-600'}`}>
                  Counties Reached
                </h3>
                <p className={`text-xs ${darkMode ? 'text-[#808080]' : 'text-gray-400'}`}>of California</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-green-500 text-sm font-semibold flex items-center gap-1"
            >
              ↑ +2%
            </motion.div>
          </div>
          <motion.div
            className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {stats.countiesReached}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
