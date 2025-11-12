import { useState, useMemo } from 'react'
import type { Donor } from './useDonors'

export type SortOption = 'total_donated' | 'name' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export const useDonorFilters = (donors: Donor[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCounty, setSelectedCounty] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('total_donated')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const counties = useMemo(() => {
    const uniqueCounties = new Set(donors.map(donor => donor.county).filter((county): county is string => Boolean(county)))
    return Array.from(uniqueCounties).sort()
  }, [donors])

  const filteredAndSortedDonors = useMemo(() => {
    let filtered = donors.filter(donor => {
      const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCounty = !selectedCounty || donor.county === selectedCounty
      return matchesSearch && matchesCounty
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'total_donated':
          aValue = a.total_donated
          bValue = b.total_donated
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [donors, searchTerm, selectedCounty, sortBy, sortDirection])

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortDirection('desc')
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedCounty,
    setSelectedCounty,
    sortBy,
    sortDirection,
    counties,
    filteredAndSortedDonors,
    handleSort
  }
}