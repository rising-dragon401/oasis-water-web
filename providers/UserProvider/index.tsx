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

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)
    setProvider(user?.app_metadata?.provider)

    if (user) {
      setUserId(user.id)
    } else {
      setUserId(null)
    }
  }

  // fetch auth user on mount
  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    refreshUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, session])

  const updateUserData = async () => {
    const data = await getCurrentUserData()
    setUserData(data)
  }

  const updateUserFavorites = async () => {
    const favs = await getUserFavorites()
    setUserFavorites(favs)
  }

  const updateEmailSubscriptions = async (uid: string | null) => {
    const res = await getEmailSubscriptions(uid)
    setEmailSubscriptions(res)
  }

  const updateSubscription = async () => {
    const data = await getSubscription()
    setSubscription(data)
    return data
  }

  const refreshUserData = () => {
    updateUserData()
    updateSubscription()
    updateUserFavorites()
    updateEmailSubscriptions(user?.id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSubscription(null)
    await fetchUser()
    await clearUserData()
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
