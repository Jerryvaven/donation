'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface DashboardStats {
  totalDonations: number
  totalDonors: number
  matchedFunds: number
  countiesReached: number
  todaysDonations: number
  newDonorsToday: number
  averageDonation: number
  goalProgress: number
  donationsGrowth: number
  newDonorsGrowth: number
  matchRate: number
  californiaPercentage: number
}

interface RecentDonor {
  id: string
  donorId: string
  donorName: string
  amount: number
  city: string
  county: string
  date: string
  status: 'MATCHED' | 'PENDING'
}

interface ActivityItem {
  id: string
  type: 'donation' | 'match' | 'update' | 'goal'
  message: string
  timestamp: string
  icon: string
  color: string
}

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    totalDonors: 0,
    matchedFunds: 0,
    countiesReached: 0,
    todaysDonations: 0,
    newDonorsToday: 0,
    averageDonation: 0,
    goalProgress: 0,
    donationsGrowth: 0,
    newDonorsGrowth: 0,
    matchRate: 0,
    californiaPercentage: 0
  })
  const [recentDonors, setRecentDonors] = useState<RecentDonor[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [notificationActivity, setNotificationActivity] = useState<ActivityItem[]>([])
  const [monthlyData, setMonthlyData] = useState<{month: string, donations: number, matched: number}[]>([
    {month: 'Jan', donations: 0, matched: 0},
    {month: 'Feb', donations: 0, matched: 0},
    {month: 'Mar', donations: 0, matched: 0},
    {month: 'Apr', donations: 0, matched: 0},
    {month: 'May', donations: 0, matched: 0},
    {month: 'Jun', donations: 0, matched: 0},
    {month: 'Jul', donations: 0, matched: 0},
    {month: 'Aug', donations: 0, matched: 0},
    {month: 'Sep', donations: 0, matched: 0},
    {month: 'Oct', donations: 0, matched: 0},
    {month: 'Nov', donations: 0, matched: 0},
    {month: 'Dec', donations: 0, matched: 0}
  ])
  const [loading, setLoading] = useState(true)
  const [showAddDonorModal, setShowAddDonorModal] = useState(false)
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(true)
  const [lastNotificationCheck, setLastNotificationCheck] = useState<string>('')
  const notificationRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Load last notification check time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lastNotificationCheck')
    if (stored) {
      setLastNotificationCheck(stored)
      setUnreadNotifications(false)
    }
  }, [])

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
  }, [showNotifications])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAddDonorModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showAddDonorModal])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAddDonorModal(false)
      }
    }

    if (showAddDonorModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAddDonorModal])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
      } else {
        // Check if user is admin
        const { data: adminData } = await supabase.from('admins').select('*').eq('user_id', user.id).single()
        if (!adminData) {
          setShowAccessDeniedModal(true)
          await supabase.auth.signOut()
          router.push('/admin/login')
        } else {
          setUser(user)
        }
      }
    }
    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
      fetchRecentDonors()
      fetchRecentActivity()
      fetchMonthlyData()
    }
  }, [user])

  const fetchMonthlyData = async () => {
    try {
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, matched_amount, donation_date')

      // Initialize monthly data for all 12 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentYear = new Date().getFullYear()

      const monthlyStats = months.map((month, index) => {
        const monthNum = index + 1
        const monthDonations = donations?.filter(d => {
          const date = new Date(d.donation_date)
          return date.getMonth() + 1 === monthNum && date.getFullYear() === currentYear
        }) || []

        const totalDonations = monthDonations.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)
        const totalMatched = monthDonations.reduce((sum, d) =>
          sum + (d.matched_amount ? parseFloat(d.matched_amount.toString()) : 0), 0)

        return {
          month,
          donations: totalDonations,
          matched: totalMatched
        }
      })

      // console.log('Monthly Data:', monthlyStats)
      // console.log('All Donations:', donations)
      setMonthlyData(monthlyStats)
    } catch (error) {
      console.error('Error fetching monthly data:', error)
    }
  }

  const fetchDashboardStats = async () => {
    setLoading(true)

    // Get all donations
    const { data: donations } = await supabase
      .from('donations')
      .select('amount, matched_amount, donation_date, created_at')

    // Get all donors
    const { data: donors } = await supabase
      .from('donors')
      .select('id, total_donated, county, created_at')

    const today = new Date().toISOString().split('T')[0]
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthStr = lastMonth.toISOString().split('T')[0]

    // Calculate statistics
    const totalDonations = donations?.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0
    const totalDonors = donors?.length || 0
    const matchedFunds = donations?.reduce((sum, d) => sum + (d.matched_amount ? parseFloat(d.matched_amount.toString()) : 0), 0) || 0
    const countiesReached = new Set(donors?.filter(d => d.county).map(d => d.county)).size

    const todaysDonations = donations?.filter(d => d.donation_date === today)
      .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0

    const newDonorsToday = donors?.filter(d =>
      new Date(d.created_at).toISOString().split('T')[0] === today
    ).length || 0

    const averageDonation = donations && donations.length > 0
      ? totalDonations / donations.length
      : 0

    const goalAmount = 50000 // $50k goal
    const goalProgress = (totalDonations / goalAmount) * 100

    // Calculate growth
    const lastMonthDonations = donations?.filter(d => d.donation_date >= lastMonthStr)
      .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0
    const previousMonthDonations = totalDonations - lastMonthDonations
    const donationsGrowth = previousMonthDonations > 0
      ? ((lastMonthDonations - previousMonthDonations) / previousMonthDonations) * 100
      : 0

    const lastMonthNewDonors = donors?.filter(d => d.created_at >= lastMonthStr).length || 0
    const newDonorsGrowth = lastMonthNewDonors

    // Match rate
    const matchedCount = donations?.filter(d => d.matched_amount).length || 0
    const matchRate = donations && donations.length > 0
      ? (matchedCount / donations.length) * 100
      : 0

    // California percentage (58 counties in CA)
    const californiaPercentage = (countiesReached / 58) * 100

    setStats({
      totalDonations,
      totalDonors,
      matchedFunds,
      countiesReached,
      todaysDonations,
      newDonorsToday,
      averageDonation,
      goalProgress,
      donationsGrowth,
      newDonorsGrowth,
      matchRate,
      californiaPercentage
    })

    setLoading(false)
  }

  const fetchRecentDonors = async () => {
    try {
      setLoading(true)

      // Get recent donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('id, amount, donation_date, matched, donor_id')
        .order('donation_date', { ascending: false })
        .limit(20)

      if (donationsError) {
        console.error('Error fetching donations:', donationsError)
        setLoading(false)
        return
      }

      // console.log('Fetched donations:', donations)

      if (!donations || donations.length === 0) {
        setRecentDonors([])
        setLoading(false)
        return
      }

      // Get all donors
      const donorIds = donations.map(d => d.donor_id)
      const { data: donors, error: donorsError } = await supabase
        .from('donors')
        .select('*')
        .in('id', donorIds)

      if (donorsError) {
        console.error('Error fetching donors:', donorsError)
        console.error('Error message:', donorsError.message)
        console.error('Error details:', donorsError.details)
        // Continue anyway with empty donor data
      }

      // console.log('Fetched donors:', donors)

      // Create a map of donor id to donor info
      const donorMap = new Map()
      donors?.forEach(donor => {
        donorMap.set(donor.id, donor)
      })

      const formattedDonors: RecentDonor[] = donations.map((d: any) => {
        const donor = donorMap.get(d.donor_id)
        // Get city and county from donor fields
        const city = donor?.city || 'N/A'
        const county = donor?.county || 'N/A'

        return {
          id: d.id,
          donorId: d.donor_id,
          donorName: donor?.name || 'Unknown Donor',
          amount: parseFloat(d.amount),
          city: city,
          county: county,
          date: d.donation_date,
          status: d.matched ? 'MATCHED' : 'PENDING'
        }
      })

      // console.log('Formatted donors:', formattedDonors)
      setRecentDonors(formattedDonors)
      setLoading(false)
    } catch (error) {
      console.error('Exception in fetchRecentDonors:', error)
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      // Get recent donations with timestamps
      const { data: donations } = await supabase
        .from('donations')
        .select('id, amount, donation_date, matched, matched_amount, created_at, donor_id')
        .order('created_at', { ascending: false })
        .limit(10)

      // Get donor names
      const donorIds = donations?.map(d => d.donor_id) || []
      const { data: donors } = await supabase
        .from('donors')
        .select('id, name, created_at')
        .in('id', donorIds)

      const donorMap = new Map()
      donors?.forEach(donor => {
        donorMap.set(donor.id, donor)
      })

      const allActivities: ActivityItem[] = []
      const newActivities: ActivityItem[] = []

      // Get last check time from localStorage
      const lastCheck = localStorage.getItem('lastNotificationCheck')
      const lastCheckTime = lastCheck ? new Date(lastCheck).getTime() : 0

      // Process donations as activities
      donations?.forEach((donation: any) => {
        const donor = donorMap.get(donation.donor_id)
        const donorName = donor?.name || 'Unknown Donor'
        const amount = parseFloat(donation.amount)
        const timeAgo = getTimeAgo(donation.created_at)
        const createdTime = new Date(donation.created_at).getTime()

        const donationActivity = {
          id: `donation-${donation.id}`,
          type: 'donation' as const,
          message: `New donation from ${donorName} - $${amount.toLocaleString()}`,
          timestamp: timeAgo,
          icon: '✅',
          color: 'green'
        }

        // Add to all activities
        allActivities.push(donationActivity)

        // Only add to notifications if newer than last check
        if (createdTime > lastCheckTime) {
          newActivities.push(donationActivity)
        }

        // Matched donation activity
        if (donation.matched && donation.matched_amount) {
          const matchedAmt = parseFloat(donation.matched_amount)
          const matchActivity = {
            id: `match-${donation.id}`,
            type: 'match' as const,
            message: `Donation matched for ${donorName} - $${matchedAmt.toLocaleString()}`,
            timestamp: timeAgo,
            icon: '🤝',
            color: 'yellow'
          }

          allActivities.push(matchActivity)

          if (createdTime > lastCheckTime) {
            newActivities.push(matchActivity)
          }
        }
      })

      // Check if goal reached milestone
      const { data: allDonations } = await supabase
        .from('donations')
        .select('amount')

      const totalAmount = allDonations?.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0
      const goalAmount = 50000
      const goalProgress = (totalAmount / goalAmount) * 100

      if (goalProgress >= 90) {
        const goalActivity = {
          id: 'goal-milestone',
          type: 'goal' as const,
          message: `Fundraising goal reached ${goalProgress.toFixed(1)}% - Almost there!`,
          timestamp: 'Recently',
          icon: '🎯',
          color: 'purple'
        }
        allActivities.push(goalActivity)
        newActivities.push(goalActivity)
      }

      // Set activities - limit to 5 for display
      setRecentActivity(allActivities.slice(0, 5))
      setNotificationActivity(newActivities.slice(0, 5))

      // Set unread flag if there are new activities
      if (newActivities.length > 0) {
        setUnreadNotifications(true)
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleQuickMatch = async () => {
    try {
      // Get all pending donations
      const { data: pendingDonations, error: fetchError } = await supabase
        .from('donations')
        .select('id, amount')
        .eq('matched', false)

      if (fetchError) throw fetchError

      if (!pendingDonations || pendingDonations.length === 0) {
        alert('No pending donations to match.')
        return
      }

      // Update each pending donation individually
      const updatePromises = pendingDonations.map(donation =>
        supabase
          .from('donations')
          .update({
            matched: true,
            matched_amount: donation.amount
          })
          .eq('id', donation.id)
      )

      const results = await Promise.all(updatePromises)

      // Check for errors
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        throw errors[0].error
      }

      alert(`Successfully matched ${pendingDonations.length} pending donations!`)

      // Refresh stats, donors table, and activity
      fetchDashboardStats()
      fetchRecentDonors()
      fetchRecentActivity()
    } catch (error: any) {
      alert('Error performing quick match: ' + error.message)
    }
  }

  const handleExport = async () => {
    try {
      // Get all donors with their donations
      const { data: donors, error: donorsError } = await supabase
        .from('donors')
        .select('*')

      if (donorsError) throw donorsError

      if (!donors || donors.length === 0) {
        alert('No donors to export.')
        return
      }

      // Get all donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('*')

      if (donationsError) throw donationsError

      // Create CSV content
      const csvHeaders = 'Donor Name,Total Donated,City,County,Number of Donations,Last Donation Date\n'
      const csvRows = donors.map(donor => {
        const donorDonations = donations?.filter(d => d.donor_id === donor.id) || []
        const lastDonation = donorDonations.length > 0
          ? new Date(Math.max(...donorDonations.map(d => new Date(d.donation_date).getTime()))).toISOString().split('T')[0]
          : 'N/A'

        return `"${donor.name}","${donor.total_donated}","${donor.city || ''}","${donor.county || ''}","${donorDonations.length}","${lastDonation}"`
      }).join('\n')

      const csvContent = csvHeaders + csvRows

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `donors_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('Donors data exported successfully!')
    } catch (error: any) {
      alert('Error exporting data: ' + error.message)
    }
  }

  const handleImport = () => {
    // Create a hidden file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.style.display = 'none'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
          alert('CSV file must have at least a header row and one data row.')
          return
        }

        // Parse CSV (simple parsing, assumes no commas in fields or proper quoting)
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
        const expectedHeaders = ['Donor Name', 'Total Donated', 'City', 'County']

        // Check if headers match expected format
        const hasExpectedHeaders = expectedHeaders.every(expected =>
          headers.some(header => header.toLowerCase().includes(expected.toLowerCase().replace(' ', '')))
        )

        if (!hasExpectedHeaders) {
          alert('CSV must have columns: Donor Name, Total Donated, City, County')
          return
        }

        let successCount = 0
        let errorCount = 0

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
          if (values.length < 2) continue // Skip invalid rows

          const name = values[0]
          const totalDonated = parseFloat(values[1])
          const city = values[2] || null
          const county = values[3] || null

          if (!name || isNaN(totalDonated)) continue

          try {
            // Check if donor exists
            const { data: existingDonor } = await supabase
              .from('donors')
              .select('id, total_donated, city, county')
              .eq('name', name)
              .single()

            if (existingDonor) {
              // Update existing donor
              await supabase
                .from('donors')
                .update({
                  total_donated: parseFloat(existingDonor.total_donated.toString()) + totalDonated,
                  city: city || existingDonor.city,
                  county: county || existingDonor.county,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existingDonor.id)
            } else {
              // Create new donor
              await supabase
                .from('donors')
                .insert([{
                  name,
                  total_donated: totalDonated,
                  city,
                  county
                }])
            }

            successCount++
          } catch (err) {
            errorCount++
            console.error('Error importing donor:', name, err)
          }
        }

        alert(`Import completed! ${successCount} donors imported successfully. ${errorCount} errors.`)

        // Refresh data
        fetchDashboardStats()
        fetchRecentDonors()
        fetchRecentActivity()
        fetchMonthlyData()
      } catch (error: any) {
        alert('Error reading file: ' + error.message)
      }
    }

    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  }

  const handleReport = async () => {
    try {
      // Get all data for the report
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, matched_amount, donation_date, matched')

      const { data: donors } = await supabase
        .from('donors')
        .select('name, total_donated, county, city, created_at')

      if (!donations || !donors) {
        alert('No data available for report.')
        return
      }

      // Calculate report statistics
      const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)
      const totalMatched = donations.reduce((sum, d) => sum + (d.matched_amount ? parseFloat(d.matched_amount.toString()) : 0), 0)
      const matchedCount = donations.filter(d => d.matched).length
      const matchRate = donations.length > 0 ? (matchedCount / donations.length) * 100 : 0
      const averageDonation = donations.length > 0 ? totalDonations / donations.length : 0
      const countiesReached = new Set(donors.filter(d => d.county).map(d => d.county)).size

      // Generate report text
      const report = `
DONATION CAMPAIGN REPORT
Generated on: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS:
- Total Donors: ${donors.length}
- Total Donations: $${totalDonations.toLocaleString()}
- Matched Funds: $${totalMatched.toLocaleString()}
- Match Rate: ${matchRate.toFixed(1)}%
- Average Donation: $${averageDonation.toFixed(2)}
- Counties Reached: ${countiesReached}

TOP DONORS:
${donors
  .sort((a, b) => parseFloat(b.total_donated.toString()) - parseFloat(a.total_donated.toString()))
  .slice(0, 10)
  .map((donor, index) => `${index + 1}. ${donor.name} - $${parseFloat(donor.total_donated.toString()).toLocaleString()}`)
  .join('\n')}

RECENT ACTIVITY (Last 30 days):
- New Donors: ${donors.filter(d => {
    const created = new Date(d.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return created >= thirtyDaysAgo
  }).length}
- Donations in Last 30 Days: $${donations
    .filter(d => {
      const date = new Date(d.donation_date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return date >= thirtyDaysAgo
    })
    .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)
    .toLocaleString()}
      `

      // Create and download the report
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `donation_report_${new Date().toISOString().split('T')[0]}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('Report generated successfully!')
    } catch (error: any) {
      alert('Error generating report: ' + error.message)
    }
  }

  const refreshData = () => {
    fetchDashboardStats()
    fetchRecentDonors()
    fetchRecentActivity()
    fetchMonthlyData()
  }

  return {
    // State
    user,
    stats,
    recentDonors,
    recentActivity,
    notificationActivity,
    monthlyData,
    loading,
    showAddDonorModal,
    setShowAddDonorModal,
    showAccessDeniedModal,
    setShowAccessDeniedModal,
    showNotifications,
    setShowNotifications,
    unreadNotifications,
    setUnreadNotifications,
    lastNotificationCheck,
    setLastNotificationCheck,
    notificationRef,
    modalRef,

    // Functions
    formatCurrency,
    handleQuickMatch,
    handleExport,
    handleImport,
    handleReport,
    refreshData
  }
}