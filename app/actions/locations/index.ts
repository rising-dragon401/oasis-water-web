'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { IngredientDescriptor } from '@/types/custom'

export const getLocations = async () => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: locations, error } = await supabase.from('tap_water_locations').select()

    const locationsWithScores =
      locations &&
      locations.map((location: any) => {
        return {
          ...location,
          // @ts-ignore
          score: location?.utilities?.length > 0 ? location?.utilities[0].score : 0,
        }
      })

    return locationsWithScores
  } catch (error) {
    console.error('Error fetching locations:', error)
    return []
  }
}

export const getLocationDetails = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  // Fetch location details
  const { data: items, error } = await supabase.from('tap_water_locations').select().eq('id', id)

  if (!items) {
    return null
  }

  const location = items[0]

  // Fetch all ingredients once
  const { data: ingredients, error: ingredientsError } = await supabase.from('ingredients').select()

  if (!ingredients) {
    return null
  }

  const cleanUtilities = await Promise.all(
    location.utilities?.map(async (utility: any) => {
      if (!utility) return null

      const cleanedContaminants = await Promise.all(
        utility.contaminants.map(async (contaminant: IngredientDescriptor) => {
          // Find the matching ingredient from the fetched ingredients
          const ingredient = ingredients.find(
            (ingredient) => ingredient.id === contaminant.ingredient_id
          )

          return {
            ...ingredient,
            ingredient_id: contaminant.ingredient_id,
            amount: contaminant.amount,
          }
        })
      )

      return {
        ...utility,
        contaminants: cleanedContaminants,
      }
    }) || []
  )

  const locationWithDetails = {
    ...location,
    utilities: cleanUtilities,
  }

  // console.log('locationWithDetails: ', locationWithDetails)

  return locationWithDetails
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
