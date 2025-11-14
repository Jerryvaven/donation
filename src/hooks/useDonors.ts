import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export interface Donor {
  id: string
  name: string
  total_donated: number
  city?: string
  county?: string
  latitude?: string
  longitude?: string
  created_at: string
}

export const useDonors = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await supabase
          .from('donors')
          .select('*')
          .order('total_donated', { ascending: false })

        const { data, error: supabaseError } = response

        if (supabaseError) {
          console.error('Error fetching donors:', supabaseError)
          setError('Failed to fetch donors')
        } else {
          setDonors(data || [])
        }
      } catch (err) {
        console.error('Exception fetching donors:', err)
        setError('An unexpected error occurred while fetching donors')
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [supabase])

  return { donors, loading, error }
}