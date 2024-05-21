'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'

export const getFeaturedUsers = async () => {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from('users').select('*').eq('is_featured', true)

  if (error) {
    console.error('error', error)

    return []
  }

  const usersWithType = data.map((user) => ({ ...user, type: 'user' }))
  return usersWithType
}
