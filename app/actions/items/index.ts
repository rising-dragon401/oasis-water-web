'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { IngredientDescriptor } from '@/types/custom'

export const getItems = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase.from('items').select()

  if (!items) {
    return []
  }

  const itemsWithCompany = await Promise.all(
    items.map(async (item) => {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('name')
        .eq('id', item.company)

      return {
        ...item,
        company_name: company ? company[0].name : null,
      }
    })
  )

  return itemsWithCompany
}

export const getItem = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: item, error } = await supabase.from('items').select().eq('id', id).single()
  return item
}

export const getItemDetails = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: item, error } = await supabase.from('items').select().eq('id', id)

  if (!item) {
    return null
  }

  const brandId = item[0].brand
  const ingredients = item[0].ingredients as IngredientDescriptor[]
  const companyId = item[0].company

  let contaminants = await Promise.all(
    (ingredients || []).map(async (ingredient) => {
      if (!ingredient) {
        return null
      }
      const isContaminant = await determineIfIngredientIsContaminant(ingredient.ingredient_id)
      return isContaminant ? ingredient : null
    })
  )

  contaminants = contaminants.filter((contaminant) => contaminant !== null)

  let brand = null
  if (brandId) {
    const { data, error: brandError } = await supabase.from('brands').select().eq('id', brandId)
    brand = data ? data[0] : null
  }

  let ingredientsDetails: any[] = []
  if (ingredients && ingredients.length > 0) {
    ingredientsDetails = await Promise.all(
      ingredients.map(async (ingredient: any) => {
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

        const ingredient = data[0]

        const exceedingHealthGuideline = ingredient.health_guideline
          ? Math.floor(contaminant?.amount / ingredient.health_guideline) || false
          : false

        const exceedingLegalLimit = ingredient?.legal_limit
          ? Math.floor(contaminant?.amount / ingredient.legal_limit) || false
          : false

        const exceedingRecommendedLimit = exceedingHealthGuideline || exceedingLegalLimit || false

        return {
          metadata: data[0],
          amount: contaminant.amount,
          exceedingRecommendedLimit,
        }
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

export const getTopItems = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase
    .from('items')
    .select()
    .or('is_indexed.is.null,is_indexed.eq.true')
    .order('score', { ascending: false })
    .range(0, 10)

  return items || []
}

export const getWorstItems = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase
    .from('items')
    .select()
    .or('is_indexed.is.null,is_indexed.eq.true')
    .order('score', { ascending: true })
    .range(0, 10)

  return items || []
}

export const getRecommendedItems = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase.from('items').select().eq('recommended', true)

  return items || []
}

export const determineIfIngredientIsContaminant = async (ingredientId: number) => {
  const supabase = await createSupabaseServerClient()

  const { data: ingredient, error } = await supabase
    .from('ingredients')
    .select('is_contaminant')
    .eq('id', ingredientId)
    .single()

  if (error) throw error

  return ingredient.is_contaminant
}

export const getItemsWithIngredient = async (ingredientId: number) => {
  const supabase = await createSupabaseServerClient()

  try {
    // @ts-ignore
    const { data: items, error } = await supabase.rpc('get_items_with_ingredient', {
      ingredient_id: ingredientId,
    })

    if (error) throw error

    return items || []
  } catch (error) {
    console.error(error)
    return []
  }
}
