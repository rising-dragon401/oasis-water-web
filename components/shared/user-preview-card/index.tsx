'use client'

import { getUserFavorites } from '@/app/actions/user'
import Typography from '@/components/typography'
import { User } from '@/types/custom'
import Image from 'next/image'
import Link from 'next/link'
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

  return (
    <Link
      href={`/${user.username}`}
      className="flex w-full items-center border-border mt-4 relative bg-card rounded-full hover:shadow-md p-2 pr-4 md:p-3 md:pr-6"
    >
      <div className="relative flex-shrink-0 w-12 h-12 mr-3 md:w-14 md:h-14 md:mr-4">
        <Image
          src={user.avatar_url || ''}
          className="w-full h-full rounded-full object-cover hover:cursor-pointer"
          width={56}
          height={56}
          quality={100}
          blurDataURL={user.avatar_url || ''}
          alt={user.full_name || 'oasis user image'}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <Typography
          size="sm"
          fontWeight="bold"
          className="!no-underline text-primary md:text-base truncate"
        >
          {user.full_name}
        </Typography>
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-secondary md:text-sm"
        >
          {favorites?.length || 0} products
        </Typography>
      </div>
    </Link>
  )
}
