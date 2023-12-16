'use server'

import { supabase } from '@/utils/supabase'
import {
  Ingredient,
  Item,
  TapWaterLocation,
  WaterFilter,
  Filter,
  IngredientDescriptor,
} from '@/types/custom'

// export const scoreItems = async () => {
//   // return false
//   const { data: items, error } = await supabase.from('items').select('*')

//   console.log('items: ', items)

//   if (error) throw error

//   const itemsWithContaminants = await Promise.all(
//     items.map(async (item) => {
//       const contaminants = item.contaminants as IngredientDescriptor[]

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
//         numberOfContaminants: contaminants.length,
//         amount_above_health_guideline: totalOver,
//       }
//     })
//   )

//   const scoredItems = await itemsWithContaminants.map((item) => {
//     let score = 100

//     // Penalize for each contaminant
//     const maximumContaminantMultiplierPenalty = 30
//     let contaminantMultiplierPenalty = Math.floor(item.amount_above_health_guideline)

//     if (contaminantMultiplierPenalty > maximumContaminantMultiplierPenalty) {
//       contaminantMultiplierPenalty = maximumContaminantMultiplierPenalty
//     }

//     const maximumNumberOfContaminantsPenalty = 40
//     let numberOfContaminantsPenalty = (item.numberOfContaminants || 0) * 3

//     if (numberOfContaminantsPenalty > maximumNumberOfContaminantsPenalty) {
//       numberOfContaminantsPenalty = maximumNumberOfContaminantsPenalty
//     }

//     let contaminantPenalty = contaminantMultiplierPenalty + numberOfContaminantsPenalty

//     if (contaminantPenalty < 0) contaminantPenalty = 90

//     console.log('contaminantPenalty: ', contaminantPenalty)

//     score -= contaminantPenalty

//     console.log('item.source: ', item.source)

//     // Penalize for source
//     let sourcePenalty = 0
//     switch (item.source) {
//       case 'municipal_supply':
//         console.log('municipal_supply')
//         sourcePenalty = 30
//         break
//       case 'well':
//         sourcePenalty = 15
//         break
//       case null || undefined:
//         sourcePenalty = 5
//         break
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

//     score += mineralBonus

//     const maximumPossibleNegativeScore = 6

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
//   })

//   //   console.log('scoredItems: ', scoredItems)

//   console.log('done calculating item scores')

//   return scoredItems
// }

// export const scoreLocations = async () => {
//   // return false
//   const { data: locations, error } = await supabase.from('tap_water_locations').select('*')

//   if (error) throw error

//   const locationsWithContaminants = await Promise.all(
//     locations.map(async (location) => {
//       const contaminants = location.contaminants // assuming contaminants is an array of objects

//       if (!contaminants) return { id: location.id, amount_above_health_guideline: 0 }

//       let totalOver = 0

//       await contaminants.reduce(async (totalPromise, contaminant) => {
//         const amount = contaminant.amount

//         const total = await totalPromise

//         const { data: ingredient, error } = await supabase
//           .from('ingredients')
//           .select('health_guideline')
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
