'use client'

import { useRouter } from 'next/navigation'
import { useUserProvider } from '@/providers/UserProvider'
import { useEffect } from 'react'
import Loader from '@/components/loader'
import { getCurrentUserData } from '@/app/actions/user'
import Typography from '@/components/typography'

export default function Preloader() {
  const { refreshUserData } = useUserProvider()
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      refreshUserData()

      const userData = await getCurrentUserData()
      if (userData) {
        router.push('/')
      } else {
        router.push('/auth/signin')
      }
    }
    fetch()
  }, [])

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <Typography size="base" fontWeight="normal">
        Loading your clean life
      </Typography>
      <Loader height="100px" width="100px" />
    </div>
  )
}
