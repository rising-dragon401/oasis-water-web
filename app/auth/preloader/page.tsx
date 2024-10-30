'use client'

import { getCurrentUserData } from '@/app/actions/user'
import Loader from '@/components/shared/loader'
import Typography from '@/components/typography'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Preloader() {
  const router = useRouter()

  const [previousPath] = useLocalStorage('oasis-previous-path', '/')
  const [checked] = useLocalStorage('oasis-subscribe-to-newsletter', false)

  useEffect(() => {
    const fetch = async () => {
      const userData = await getCurrentUserData()

      if (userData) {
        // update user email fields
        // if (userData?.email) {
        //   await addToEmailList(userData.id, userData?.email, 'newsletter', checked)
        // }

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
