import { Database } from './supabase'

export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type TapWaterLocation = Database['public']['Tables']['tap_water_locations']['Row']
export type WaterFilter = Database['public']['Tables']['water_filters']['Row']
export type Filter = Database['public']['Tables']['water_filters']['Row']
export type IngredientDescriptor = {
  amount: number | null
  ingredient_id: string
}
