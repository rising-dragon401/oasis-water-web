'use client'

import useLocalStorage from '@/lib/hooks/use-local-storage'
import { createClient } from '@/utils/supabase/client'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type SupabaseContext = {
  supabase: any
  session: any
  user: any
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [activeSession, setActiveSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [redirectUrl, setRedirectUrl] = useLocalStorage('redirectUrl', '/')
  const [modalToOpen, setModalToOpen] = useLocalStorage('modalToOpen', '')

  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const authPages = ['/account/my-oasis']

  // On Auth State Change
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user.id !== activeSession?.user.id) {
        setActiveSession(session)
      }

      if (session?.user?.id) {
        localStorage.setItem('uid', session.user.id)
      }

      setUser(session?.user)

      // TODO - handle redirect and open modal here based on searchparams
      if (event === 'SIGNED_IN' && session?.access_token && pathname.startsWith('/auth')) {
        toast('Logged in')
        router.push('/')

        console.log('modalToOpen: ', modalToOpen)
        console.log('redirectUrl: ', redirectUrl)

        if (modalToOpen) {
          router.push(`${redirectUrl}?modalToOpen=${modalToOpen}`)
        } else if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.push('/')
        }

        setRedirectUrl('')
        setModalToOpen('')
      }

      if (authPages.includes(pathname) && !session) {
        router.push('/auth/signin')
      }

      // Sign out
      if (!session) {
        setUser(null)
        setActiveSession(null)
        localStorage.removeItem('uid')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, pathname])

  return (
    <Context.Provider value={{ supabase, session: activeSession, user }}>
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
