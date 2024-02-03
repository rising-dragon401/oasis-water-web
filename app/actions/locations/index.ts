'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getLocations = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: locations, error } = await supabase.from('tap_water_locations').select()

  return locations
}

export const getLocationDetails = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: item, error } = await supabase.from('tap_water_locations').select().eq('id', id)

  if (!item) {
    return null
  }
  const contaminants = item[0].contaminants

  let contaminantData: any[] = []
  if (contaminants && contaminants.length > 0) {
    contaminantData = await Promise.all(
      contaminants.map(async (contaminant: any) => {
        const { data, error: contaminantError } = await supabase
          .from('ingredients')
          .select()
          .eq('id', contaminant.ingredient_id)

        if (!data) {
          return null
        }

        return {
          metadata: data[0],
          amount: contaminant.amount,
        }
      })
    )
  }

  const locationithDetails = {
    ...item[0],
    contaminants: contaminantData,
  }

  return locationithDetails
}

export const getLocation = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: location, error } = await supabase
    .from('tap_water_locations')
    .select()
    .eq('id', id)
    .single()

  return location
}

export const getRandomLocationBunch = async () => {
  const supabase = await createSupabaseServerClient()

  const { count } = await supabase.from('tap_water_locations').select('*', { count: 'exact' })

  if (!count) {
    console.error('Error fetching tap_water_locations count')
    return []
  }

  const randomIds = Array.from({ length: 5 }, () => Math.floor(Math.random() * count))
  const { data: locations, error } = await supabase
    .from('tap_water_locations')
    .select()
    .in('id', randomIds)

  if (error) {
    console.error('Error fetching random locations:', error)
    return []
  }

  return locations || []
}
