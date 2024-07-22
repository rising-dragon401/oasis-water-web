'use server'

import { Ingredient } from '@/types/custom'
import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getFilters = async ({
  limit,
  sortMethod,
  type = 'filter',
}: {
  limit?: number
  sortMethod?: 'name' | 'score'
  type?: 'filter' | 'shower_filter' | 'bottle_filter'
} = {}) => {
  const supabase = await createSupabaseServerClient()

  let filters
  let orderBy = sortMethod || 'name'

  let query = supabase.from('water_filters').select().order(orderBy)

  if (type) {
    query = query.eq('type', type)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data } = await query

  filters = data

  if (!filters) {
    return []
  }

  return filters
}

export const getRandomFilters = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.rpc('get_random_filters')

  if (error) {
    console.error('error', error)

    return []
  }

  return data
}

export const getTopFilters = async () => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: items, error } = await supabase
      .from('water_filters')
      .select()
      .not('score', 'is', null)
      .order('score', { ascending: false })
      .range(0, 5)

    return items || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getFilterDetails = async (id: string, allIngredients: Ingredient[] | []) => {
  const supabase = await createSupabaseServerClient()

  const { data: item, error } = await supabase.from('water_filters').select().eq('id', id)

  if (!item) {
    return null
  }

  const contaminants = item[0].contaminants_filtered

  let contaminantData: any[] = []
  if (contaminants && contaminants.length > 0) {
    contaminantData = (
      await Promise.all(
        contaminants.map(async (contaminant: any) => {
          const data = allIngredients.find((ingredient) => ingredient.id === contaminant)
            ? [allIngredients.find((ingredient) => ingredient.id === contaminant)]
            : null

          if (!data) {
            return null
          }

          return data[0]
        })
      )
    ).filter((contaminant) => contaminant !== null) // Filter out null values
  }

  const companyId = item[0].company
  const brandId = item[0].brand

  let brand = null
  if (brandId) {
    const { data, error: brandError } = await supabase.from('brands').select().eq('id', brandId)
    brand = data ? data[0] : null
  }

  let company = null
  if (companyId) {
    const { data, error: companyError } = await supabase
      .from('companies')
      .select()
      .eq('id', companyId)
    company = data ? data[0] : null
  }

  const filterWithDetails = {
    ...item[0],
    brand,
    company,
    contaminants_filtered: contaminantData,
  }

  return filterWithDetails
}

export const getFilter = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: filter, error } = await supabase
    .from('water_filters')
    .select()
    .eq('id', id)
    .single()

  return filter
}

export const getAllContaminants = async () => {
  const supabase = await createSupabaseServerClient()

  const { data: contaminants, error } = await supabase
    .from('ingredients')
    .select()
    .eq('is_contaminant', true)

  if (!contaminants) {
    return []
  }

  await contaminants.forEach((contaminant) => {
    // @ts-ignore
    contaminant.type = 'ingredient'
  })

  return contaminants
}

export const getFiltersByContaminant = async (contaminantId: number) => {
  const supabase = await createSupabaseServerClient()

  const { data: filters, error } = await supabase
    .from('water_filters')
    .select()
    .contains('contaminants_filtered', [contaminantId])

  if (!filters) {
    return []
  }

  return filters
}

export const getRecommendedFilter = async (contaminants: any[]) => {
  const filters = await getFilters()

  let highestScoringFilter: { [key: string]: any } | null = null
  let highestScore = 0

  await filters.map((filter: any) => {
    const filteredContaminantsCount = contaminants.reduce((acc, contaminant) => {
      if (!filter.contaminants_filtered) {
        return null
      }

      if (filter.contaminants_filtered.includes(contaminant.id)) {
        return acc + 1
      }
      return acc
    }, 0)

    if (!highestScoringFilter || filteredContaminantsCount > highestScore) {
      highestScoringFilter = filter
      highestScore = filteredContaminantsCount
    }
  })

  return highestScoringFilter
}
