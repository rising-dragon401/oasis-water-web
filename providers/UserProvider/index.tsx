'use client'

import { getCurrentUserData, getUserFavorites, getEmailSubscriptions } from '@/app/actions/user'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useSupabase } from '../SupabaseProvider'
import { getSubscription } from '@/app/actions/user'
import useSWR from 'swr'
import { SubscriptionWithProduct, ProductWithPrices } from '@/types/custom'

interface UserContextType {
  uid: string | null | undefined
  provider: string | null | undefined
  user: any
  userData: any
  userFavorites: any[] | null | undefined
  emailSubscriptions: any[] | null | undefined
  subscription: SubscriptionWithProduct | null | undefined
  refreshUserData: () => void
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
  const { session } = useSupabase()

  const [userId, setUserId] = useState<string | null | undefined>(null)
  const [provider, setProvider] = useState<any>(null)
  const [subscription, setSubscription] = useState<SubscriptionWithProduct | null | undefined>(null)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(null)
  const [emailSubscriptions, setEmailSubscriptions] = useState<any[] | null | undefined>(null)

  const initUser = async (session: any) => {
    setUser(session.user)
    setUserId(session.user?.id)
    setProvider(session.user?.app_metadata?.provider)
  }

  useEffect(() => {
    if (session) {
      initUser(session)
      refreshUserData()
    } else {
      clearUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const fetchUserData = async () => {
    const data = await getCurrentUserData()
    setUserData(data)
  }

  const fetchUserFavorites = async () => {
    const favs = await getUserFavorites()
    setUserFavorites(favs)
  }

  const fetchEmailSubscriptions = async (uid: string | null) => {
    const res = await getEmailSubscriptions()
    setEmailSubscriptions(res)
  }

  const fetchSubscription = async () => {
    const data = await getSubscription()
    setSubscription(data)
    return data
  }

  const refreshUserData = async () => {
    await Promise.all([
      fetchSubscription(),
      fetchUserData(),
      fetchUserFavorites(),
      fetchEmailSubscriptions(user?.id),
    ])
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSubscription(null)
    clearUserData()
  }

  const clearUserData = () => {
    setUserData(null)
    setUserId(null)
    setUserFavorites(null)
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        provider,
        uid: userId,
        subscription,
        userData,
        userFavorites,
        emailSubscriptions,
        refreshUserData,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
