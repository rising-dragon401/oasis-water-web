'use client'

import { getUserFavorites } from '@/app/actions/user'
import Typography from '@/components/typography'
import { User } from '@/types/custom'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import useSWR from 'swr'

type Props = {
  user: User
}

export default function UserPreviewCard({ user }: Props) {
  const fetchUserFavorites = async () => {
    if (!user.id) {
      return
    }

    const favorites = await getUserFavorites(user.id)
    return favorites
  }

  const { data: favorites } = useSWR(`userFavorites-${user.id}`, fetchUserFavorites)

  const userScore = useMemo(async () => {
    let totalCount = 0
    let totalScore = 0

    await favorites?.map((fav: any) => {
      totalScore += fav.score || 0
      totalCount += 1
    })

    const finalScore = Math.round(totalScore / totalCount)
    return finalScore
  }, [favorites])

  const renderScore = () => {
    const score = user?.score || 0

    // const color = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'
    const color = 'text-blue-800'

    return (
      <div>
        <Typography size="2xl" fontWeight="normal" className={`!no-underline ${color} text-right`}>
          {score}
        </Typography>
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-secondary text-right"
        >
          /100
        </Typography>
      </div>
    )
  }

  return (
    <Link href={`/oasis/${user.id}`} className="flex flex-col hover:opacity-80 mt-4 relative">
      <div className="relative md:w-56 md:h-56 w-40 h-40">
        {/* Make this div relative */}
        <Image
          src={user.avatar_url || ''}
          className="w-full h-full rounded-full object-cover hover:cursor-pointer"
          width={300}
          height={300}
          quality={100}
          blurDataURL={user.avatar_url || ''}
          alt={user.full_name || 'oasis user image'}
        />
      </div>
      <div className="flex flex-row justify-between pt-1 md:gap-2 items-start md:w-56 w-40">
        <div className="flex flex-col">
          <Typography
            size="base"
            fontWeight="bold"
            className="!no-underline text-primary md:overflow-hidden md:max-w-56 flex-wrap md:max-h-14 max-h-24 md:whitespace-nowrap overflow-ellipsis"
          >
            {user.full_name}
          </Typography>
        </div>
        {/* Position renderScore relative to the image */}
        {user.score && <div>{renderScore()}</div>}
      </div>
    </Link>
  )
}
