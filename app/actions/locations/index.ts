'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { IngredientDescriptor, Ingredient } from '@/types/custom'

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

export const getLocationDetails = async (id: string, allIngredients: Ingredient[]) => {
  const supabase = await createSupabaseServerClient()

  // Fetch location details
  const { data: location } = await supabase
    .from('tap_water_locations')
    .select()
    .eq('id', id)
    .single()

  if (!location) {
    return null
  }

  const cleanUtilities = await Promise.all(
    location.utilities?.map(async (utility: any) => {
      if (!utility) return null

      const cleanedContaminants = await Promise.all(
        utility.contaminants.map(async (contaminant: IngredientDescriptor) => {
          // Find the matching ingredient from the fetched ingredients
          const ingredient = allIngredients.find(
            (ingredient) => ingredient.id === contaminant.ingredient_id
          )

          let limit = ingredient?.legal_limit || ingredient?.health_guideline || 0

          let exceedingRecommendedLimit = 0
          if (limit && contaminant.amount) {
            exceedingRecommendedLimit = Math.round(limit / contaminant.amount)
          }

          return {
            ...ingredient,
            ingredient_id: contaminant.ingredient_id,
            amount: contaminant.amount,
            exceedingRecommendedLimit:
              exceedingRecommendedLimit > 0 ? exceedingRecommendedLimit : null,
          }
        })
      )

      cleanedContaminants.sort((a, b) => b.exceedingRecommendedLimit - a.exceedingRecommendedLimit)

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
