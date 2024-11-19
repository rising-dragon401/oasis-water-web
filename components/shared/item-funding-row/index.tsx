'use client'

import { fetchFundingStatus } from '@/app/actions/labs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Muted, P } from '@/components/ui/typography'
import { useUserProvider } from '@/providers/UserProvider'
import { determineLink, postDataDonate, timeSince } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import * as Sentry from '@sentry/browser'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
export default function ItemFundingRow({
  item,
  linkToProduct = false,
  showContribute = false,
  date = null,
  titleClassName = '',
}: {
  item: any
  linkToProduct?: boolean
  showContribute?: boolean
  date?: string | null
  titleClassName?: string
}) {
  const router = useRouter()
  const { uid } = useUserProvider()
  const pathname = usePathname()

  const [initLoading, setInitLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fundingDetails, setFundingDetails] = useState<any>(null)
  const [isHovered, setIsHovered] = useState(false)

  const raisedAmount = useMemo(() => {
    return fundingDetails?.raised_amount / 100 || 0
  }, [fundingDetails])

  const totalCost = useMemo(() => {
    return fundingDetails?.total_cost / 100 || 0
  }, [fundingDetails])

  const getFundingPercentage = (amount: number, cost: number) => {
    const percentage = (amount / cost) * 100
    return percentage > 100 ? 100 : percentage
  }

  useEffect(() => {
    if (!item.id || !item.type) {
      return
    }

    setInitLoading(true)
    fetchFundingStatus({ itemId: item.id, type: item.type, name: item.name })
      .then(setFundingDetails)
      .catch((e) => {
        console.error('Error: ', e)
        Sentry.captureException(e)
      })
      .finally(() => {
        setInitLoading(false)
      })
  }, [item.id, item.type])

  const redirectToFundingLink = async () => {
    setLoading(true)

    // console.log('fundingDetails', JSON.stringify(fundingDetails))

    if (!uid) {
      localStorage.setItem('redirectUrl', pathname)
      toast('Please sign in to contribute')
      try {
        router.push(`/auth/signin`)
      } catch (error) {
        console.error('Router push error:', error)
      }
      setLoading(false)
      return
    }

    if (!fundingDetails?.lab_id) {
      toast('Unable to process donation link. Please try again later')
      throw new Error('Unable to process donation link. Item lab id not found')
    }

    try {
      const { sessionId } = await postDataDonate({
        url: '/api/create-donate-checkout',
        data: {
          product_id: item.id,
          product_type: item.type,
          product_name: item.name,
          image: item.image,
          lab_id: fundingDetails.lab_id,
          user_id: uid,
        },
      }).catch((e) => {
        console.error('Error: ', e)
        Sentry.captureException(e)
        setLoading(false)
      })

      if (!sessionId) {
        throw new Error('Unable to process donation link. Session ID not found')
      }

      console.log('sessionId', sessionId)

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (e) {
      toast('Unable to process donation link. Please try again later')
      console.error('Error: ', e)
      Sentry.captureException(e)
      setLoading(false)
    }
  }

  const renderContributors = () => {
    return fundingDetails?.user_contributions?.map((contribution: any) => (
      <TooltipProvider key={contribution.user_id}>
        <Tooltip>
          <TooltipTrigger>
            <Image
              src={contribution.avatar_url}
              alt={contribution.full_name}
              width={20}
              height={20}
              className="rounded-full w-5 h-5"
            />
            <div className="flex flex-col"></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{contribution.full_name || contribution.username}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ))
  }

  const renderCardBody = () => {
    return (
      <>
        <div className="flex flex-col gap-2 w-1/4">
          <div className="flex justify-center items-center">
            <Image src={item.image} alt={item.name} width={75} height={75} objectFit="fill" />
          </div>
        </div>
        <div className="flex flex-col w-3/4 justify-between h-full py-1">
          <div className="h-12 flex flex-row justify-between">
            <div className="flex flex-col w-full">
              <P className={` font-bold text-sm max-w-[80%] ${titleClassName}`}>{item.name}</P>
              {/* <Muted>Standard water test</Muted> */}
            </div>

            {showContribute && (
              <>
                {uid ? (
                  <Button
                    variant="outline"
                    className="text-sm h-8 px-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      redirectToFundingLink()
                      e.preventDefault()
                    }}
                    onMouseEnter={() => {
                      setIsHovered(false)
                    }}
                    onMouseLeave={() => {
                      setIsHovered(true)
                    }}
                    loading={loading}
                  >
                    Contribute
                  </Button>
                ) : (
                  <Link href={`/auth/signin?redirectUrl=${pathname}`} className="text-sm ">
                    <Button variant="outline" className="text-sm h-8 px-2">
                      Contribute
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
          {showContribute && (
            <>
              {initLoading ? (
                <div className="flex flex-col gap-1 max-w-[70%] w-full ">
                  <Skeleton className="w-full h-4 rounded-xl" />
                  <Skeleton className="h-2 w-24 rounded-xl" />
                </div>
              ) : (
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <Progress
                    value={getFundingPercentage(raisedAmount, totalCost)}
                    max={100}
                    className="h-2"
                  />
                  <div className="flex flex-row justify-between h-full w-full">
                    {raisedAmount && raisedAmount > 0 ? (
                      <Muted className="text-xs text-primary">{`$${raisedAmount} raised`}</Muted>
                    ) : (
                      <Muted className="text-xs">
                        Not yet funded
                        {/* {getFundingPercentage(raisedAmount, totalCost) + '% funded'} */}
                      </Muted>
                    )}
                    <div className="">{renderContributors()}</div>
                  </div>
                </div>
              )}
            </>
          )}
          {date && <Muted className="text-xs">Updated {timeSince(date)}</Muted>}
        </div>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {linkToProduct ? (
        <Link
          href={determineLink(item)}
          key={item.id}
          className="flex flex-row w-full gap-4 items-center border border-border py-3 rounded-xl bg-card pr-4 relative"
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          {renderCardBody()}
          <ArrowRight
            className={`w-4 h-4 text-muted-foreground absolute bottom-2 right-2 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </Link>
      ) : (
        <div className="flex flex-row gap-4 items-center border border-border py-3 rounded-xl bg-card pr-4 relative">
          {renderCardBody()}
        </div>
      )}
    </div>
  )
}
