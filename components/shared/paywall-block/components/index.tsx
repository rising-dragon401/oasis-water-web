'use client'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import * as Sentry from '@sentry/browser'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const valueProps = [
  'Detailed analysis and insights 🔬',
  'Comprehensive research reports 📚',
  'Exclusive content 💡',
  'Product recommendendations 🌿',
]

export default function PaywallBlock({ price }: { price: any }) {
  const { user } = useUserProvider()
  const pathname = usePathname()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [, setRedirectUrl] = useLocalStorage('redirectUrl', '')

  const redirectToPayment = async () => {
    setLoading(true)

    if (!user) {
      setRedirectUrl(pathname)
      toast('Create an account first to subscribe')
      router.push(`/auth/signin?redirectUrl=${pathname}&modal=SubscriptionModal&view=sign_up`)
      setLoading(false)
      return
    }

    // offer 3 day trial if annual plan
    const metadata = {
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
      trial_period_days: 3,
    }

    try {
      if (!price) {
        throw new Error('No annual price found')
      }

      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price, metadata: metadata, referral: null },
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (e) {
      console.error('Error: ', e)
      Sentry.captureException(e)
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col">
      <div
        onClick={redirectToPayment}
        className="no-underline bg-secondary rounded-xl pt-1 px-4 text-center flex flex-col justify-center items-center"
      >
        <Typography size="xl" fontWeight="bold" className="text-primary mb-2">
          Become an Oasis member to read the full article
        </Typography>

        {valueProps && (
          <div className="flex flex-col">
            {valueProps.map((item, index) => (
              <Typography
                key={index}
                size="base"
                fontWeight="normal"
                className="text-primary text-center my-1"
              >
                {item}
              </Typography>
            ))}
          </div>
        )}
        <Button variant="outline" className="no-underline mt-4 mb-4 w-64" loading={loading}>
          Start a free trial
        </Button>
      </div>
    </div>
  )
}
