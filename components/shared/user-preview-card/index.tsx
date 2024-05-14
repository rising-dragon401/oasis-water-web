'use client'

import PaywallContent from '@/components/shared/paywall-content'
import Typography from '@/components/typography'
import { User } from '@/types/custom'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  user: User
}

export default function UserPreviewCard({ user }: Props) {
  const renderScore = () => {
    const score = user?.score || 0

    // const color = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'
    const color = 'text-blue-800'

    return (
      <div>
        <PaywallContent label="Unlock score" hideButton={true}>
          <Typography
            size="2xl"
            fontWeight="normal"
            className={`!no-underline ${color} text-right`}
          >
            {score}
          </Typography>
        </PaywallContent>
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
        {/* Position the warning symbol relative to the image */}
        {!user.score && (
          <div>
            <Typography size="xl" fontWeight="normal" className="text-red-500">
              ⚠️
            </Typography>
          </div>
        )}
      </div>
    </Link>
  )
}
