'use client'

import useSWR from 'swr'
import { getUserId, getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import React, { ReactNode, createContext, useContext } from 'react'

interface UserContextType {
  uid: string | null | undefined
  userData: any
  userFavorites: any[] | null | undefined
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

  return (
    <UserContext.Provider value={{ uid, userData: currentUserData, userFavorites }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
