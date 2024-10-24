'use client'

import { getUserByUsername, getUserFavorites } from '@/app/actions/user'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import ProfileSkeleton from '@/components/shared/profile-skeleton'
import Score from '@/components/shared/score'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Large } from '@/components/ui/typography'
import { PLACEHOLDER_IMAGE } from '@/lib/constants/images'
import useDevice from '@/lib/hooks/use-device'
import { useUserProvider } from '@/providers/UserProvider'
import { Instagram, Loader2, Twitter, Youtube } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TbBrandTiktok } from 'react-icons/tb'
import { mutate, default as useSWR } from 'swr'
// import FollowButton from '@/components/shared/follow-button'
import { toast } from 'sonner'

const WATER_TYPES = ['bottled_water', 'water_gallon']

const FILTER_TYPES = ['filter', 'shower_filter', 'bottle_filter']

export default function FavoritesList({ userName }: { userName: string | null | undefined }) {
  const { uid, userData } = useUserProvider()
  const router = useRouter()
  const { isMobile } = useDevice()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [oasisScore, setOasisScore] = useState<number | null>(null)
  const [oasisUser, setOasisUser] = useState<any>(null)
  const [oasisUserId, setOasisUserId] = useState<string | null>(null)
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true)

  useEffect(() => {
    if (userName) {
      fetchOasisUser()

      if (userData?.username !== userName && !userData?.referred_by) {
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

  const handleShare = () => {
    if (!navigator.clipboard) {
      console.error('Clipboard functionality is not available.')
      return
    }

    const urlToShare = `${process.env.NEXT_PUBLIC_BASE_URL}/${userName}`
    navigator.clipboard
      .writeText(urlToShare)
      .then(() => {
        toast('Oasis URL copied to clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy URL to clipboard:', err)
      })
  }

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
    <div className="w-full px-2 ">
      <div className="flex flex-row justify-between mb-2 w-full">
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
            <div className="flex flex-row gap-2 mt-1">
              {oasisUser?.socials?.instagram && (
                <a href={oasisUser.socials.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="text-primary w-5 h-5y" />
                </a>
              )}
              {oasisUser?.socials?.youtube && (
                <a href={oasisUser.socials.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="text-primary w-5 h-5" />
                </a>
              )}
              {oasisUser?.socials?.twitter && (
                <a href={oasisUser.socials.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="text-primary w-5 h-5" />
                </a>
              )}
              {oasisUser?.socials?.tiktok && (
                <a href={oasisUser.socials.tiktok} target="_blank" rel="noopener noreferrer">
                  <TbBrandTiktok className="text-primary w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-40 w-36 h-16">
          <Score score={oasisScore ?? null} size={isMobile ? 'sm' : 'md'} showScore={true} />
        </div>

        {/* <Button variant="ghost" className="mt-4" onClick={handleShare}>
          <Share className="w-6 h-6" />
        </Button> */}
      </div>

      <div className="mt-4">
        <Large className="mt-4 mb-2">Products</Large>

        {loadingFavorites ? (
          <div className="flex justify-center items-center w-full h-64">
            <Loader2 size={20} className="animate-spin text-secondary-foreground" />
          </div>
        ) : (
          <>
            {favorites && favorites.length > 0 ? (
              <div className="">
                <Tabs defaultValue="water" className="">
                  <TabsList className="gap-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="water">Water</TabsTrigger>
                    <TabsTrigger value="filters">Filters</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="grid md:grid-cols-3 grid-cols-2 w-full gap-6">
                    {favorites.map((fav: any) => (
                      <ItemPreviewCard
                        key={fav.id}
                        item={fav}
                        showFavoriteButton
                        isAuthUser={isAuthUser}
                      />
                    ))}
                  </TabsContent>
                  <TabsContent
                    value="water"
                    className="grid md:grid-cols-3 grid-cols-2 w-full gap-6"
                  >
                    {favorites
                      .filter((fav: any) => fav.type === 'water')
                      .map((fav: any) => (
                        <ItemPreviewCard
                          key={fav.id}
                          item={fav}
                          showFavoriteButton
                          isAuthUser={isAuthUser}
                        />
                      ))}
                  </TabsContent>
                  <TabsContent
                    value="filters"
                    className="grid md:grid-cols-3 grid-cols-2 w-full gap-6"
                  >
                    {favorites
                      .filter((fav: any) => FILTER_TYPES.includes(fav.type))
                      .map((fav: any) => (
                        <ItemPreviewCard
                          key={fav.id}
                          item={fav}
                          showFavoriteButton
                          isAuthUser={isAuthUser}
                        />
                      ))}
                  </TabsContent>
                </Tabs>
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

      {/* {!isAuthUser && (
        <div className="flex justify-center items-center w-full mt-10">
          <Link href="https://www.oasiswater.app/affiliates" className="">
            <Button variant="secondary" className="rounded-full  !shadow-md">
              Save what you drink to see your score and earn {` `}💸
            </Button>
          </Link>
        </div>
      )} */}
    </div>
  )
}
