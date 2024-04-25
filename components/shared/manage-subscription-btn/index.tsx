'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const router = useRouter()
  const { subscription } = useUserProvider()

  const [isLoadingCustomerPortal, setIsLoadingCustomerPortal] = useState(false)
  const handleManageSubscription = async () => {
    setIsLoadingCustomerPortal(true)
    try {
      const { url } = await postData({
        url: '/api/create-portal-link',
      })

      console.log('url', url)

      if (url) {
        router.push(url)
      } else {
        throw new Error('Error')
      }
    } catch (error) {
      console.log('error', error)
    }

    setIsLoadingCustomerPortal(false)
  }

  // @ts-ignore
  if (subscription && subscription.status === 'active') {
    return (
      <DropdownMenuItem className="hover:cursor-pointer" asChild>
        <Button
          variant="ghost"
          onClick={handleManageSubscription}
          className="flex flex-row items-center w-full justify-start"
          loading={isLoadingCustomerPortal}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Subscription
        </Button>
      </DropdownMenuItem>
    )
  } else {
    return null
  }
}
