'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { Ingredient, IngredientDescriptor } from '@/types/custom'
import { determineIfIngredientIsContaminant } from '@/app/actions/items'

// export const scoreItems = async () => {
//   const supabase = await createSupabaseServerClient()
//   let { data: items, error } = await supabase.from('items').select('*')

//   if (error) throw error
//   if (!items) return false

//   // remove items with .is_indexed === false
//   items = items.filter((item) => item.is_indexed !== false)

//   const itemsWithContaminants = await Promise.all(
//     items.map(async (item) => {
//       const ingredients = (item.ingredients as IngredientDescriptor[]) || []

//       const contaminants = await Promise.all(
//         ingredients?.map(async (ingredient) => {
//           const isContaminant = await determineIfIngredientIsContaminant(ingredient.ingredient_id)
//           return isContaminant ? ingredient : null
//         })
//       ).then((results) => results.filter((result) => result !== null))

//       if (!contaminants)
//         return {
//           id: item.id,
//           name: item.name,
//           source: item.water_source || null,
//           is_distilled: item.is_distilled,
//           numberOfContaminants: 0,
//           amount_above_health_guideline: 0,
//         }

//       let totalOver = 0

//       await contaminants.reduce(async (totalPromise, contaminant) => {
//         const amount = contaminant.amount || 1

//         const total = await totalPromise

//         const { data: ingredient, error } = (await supabase
//           .from('ingredients')
//           .select('health_guideline')
//           .eq('id', contaminant.ingredient_id)
//           .single()) as { data: Ingredient; error: any }

//         if (error) throw error

//         const guideline = ingredient.health_guideline || ingredient.legal_limit

//         if (guideline === 0 || !guideline) return 1

//         totalOver += Math.floor(amount / guideline)
//         return totalOver
//       }, Promise.resolve(0))

//       return {
//         id: item.id,
//         name: item.name,
//         source: item.water_source || null,
//         is_distilled: item.is_distilled,
//         packaging: item.packaging,
//         numberOfContaminants: contaminants.length,
//         amount_above_health_guideline: totalOver,
//       }
//     })
//   )

//   const scoredItems = await itemsWithContaminants.map((item) => {
//     let score = 100

//     // Penalize for each contaminant
//     const maximumContaminantMultiplierPenalty = 40
//     let contaminantMultiplierPenalty = Math.floor(item.amount_above_health_guideline * 2.5)

//     if (contaminantMultiplierPenalty > maximumContaminantMultiplierPenalty) {
//       contaminantMultiplierPenalty = maximumContaminantMultiplierPenalty
//     }

//     const maximumNumberOfContaminantsPenalty = 40
//     let numberOfContaminantsPenalty = (item.numberOfContaminants || 0) * 5

//     if (numberOfContaminantsPenalty > maximumNumberOfContaminantsPenalty) {
//       numberOfContaminantsPenalty = maximumNumberOfContaminantsPenalty
//     }

//     let contaminantPenalty = contaminantMultiplierPenalty + numberOfContaminantsPenalty

//     if (contaminantPenalty < 0) contaminantPenalty = 90

//     score -= contaminantPenalty

//     // Penalize for source
//     let sourcePenalty = 0
//     switch (item.source) {
//       case 'municipal_supply':
//         sourcePenalty = 30
//         break
//       case 'well':
//         sourcePenalty = 20
//         break
//       case null || undefined:
//         sourcePenalty = 5
//         break
//       case 'mountain_spring':
//         sourcePenalty = -10
//       default:
//         sourcePenalty = 0
//     }

//     score -= sourcePenalty

//     // Add points if not distilled -- reward for natural minerals
//     let mineralBonus = 0
//     if (item.is_distilled) {
//       mineralBonus = -30
//     } else {
//       mineralBonus = 0
//     }

//     // console.log('item.name: ', item.name)
//     // console.log('contaminantMultiplierPenalty: ', contaminantMultiplierPenalty)
//     // console.log('numberOfContaminantsPenalty: ', numberOfContaminantsPenalty)
//     // console.log('contaminantPenalty: ', contaminantPenalty)
//     // console.log('sourcePenalty: ', sourcePenalty)
//     // console.log('mineralBonus: ', mineralBonus)

//     score += mineralBonus

//     const maximumPossibleNegativeScore = 6

//     // Plastic penalty
//     let plasticPenalty = 0
//     if (item.packaging === 'plastic') {
//       plasticPenalty = 10
//     } else {
//       plasticPenalty = 0
//     }

//     score -= plasticPenalty

//     // If score is negative, calculate the difference and scale it to [5, 50]
//     if (score < 1) {
//       const difference = Math.abs(score)

