'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getLocations = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: locations, error } = await supabase.from('tap_water_locations').select()

  return locations
}

export const getLocationDetails = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  // Fetch location details
  const { data: item, error } = await supabase.from('tap_water_locations').select().eq('id', id)
  if (!item) {
    return null
  }

  const contaminants = item[0].contaminants
  if (!contaminants || contaminants.length === 0) {
    return { ...item[0], contaminants: [] }
  }

  // Fetch all ingredients in a single query
  const ingredientIds = contaminants.map((c: any) => c.ingredient_id)
  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select()
    .in('id', ingredientIds)

  if (!ingredients) {
    return { ...item[0], contaminants: [] }
  }

  // Map the fetched ingredients to their contaminants
  const contaminantData = contaminants
    .map((contaminant: any) => {
      const ingredientData = ingredients.find(
        (ingredient) => ingredient.id === contaminant.ingredient_id
      )
      return ingredientData ? ingredientData : null
    })
    .filter(Boolean) // Filter out any nulls in case of missing data

  const locationWithDetails = {
    ...item[0],
    contaminants: contaminantData,
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
