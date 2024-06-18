'use server'

import { Ingredient, IngredientDescriptor, ItemType } from '@/types/custom'
import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getItems = async ({
  limit,
  sortMethod,
}: { limit?: number; sortMethod?: 'name' | 'score' } = {}) => {
  const supabase = await createSupabaseServerClient()

  let items
  let orderBy = sortMethod || 'name'

  console.log('orderBy: ', orderBy)

  if (limit) {
    const { data } = await supabase
      .from('items')
      .select()
      .order(orderBy, { ascending: true })
      .limit(limit)

    items = data
  } else {
    const { data } = await supabase.from('items').select().order(orderBy, { ascending: true })

    items = data
  }

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
  try {
    const { data: item, error } = await supabase
      .from('items')
      .select(`*, brand:brands(*), company:companies(*)`)
      .eq('id', id)
      .single()

    if (!item) {
      return null
    }

    const ingredientIds = item.ingredients
      ? (item.ingredients as IngredientDescriptor[])
          .filter(Boolean)
          .map((ingredient: IngredientDescriptor) => ingredient.ingredient_id)
      : []

    const { data: ingredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*')
      .in('id', ingredientIds)

    const ingredientsMap = ingredients?.reduce(
      (map, ingredient) => {
        map[ingredient.id] = ingredient
        return map
      },
      {} as Record<string, Ingredient>
    )

    const detailedIngredients = item.ingredients
      ? item.ingredients
          .filter(Boolean)
          .map((ingredient: any) => {
            if (!ingredient.ingredient_id) return null

            if (!ingredientsMap) return null

            const detail = ingredientsMap[ingredient.ingredient_id]
            let limit = detail?.legal_limit || 0
            if (detail?.health_guideline) {
              limit = detail.health_guideline
            }
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
          ?.filter((ingredient: any) => ingredient !== null)
      : []

    const itemWithDetails = {
      ...item,
      brand: item.brand,
      ingredients: detailedIngredients,
      company: item.company,
      contaminants: detailedIngredients?.filter((ingredient: any) => ingredient?.is_contaminant),
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

    if (!items) {
      return []
    }

    const shuffleArray = (array: any) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
      }
      return array
    }

    const shuffledItems = shuffleArray(items || [])

    return shuffledItems
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getRandomItems = async ({ type }: { type?: ItemType }) => {
  const supabase = await createSupabaseServerClient()

  try {
    const query = supabase.from('items').select().range(0, 5)

    if (type) {
      query.eq('type', type)
    }

    const { data: items, error } = await query

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
    .range(0, 5)

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

export const getFlavoredWater = async ({
  limit,
  sortMethod,
}: { limit?: number; sortMethod?: 'name' | 'score' } = {}) => {
  let orderBy = sortMethod || 'name'

  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase
    .from('items')
    .select()
    .eq('type', 'flavored_water')
    .order(orderBy, { ascending: true })

  return items || []
}

export const getWaterGallons = async ({
  limit,
  sortMethod,
}: { limit?: number; sortMethod?: 'name' | 'score' } = {}) => {
  const supabase = await createSupabaseServerClient()

  let orderBy = sortMethod || 'name'

  const { data: items, error } = await supabase
    .from('items')
    .select()
    .ilike('name', '%gallon%')
    .order(orderBy, { ascending: true })

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

export const getMineralPackets = async ({
  limit,
  sortMethod,
}: { limit?: number; sortMethod?: 'name' | 'score' } = {}) => {
  let orderBy = sortMethod || 'name'

  const supabase = await createSupabaseServerClient()

  const { data: items, error } = await supabase
    .from('items')
    .select()
    .eq('type', 'mineral_packets')
    .order(orderBy, { ascending: true })

  return items || []
}
