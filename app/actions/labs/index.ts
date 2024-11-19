'use server'

import { ITEM_TYPES } from '@/lib/constants/categories'
import { createSupabaseServerClient } from '@/utils/supabase/server'

// if is_indexed === false,
// get labs for that item where product == item.id, type = product type and status === funding // in progress
// if none, then amount funded == 0

export const fetchFundingStatus = async ({
  itemId,
  type,
  name,
}: {
  itemId: any
  type: string
  name: string
}) => {
  if (!itemId || !type) {
    return {
      lab_id: null,
      raised_amount: 0,
      status: 'not_started',
      total_cost: 28500,
    }
  }

  const supabase = await createSupabaseServerClient()

  const query = supabase
    .from('labs')
    .select('id, test_kit, raised_amount, is_funded, status')
    .eq('product', itemId)
    .eq('product_type', type)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching funding status: ', error)
  }

  const labRow = data?.[0]

  // create new lab row for standard water testing
  if (!labRow) {
    console.log('no lab row, creating new lab row')
    // create new lab row for standard water testing
    const { data: newLabData, error: newLabError } = await supabase
      .from('labs')
      .insert({
        product: itemId,
        product_type: type as any,
        label: name + ' - Standard Water Testing',
        test_kit: 1,
        status: 'not_started',
      })
      .select()

    if (newLabError) {
      return {
        lab_id: null,
        raised_amount: 0,
        status: 'not_started',
        total_cost: 28500, // assume all funding is for standard water testing for now (test kit id === 1)
      }
    }

    const newLabRow = newLabData?.[0]

    if (!newLabRow) {
      throw new Error('Error creating new lab')
    }

    return {
      lab_id: newLabRow?.id,
      raised_amount: 0,
      status: 'not_started',
      total_cost: 28500, // assume all funding is for standard water testing for now (test kit id === 1)
    }
  }

  const testKit = labRow?.test_kit

  const { data: testKitData, error: testKitError } = await supabase
    .from('test_kits')
    .select('price')
    .eq('id', testKit as any)

  if (testKitError) {
    throw new Error(`Error fetching test kit: ${testKitError.message}`)
  }

  // get all contributions for this lab along with user avatars
  const { data: contributionsData, error: contributionsError } = await supabase
    .from('contributions')
    .select('user_id, amount, users!inner(avatar_url, full_name, username)')
    .eq('lab_id', labRow?.id)

  if (contributionsError) {
    throw new Error(`Error fetching contributions: ${contributionsError.message}`)
  }

  // Restructure contributions to include user details in the same object
  const userContributions = contributionsData.map((contribution) => ({
    user_id: contribution.user_id,
    amount: contribution.amount,
    avatar_url: contribution.users?.avatar_url,
    full_name: contribution.users?.full_name,
    username: contribution.users?.username,
  }))

  const labDetails = {
    lab_id: labRow?.id,
    raised_amount: labRow?.raised_amount || 0,
    status: labRow?.status,
    total_cost: testKitData?.[0]?.price || null,
    user_contributions: userContributions,
  }

  return labDetails
}

export const fetchUntestedThing = async ({ itemId, type }: { itemId: string; type: string }) => {
  const supabase = await createSupabaseServerClient()

  const query = supabase
    .from('labs')
    .select('id, test_kit, funded_amount, is_funded, status')
    .eq('product', itemId)
    .eq('product_type', type)

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching untsted thing: ${error.message}`)
  }

  return data?.[0]
}

// Get all things that where is_indexed !== true
export const fetchUntestedThings = async ({
  tables,
  limit,
  offset = 0,
}: {
  tables: string[]
  limit: number
  offset?: number
}) => {
  const supabase = await createSupabaseServerClient()
  try {
    let allData: any[] = []

    for (const table of tables) {
      let query = supabase
        .from(table)
        .select('id, name, image, test_request_count, type, labs')
        .eq('is_indexed', false)
        .order('lab_updated_at', { ascending: true })
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1)

      if (table === 'items') {
        query = query.in('type', ['bottled_water', 'water_gallon'])
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error fetchUntestedThings fetching data from ${table}: ${error.message}`)
      }

      const itemsWithLabs = await Promise.all(
        data.map(async (item) => {
          if (item.labs === null) {
            return {
              ...item,
              lab_id: 0,
              funded_amount: 0,
            }
          } else {
            const labData = await fetchFundingStatus({
              itemId: item.id,
              type: item.type,
              name: item.name,
            })

            return {
              ...item,
              lab_id: labData.lab_id,
              funded_amount: labData.raised_amount,
            }
          }
        })
      )

      allData = allData.concat(itemsWithLabs)
    }

    // Sort the combined data by test_request_count in descending order
    allData.sort((a, b) => b?.funded_amount - a?.funded_amount)

    return allData
  } catch (error) {
    console.error(error)
    return []
  }
}

