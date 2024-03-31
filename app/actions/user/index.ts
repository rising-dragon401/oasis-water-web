'use server'

import { getSession } from '@/utils/supabase/server'
import { ItemType } from '@/types/custom'
import { createSupabaseServerClient } from '@/utils/supabase/server'

export async function getUserId() {
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  return user.id
}

export async function getCurrentUserData() {
  const supabase = await createSupabaseServerClient()
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()

  if (error) {
    console.error('Error fetching user: ', error)
    return null
  }

  const dataWithFields = {
    ...data,
    email: data.email || user.email,
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

export async function updateUserData(column: string, value: any) {
  const supabase = await createSupabaseServerClient()
  const session = await getSession()

  const user = session?.user

  try {
    if (!user) {
      throw new Error('No user found')
    }

    const { data, error } = await supabase
      .from('users')
      .update({ [column]: value })
      .eq('id', user.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (e) {
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

export async function getUserFavorites() {
  const supabase = await createSupabaseServerClient()
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from('favorites').select('*').eq('uid', user.id)

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

export async function getSubscription() {
  const supabase = await createSupabaseServerClient()

  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user.id)
      .single()

    return subscription
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = await createSupabaseServerClient()

  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

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

export async function getEmailSubscriptions(uid: string | null) {
  if (!uid) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from('email_lists').select('*').eq('uid', uid)

  if (error) {
    console.error('Error fetching email subscriptions:', error)
  }

  return data
}
