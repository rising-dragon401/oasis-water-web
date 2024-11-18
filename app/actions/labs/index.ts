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
  itemId: string
  type: string
  name: string
}) => {
  const supabase = await createSupabaseServerClient()

  const query = supabase
    .from('labs')
    .select('id, test_kit, funded_amount, is_funded, status')
    .eq('product', itemId)
    .eq('product_type', type)

  const { data, error } = await query

  if (error) {
    throw new Error(`Error fetching funding status: ${error.message}`)
  }

  const labRow = data?.[0]

  if (!labRow) {
    // create new lab row for standard water testing
    const { data: newLabData, error: newLabError } = await supabase
      .from('labs')
      .insert({
        product: itemId,
        product_type: type,
        label: name + ' - Standard Water Testing',
        test_kit: 1,
        status: 'not_started',
      })
      .select()

    if (newLabError) {
      return {
        lab_id: null,
        funded_amount: 0,
        status: 'not_started',
        total_cost: 285, // assume all funding is for standard water testing for now (test kit id === 1)
      }
    }

    const newLabRow = newLabData?.[0]

    if (!newLabRow) {
      throw new Error('Error creating new lab')
    }

    return {
      lab_id: newLabRow?.id,
      funded_amount: 0,
      status: 'not_started',
      total_cost: 285, // assume all funding is for standard water testing for now (test kit id === 1)
    }
  }

  const testKit = labRow?.test_kit

  const { data: testKitData, error: testKitError } = await supabase
    .from('test_kits')
    .select('*')
    .eq('id', testKit)

  if (testKitError) {
    throw new Error(`Error fetching test kit: ${testKitError.message}`)
  }

  const testKitDetails = testKitData?.[0]

  const totalCost = testKitDetails?.total_cost || 0

  const labDetails = {
    lab_id: labRow?.id,
    funded_amount: labRow?.funded_amount || 0,
    status: labRow?.status,
    total_cost: totalCost,
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
}: {
  tables: string[]
  limit: number
}) => {
  const supabase = await createSupabaseServerClient()
  try {
    let allData: any[] = []

    for (const table of tables) {
      let query = supabase
        .from(table)
        .select('id, name, image, test_request_count, type')
        .eq('is_indexed', false)
        .order('test_request_count', { ascending: true })

      if (table === 'items') {
        query = query.in('type', ['bottled_water', 'water_gallon'])
      }

      const { data, error } = await query.limit(limit)

      if (error) {
        throw new Error(`Error fetchUntestedThings fetching data from ${table}: ${error.message}`)
      }

      allData = allData.concat(data)
    }

    // Sort the combined data by test_request_count in descending order
    allData.sort((a, b) => b?.test_request_count - a?.test_request_count)

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
      const query = supabase
        .from(table)
        .select('id, name, image, updated_at, type')
        .eq('is_indexed', true)
        .order('updated_at', { ascending: true })

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
          .select('*')
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
              allItemDetails = allItemDetails.concat(itemData)
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
