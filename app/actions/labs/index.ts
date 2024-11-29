'use server'

import { FILTER_CONTAMINANT_CATEGORIES, ITEM_TYPES } from '@/lib/constants/categories'
import { createSupabaseServerClient } from '@/utils/supabase/server'

// if is_indexed === false,
// get labs for that item where product == item.id, type = product type and status === funding // in progress
// if none, then amount funded == 0

export const fetchFundingStatus = async ({
  itemId,
  type,
  name,
  createLab = true,
}: {
  itemId: any
  type: string
  name: string
  createLab: boolean
}) => {
  console.log('fetching funding status for item', itemId, type, name, createLab)

  if (!itemId || !type) {
    return {
      lab_id: null,
      raised_amount: 0,
      status: 'not_started',
      total_cost: 28500,
      user_contributions: [],
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
  if (!labRow && createLab) {
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

  if (labRow?.id) {
    const { data: contributionsData, error: contributionsError } = await supabase
      .from('contributions')
      .select('user_id, amount, users!inner(avatar_url, full_name, username)')
      .eq('kind', 'donation')
      .eq('lab_id', labRow.id)

    if (contributionsError) {
      throw new Error(`Error fetching contributors: ${contributionsError.message}`)
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
      lab_id: labRow.id,
      raised_amount: labRow.raised_amount || 0,
      status: labRow.status,
      total_cost: testKitData?.[0]?.price || null,
      user_contributions: userContributions,
    }

    return labDetails
  } else {
    throw new Error('Lab ID is undefined')
  }
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
        .select('id, name, image, test_request_count, type, labs, is_indexed')
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
          const labData = await fetchFundingStatus({
            itemId: item.id,
            type: item.type,
            name: item.name,
            createLab: true,
          })

          if (!labData) {
            return null
          }

          // Exclude items where lab status is 'in_progress' or 'complete'
          if (labData.status === 'in_progress' || labData.status === 'complete') {
            return null
          }

          return {
            ...item,
            lab_id: labData.lab_id,
            raised_amount: labData.raised_amount,
            total_cost: labData.total_cost,
            user_contributions: labData.user_contributions,
          }
        })
      )

      // Filter out null values from the results
      allData = allData.concat(itemsWithLabs.filter((item) => item !== null))
    }

    // Sort the combined data by test_request_count in descending order
    // allData.sort((a, b) => b?.funded_amount - a?.funded_amount)

    return allData
  } catch (error) {
    console.error(error)
    return []
  }
}

const checkLabExists = async ({
  itemId,
  type,
  status,
}: {
  itemId: string
  type: string
  status: string
}) => {
  const supabase = await createSupabaseServerClient()

  const query = supabase
    .from('labs')
    .select('id, raised_amount, total_cost, status')
    .eq('product', itemId)
    .eq('product_type', type)
    .eq('status', status)

  const { data, error } = await query

  if (error) {
    return {
      status,
      raised_amount: null,
      total_cost: null,
      lab_id: null,
    }
  }

  return data?.[0]
}

