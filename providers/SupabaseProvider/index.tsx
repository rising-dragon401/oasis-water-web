'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'
import { getCurrentUserData } from '@/app/actions/user'
import { createClient } from '@/utils/supabase/client'

type SupabaseContext = {
  supabase: any
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const authPages = ['/account/my-oaisys']

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const userData = await getCurrentUserData()

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
    <Context.Provider value={{ supabase }}>
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
