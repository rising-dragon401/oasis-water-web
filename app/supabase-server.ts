'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function getSession() {
  const supabase = createClient(cookies())

  const {
    data: { user },
  } = await supabase.auth.getUser()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUserDetails() {
  const supabase = createClient(cookies())
  try {
    const { data: userDetails } = await supabase.from('users').select('*').single()
    return userDetails
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
