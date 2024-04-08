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
import { useState } from 'react'
import { useUserProvider } from '@/providers/UserProvider'
import { toast } from 'sonner'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import useSubscription from '@/lib/hooks/use-subscription'
import Image from 'next/image'
import { SubscriptionItem } from '@/components/shared/subscribe-modal/subscription-item'
import { FlaskConical, Dna, MessageCircle } from 'lucide-react'
import Typography from '@/components/typography'

type SubscribeModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FEATURES = [
  {
    label: 'Access all data, ratings and research',
    icon: <FlaskConical className="w-4 h-4" />,
  },
  {
    label: 'AI search',
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    label: 'Personalized recommendations',
    icon: <Dna className="w-4 h-4" />,
  },
]

const kSubscriptionPrice = 10

export function SubscribeModal({ open, setOpen }: SubscribeModalProps) {
  const router = useRouter()
  const { user } = useUserProvider()
  const { products } = useSubscription()
  const [loadingCheckoutSession, setLoadingCheckoutSession] = useState(false)

  const proProduct = products?.find(
    (product: any) => product.name === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_NAME
  )

  const proPrice =
    proProduct?.prices.find(
      (price: any) => price.id === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_ID
    ) ?? null

  const redirectToPayment = async () => {
    if (!user) {
      toast('Please login first')
      router.push('/auth/signin')
      return
    }

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
          <DialogTitle className="text-2xl text-center">Upgrade your health</DialogTitle>
          <Image
            src="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/images/arch%20palm%20tree.jpg"
            alt="Upgrade your health"
            width={425}
            height={200}
            className="rounded-t-lg "
          />
          <Typography size="lg" fontWeight="bold" className="text-center">
            ${kSubscriptionPrice} /mo
          </Typography>
          <DialogDescription className="text-center">
            Access the most up-to-date water health science and water reports. Search with AI to
            personalize your recommendations based on your unique preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 p-4 rounde-md bg-muted">
          {FEATURES.map((feature) => (
            <SubscriptionItem key={feature.label} label={feature.label} icon={feature.icon} />
          ))}
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setOpen(false)
            }}
          >
            Not now
          </Button>
          <Button
            variant="default"
            className="px-4 w-full"
            onClick={redirectToPayment}
            loading={loadingCheckoutSession}
          >
            Upgrade ${kSubscriptionPrice} /mo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
