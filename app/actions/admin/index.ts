'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getFeaturedUsers = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from('users').select('*').eq('is_featured', true)

  if (error) {
    console.error('error', error)

    return []
  }

  const usersWithType = data.map((user) => ({ ...user, type: 'user' }))
  return usersWithType
}

export const getOasisUsers = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: featuredUsers, error: featuredError } = await supabase
    .from('users')
    .select('*')
    .eq('is_featured', true)
    .gt('favorites', 1)
    .not('username', 'is', null)

  const { data: nonFeaturedUsers, error: nonFeaturedError } = await supabase
    .from('users')
    .select('*')
    .eq('is_featured', false)
    .gt('favorites', 1)
    .not('username', 'is', null)

  if (featuredError || nonFeaturedError) {
    console.error('error', featuredError || nonFeaturedError)
    return []
  }

  const allUsers = [...(featuredUsers || []), ...(nonFeaturedUsers || [])]
  return allUsers
}

export const getResearch = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('research')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('error', error)

    return []
  }

  return data
}

export const getUserReferralStats = async (userId: string) => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referring_user_id', userId)

  let stats = {
    total_earnings: 0,
    total_paid_referrals: 0,
    total_trials: 0,
  }

  if (data) {
    // TODO - needs to be tracked by differnt parameter
    // i.e. if user cancels after paying they still count as a paid referral
    const totalEarnings = data.reduce(
      (acc, referral) => (referral.subscription_status === 'active' ? acc + referral.amount : acc),
      0
    )

    const totalPaidReferrals = data.reduce(
      (acc, referral) => (referral.subscription_status === 'paid' ? acc + 1 : acc),
      0
    )

    const totalTrials = data.reduce(
      (acc, referral) => (referral.subscription_status === 'trialing' ? acc + 1 : acc),
      0
    )

    stats = {
      total_earnings: Math.round(totalEarnings / 100),
      total_paid_referrals: totalPaidReferrals,
      total_trials: totalTrials,
    }
  }

  return stats
}
