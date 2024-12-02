'use client'

import { getActiveProductsWithPrices } from '@/app/actions/user'
import { Check } from 'lucide-react'
import Image from 'next/image'
// import Logo from '@/components/shared/logo'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Muted } from '@/components/ui/typography'
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
    label: 'View scores and ratings',
    icon: '🔓',
  },
  {
    label: 'Scan your water / filter',
    icon: '🏆',
  },
  {
    label: 'Check your tap water quality',
    icon: '🧬',
  },
  {
    label: 'Save your favorites',
    icon: '💖',
  },
  {
    label: 'Stay notified of new scores',
    icon: '👥',
  },
  // {
  //   label: 'See what others are',
  //   icon: '🔬',
  // },
  // {
  //   label: 'Support further testing',
  //   icon: '🌐',
  // },
]

const kAnnualPrice = 47
const kWeeklyPrice = 4.99

export default function SubscribeModal({ open, setOpen }: SubscribeModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, subscription, userData } = useUserProvider()
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

  const appPreviewImage =
    'https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/welcome-scan-graphic.png?t=2024-10-30T20%3A55%3A40.800Z'

  const isCormac =
    userData?.email?.includes('cormacncheese') || user?.email?.includes('cormacncheese')

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogContent className="md:max-w-none max-w-sm overflow-y-scroll min-h-[40vh] mx-10">
        <DialogHeader>
          <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <div className="flex flex-col gap-1">
              <Typography size="2xl" fontWeight="bold" className="text-center ">
                {subscription ? 'Download app to view' : 'Download app to unlock'}
              </Typography>
              {subscription && (
                <Muted className="text-center">
                  Don&apos;t worry your existing membership will transfer over
                </Muted>
              )}
            </div>
            <div className="flex flex-col items-center h-full w-36">
              <Image
                src={appPreviewImage}
                alt="Oasis"
                width={300}
                height={400}
                className="rounded-md"
                objectFit="contain"
              />
            </div>
          </div>

          {/* <div className="flex flex-col text-center">
            <Large>$4 /mo</Large>
            <Muted>Billed annually at $47</Muted> */}
          {/* <Typography size="base" fontWeight="normal" className="text-center text-secondary">
              Your membership funds independent lab testing (which is expensive!) and keeps Oasis
              unbiased.
            </Typography> */}
          {/* </div> */}
        </DialogHeader>

        <div className="flex flex-col gap-3 px-4 pb-4 rounded-md mx-auto">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="flex flex-row gap-2 items-center">
              <Check className="w-4 h-4" />

              <Typography size="base" fontWeight="normal">
                {feature.label}
              </Typography>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col gap-2 w-full px-4 pb-4">
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                window.open(kAppStore, '_blank')
              }}
            >
              <TbBrandApple className="w-4 h-4 mr-2" />
              iOS app
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.open(kGooglePlay, '_blank')
              }}
            >
              <TbBrandGooglePlay className="w-4 h-4 mr-2" />
              Android app
            </Button>

            {isCormac && (
              <>
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
                  <Muted>
                    We charge to support product lab testing and to keep Oasis unbiased.
                  </Muted>
                </div>

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
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
