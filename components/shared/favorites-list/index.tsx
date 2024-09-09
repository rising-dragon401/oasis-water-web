'use client'

import { getUserByUsername, getUserFavorites } from '@/app/actions/user'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import ProfileSkeleton from '@/components/shared/profile-skeleton'
import Score from '@/components/shared/score'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { PLACEHOLDER_IMAGE } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { mutate, default as useSWR } from 'swr'
// import FollowButton from '@/components/shared/follow-button'
import useSessionStorage from '@/lib/hooks/use-session-storage'

export default function FavoritesList({ userName }: { userName: string | null | undefined }) {
  const { uid, userData } = useUserProvider()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [oasisScore, setOasisScore] = useState<number | null>(null)
  const [oasisUser, setOasisUser] = useState<any>(null)
  const [oasisUserId, setOasisUserId] = useState<string | null>(null)
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true)
  const [referralCode, setReferralCode] = useSessionStorage('referralCode', null)

  useEffect(() => {
    if (userName) {
      fetchOasisUser()

      if (userData?.username !== userName && !userData.referred_by) {
        localStorage.setItem('referralCode', userName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, userData])

  const fetchOasisUser = async () => {
    if (!userName) {
      return
    }

    const userData = await getUserByUsername(userName)

    if (userData) {
      setOasisUser(userData)
      setOasisUserId(userData.id)
      setOasisScore(userData.score)
      setIsLoading(false)
      mutate(`userFavorites-${userData.id}`)
    } else {
      setLoadingFavorites(false)
      setIsLoading(false)
    }
  }

  const fetchUserFavorites = async () => {
    if (!oasisUserId) {
      return
    }

    const favorites = await getUserFavorites(oasisUserId)
    setLoadingFavorites(false)
    return favorites
  }

  const { data: favorites } = useSWR(`userFavorites-${oasisUserId}`, fetchUserFavorites)

  const isAuthUser = uid === oasisUserId

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

  if (!userName) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Typography size="xl" fontWeight="normal">
          No user found
        </Typography>
      </div>
    )
  }

  if (userName && isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="pb-8 w-full px-2">
      <div className="flex flex-row justify-between mb-2 md:py-4 py-2 w-full">
        <div className="flex flex-row items-start md:gap-4 gap-2 w-full">
          <Image
            src={oasisUser?.avatar_url || PLACEHOLDER_IMAGE}
            alt="Oasis user avatar"
            width={200}
            height={200}
            className="rounded-full md:w-36 md:h-36 w-20 h-20"
          />
          <div className="flex flex-col justify-start gap-0">
            <Typography size="xl" fontWeight="normal" className="pb-0 mb-0">
              {oasisUser?.full_name || 'Unknown'}
            </Typography>
            <Typography size="base" fontWeight="normal" className="text-secondary mt-0 pt-0">
              @{oasisUser?.username}
            </Typography>

            <Typography size="xs" fontWeight="normal" className="text-primary mt-2">
              {oasisUser?.bio}
            </Typography>
          </div>
        </div>

        <div className="md:w-40 w-36">
          <Score score={oasisScore ?? null} size="md" showScore={true} />
        </div>
      </div>

      <div>
        <Typography size="lg" fontWeight="normal" className="mb-2">
          Products
        </Typography>
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
                  No items in this profile
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
    </div>
  )
}
