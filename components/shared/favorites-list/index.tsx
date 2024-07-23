'use client'

import { getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Score from '@/components/shared/score'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import useDevice from '@/lib/hooks/use-device'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { mutate, default as useSWR } from 'swr'
// import FollowButton from '@/components/shared/follow-button'

export default function FavoritesList({ userId }: { userId: string }) {
  const { uid, userData, loadingUser } = useUserProvider()
  const { isMobile } = useDevice()
  const router = useRouter()

  const [oasisScore, setOasisScore] = useState<number | null>(null)
  const [oasisUser, setOasisUser] = useState<any>(null)
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true)

  useEffect(() => {
    if (userId) {
      fetchOasisUser()
      mutate(`userFavorites-${userId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const fetchOasisUser = async () => {
    if (!userId) {
      return
    }

    const res = await getCurrentUserData(userId)
    if (res) {
      setOasisUser(res)
    } else {
      setLoadingFavorites(false)
    }
  }

  const fetchUserFavorites = async () => {
    if (!userId) {
      return
    }

    const favorites = await getUserFavorites(userId)
    setLoadingFavorites(false)
    return favorites
  }

  const { data: favorites } = useSWR(`userFavorites-${userId}`, fetchUserFavorites)

  const isAuthUser = uid === userId

  // calculate oasis score
  useEffect(() => {
    if (favorites) {
      calculateScore(favorites)
    }
  }, [favorites])

  const calculateScore = async (favorites: any[]) => {
    let totalCount = 0
    let totalScore = 0

    await favorites.map((fav: Item | TapWaterLocation | WaterFilter) => {
      totalScore += fav.score || 0
      totalCount += 1
    })

    const finalScore = Math.round(totalScore / totalCount)
    setOasisScore(finalScore)
  }

  // const handleShare = () => {
  //   if (!navigator.clipboard) {
  //     console.error('Clipboard functionality is not available.')
  //     return
  //   }

  //   const urlToShare = `${process.env.NEXT_PUBLIC_BASE_URL}${userId}`
  //   navigator.clipboard
  //     .writeText(urlToShare)
  //     .then(() => {
  //       toast('Oasis URL copied to clipboard')
  //     })
  //     .catch((err) => {
  //       console.error('Failed to copy URL to clipboard:', err)
  //     })
  // }

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Loader2 size={20} className="animate-spin text-secondary-foreground" />
      </div>
    )
  }

  return (
    <div className="pb-8 w-full px-2">
      <div className="flex flex-col justify-between mb-2">
        <Typography size="3xl" fontWeight="normal" className="mb-4 md:mt-8 mt-2">
          My products
        </Typography>
        <Score score={oasisScore ?? null} size="md" />
      </div>

      {loadingFavorites ? (
        <div className="flex justify-center items-center w-full h-64">
          <Loader2 size={20} className="animate-spin text-secondary-foreground" />
        </div>
      ) : (
        <>
          {favorites && favorites.length > 0 ? (
            <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6">
              {favorites.map((fav: any) => (
                <ItemPreviewCard key={fav.id} item={fav} showFavoriteButton />
              ))}
            </div>
          ) : (
            <div className="flex w-full justify-center flex-col items-center mt-10">
              <Typography size="xl" fontWeight="normal">
                No items in this Oasis
              </Typography>
              {isAuthUser && (
                <>
                  {userData ? (
                    <div className="w-full flex flex-col justify-center items-center">
                      <Typography size="base" fontWeight="normal">
                        Start adding your favorite items to your Oasis
                      </Typography>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          router.push('/')
                        }}
                      >
                        Explore
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <Typography size="base" fontWeight="normal">
                        Sign in and subscribe to start adding items to your Oasis
                      </Typography>
                      <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => {
                          router.push('/auth/signin')
                        }}
                      >
                        Sign in
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
