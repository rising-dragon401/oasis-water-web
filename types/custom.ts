// @ts-ignore
import { Database } from './supabase'

export type User = Database['public']['Tables']['users']['Row']
export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type Contaminant = Database['public']['Tables']['ingredients']['Row']
export type Item = Database['public']['Tables']['items']['Row'] & {
  company_name?: string | null
}
export type TapWaterLocation = Database['public']['Tables']['tap_water_locations']['Row'] & {
  company_name?: string | null
}
export type ItemType = 'bottled_water' | 'tap_water' | 'filter'
export type WaterFilter = Database['public']['Tables']['water_filters']['Row'] & {
  company_name?: string | null
}
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type IngredientDescriptor = {
  amount: number
  ingredient_id: number
}
export type Company = Database['public']['Tables']['companies']['Row']
export type Source = {
  url: string
  label: string
}
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

export type Product = Database['public']['Tables']['products']['Row']

export type Price = Database['public']['Tables']['prices']['Row']
export interface ProductWithPrices extends Product {
  prices: Price[]
}
export interface PriceWithProduct extends Price {
  products: Product | null
}

export type NutrientDescriptor = {
  nutrient_id: number | null
  name: string
  amount: number | null
}
export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null
  plan: string | null
}

export type IngredientCategory = Database['public']['Enums']['ingredient_category']
