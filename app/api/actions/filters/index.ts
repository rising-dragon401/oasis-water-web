import { supabase } from '@/app/api/utils/supabase-server-client'

export const getFilters = async () => {
  const { data: filters, error } = await supabase.from('water_filters').select()

  return filters
}
