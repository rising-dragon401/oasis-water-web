'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getFilters = async ({
  limit,
  sortMethod,
  type,
  tags,
}: {
  limit?: number
  sortMethod?: 'name' | 'score'
  type?: string[] | null
  tags?: string[] | null
} = {}) => {
  const supabase = await createSupabaseServerClient()

  let filters
  const orderBy = sortMethod || 'name'

  let query = supabase.from('water_filters').select().order(orderBy)

  if (type && type.length > 0) {
    query = query.in('type', type)
  }

  if (tags && tags.length > 0) {
    query = query.or(tags.map((tag) => `tags.ilike.%${tag}%`).join(','))
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data: filterData } = await query

  if (!filterData) {
    return []
  }

  // Fetch brand names for each filter
  const filterIds = filterData.map((filter) => filter.id)
  const { data: brandData } = await supabase.from('brands').select('id, name').in('id', filterIds)

  if (!brandData) {
    return []
  }

  // Map brand names to filters
  filters = filterData.map((filter) => {
    const brand = brandData.find((b) => b.id === filter.id)
    return {
      ...filter,
      brandName: brand ? brand.name : null,
    }
  })

  filters = filters.sort((a, b) => {
    if (a.is_indexed === false) return 1
    if (b.is_indexed === false) return -1
    return 0
  })

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

export const getFilterDetails = async (id: string) => {
  const supabase = await createSupabaseServerClient()

  const { data: item, error } = await supabase.from('water_filters').select('*').eq('id', id)

  if (!item) {
    return null
  }

  const contaminants = item[0].contaminants_filtered

  // const contaminantData = await Promise.all(
  //   contaminants.map(async (contaminantId: string) => {
  //     const { data: ingredient, error } = await supabase
  //       .from('ingredients')
  //       .select('name')
  //       .eq('id', contaminantId)
  //       .single()

  //     if (error) {
  //       console.error('Error fetching ingredient name:', error)
  //       return { id: contaminantId, name: 'Unknown' }
  //     }

  //     return { id: contaminantId, name: ingredient.name }
  //   })
  // )

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

  console.log('contaminants: ', contaminants)

  await filters.map((filter: any) => {
    const filteredContaminantsCount = contaminants.reduce((acc, contaminant) => {
      const categories = filter.filtered_contaminant_categories || []

      const category = categories?.find((cat: any) => cat.category === contaminant.category)
      if (category && category.percentage > 50) {
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
