'use client'

import { useRouter } from 'next/navigation'
import { useUserProvider } from '@/providers/UserProvider'
import { useEffect } from 'react'
import Loader from '@/components/shared/loader'
import { getCurrentUserData } from '@/app/actions/user'
import Typography from '@/components/typography'
import useLocalStorage from '@/lib/hooks/use-local-storage'

export default function Preloader() {
  const { refreshUserData } = useUserProvider()
  const router = useRouter()

  const [previousPath] = useLocalStorage('oasis-previous-path', '/')

  useEffect(() => {
    const fetch = async () => {
      refreshUserData()

      const userData = await getCurrentUserData()
      if (userData) {
        router.push(previousPath || '/')
      } else {
        router.push('/auth/signin')
      }
    }
    fetch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <Typography size="lg" fontWeight="normal">
        Accessing your healthiest life
      </Typography>
      <Loader height="100px" width="100px" />
    </div>
  )
}
