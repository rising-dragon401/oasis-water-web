'use server'

import { Ingredient, IngredientDescriptor } from '@/types/custom'
import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getLocations = async ({
  limit,
  sortMethod,
}: { limit?: number; sortMethod?: 'name' | 'score' } = {}) => {
  const supabase = await createSupabaseServerClient()

  let orderBy = sortMethod || 'name'

  try {
    let locations

    if (limit) {
      const { data } = await supabase
        .from('tap_water_locations')
        .select()
        .order(orderBy)
        .limit(limit)

      locations = data
    } else {
      const { data } = await supabase.from('tap_water_locations').select().order(orderBy)

      locations = data
    }

    if (!locations) {
      return []
    }

    // const filteredAndScoredLocations =
    //   locations &&
    //   locations
    //     .filter((location: any) => location.name && location.image)
    //     .map((location: any) => {
    //       return {
    //         ...location,
    //         // @ts-ignore
    //         score: location?.utilities?.length > 0 ? location?.utilities[0].score : 0,
    //       }
    //     })

    return locations
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

  // Assuming utility processing doesn't inherently require async operations
  const cleanUtilities =
    location.utilities?.map((utility: any) => {
      if (!utility) return null

      const cleanedContaminants = utility.contaminants.map((contaminant: IngredientDescriptor) => {
        const ingredient = allIngredients.find(
          (ingredient) => ingredient.id === contaminant.ingredient_id
        )

        let limit = ingredient?.legal_limit || ingredient?.health_guideline || 0
        let exceedingLimit = 0
        if (limit && contaminant.amount) {
          exceedingLimit = Math.round(contaminant.amount / limit)
        }

        return {
          ...ingredient,
          ingredient_id: contaminant.ingredient_id,
          amount: contaminant.amount,
          exceedingLimit: exceedingLimit > 0 ? exceedingLimit : null,
        }
      })

      cleanedContaminants.sort(
        (a: { exceedingLimit: number | null }, b: { exceedingLimit: number | null }) => {
          // Assuming exceedingLimit can be null, handle nulls in your comparison logic
          if (a.exceedingLimit === null) return 1
          if (b.exceedingLimit === null) return -1
          return b.exceedingLimit - a.exceedingLimit
        }
      )
      return {
        ...utility,
        contaminants: cleanedContaminants,
      }
    }) || []

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

export const getRandomLocations = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.rpc('get_random_locations')

  if (error) {
    console.error('error', error)

    return []
  }

  return data
}

export const getFeaturedLocations = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: featuredLocations, error } = await supabase
    .from('tap_water_locations')
    .select()
    .eq('is_featured', true)

  if (error) {
    console.error('Error fetching featured locations:', error)
    return []
  }

  featuredLocations.forEach((location) => {
    if (location && location.utilities && location.utilities.length > 0) {
      // @ts-ignore
      location.score = location.utilities[0]?.score
    } else {
      location.score = null
    }
  })

  const randomOrder = featuredLocations.sort(() => Math.random() - 0.5)

  return randomOrder || []
}
