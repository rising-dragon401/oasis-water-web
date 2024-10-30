'use client'

import { getActiveProductsWithPrices } from '@/app/actions/user'
import Logo from '@/components/shared/logo'
import { SubscriptionItem } from '@/components/shared/subscribe-modal/subscription-item'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Large, Muted } from '@/components/ui/typography'
import { kAppStore, kGooglePlay } from '@/lib/constants/socials'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { ProductWithPrices } from '@/types/custom'
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import * as Sentry from '@sentry/browser'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TbBrandApple, TbBrandGooglePlay } from 'react-icons/tb'
import { toast } from 'sonner'

type SubscribeModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FEATURES = [
  {
    label: 'Access to all scores and ratings',
    icon: '🔓',
  },
  {
    label: 'Unlimited scans and searches',
    icon: '🏆',
  },
  {
    label: 'Full contaminant breakdowns',
    icon: '🧬',
  },
  {
    label: 'Personalized filter recommendations',
    icon: '🔬',
  },
  {
    label: 'Support further testing',
    icon: '🌐',
  },
]

const kAnnualPrice = 47
const kWeeklyPrice = 4.99

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

  const proPriceWeekly =
    proProduct?.prices.find(
      (price: any) => price.id === process.env.NEXT_PUBLIC_PRO_STRIPE_PRICE_ID_WEEKLY
    ) ?? null

  const redirectToPayment = async () => {
    if (!user) {
      setRedirectUrl(pathname)
      toast('Create an account first to subscribe')
      closeModal('SubscriptionModal')
      router.push(`/auth/signin?redirectUrl=${pathname}&modal=SubscriptionModal&view=sign_up`)
      return
    }

    const thisPrice =
      selectedPlan === 'annual'
        ? proPriceAnnual
        : selectedPlan === 'weekly'
          ? proPriceWeekly
          : proPriceMonthly

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

  const redirectToSignIn = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    setTimeout(() => {
      router.push('/auth/signin')
    }, 0)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogContent className="md:max-w-none max-w-sm overflow-y-scroll max-h-[90vh] mx-10 ">
        <DialogHeader>
          <div className="flex flex-col justify-center items-center">
            <Logo className="w-20 h-20" />
            <Typography size="2xl" fontWeight="bold" className="text-center mt-2">
              Unlock healthy hydration
            </Typography>
          </div>

          <div className="flex flex-col text-center">
            <Large>$4 /mo</Large>
            <Muted>Billed annually at $47</Muted>
            {/* <Typography size="base" fontWeight="normal" className="text-center text-secondary">
              Your membership funds independent lab testing (which is expensive!) and keeps Oasis
              unbiased.
            </Typography> */}
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-4 py-4 rounded-md bg-muted mx-8 ">
          {FEATURES.map((feature) => (
            <SubscriptionItem key={feature.label} label={feature.label} icon={feature.icon} />
          ))}
        </div>

        <DialogFooter className="flex flex-col gap-2 w-full px-4">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                className={`px-4 w-full !font-bold mb-2 flex !h-full !py-1 !rounded-md flex-row justify-between
                ${selectedPlan === 'annual' ? 'border-primary border-2' : 'border'}
              `}
                onClick={() => setSelectedPlan('annual')}
              >
                <div className="flex flex-row gap-3 items-center w-full">
                  <div className="flex flex-col items-start w-full">
                    <Typography size="base" fontWeight="bold">
                      Yearly
                    </Typography>
                    <div className="flex flex-row justify-between items-end w-full mt-2">
                      <Typography size="sm" fontWeight="normal">
                        ${kAnnualPrice}
                      </Typography>
                      <Typography size="xs" fontWeight="normal">
                        ${(kAnnualPrice / 52).toFixed(2)} /wk
                      </Typography>
                    </div>
                  </div>
                </div>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`px-4 w-full !font-bold mb-2 flex h-full  !py-1 !rounded-md flex-row justify-between 
                ${selectedPlan === 'weekly' ? 'border-primary border-2' : 'border'}
              `}
                    // onClick={() => setSelectedPlan('weekly')}
                  >
                    <div className="flex flex-row gap-3 items-center w-full">
                      <div className="flex flex-col items-start w-full">
                        <Typography size="base" fontWeight="bold">
                          Weekly
                        </Typography>
                        <div className="flex flex-row justify-between items-end w-full mt-2">
                          <Typography size="sm" fontWeight="normal">
                            ${kWeeklyPrice}
                          </Typography>
                          <Typography size="xs" fontWeight="normal">
                            app only
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuItem>
                    <TbBrandApple className="w-4 h-4 mr-2" />
                    <a href={kAppStore} target="_blank" rel="noopener noreferrer">
                      iOS app
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TbBrandGooglePlay className="w-4 h-4 mr-2" />
                    <a href={kGooglePlay} target="_blank" rel="noopener noreferrer">
                      Android app
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <Button
                variant="default"
                className="px-4 mt-4 w-full !font-bold mb-2 flex rounded-full h-12 shadow-md shadow-blue-600/50"
                onClick={() => redirectToPayment()}
                loading={loadingCheckoutSession}
              >
                Upgrade
              </Button>
              <Muted>We charge to support product lab testing and to keep Oasis unbiased.</Muted>
            </div>

            {/* <ReferralCodeInput /> */}

            {/* <div
              onClick={redirectToSignIn}
              className="text-center text-secondary my-2 text-sm underline hover:cursor-pointer"
            >
              or sign in to existing Member account
            </div> */}

            <div className="flex flex-row mt-4 w-full justify-between">
              <Muted className="text-center italic mt-1 text-xs">
                <a href="/terms" className="underline">
                  Terms of service
                </a>
              </Muted>
              <Muted className="text-center italic mt-1 text-xs">
                <a href="/privacy-policy" className="underline">
                  Privacy policy
                </a>
              </Muted>
              <Muted className="text-center italic mt-1 text-xs">
                <a href="/refund-policy" className="underline">
                  Refund policy.
                </a>
              </Muted>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
