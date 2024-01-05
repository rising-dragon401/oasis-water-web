'use server'

import { supabase } from '@/app/api/utils/supabase-server-client'

export const getCompanyByName = async (name: string) => {
  const { data: company, error } = await supabase.from('companies').select().eq('name', name)

  if (!company) {
    return null
  }

  return company[0]
}

export const getCompanyItems = async (id: number) => {
  const { data: items } = await supabase.from('items').select().eq('company', id)

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

  const { data: filters } = await supabase.from('water_filters').select().eq('company', id)

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

  const combinedData = [...itemsWithCompany, ...filtersWithCompany]

  return combinedData
}
