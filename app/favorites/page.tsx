'use client'

import SubpageLayout from '@/components/home-layout'
import FavoriteList from '@/components/shared/favorites-list'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { useUserProvider } from '@/providers/UserProvider'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function FavoritesPage() {
  const { uid } = useUserProvider()
  const router = useRouter()

  return (
    <SubpageLayout>
      {uid ? (
        <div className="py-4">
          <FavoriteList userId={uid || ''} />
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center my-4 px-4 mb-14 gap-y-4">
          <Image
            src="https://connect.live-oasis.com/storage/v1/object/public/website/images/Popsicle%20Island%20transparent.png"
            alt="Island transparent"
            width={200}
            height={200}
          />
          <Typography size="xl" fontWeight="normal">
            Login to start saving your favorites
          </Typography>
          <Button variant="outline" onClick={() => router.push('/auth/signin')}>
            Login / Sign Up
          </Button>
        </div>
      )}
    </SubpageLayout>
  )
}
