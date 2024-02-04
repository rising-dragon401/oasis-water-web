'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getIngredient = async (id: string) => {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: ingredient, error } = await supabase.from('ingredients').select().eq('id', id)

    if (!ingredient || error) {
      throw new Error('No ingredient found')
    }

    return ingredient[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getIngredients = async () => {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: ingredients, error } = await supabase.from('ingredients').select()

    if (!ingredients || error) {
      throw new Error('No ingredients found')
    }

    return ingredients
  } catch (error) {
    console.error(error)
    return []
  }
}
