'use server'

import { supabase } from '@/utils/supabase'
import { getSession } from '@/app/supabase-server'
import { Ingredient } from '@/types/custom'

export const getItems = async () => {
  const { data: items, error } = await supabase.from('items').select()

  return items
}

export const searchItems = async (query: string) => {
  // Text search items
  const { data: items, error } = await supabase.from('items').select().textSearch('fts', query, {
    type: 'phrase',
  })

  return items || []
}

export const getItem = async (id: string) => {
  const { data: item, error } = await supabase.from('items').select().eq('id', id).single()
  return item
}

export const getItemDetails = async (id: string) => {
  const { data: item, error } = await supabase.from('items').select().eq('id', id)

  if (!item) {
    return null
  }

  const brandId = item[0].brand
  const ingredients = item[0].ingredients
  const companyId = item[0].company
  const contaminants = item[0].contaminants

  let brand = null
  if (brandId) {
    const { data, error: brandError } = await supabase.from('brands').select().eq('id', brandId)
    brand = data ? data[0] : null
  }

  let ingredientsDetails: any[] = []
  if (ingredients && ingredients.length > 0) {
    ingredientsDetails = await Promise.all(
      ingredients.map(async (ingredient) => {
        if (!ingredient) {
          return null
        }

        const { data, error: ingredientError } = await supabase
          .from('ingredients')
          .select()
          // @ts-ignore
          .eq('id', ingredient.ingredient_id)

        if (!data) {
          return null
        }

        return data[0]
      })
    )
  }

  let company = null
  if (companyId) {
    const { data, error: companyError } = await supabase
      .from('companies')
      .select()
      .eq('id', companyId)
    company = data ? data[0] : null
  }

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

        return data[0]
      })
    )
  }

  const itemWithDetails = {
    ...item[0],
    brand,
    ingredients: ingredientsDetails,
    company,
    contaminants: contaminantData,
  }

  return itemWithDetails
}