//       const ratio = difference / 50

//       score = 0 + Math.floor(ratio * maximumPossibleNegativeScore)
//     }

//     if (score === 0) score = 1

//     // console.log('score: ', score)

//     return { ...item, score }
//   })

//   scoredItems.forEach(async (item) => {
//     const { data, error } = await supabase
//       .from('items')
//       .update({ score: item.score })
//       .match({ id: item.id })

//     if (error) throw error
//   })

//   console.log('done calculating item scores')

//   return scoredItems
// }

// export const scoreLocations = async () => {
//   const supabase = await createSupabaseServerClient()
//   // return false
//   const { data: locations, error } = await supabase.from('tap_water_locations').select('*')

//   if (error) throw error

//   const locationsWithContaminants = await Promise.all(
//     locations.map(async (location) => {
//       const contaminants = location.contaminants as IngredientDescriptor[]

//       if (!contaminants) return { id: location.id, amount_above_health_guideline: 0 }

//       let totalOver = 0

//       await contaminants.reduce(async (totalPromise, contaminant) => {
//         const amount = contaminant.amount

//         const total = await totalPromise

//         const { data: ingredient, error } = await supabase
//           .from('ingredients')
//           .select('health_guideline, legal_limit')
//           .eq('id', contaminant.ingredient_id)
//           .single()

//         if (error) throw error

//         const guideline = ingredient.health_guideline || ingredient.legal_limit

//         if (guideline === 0 || !guideline) return 1

//         totalOver += Math.floor(amount / guideline)
//         return totalOver
//       }, Promise.resolve(0))

//       return {
//         id: location.id,
//         name: location.name,
//         numberOfContaminants: contaminants.length,
//         amount_above_health_guideline: totalOver,
//       }
//     })
//   )

//   const scoredItems = await locationsWithContaminants.map((location) => {
//     let score = 100

//     // Penalize for each contaminant
//     let contaminantPenalty =
//       location.numberOfContaminants * 3.5 + Math.floor(location.amount_above_health_guideline / 5)

//     score -= contaminantPenalty

//     // If score is negative, calculate the difference and scale it to [5, 50]
//     if (score < 2) {
//       const difference = Math.abs(score)

//       console.log('difference: ', difference)

//       const ratio = difference / 20

//       console.log('ratio: ', ratio)

//       score = 0 + Math.floor(ratio)

//       if (score > 50) score = 50
//     }

//     if (score === 0) score = 1

//     return { ...location, score }
//   })

//   scoredItems.forEach(async (item) => {
//     const { data, error } = await supabase
//       .from('tap_water_locations')
//       .update({ score: item.score })
//       .match({ id: item.id })
//   })

//   console.log('done calculating location scores')

//   return scoredItems
// }

// export const scoreFilters = async () => {
//   const supabase = await createSupabaseServerClient()
//   console.log('calculating filter scores')

//   const { data: contaminants, error } = await supabase
//     .from('ingredients')
//     .select('*')
//     .eq('is_contaminant', true)

//   const { data: filters, error: filterError } = await supabase.from('water_filters').select('*')

//   if (error) throw error

//   if (!filters) return false

//   const filterWithMetadata = await Promise.all(
//     filters.map(async (filter) => {
//       const contaminants_filtered = filter.contaminants_filtered

//       if (!contaminants_filtered)
//         return {
//           id: filter.id,
//           name: filter.name,
//           numberOfContaminantsNotFilterd: 0,
//         }

//       let totalContaminantsNotFiltered = contaminants.length - contaminants_filtered.length

//       return {
//         id: filter.id,
//         name: filter.name,
//         numberOfContaminantsNotFilterd: totalContaminantsNotFiltered,
//       }
//     })
//   )

//   const scoredItems = await filterWithMetadata.map((filter) => {
//     let score = 100

//     // Penalize for each contaminant
//     let contaminantPenalty = Math.floor(filter.numberOfContaminantsNotFilterd * 3.5)

//     score -= contaminantPenalty

//     // If score is negative, calculate the difference and scale it to [5, 50]
//     if (score < 2) {
//       const difference = Math.abs(score)

//       console.log('difference: ', difference)

//       const ratio = difference / 20

//       console.log('ratio: ', ratio)

//       score = 0 + Math.floor(ratio)

//       if (score > 50) score = 50
//     }

//     if (score === 0) score = 1

//     return { ...filter, score }
//   })

//   scoredItems.forEach(async (item) => {
//     const { data, error } = await supabase
//       .from('water_filters')
//       .update({ score: item.score })
//       .match({ id: item.id })
//   })

//   console.log('done calculating filter scores')

//   return scoredItems
// }
