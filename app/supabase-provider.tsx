'use client'

import { Database } from '@/types/supabase'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUserData } from '@/app/actions/user'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createPagesBrowserClient())
  const router = useRouter()
  const pathname = usePathname()

  const homePages = [
    '/',
    '/manifesto',
    '/legal/terms-of-use',
    '/legal/privacy-policy',
    '/blog',
    '/auth/signin',
  ]

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        router.push('/')

        // const userData = await getCurrentUserData();
        // if (homePages.includes(pathname)) {
        //   if (userData && !userData.has_onboarded) {
        //     router.push('/onboarding');
        //   } else {
        //     router.push('/dashboard/assistant');
        //   }
        // }

        router.refresh()
      } else if (!session?.user && !homePages.includes(pathname)) {
        // direct to home if not signed in
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
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
