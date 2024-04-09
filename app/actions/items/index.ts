'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { IngredientDescriptor, Ingredient } from '@/types/custom'

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

export const getItemDetails = async (id: string, allIngredients: Ingredient[]) => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: item, error } = await supabase.from('items').select().eq('id', id).single()

    if (!item) {
      return null
    }

    const brandPromise = item.brand
      ? supabase.from('brands').select().eq('id', item.brand).single()
      : Promise.resolve(null)
    const companyPromise = item.company
      ? supabase.from('companies').select().eq('id', item.company).single()
      : Promise.resolve(null)
    const ingredients = item.ingredients as IngredientDescriptor[]

    // Fetching ingredients with their legal limits and health guidelines
    const [brandResult, companyResult] = await Promise.all([brandPromise, companyPromise])

    let brand = brandResult?.data ? brandResult.data : null
    let company = companyResult?.data ? companyResult.data : null

    // Map through ingredients to compare amount with legal_limit and health_guideline
    const detailedIngredients = ingredients
      ?.map((ingredient: IngredientDescriptor) => {
        if (!ingredient || !ingredient?.ingredient_id) return null

        const detail = allIngredients.find((d) => d.id === ingredient?.ingredient_id) as any

        let limit = detail?.legal_limit || 0
        if (detail?.health_guideline) {
          limit = detail.health_guideline
        }

        console.log('limit', limit)

        let exceedingLimit = 0
        if (limit && ingredient.amount) {
          exceedingLimit = Math.round(ingredient.amount / limit)
        }

        return {
          ...detail,
          amount: ingredient.amount,
          legal_limit: detail?.legal_limit,
          health_guideline: detail?.health_guideline,
          exceedingLimit: exceedingLimit,
        }
      })
      ?.filter((ingredient) => ingredient !== null)

    const itemWithDetails = {
      ...item,
      brand,
      ingredients: detailedIngredients,
      company,
      contaminants: detailedIngredients?.filter((ingredient) => ingredient.is_contaminant),
    }

    return itemWithDetails
  } catch (error) {
    console.error('getItemDetails error: ', error)
    return error
  }
}

export const getTopItems = async () => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: items, error } = await supabase
      .from('items')
      .select()
      .not('score', 'is', null) // Exclude items with a score of null
      .or('is_indexed.is.null,is_indexed.eq.true')
      .order('score', { ascending: false })
      .range(0, 10)

    return items || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getRandomItems = async () => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: items, error } = await supabase.from('items').select().range(0, 10)

    return items || []
  } catch (error) {
    console.error(error)
    return []
  }
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

  const { data: items, error } = await supabase.from('items').select().gt('score', 70)

  return items || []
}

export const determineIfIngredientIsContaminant = async (ingredientId: number) => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: ingredient, error } = await supabase
      .from('ingredients')
      .select('is_contaminant')
      .eq('id', ingredientId)
      .single()

    if (error) throw error

    return ingredient.is_contaminant
  } catch (error) {
    console.error(error)
    return false
  }
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
