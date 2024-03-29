'use client'

import useSWR, { mutate } from 'swr'
import { getUserId, getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UserContextType {
  uid: string | null | undefined
  user: any
  userData: any
  userFavorites: any[] | null | undefined
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

  const [user, setUser] = useState<any>(null)

  const { data: uid } = useSWR('uid', getUserId)
  const { data: currentUserData } = useSWR('userData', getCurrentUserData)
  const { data: userFavorites } = useSWR('userFavorites', getUserFavorites)

  const fetchUser = async () => {
    console.log('fetching user')
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)
  }

  // fetch auth user on mount
  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    refreshUserData()
  }, [user])

  const logout = async () => {
    await supabase.auth.signOut()
    fetchUser()
    clearUserData()
  }

  const refreshUserData = () => {
    mutate('userData')
    mutate('userFavorites')
    mutate('uid')
  }

  const clearUserData = () => {
    mutate('userData', null)
    mutate('userFavorites', null)
    mutate('uid', null)
  }

  return (
    <UserContext.Provider
      value={{ user, uid, userData: currentUserData, userFavorites, refreshUserData, logout }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
