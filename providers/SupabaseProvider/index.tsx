'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'
import { getCurrentUserData } from '@/app/actions/user'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

type SupabaseContext = {
  supabase: any
  session: any
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const authPages = ['/account/my-oasis']

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)

      const userData = await getCurrentUserData()

      if (event === 'SIGNED_IN' && session?.access_token) {
        router.push('/')
      }

      if (authPages.includes(pathname) && !userData) {
        router.push('/auth/signin')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase])

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}
