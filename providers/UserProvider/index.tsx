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
  const [user, setUser] = useState<any | null>(null)
  const { data: uid } = useSWR('uid', getUserId)
  const { data: currentUserData } = useSWR('userData', getCurrentUserData)
  const { data: userFavorites } = useSWR('userFavorites', getUserFavorites)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetch()
  }, [])

  useEffect(() => {
    refreshUserData()
  }, [user])

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
      value={{ user, uid, userData: currentUserData, userFavorites, refreshUserData }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
