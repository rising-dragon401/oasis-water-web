import { supabase } from '@/app/api/utils/supabase-server-client'

export const getLocations = async () => {
  const { data: locations, error } = await supabase.from('tap_water_locations').select()

  return locations
}
