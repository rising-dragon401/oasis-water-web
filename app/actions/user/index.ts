'use server'

import { ItemType } from '@/types/custom'
import { createSupabaseServerClient, getSession } from '@/utils/supabase/server'

export async function getUserId() {
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  return user.id
}

export async function getCurrentUserData(uid?: string | null) {
  const supabase = await createSupabaseServerClient()

  const session = await getSession()
  const user = session?.user

  let userId = null

  if (!uid) {
    userId = user?.id

    if (!user) {
      return null
    }
  } else {
    userId = uid
  }

  if (!userId) {
    return null
  }

  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()

  if (error) {
    console.error('Error fetching user: ', error)
    return null
  }

  // generate avatar url
  if (!data.avatar_url) {
    const randomInt = Math.floor(Math.random() * 15) + 1
    data.avatar_url = `https://connect.live-oasis.com/storage/v1/object/public/website/avatars/gradients/gradient-${randomInt}.png`

    // update user with new avatar url
    try {
      await supabase.from('users').update({ avatar_url: data.avatar_url }).eq('id', userId)
    } catch (error) {
      console.error('Error updating user avatar url:', error)
    }
  }

  const dataWithFields = {
    ...data,
    email: data.email || user?.email,
  }

  return dataWithFields
}

export async function getCurrentUserEmail() {
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  return user.email
}

export async function updateUserData(column: string, value: any, uid?: string) {
  const supabase = await createSupabaseServerClient()

  let userId

  if (uid) {
    userId = uid
  } else {
    const session = await getSession()

    const user = session?.user

    userId = user?.id
  }

  try {
    if (!userId) {
      throw new Error('No user found')
    }

    const { data, error } = await supabase
      .from('users')
      .update({ [column]: value })
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (e) {
    console.error('Error updating user data:', e)
    return false
  }
}

export async function updateUserFullName(uid: string, fullName: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', uid)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function getUserFavorites(uid: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from('favorites').select('*').eq('uid', uid)

  if (error) {
    throw new Error(error.message)
  }

  // go through each favorite and get the data for the favorite. If type is 'bottled_water' search items table. If type is 'tap_water_locations'. If type is 'filter' search water_filters table.
  const favorites = await Promise.all(
    data.map(async (favorite) => {
      if (favorite.type === 'bottled_water') {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', favorite.item_id)
          .single()

        if (error) {
          throw new Error(error.message)
        }

        return data
      } else if (favorite.type === 'tap_water') {
        const { data, error } = await supabase
          .from('tap_water_locations')
          .select('*')
          .eq('id', favorite.item_id)
          .single()

        if (error) {
          throw new Error(error.message)
        }

        return data
      } else if (favorite.type === 'filter') {
        const { data, error } = await supabase
          .from('water_filters')
          .select('*')
          .eq('id', favorite.item_id)
          .single()

        if (error) {
          throw new Error(error.message)
        }

        return data
      }
    })
  )

  return favorites
}

export async function addFavorite(uid: string, type: ItemType, itemId: number) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('favorites')
    .insert({ uid: uid, type: type, item_id: itemId })
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // then update user score

  return data
}

