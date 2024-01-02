'use server'

import { supabase } from '@/utils/supabase'

export const getFilters = async () => {
  const { data: filters, error } = await supabase.from('water_filters').select()

  if (!filters) {
    return []
  }

  const filtersWithCompany = await Promise.all(
    filters.map(async (filter) => {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('name')
        .eq('id', filter.company)

      return {
        ...filter,
        company_name: company ? company[0].name : null,
      }
    })
  )

  return filtersWithCompany
}

export const searchFilters = async (query: string) => {
  const { data: filters, error: nameError } = await supabase
    .from('water_filters')
    .select()
    .ilike('name', `%${query}%`)

  if (!filters) {
    return []
  }

  const taggedFilters = filters.map((filter) => {
    return {
      ...filter,
      type: 'filter',
    }
  })

  return taggedFilters || []
}

export const getFilterDetails = async (id: string) => {
  const { data: item, error } = await supabase.from('water_filters').select().eq('id', id)

  if (!item) {
    return null
  }

  const contaminants = item[0].contaminants_filtered

  let contaminantData: any[] = []
  if (contaminants && contaminants.length > 0) {
    contaminantData = await Promise.all(
      contaminants.map(async (contaminant: any) => {
        const { data, error: contaminantError } = await supabase
          .from('ingredients')
          .select()
          .eq('id', contaminant)

        if (!data) {
          return null
        }

        return {
          metadata: data[0],
          amount: contaminant.amount,
        }
      })
    )
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
  const { data: filter, error } = await supabase
    .from('water_filters')
    .select()
    .eq('id', id)
    .single()

  return filter
}

export const getAllContaminants = async () => {
  const { data: contaminants, error } = await supabase
    .from('ingredients')
    .select()
    .eq('is_contaminant', true)

  if (!contaminants) {
    return []
  }

  const contaminantsWithMetadata = contaminants.map((contaminant) => {
    return {
      metadata: contaminant,
    }
  })

  return contaminantsWithMetadata
}
