'use client'

import { getUserId, getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import { useState, useEffect } from 'react'
import useSWR from 'swr'

export default function useUser() {
  const [userData, setUserData] = useState<any>({})

  const { data: uid, error: uidError } = useSWR('uid', getUserId)
  const { data: currentUserData, error: userDataError } = useSWR('userData', getCurrentUserData)
  const { data: userFavorites } = useSWR('userFavorites', getUserFavorites)

  useEffect(() => {
    setUserData(currentUserData)
  }, [currentUserData, uid])

  return {
    uid: uid || '',
    userData: userData,
    userFavorites: userFavorites || [],
  }
}
