'use client'

import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { useUserProvider } from '@/providers/UserProvider'
import useSubscription from '@/lib/hooks/use-subscription'
import { postData } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function ManageSubscriptionButton() {
  const router = useRouter()
  const { subscription } = useSubscription()

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

  if (subscription && subscription.status === 'active') {
    return (
      <DropdownMenuItem className="hover:cursor-pointer" asChild>
        <Button
          variant="ghost"
          onClick={handleManageSubscription}
          className="flex flex-row items-center"
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