export const fetchTestedThings = async ({ tables, limit }: { tables: string[]; limit: number }) => {
  const supabase = await createSupabaseServerClient()
  try {
    let allData: any[] = []

    for (const table of tables) {
      // Adjust the select statement based on the table name
      let selectColumns = 'id, name, image, updated_at, type'
      if (table === 'items') {
        selectColumns += ', ingredients'
      } else if (table === 'water_filters') {
        selectColumns += ', filtered_contaminant_categories'
      }

      const query = supabase
        .from(table)
        .select(selectColumns)
        .eq('is_indexed', true)
        .order('updated_at', { ascending: true })
        .order('created_at', { ascending: true })

      const { data, error } = await query.limit(limit)

      if (error) {
        throw new Error(`Error fetchTestedThings fetching data from ${table}: ${error.message}`)
      }

      allData = allData.concat(data)
    }

    // Sort the combined data by updated_at in ascending order
    allData.sort((a, b) => new Date(b?.updated_at).getTime() - new Date(a?.updated_at).getTime())

    return allData
  } catch (error) {
    console.error(error)
    return []
  }
}

export const fetchInProgressThings = async ({
  type,
  limit,
}: {
  type?: string[]
  limit: number
}) => {
  const supabase = await createSupabaseServerClient()
  try {
    let allItemDetails: any[] = []

    if (type) {
      for (const t of type) {
        const query = supabase
          .from('labs')
          .select('*, updated_at')
          .eq('status', 'in_progress')
          .eq('product_type', t)

        const { data, error } = await query.limit(limit)

        if (error) {
          throw new Error(`Error fetchInProgressThings fetching data from labs: ${error.message}`)
        }

        const table = ITEM_TYPES.find((item) => item.typeId === t)?.tableName

        if (table) {
          for (const labItem of data) {
            const itemQuery = supabase
              .from(table)
              .select('id, name, image, test_request_count, type')
              .eq('id', labItem.product)

            const { data: itemData, error: itemError } = await itemQuery

            if (itemError) {
              throw new Error(`Error getting table data from ${table}: ${itemError.message}`)
            }

            if (itemData) {
              const detailedItems = itemData.map((item) => ({
                ...item,
                updated_at: labItem.updated_at,
              }))
              allItemDetails = allItemDetails.concat(detailedItems)
            }
          }
        }
      }
    }

    return allItemDetails
  } catch (error) {
    console.error(error)
    return []
  }
}

export const fetchTestedPreview = async ({ limit }: { limit: number }) => {
  const supabase = await createSupabaseServerClient()

  try {
    const { data: items, error } = await supabase
      .from('items')
      .select('id, name, image, ingredients, type')
      .eq('is_indexed', true)
      .not('ingredients', 'is', null)
      .order('updated_at', { ascending: true })
      .limit(limit)

    if (error) {
      throw new Error(`Error fetchTestedPreview fetching data from items: ${error.message}`)
    }

    const itemsWithContCount = await Promise.all(
      items.map(async (item) => {
        const ingredients = item.ingredients as any[]

        const contCount = ingredients.filter((ingredient) => ingredient.is_contaminant).length

        return {
          ...item,
          cont_count: contCount,
        }
      })
    )

    return itemsWithContCount
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getFundingStats = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('contributions')
    .select('amount')
    .eq('kind', 'donation')

  if (error) {
    throw new Error(`Error fetching funding stats: ${error.message}`)
  }

  const totalRaised = data.reduce((acc, curr) => acc + (curr.amount || 0), 0) / 100

  return {
    totalRaised,
  }
}
