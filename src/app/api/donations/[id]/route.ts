import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminData) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id: donationId } = await params

    // First, get the donation to get amount and donor_id
    const { data: donation, error: fetchError } = await supabase
      .from('donations')
      .select('amount, donor_id')
      .eq('id', donationId)
      .single()

    if (fetchError || !donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    // Check how many donations this donor has
    const { data: donorDonations, error: countError } = await supabase
      .from('donations')
      .select('id')
      .eq('donor_id', donation.donor_id)

    if (countError) {
      console.error('Error counting donor donations:', countError)
      return NextResponse.json({ error: 'Failed to check donor donations' }, { status: 500 })
    }

    // Delete the donation
    const { error: deleteError } = await supabase
      .from('donations')
      .delete()
      .eq('id', donationId)

    if (deleteError) {
      console.error('Error deleting donation:', deleteError)
      return NextResponse.json({ error: 'Failed to delete donation' }, { status: 500 })
    }

    // If this was the donor's only donation, delete the donor as well
    if (donorDonations && donorDonations.length === 1) {
      const { error: donorDeleteError } = await supabase
        .from('donors')
        .delete()
        .eq('id', donation.donor_id)

      if (donorDeleteError) {
        console.error('Error deleting donor:', donorDeleteError)
        // Don't fail the request, donation is already deleted
      }
    } else if (donorDonations && donorDonations.length > 1) {
      // Update donor's total_donated if they have other donations
      const { data: donor, error: donorFetchError } = await supabase
        .from('donors')
        .select('total_donated')
        .eq('id', donation.donor_id)
        .single()

      if (donor && !donorFetchError) {
        const newTotal = parseFloat(donor.total_donated.toString()) - parseFloat(donation.amount.toString())
        const { error: donorError } = await supabase
          .from('donors')
          .update({
            total_donated: newTotal
          })
          .eq('id', donation.donor_id)

        if (donorError) {
          console.error('Error updating donor total:', donorError)
          // Continue, donation is already deleted
        }
      }
    }

    return NextResponse.json({ message: 'Donation deleted successfully' })
  } catch (error) {
    console.error('Error in delete donation API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminData) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id: donationId } = await params
    const body = await request.json()
    const { donorName, amount, city, county, date, matched, matchedAmount } = body

    // First, get the current donation to find the donor_id and current amount
    const { data: currentDonation, error: fetchError } = await supabase
      .from('donations')
      .select('donor_id, amount')
      .eq('id', donationId)
      .single()

    if (fetchError || !currentDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    // Calculate amount difference
    const amountDifference = parseFloat(amount) - parseFloat(currentDonation.amount.toString())

    // Update donor's total_donated
    const { data: donor, error: donorFetchError } = await supabase
      .from('donors')
      .select('total_donated')
      .eq('id', currentDonation.donor_id)
      .single()

    if (donor && !donorFetchError) {
      const currentTotal = parseFloat(donor.total_donated.toString())
      const newTotal = currentTotal + amountDifference
      const { error: donorError } = await supabase
        .from('donors')
        .update({
          name: donorName,
          city: city || null,
          county: county || null,
          total_donated: newTotal
        })
        .eq('id', currentDonation.donor_id)

      if (donorError) {
        console.error('Error updating donor:', donorError)
        return NextResponse.json({ error: 'Failed to update donor' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 })
    }

    // Update the donation
    const { error } = await supabase
      .from('donations')
      .update({
        amount: parseFloat(amount),
        donation_date: new Date(date).toISOString().split('T')[0],
        matched: matched || false,
        matched_amount: matched ? (parseFloat(matchedAmount) || parseFloat(amount)) : null
      })
      .eq('id', donationId)

    if (error) {
      console.error('Error updating donation:', error)
      return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Donation updated successfully' })
  } catch (error) {
    console.error('Error in update donation API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}