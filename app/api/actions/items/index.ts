import { supabase } from '@/app/api/utils/supabase-server-client'

export const getItems = async () => {
  const { data: items, error } = await supabase.from('items').select()

  return items
}
