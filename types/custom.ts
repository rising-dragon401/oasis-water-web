import { Database } from './supabase'

export type Item = Database['public']['Tables']['items']['Row']
