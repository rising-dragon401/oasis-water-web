'use server'

import { supabase } from '@/utils/supabase'
import { getSession } from '@/app/supabase-server'

import { Ingredient } from '@/types/custom'

export const getLocations = async () => {
  const { data: locations, error } = await supabase.from('tap_water_locations').select()

  return locations
}

export const searchLocations = async (query: string) => {
  const queryNumber = parseInt(query)

  const { data: locationsByZip, error: zipError } = await supabase
    .from('tap_water_locations')
    .select()
    .contains('zip_codes', [queryNumber])

  const { data: locationsByName, error: nameError } = await supabase
    .from('tap_water_locations')
    .select()
    .ilike('name', `%${query}%`)

  const locations = [...(locationsByZip || []), ...(locationsByName || [])]

  if (!locations) {
    return []
  }

  const taggedLocations = locations.map((location) => {
    return {
      ...location,
      type: 'location',
    }
  })

  return taggedLocations || []
}

export const getLocationDetails = async (id: string) => {
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
  const { data: location, error } = await supabase
    .from('tap_water_locations')
    .select()
    .eq('id', id)
    .single()

  return location
}
