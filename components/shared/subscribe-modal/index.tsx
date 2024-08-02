'use client'

import { getActiveProductsWithPrices } from '@/app/actions/user'
import Logo from '@/components/shared/logo'
import { SubscriptionItem } from '@/components/shared/subscribe-modal/subscription-item'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { ProductWithPrices } from '@/types/custom'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import * as Sentry from '@sentry/browser'
import { CheckCircle, Circle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type SubscribeModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FEATURES = [
  {
    label: ' Scores and ratings',
    icon: '🔓',
  },
  {
    label: ' Top products per category',
    icon: '🏆',
  },
  // {
  //   label: 'View lab data',
  //   icon: '🔍',
  // },
  {
    label: 'Research articles',
    icon: '🧬',
  },
  {
    label: 'Personal AI health companion',
    icon: '🧑‍⚕️',
  },
  {
    label: 'Support lab testing',
    icon: '🔬',
  },
  // {
  //   label: 'Personalized recommendations',
  //   icon: <Dna className="w-4 h-4" />,
  // },
  {
    label: 'Private community',
    icon: '🌐',
  },
]

// annual
const kAnnualPrice = 39.99
const kWeeklyPrice = 5.99
const kMonthlyPrice = 7.99

export default function SubscribeModal({ open, setOpen }: SubscribeModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUserProvider()
  const { closeModal } = useModal()

  const [products, setProducts] = useState<ProductWithPrices[]>([])

  useEffect(() => {
    getActiveProductsWithPrices().then((products: ProductWithPrices[]) => setProducts(products))
  }, [])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'openSubscribe' && event.newValue === 'true') {
        setOpen(true)
        localStorage.setItem('openSubscribe', 'false') // Reset the value
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [setOpen])

  const [selectedPlan, setSelectedPlan] = useState('annual')
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

  const proPriceAnnual =
    proProduct?.prices.find(
      (price: any) => price.id === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_ID_ANNUAL
    ) ?? null

  const proPriceMonthly =
    proProduct?.prices.find(
      (price: any) => price.id === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_ID_MONTHLY
    ) ?? null

  const redirectToPayment = async () => {
    if (!user) {
      setRedirectUrl(pathname)
      toast('Create an account first to subscribe')
      closeModal('SubscriptionModal')
      router.push(`/auth/signin?redirectUrl=${pathname}&modal=SubscriptionModal&view=sign_up`)
      return
    }

    const thisPrice = selectedPlan === 'annual' ? proPriceAnnual : proPriceMonthly

    if (!thisPrice) {
      toast('Unable to create checkout link')
      console.error('No price id found')
      return
    }

    setLoadingCheckoutSession(true)

    // offer 3 day trial if annual plan
    // const metadata =
    //   selectedPlan === 'annual'
    //     ? {
    //         trial_settings: {
    //           end_behavior: {
    //             missing_payment_method: 'cancel',
    //           },
    //         },
    //         trial_period_days: 3,
    //       }
    //     : {}
    // no free trial anymore
    const metadata = {}

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price: thisPrice, metadata: metadata, referral: referral },
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (e) {
      console.error('Error: ', e)
      Sentry.captureException(e)
      toast('Unable to create checkout link')
    }

    setLoadingCheckoutSession(false)
  }

  const redirectToSignIn = () => {
    router.push('/auth/signin')
    setOpen(false)
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
          <div className="flex flex-col justify-center items-center">
            <Logo className="w-20 h-20" />
            <Typography size="2xl" fontWeight="bold" className="text-center mt-2">
              Oasis Membership
            </Typography>
          </div>

          <div className="flex flex-col">
            <Typography size="base" fontWeight="normal" className="text-center text-secondary">
              Unlock the healthiest water products for you
            </Typography>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-4 rounded-md bg-muted mx-8 ">
          {FEATURES.map((feature) => (
            <SubscriptionItem key={feature.label} label={feature.label} icon={feature.icon} />
          ))}
        </div>

        <DialogFooter className="flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <Button
              variant="outline"
              className={`px-4 w-full !font-bold mb-2 flex h-12 flex-row justify-between
                ${selectedPlan === 'annual' ? 'border-primary' : 'border'}
              `}
              onClick={() => setSelectedPlan('annual')}
            >
              <div className="flex flex-row gap-3 items-center">
                {selectedPlan === 'annual' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}

                <div className="flex flex-col items-start ">
                  <Typography size="base" fontWeight="bold">
                    Yearly access
                  </Typography>
                  <Typography size="xs" fontWeight="normal">
                    ${kAnnualPrice} /year
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <Typography size="xs" fontWeight="normal">
                  ${(kAnnualPrice / 52).toFixed(2)}
                </Typography>
                <Typography size="xs" fontWeight="normal">
                  per week
                </Typography>
              </div>
            </Button>

            {/* <Button
              variant="outline"
              className={`px-4 w-full !font-bold mb-2 flex h-12 flex-row justify-between 
                ${selectedPlan === 'monthly' ? 'border-primary' : 'border'}
              `}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex flex-row gap-3 items-center">
                {selectedPlan === 'monthly' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}

                <div className="flex flex-col items-start ">
                  <Typography size="base" fontWeight="bold">
                    Monthly access
                  </Typography>
                  <Typography size="xs" fontWeight="normal">
                    ${kMonthlyPrice} /month
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex flex-col items-start">
                  <Typography size="xs" fontWeight="normal">
                    ${(kMonthlyPrice / 5).toFixed(2)}
                  </Typography>
                  <Typography size="xs" fontWeight="normal">
                    per week
                  </Typography>
                </div>
              </div>
            </Button> */}

            <Button
              variant="default"
              className="px-4 w-full !font-bold mb-2 flex rounded-full"
              onClick={() => redirectToPayment()}
              loading={loadingCheckoutSession}
            >
              Unlock Membership
            </Button>

            <div
              onClick={redirectToSignIn}
              className="text-center text-secondary mb-2 text-sm underline hover:cursor-pointer"
            >
              or sign in to existing Member account
            </div>

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
