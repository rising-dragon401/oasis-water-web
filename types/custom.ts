import { Database } from './supabase'

export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type Item = Database['public']['Tables']['items']['Row'] & {
  company_name?: string | null
}
export type TapWaterLocation = Database['public']['Tables']['tap_water_locations']['Row']
export type ItemType = 'bottled_water' | 'tap_water' | 'filter'
export type WaterFilter = Database['public']['Tables']['water_filters']['Row'] & {
  company_name?: string | null
}
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type IngredientDescriptor = {
  amount: number | null
  ingredient_id: number
}
export type Company = Database['public']['Tables']['companies']['Row']
export type Source = {
  url: string
  label: string
}
