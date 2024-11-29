'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Muted, P } from '@/components/ui/typography'
import { useUserProvider } from '@/providers/UserProvider'
import { determineLink, postDataDonate, timeSince } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'
import * as Sentry from '@sentry/browser'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function ItemFundingRow({
  item,
  lab_id = null,
  raisedAmount = null,
  totalCost = null,
  contributions = [],
  linkToProduct = false,
  showFundProgress = false,
  showFundButton = false,
  date = null,
  titleClassName = '',
  showContMeta = false,
}: {
  item: any
  lab_id?: string | null
  raisedAmount?: number | null
  totalCost?: number | null
  contributions?: any[]
  linkToProduct?: boolean
  showFundProgress?: boolean
  showFundButton?: boolean
  date?: string | null
  titleClassName?: string
  showContMeta?: boolean
}) {
  const router = useRouter()
  const { uid } = useUserProvider()
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getFundingPercentage = (amount: number | null, cost: number | null) => {
    if (!amount || !cost) {
      return 0
    }

    const percentage = (amount / cost) * 100

    return percentage > 100 ? 100 : percentage
  }

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

    if (!lab_id) {
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
          lab_id,
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
    return contributions?.map((contribution: any) => (
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

  const percentageFunded = useMemo(
    () => getFundingPercentage(raisedAmount, totalCost),
    [raisedAmount, totalCost]
  )

  const isFunded = percentageFunded >= 100

  const renderCardBody = () => {
    return (
      <>
        <div className="flex flex-col gap-2 w-1/4">
          <div className="flex justify-center items-center">
            <Image src={item.image} alt={item.name} width={75} height={75} objectFit="fill" />
          </div>
        </div>
        <div className="flex flex-col w-3/4 justify-between h-full py-1">
          <div className=" flex flex-row justify-between">
            <P className={`font-bold h-10 text-sm max-w-[80%] ${titleClassName} w-full truncate`}>
              {item.name}
            </P>

            {showFundButton && (
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
                    Donate
                  </Button>
                ) : (
                  <Link href={`/auth/signin?redirectUrl=${pathname}`} className="text-sm ">
                    <Button variant="outline" className="text-sm h-8 px-4">
                      Donate
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {showFundProgress && (
            <>
              <div className="flex flex-col gap-1 max-w-[70%]">
                {isFunded && (
                  <div className="flex flex-row gap-2 w-full justify-end">
                    <Muted className="text-xs text-accent">Funded</Muted>
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                )}

                <Progress value={percentageFunded} max={100} className={`h-2`} />

                <div className="flex flex-row justify-between items-center h-full w-full">
                  {raisedAmount && raisedAmount > 0 ? (
                    <Muted className="text-xs text-primary font-bold">{`$${raisedAmount / 100} raised`}</Muted>
                  ) : (
                    <Muted className="text-xs">Not yet funded</Muted>
                  )}
                  <div>{renderContributors()}</div>
                </div>
              </div>
            </>
          )}

          {showContMeta && (
            <>
              {item.type === 'bottled_water' && (
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.cont_count > 0 ? 'bg-danger' : 'bg-neutral'
                    }`}
                  />
                  <P className="text-xs text-muted-foreground">
                    {item?.cont_count > 0
                      ? `${item?.cont_count} contaminant${item?.cont_count !== 1 ? 's' : ''}`
                      : 'New data available'}
                  </P>
                </div>
              )}

              {item.type === 'filter' && (
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.cont_not_removed > 0 ? 'bg-danger' : 'bg-neutral'
                    }`}
                  />
                  <P className="text-xs text-muted-foreground">
                    {item.cont_not_removed > 0
                      ? `${item.cont_not_removed} unfiltered pollutants`
                      : 'New data available'}
                  </P>
                </div>
              )}
            </>
          )}

          {date && (
            <div className="flex justify-start mt-2">
              <Muted className="text-xs">{timeSince(date)}</Muted>
            </div>
          )}
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
          className={`flex flex-row w-full gap-4 items-center border border-border py-3 rounded-xl bg-card pr-4 relative transition-transform duration-300 ${
            isHovered ? 'transform translate-y-[-5px]' : ''
          }`}
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          {renderCardBody()}
        </Link>
      ) : (
        <div
          className={`flex flex-row gap-4 items-center border border-border py-3 rounded-xl bg-card pr-4 relative transition-transform duration-300 ${
            isHovered ? 'transform translate-y-[-5px]' : ''
          }`}
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          {renderCardBody()}
        </div>
      )}
    </div>
  )
}
