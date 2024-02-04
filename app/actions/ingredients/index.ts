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
