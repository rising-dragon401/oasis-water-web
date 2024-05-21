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
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import {
  Dna,
  FlaskConical,
  Microscope,
  Palmtree,
  Plus,
  Search,
  SearchCheck,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
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
    label: 'Bottled water, filters and tap water',
    icon: <Search className="w-4 h-4" />,
  },
  {
    label: 'Explore and build your own Oasis',
    icon: <Palmtree className="w-4 h-4" />,
  },
  // {
  //   label: 'AI search',
  //   icon: <MessageCircle className="w-4 h-4" />,
  // },
  {
    label: 'Most up to date research',
    icon: <SearchCheck className="w-4 h-4" />,
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

const kSubscriptionPrice = 7.99

export default function SubscribeModal({ open, setOpen }: SubscribeModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUserProvider()
  const { products } = useSubscription()
  const { closeModal } = useModal()

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
      toast('Please login first to subscribe')
      closeModal('SubscriptionModal')
      router.push(`/auth/signin?redirectUrl=${pathname}&modal=SubscriptionModal`)
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
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Upgrade your health</DialogTitle>
          <Image
            src="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/images/arch%20palm%20tree.jpg"
            alt="Unlock best water"
            width={425}
            height={200}
            className="rounded-lg h-40 object-cover object-center"
          />
          <Typography size="xl" fontWeight="bold" className="text-center">
            Oasis Pro ${kSubscriptionPrice} /mo
          </Typography>
          <div className="flex w-full justify-center">
            <DialogDescription className="text-center max-w-72">
              Improve your health and longevity by accessing the most up to date research and
              scientific data on health products recommended for you.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-4 rounded-md bg-muted">
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
