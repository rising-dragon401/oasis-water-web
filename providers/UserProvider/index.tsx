'use client'

import useSWR, { mutate } from 'swr'
import { getUserId, getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import React, { ReactNode, createContext, useContext, useEffect } from 'react'

interface UserContextType {
  uid: string | null | undefined
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
  const { data: uid } = useSWR('uid', getUserId)
  const { data: currentUserData } = useSWR('userData', getCurrentUserData)
  const { data: userFavorites } = useSWR('userFavorites', getUserFavorites)

  const refreshUserData = () => {
    console.log('refreshing user data')
    mutate('userData')
    mutate('userFavorites')
    mutate('uid')
  }

  return (
    <UserContext.Provider
      value={{ uid, userData: currentUserData, userFavorites, refreshUserData }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
