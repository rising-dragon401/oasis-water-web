'use client'

import { getCurrentUserData, getUserFavorites } from '@/app/actions/user'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Score from '@/components/shared/score'
import Typography from '@/components/typography'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { PROFILE_AVATAR } from '@/lib/constants/images'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { useEffect, useState } from 'react'
import { default as useSWR } from 'swr'

export default function FavoritesList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [oasisScore, setOasisScore] = useState<number | null>(null)

  const fetchUserFavorites = async () => {
    const favorites = await getUserFavorites(userId)
    return favorites
  }

  const { data: favorites } = useSWR('userFavorites', fetchUserFavorites)

  // calculate oasis score
  useEffect(() => {
    if (favorites) {
      calculateScore(favorites)
    }
  }, [favorites])

  // load user favorites
  useEffect(() => {
    if (userId) {
      fetchThisUserData(userId)
    }
  }, [userId])

  const fetchThisUserData = async (userId: string) => {
    const userData = await getCurrentUserData(userId)
    setUserData(userData)
    setLoading(false)
  }

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

  return (
    <div className="pb-8">
      {!loading && (
        <div className="py-4 gap-4 flex w-full flex-row justify-between items-start">
          <div className="flex flex-col gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} alt="oasis pfp" />
            </Avatar>

            <Typography size="2xl" fontWeight="normal">
              {`${userData?.full_name || userData?.email || 'User'}'s Oasis`}
            </Typography>
          </div>

          <div className="max-h-24">
            <Score score={oasisScore || 0} size="md" />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6">
        {favorites &&
          favorites.map((fav: any) => (
            <ItemPreviewCard key={fav.id} item={fav} showFavoriteButton />
          ))}
      </div>
    </div>
  )
}
