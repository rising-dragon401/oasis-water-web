'use server'

import { getSession } from '@/app/supabase-server'
import { ItemType } from '@/types/custom'
import { supabase } from '@/app/api/utils/supabase-server-client'

export async function getUserId() {
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  return user.id
}

export async function getCurrentUserData() {
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

  return data
}

export async function getCurrentUserEmail() {
  const session = await getSession()

  const user = session?.user

  if (!user) {
    return null
  }

  return user.email
}

export async function updateUserFullName(uid: string, fullName: string) {
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
