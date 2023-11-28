import { Database } from './supabase'

export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type Item = Database['public']['Tables']['items']['Row']
export type TapWaterLocation = Database['public']['Tables']['tap_water_locations']['Row']
