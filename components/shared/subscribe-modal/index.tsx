'use client'

import Logo from '@/components/shared/logo'
import { SubscriptionItem } from '@/components/shared/subscribe-modal/subscription-item'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import useSubscription from '@/lib/hooks/use-subscription'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type SubscribeModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FEATURES = [
  {
    label: ' Unlock all scores and ratings',
    icon: '🔓',
  },
  {
    label: 'Scientific research',
    icon: '🧬',
  },
  {
    label: 'Personal AI nutritionist',
    icon: '🧑‍⚕️',
  },
  {
    label: 'Supports lab testing',
    icon: '🔬',
  },
  // {
  //   label: 'Personalized recommendations',
  //   icon: <Dna className="w-4 h-4" />,
  // },
  // {
  //   label: 'Private community',
  //   icon: <Users className="w-4 h-4" />,
  // },
]

// annual
const kSubscriptionPrice = 47

export default function SubscribeModal({ open, setOpen }: SubscribeModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUserProvider()
  const { products } = useSubscription()
  const { closeModal } = useModal()

  const [loadingCheckoutSession, setLoadingCheckoutSession] = useState(false)
  const [referral, setReferral] = useState(null)

  const [, setRedirectUrl] = useLocalStorage('redirectUrl', '')

  useEffect(() => {
    // @ts-ignore
    if (typeof Rewardful !== 'undefined') {
      // @ts-ignore
      rewardful('ready', function () {
        // @ts-ignore
        if (Rewardful.referral) {
          // @ts-ignore
          setReferral(Rewardful.referral)
          // @ts-ignore
          console.log('Rewardful.referral: ', Rewardful.referral)
        }
      })
    }
  }, [])

  const proProduct = products?.find(
    (product: any) => product.name === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_NAME
  )

  const proPrice =
    proProduct?.prices.find(
      (price: any) => price.id === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_ID
    ) ?? null

  const redirectToPayment = async () => {
    if (!user) {
      setRedirectUrl(pathname)
      toast('Please login first to subscribe and unlock ratings')
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

    // offer 3 day trial
    const metadata = {
      // trial_settings: {
      //   end_behavior: {
      //     missing_payment_method: 'cancel',
      //   },
      // },
      // trial_period_days: 3,
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price: proPrice, metadata: {}, referral: referral },
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
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[90vh] ">
        <DialogHeader>
          {/* <DialogTitle className="text-2xl text-center">Unlock the healthiest water</DialogTitle> */}
          {/* <Image
            src="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/images/arch%20palm%20tree.jpg"
            blurDataURL="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/images/arch%20palm%20tree.jpg"
            alt="Unlock best water"
            width={425}
            height={200}
            className="rounded-lg h-40 object-cover object-center"
          /> */}

          <div className="flex flex-col justify-center items-center">
            <Logo className="w-20 h-20" />
            <Typography size="2xl" fontWeight="bold" className="text-center mt-2">
              Oasis Pro
            </Typography>
            <Typography size="base" fontWeight="normal" className="text-center ">
              Know what you are drinking
            </Typography>
          </div>
          <Typography size="base" fontWeight="normal" className="text-secondary text-center mb-2">
            ${Math.round(kSubscriptionPrice)} annual (${Math.round(kSubscriptionPrice / 52)} per
            week)
          </Typography>
          {/* <div className="flex w-full justify-center">
            <DialogDescription className="text-center max-w-72">
              Improve your health and longevity by accessing the most up to date research and
              scientific data on health products recommended for you.
            </DialogDescription>
          </div> */}
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-4 rounded-md bg-muted mx-8">
          {FEATURES.map((feature) => (
            <SubscriptionItem key={feature.label} label={feature.label} icon={feature.icon} />
          ))}
        </div>

        <DialogFooter className="flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <Button
              variant="default"
              className="px-4 w-full !font-bold"
              onClick={redirectToPayment}
              loading={loadingCheckoutSession}
            >
              Subscribe to Oasis Pro
              {/* Upgrade ${kSubscriptionPrice} /mo */}
            </Button>
            <Typography size="sm" fontWeight="normal" className="text-center italic mt-1">
              We do not offer refunds as stated in our
              <a href="/refund-policy" className="text-blue-500 underline">
                {` `} Refund policy.
              </a>
              {` `} Funds go to improving Oasis and further lab testing.
            </Typography>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
