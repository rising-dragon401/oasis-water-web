'use server'

import { supabase } from '@/utils/supabase'
import { getSession } from '@/app/supabase-server'

export const searchItems = async (query: string) => {
  const { data: items, error } = await supabase.from('items').select().textSearch('name', query)

  return items
}

export const getItemDetails = async (id: string) => {
  const { data: item, error } = await supabase.from('items').select().eq('id', id)

  if (!item) {
    return null
  }

  const brandId = item[0].brand
  const ingredientIds = item[0].ingredients
  const companyId = item[0].company
  const contaminants = item[0].contaminants

  let brand = null
  if (brandId) {
    const { data, error: brandError } = await supabase.from('brands').select().eq('id', brandId)
    brand = data ? data[0] : null
  }

  let ingredients: any[] = []
  if (ingredientIds && ingredientIds.length > 0) {
    ingredients = await Promise.all(
      ingredientIds.map(async (ingredientId) => {
        const { data: ingredient, error: ingredientError } = await supabase
          .from('ingredients')
          .select()
          .eq('id', ingredientId)

        if (!ingredient) {
          return null
        }

        return ingredient[0]
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

  let contaminantData = []
  if (contaminants && contaminants.length > 0) {
    contaminantData = await Promise.all(
      contaminants.map(async (contaminant: any) => {
        const { data: contaminantData, error: contaminantError } = await supabase
          .from('contaminants')
          .select()
          .eq('id', contaminant.ingedient_id)

        if (!contaminantData) {
          return null
        }

        return contaminantData[0]
      })
    )
  }

  const itemWithDetails = {
    ...item[0],
    brand,
    ingredients,
    company,
    contaminantData,
  }

  console.log('itemWithDetails: ', itemWithDetails)

  return itemWithDetails
}
