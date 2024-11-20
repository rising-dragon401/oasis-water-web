'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getFeaturedUsers = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: featuredUsers, error: featuredError } = await supabase
    .from('users')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  if (featuredError) {
    console.error('Error fetching featured users:', featuredError)
    return []
  }

  const { data: favorites, error: favoritesError } = await supabase
    .from('favorites')
    .select('*')
    .in(
      'uid',
      featuredUsers.map((user) => user.id)
    )

  if (favoritesError) {
    console.error('Error fetching user favorites:', favoritesError)
    return []
  }

  const usersWithFavorites = featuredUsers.map((user) => ({
    ...user,
    type: 'user',
    favorites: favorites.filter((fav) => fav.uid === user.id),
  }))

  // sort by most recent favorite
  usersWithFavorites.sort((a, b) => {
    const maxFavoriteA = Math.max(...a.favorites.map((fav: any) => fav.id))
    const maxFavoriteB = Math.max(...b.favorites.map((fav: any) => fav.id))
    return maxFavoriteB - maxFavoriteA
  })

  return usersWithFavorites
}
export const getOasisUsers = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = (await supabase.rpc('get_users_with_favorites', {
    page_number: 1,
    page_size: 40,
  })) as { data: Array<{ total_count: number } & Record<string, any>>; error: any }

  return data
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
    const totalEarnings =
      data.reduce(
        (acc, referral) =>
          referral.subscription_status === 'active' ? acc + (referral.amount ?? 0) : acc,
        0
      ) * 0.2

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

export const getAllLocationMarkers = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('tap_water_locations')
    .select('name, score, lat_long')
    .not('lat_long', 'is', null)
    .not('score', 'is', null)
    .limit(1000)

  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }

  const formattedData = data.map((location) => {
    const { latitude, longitude } = location.lat_long as { latitude: number; longitude: number }
    return {
      name: location.name,
      score: location.score,
      lat: latitude,
      lng: longitude,
    }
  })

  return formattedData
}

export const submitContact = async ({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from('contact_us').insert([
    {
      name,
      email,
      message,
    },
  ])

  return { success: !error }
}
