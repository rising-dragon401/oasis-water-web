'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useUserProvider } from '@/providers/UserProvider'
import { submitFeedback } from '@/app/actions/feedback'
import { toast } from 'sonner'
import Typography from '@/components/typography'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import useSubscription from '@/lib/hooks/use-subscription'

type SubscribeModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SubscribeModal({ open, setOpen }: SubscribeModalProps) {
  const router = useRouter()
  const { uid } = useUserProvider()
  const { subscription, products } = useSubscription()

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCheckoutSession, setLoadingCheckoutSession] = useState(false)

  const proProduct = products?.find(
    (product: any) => product.name === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_NAME
  )
  const proPrice = proProduct?.prices[0]

  const handleSubmission = async () => {
    setLoading(true)

    const res = await submitFeedback(value, uid)

    if (res.error) {
      toast('Unable to submit feedback at this time. Please try again later.')
    } else {
      toast('Thank you for the feedback!')
      setOpen(false)
      router.back()
    }

    setLoading(false)
  }

  const redirectToPayment = async () => {
    if (!proPrice) {
      toast('Unable to create checkout link')
      console.error('No pro price found')
      return
    }

    setLoadingCheckoutSession(true)

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price: proPrice },
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (e) {
      console.error('Error: ', e)
      toast('Unable to create checkout link')
    }

    setLoadingCheckoutSession(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find your perfect water</DialogTitle>
          <DialogDescription>
            Search across our entire water database using AI to find your perfect water.
          </DialogDescription>
        </DialogHeader>

        <Typography size="sm" fontWeight="medium">
          • Search with AI
          <br />
          • Access full data and reports
          <br />
          • Premium support
        </Typography>

        <DialogFooter className="flex flex-col-reverse gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
          >
            Not now
          </Button>
          <Button
            variant="default"
            className="px-4"
            onClick={redirectToPayment}
            loading={loadingCheckoutSession}
          >
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