export const fetchTestedThings = async ({
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
      // Adjust the select statement based on the table name
      let selectColumns = 'id, name, image, updated_at, created_at, type'
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
        .range(offset, offset + limit - 1)

      const { data, error } = await query

      if (error) {
        throw new Error(`Error fetchTestedThings fetching data from ${table}: ${error.message}`)
      }

      // Check if lab exists for each item and attach raised_amount, total_cost, cont_count, and cont_not_removed
      const itemsWithDetails = await Promise.all(
        data.map(async (item: any) => {
          let contCount = null
          let contNotRemoved = null

          if (table === 'items' && item.ingredients) {
            contCount = item.ingredients.filter(
              (ingredient: any) => ingredient.is_contaminant
            ).length
          } else if (table === 'water_filters' && item.filtered_contaminant_categories) {
            contNotRemoved = FILTER_CONTAMINANT_CATEGORIES.filter((category) => {
              const matchedCategory = item.filtered_contaminant_categories.find(
                (contaminant: any) => contaminant.category === category
              )
              return !matchedCategory || matchedCategory.percentage < 50
            }).length
          }

          // const labData = await checkLabExists({
          //   itemId: item.id,
          //   type: item.type,
          //   status: 'complete', // Assuming you want to check for completed labs
          // })

          return {
            ...item,
            // raised_amount: labData?.raised_amount || null,
            // total_cost: labData?.total_cost || null,
            cont_count: contCount,
            cont_not_removed: contNotRemoved,
            updated_at: item.updated_at || item.created_at,
          }
        })
      )

      allData = allData.concat(itemsWithDetails)
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
          .select('updated_at, product, status')
          .eq('product_type', t)
          .eq('status', 'in_progress')

        const { data: labData, error: labError } = await query.limit(limit)

        if (labError || !labData) {
          throw new Error(
            `Error fetchInProgressThings fetching data from labs: ${labError.message}`
          )
        }

        const table = ITEM_TYPES.find((item) => item.typeId === t)?.tableName

        if (table) {
          for (const labItem of labData) {
            const itemQuery = supabase
              .from(table)
              .select('id, name, image, test_request_count, type')
              .eq('id', labItem.product)

            const { data: itemData, error: itemError } = await itemQuery

            if (itemError) {
              throw new Error(`Error getting table data from ${table}: ${itemError.message}`)
            }

            const item = itemData[0]

            if (item) {
              const fundingStatus = await fetchFundingStatus({
                itemId: item.id,
                type: item.type,
                name: item.name,
                createLab: false,
              })

              const detailedItems = itemData.map((item) => ({
                ...item,
                updated_at: labItem.updated_at,
                raised_amount: fundingStatus?.raised_amount,
                total_cost: fundingStatus?.total_cost,
                user_contributions: fundingStatus?.user_contributions || [],
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
      .select('id, name, image, ingredients, type, updated_at, created_at')
      .eq('is_indexed', true)
      .not('ingredients', 'is', null)
      .order('updated_at', { ascending: true })
      .order('created_at', { ascending: true })
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

    const { data: filters, error: filtersError } = await supabase
      .from('water_filters')
      .select('id, name, image, type, filtered_contaminant_categories, updated_at, created_at')
      .eq('is_indexed', true)
      .order('updated_at', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(limit)

    if (filtersError) {
      throw new Error(
        `Error fetchTestedPreview fetching data from filters: ${filtersError.message}`
      )
    }

    // Sort by created_at if updated_at is null
    filters.sort((a, b) => {
      const dateA = a.updated_at || a.created_at
      const dateB = b.updated_at || b.created_at
      return new Date(dateA).getTime() - new Date(dateB).getTime()
    })

    const filtersWithContCount = await Promise.all(
      filters.map(async (filter) => {
        const filteredContaminantCategories = filter.filtered_contaminant_categories as any[]

        const contaminantsNotRemoved = FILTER_CONTAMINANT_CATEGORIES.filter((category) => {
          const matchedCategory = filteredContaminantCategories.find(
            (contaminant) => contaminant.category === category
          )
          return !matchedCategory || matchedCategory.percentage < 50
        }).length

        return {
          ...filter,
          cont_not_removed: contaminantsNotRemoved,
        }
      })
    )

    const combinedItems = [...itemsWithContCount, ...filtersWithContCount]
    combinedItems.sort(
      (a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    )

    return combinedItems
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

export const submitRequest = async ({
  name,
  productId,
  productType,
  userId,
  message,
  attachment,
  kind,
}: {
  name: string
  productId?: string
  productType?: string
  userId: string | null
  message: string
  attachment?: string | null
  kind: 'request_new_product' | 'update_existing_product'
}) => {
  const supabase = await createSupabaseServerClient()

  // @ts-ignore
  const { data, error } = await supabase.from('contributions').insert([
    {
      name,
      product_id: productId,
      product_type: productType,
      user_id: userId,
      note: message,
      file_url: attachment,
      kind,
    },
  ])

  if (error) {
    console.error('Error submitting request:', error)
    return false
  }

  return true
}
