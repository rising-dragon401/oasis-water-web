'use server'

import { supabase } from '@/utils/supabase'

export const scoreItems = async () => {
  return false
  // const { data: items, error } = await supabase.from('items').select('*')

  // if (error) throw error

  // const itemsWithContaminants = await Promise.all(
  //   items.map(async (item) => {
  //     const contaminants = item.contaminants // assuming contaminants is an array of objects

  //     if (!contaminants) return { id: item.id, amount_above_health_guideline: 0 }

  //     let totalOver = 0
  //     const amount_above_health_guideline = await contaminants.reduce(
  //       async (totalPromise, contaminant) => {
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
  //       },
  //       Promise.resolve(0)
  //     )

  //     return {
  //       id: item.id,
  //       name: item.name,
  //       source: item.source || null,
  //       is_distilled: item.is_distilled || null,
  //       numberOfContaminants: contaminants.length,
  //       amount_above_health_guideline: totalOver,
  //     }
  //   })
  // )

  // const scoredItems = await itemsWithContaminants.map((item) => {
  //   let score = 100

  //   // Penalize for each contaminant
  //   let contaminantPenalty = item.numberOfContaminants * 5 + item.amount_above_health_guideline

  //   if (contaminantPenalty < 0) contaminantPenalty = 100

  //   score -= contaminantPenalty

  //   // Penalize for source
  //   let sourcePenalty = 0
  //   switch (item.source) {
  //     case 'municipal_supply':
  //       sourcePenalty = 20
  //       break
  //     case 'well':
  //       sourcePenalty = 10
  //       break
  //     case null || undefined:
  //       sourcePenalty = 12
  //       break
  //     default:
  //       sourcePenalty = 0
  //   }

  //   score -= sourcePenalty

  //   // Add points if not distilled
  //   let mineralBonus = 0
  //   if (item.is_distilled === false) {
  //     mineralBonus = 12
  //   } else if (item.is_distilled === true) {
  //     mineralBonus = -12
  //   }

  //   score += mineralBonus

  //   if (score < 0) score = 0

  //   return { ...item, score }
  // })

  // scoredItems.forEach(async (item) => {
  //   const { data, error } = await supabase
  //     .from('items')
  //     .update({ score: item.score })
  //     .match({ id: item.id })
  // })

  // // console.log('scoredItems: ', scoredItems)

  // console.log('done calculating item scores')

  // return scoredItems
}
