'use client'

import { getCurrentUserData, getUserFavorites } from '@/app/actions/user'
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

  const [userId, setUserId] = useState<string | null | undefined>(null)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [userFavorites, setUserFavorites] = useState<any[] | null | undefined>(null)

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)

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
  }, [])

  useEffect(() => {
    refreshUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const updateUserData = async () => {
    const data = await getCurrentUserData()
    setUserData(data)
  }

  const updateUserFavorites = async () => {
    const favs = await getUserFavorites()
    setUserFavorites(favs)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    await fetchUser()
    await clearUserData()
  }

  const refreshUserData = () => {
    updateUserData()
    updateUserFavorites()
  }

  const clearUserData = () => {
    setUserData(null)
    setUserId(null)
    setUserFavorites(null)
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{ user, uid: userId, userData, userFavorites, refreshUserData, logout }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