export async function removeFavorite(uid: string, type: string, itemId: number) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('uid', uid)
    .eq('type', type)
    .eq('item_id', itemId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function addToEmailList(
  uid: string,
  email: string,
  list: 'newsletter',
  subscribed: boolean
) {
  const supabase = await createSupabaseServerClient()

  try {
    // First, check if the record already exists
    const { data: existing, error: existingError } = await supabase
      .from('email_lists')
      .select()
      .eq('email', email)
      .eq('list', list)
      .single()

    // If the record exists, return or update as needed
    if (existing) {
      console.log('Record already exists. Skipping insert.')
      return false // Or handle as needed, e.g., update the record instead
    }

    // If the record does not exist, proceed to insert
    const { data, error } = await supabase
      .from('email_lists')
      .insert({ uid, email, list, subscribed })
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (err) {
    console.error('Error updating user email settings: ', err)
    return false
  }
}

export async function getSubscription(uid: string | null) {
  if (!uid) {
    return null
  }

  const supabase = await createSupabaseServerClient()

  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', uid)
      .single()

    if (!subscription) {
      return null
    }

    let planPlan = 'Free'

    // @ts-ignore
    const provider = subscription?.metadata?.provider || 'stripe'

    if (provider === 'stripe') {
      const activePlan = subscription?.prices?.products?.name

      if (!activePlan) {
        planPlan = 'Free'
      } else if (
        activePlan?.toLowerCase() === 'pro (test)' ||
        activePlan?.toLowerCase() === 'pro (beta)' ||
        activePlan?.toLowerCase() === 'pro (dev)'
      ) {
        planPlan = 'Member'
      }
    } else if (provider === 'revenue_cat') {
      const isActive = subscription?.prices?.active

      console.log('isActive: ', isActive)

      if (isActive) {
        planPlan = 'Member'
      }
    }

    return {
      ...subscription,
      plan: planPlan,
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' })

  if (error) {
    console.log(error.message)
  }
  return data ?? []
}

export async function getEmailSubscriptions() {
  const supabase = await createSupabaseServerClient()
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  const uid = user.id

  if (!uid) {
    return null
  }

  const { data, error } = await supabase.from('email_lists').select('*').eq('uid', uid)

  if (error) {
    console.error('Error fetching email subscriptions:', error)
  }

  return data
}

export const resetPassword = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error('Error:', error)
    return false
  }

  return data
}

export const incrementItemsViewed = async () => {
  const supabase = await createSupabaseServerClient()
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  // Fetch current user data to get the current items_viewed count
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userError) {
    console.error('Error fetching user data:', userError)
    return null
  }

  // Increment items_viewed count
  // @ts-ignore
  const currentItemsViewed = userData.metadata?.items_viewed || 0
  const updatedItemsViewed = currentItemsViewed + 1

  // Update user metadata with new items_viewed count
  const { data, error } = await supabase
    .from('users')
    .update({ metadata: { items_viewed: updatedItemsViewed } })
    .eq('id', user.id)
    .select()

  if (error) {
    console.error('Error incrementing items viewed:', error)
    return null
  }

  return data
}

export const calculateUserScore = async (uid: string) => {
  try {
    const favs = await getUserFavorites(uid)

    let score = 0
    let totalCount = 0
    let totalScore = 0

    // get average
    await favs.map((fav: any) => {
      totalScore += fav.score || 0
      totalCount += 1
    })

    score = Math.round(totalScore / totalCount)

    return updateUserData('score', score, uid)
  } catch {
    return false
  }
}

export const getUsersWithOasis = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from('users').select('*').eq('is_oasis_public', true)

  if (error) {
    console.error('Error fetching users with oasis:', error)
    return null
  }

  // check if user has favorites
  const users = await Promise.all(
    data.map(async (user) => {
      const favorites = await getUserFavorites(user.id)
      return { ...user, favorites }
    })
  )

  return users
}

export const followUser = async (uid: string, followId: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: authUserFollowing, error: fetchError } = await supabase
    .from('users')
    .select('following')
    .eq('uid', uid)
    .single()

  console.log('authUserFollowing array: ', authUserFollowing)

  // if (fetchError) {
  //   console.error('Error fetching user data:', fetchError)
  //   return null
  // }

  // const { data: userToUpdate, error: updateUserError } = await supabase
  //   .from('users')
  //   .update({ following: supabase.functions.append(followId) })
  //   .match({ uid: uid })
  //   .single()

  // const { data: followerToUpdate, error: updateFollowerError } = await supabase
  //   .from('users')
  //   .update({ followers: supabase.functions.append(uid) })
  //   .match({ uid: followId })
  //   .single()

  // if (error) {
  //   console.error('Error following user:', error)
  //   return false
  // }

  // return data
}

export const unFollowUser = async (uid: string, followId: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: authUserFollowing, error: fetchError } = await supabase
    .from('users')
    .select('following')
    .eq('uid', uid)
    .single()

  console.log('authUserFollowing array: ', authUserFollowing)

  // if (fetchError) {
  //   console.error('Error fetching user data:', fetchError)
  //   return null
  // }

  // const { data: userToUpdate, error: updateUserError } = await supabase
  //   .from('users')
  //   .update({ following: supabase.functions.append(followId) })
  //   .match({ uid: uid })
  //   .single()

  // const { data: followerToUpdate, error: updateFollowerError } = await supabase
  //   .from('users')
  //   .update({ followers: supabase.functions.append(uid) })
  //   .match({ uid: followId })
  //   .single()

  // if (error) {
  //   console.error('Error following user:', error)
  //   return false
  // }

  // return data
}
