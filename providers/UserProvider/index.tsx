'use client'

import {
  getCurrentUserData,
  getEmailSubscriptions,
  getSubscription,
  getUserFavorites,
} from '@/app/actions/user'
import { SubscriptionWithProduct } from '@/types/custom'
import { createClient } from '@/utils/supabase/client'
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSupabase } from '../SupabaseProvider'

interface UserContextType {
  uid: string | null | undefined
  provider: string | null | undefined
  user: any
  userData: any
  userFavorites: any[] | null | undefined
  emailSubscriptions: any[] | null | undefined
  subscription: SubscriptionWithProduct | null | undefined
  loadingUser: boolean
  refreshUserData: () => void
  fetchUserFavorites: (uid: string) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | null>(null)

export const useUserProvider = () => {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUserProvider must be used within a UserProvider')
  }
  return context
}

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabase = createClient()
  const { session, user } = useSupabase()

  const [loading, setLoading] = useState<boolean>(true)
  const [activeSession, setActiveSession] = useState<any>(null)
  const [userId, setUserId] = useState<string | null | undefined>(null)
  const [provider, setProvider] = useState<any>(null)
  const [subscription, setSubscription] = useState<SubscriptionWithProduct | null | undefined>(null)
  const [userData, setUserData] = useState<any>(null)
  const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(null)
  const [emailSubscriptions, setEmailSubscriptions] = useState<any[] | null | undefined>(null)

  useEffect(() => {
    setActiveSession(session)

    if (session && session !== activeSession) {
      initUser(session)
      refreshUserData(session.user.id)
    } else {
      setLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeSession])

  const initUser = async (session: any) => {
    setUserId(session.user?.id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('uid', session.user?.id || '')
    }
    setProvider(session.user?.app_metadata?.provider)
  }

  const fetchUserData = async (uid?: string | null) => {
    const data = await getCurrentUserData(uid)
    setUserData(data)
  }

  const fetchUserFavorites = async (uid: string | null) => {
    if (!uid) return

    const favs = await getUserFavorites(uid)
    setUserFavorites(favs)
  }

  const fetchEmailSubscriptions = async (uid: string | null) => {
    const res = await getEmailSubscriptions()
    setEmailSubscriptions(res)
  }

  const fetchSubscription = async (uid: string | null) => {
    const data = await getSubscription(uid)

    setSubscription(data as SubscriptionWithProduct | null)

    return data
  }

  const refreshUserData = useCallback(
    async (uid?: string | null) => {
      let userId = uid ?? null

      await Promise.all([
        fetchSubscription(userId),
        fetchUserData(userId),
        fetchUserFavorites(userId),
        fetchEmailSubscriptions(user?.id),
      ])

      setLoading(false)
    },
    [user?.id]
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setSubscription(null)
    clearUserData()
  }, [supabase.auth])

  const clearUserData = () => {
    console.log('clearUserData')
    setUserData(null)
    setUserId(null)
    setUserFavorites(null)
  }

  const context = useMemo(
    () => ({
      user,
      provider,
      uid: userId,
      subscription,
      userData,
      userFavorites,
      emailSubscriptions,
      loadingUser: loading,
      refreshUserData,
      fetchUserFavorites,
      logout,
    }),
    [
      user,
      provider,
      userId,
      subscription,
      userData,
      userFavorites,
      emailSubscriptions,
      loading,
      refreshUserData,
      fetchUserFavorites,
      logout,
    ]
  )

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}

export default UserProvider
