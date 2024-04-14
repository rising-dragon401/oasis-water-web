'use client'

import { SubscriptionItem } from '@/components/shared/subscribe-modal/subscription-item'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import useSubscription from '@/lib/hooks/use-subscription'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import {
  Dna,
  FlaskConical,
  MessageCircle,
  Microscope,
  Plus,
  SearchCheck,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type SubscribeModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FEATURES = [
  {
    label: 'Unlock all ratings and data',
    icon: <FlaskConical className="w-4 h-4" />,
  },
  {
    label: 'Most up to date research',
    icon: <SearchCheck className="w-4 h-4" />,
  },
  {
    label: 'AI search',
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    label: 'Personalized recommendations',
    icon: <Dna className="w-4 h-4" />,
  },
  {
    label: 'Supports Oasis to further our research',
    icon: <Microscope className="w-4 h-4" />,
  },
  {
    label: 'Private community',
    icon: <Users className="w-4 h-4" />,
  },
]

const kSubscriptionPrice = 5

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
      toast('Please login and subscribe to access this content')
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
            className="rounded-lg h-40 object-cover object-center"
          />
          <Typography size="xl" fontWeight="bold" className="text-center">
            ${kSubscriptionPrice} /mo
          </Typography>
          <DialogDescription className="text-center">
            Access the most up-to-date water health science and water reports and search using AI
            across our database to personalize your water health journey.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-6 py-4 rounded-md bg-muted">
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
            <Plus className="w-4 h-4 mr-2 " />
            Upgrade
            {/* Upgrade ${kSubscriptionPrice} /mo */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
