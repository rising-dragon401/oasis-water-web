'use client'

import { getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Score from '@/components/shared/score'
import SubscribeButton from '@/components/shared/subscribe-button'
import Typography from '@/components/typography'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PROFILE_AVATAR } from '@/lib/constants/images'
import useSubscription from '@/lib/hooks/use-subscription'
import { useUserProvider } from '@/providers/UserProvider'
import { Loader2, Share } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { mutate, default as useSWR } from 'swr'

export default function FavoritesList({ userId }: { userId: string }) {
  const { uid, userData, loadingUser } = useUserProvider()
  const { subscription } = useSubscription()
  const router = useRouter()

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

  const handleShare = () => {
    if (!navigator.clipboard) {
      console.error('Clipboard functionality is not available.')
      return
    }

    const urlToShare = `${process.env.NEXT_PUBLIC_BASE_URL}oasis/${userId}`
    navigator.clipboard
      .writeText(urlToShare)
      .then(() => {
        toast('Oasis URL copied to clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy URL to clipboard:', err)
      })
  }

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Loader2 size={20} className="animate-spin text-secondary-foreground" />
      </div>
    )
  }

  return (
    <div className="pb-8 w-full px-2">
      <div className="py-4 gap-4 flex w-full flex-row justify-between items-start">
        <div className="flex flex-col gap-2 w-full">
          <Avatar className="h-24 w-24">
            <AvatarImage src={oasisUser?.avatar_url || PROFILE_AVATAR} alt="oasis pfp" />
          </Avatar>

          <div className="flex flex-col gap-1 justify-start">
            <Typography size="xl" fontWeight="normal">
              {`${oasisUser?.full_name || oasisUser?.email || 'User'}'s Oasis`}
            </Typography>
            {isAuthUser && <Link href="/account">Edit</Link>}
          </div>
        </div>

        <div className="flex flex-row gap-1 max-h-24">
          <Score score={userData?.score || 0} size="md" showScore={true} />
          <Button variant="ghost" onClick={handleShare}>
            <Share className="w-6 h-6" />
          </Button>
        </div>
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
                User has not added anything to their Oasis yet
              </Typography>
              {isAuthUser && (
                <>
                  {userData ? (
                    <div>
                      {subscription ? (
                        <div>
                          <Typography size="base" fontWeight="normal">
                            Start adding your favorite items to your Oasis
                          </Typography>
                          <Button
                            variant="secondary"
                            className="mt-4"
                            onClick={() => {
                              router.push('/')
                            }}
                          >
                            Explore
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Typography
                            size="base"
                            fontWeight="normal"
                            className="text-secondar text-center"
                          >
                            Subscribe to start adding your favorite items to your Oasis
                          </Typography>
                          <div className="mt-4">
                            <SubscribeButton />
                          </div>
                        </div>
                      )}
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
