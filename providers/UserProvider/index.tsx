'use client'

import {
  createUsername,
  getCurrentUserData,
  getEmailSubscriptions,
  getSubscription,
  getUserByUsername,
  getUserFavorites,
  updateUserData,
} from '@/app/actions/user'
import useSessionStorage from '@/lib/hooks/use-session-storage'
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
  fetchUserData: (uid: string) => void
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
  const [userId, setUserId] = useState<string | null>(null)
  const [provider, setProvider] = useState<any>(null)
  const [subscription, setSubscription] = useState<SubscriptionWithProduct | null | undefined>(null)
  const [userData, setUserData] = useSessionStorage<any>('userData', null)
  const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(null)
  const [emailSubscriptions, setEmailSubscriptions] = useState<any[] | null | undefined>(null)

  // set referral code from local storage if applicable
  // TODO - move this to a SIGN_UP event, wildly inefficient
  useEffect(() => {
    const fetchReferralCode = async () => {
      const referralCode = localStorage.getItem('referralCode')
      if (referralCode && userData && !userData?.referred_by) {
        const user = await getUserByUsername(referralCode)
        if (!user) {
          return
        }

        const referredByUserId = user.id

        await updateUserData('referred_by', referredByUserId)
      }
    }
    fetchReferralCode()
  }, [userData])

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

    // check for username
    if (!data?.username && uid) {
      const username = await createUsername(uid)
      if (username) {
        setUserData({ ...data, username })
      }
    }
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
      let userId_ = uid ?? null

      await Promise.all([
        fetchSubscription(userId_),
        fetchUserData(userId_),
        fetchUserFavorites(userId_),
        fetchEmailSubscriptions(userId_),
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
      fetchUserData,
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
      fetchUserData,
      fetchUserFavorites,
      logout,
    ]
  )

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}

export default UserProvider
