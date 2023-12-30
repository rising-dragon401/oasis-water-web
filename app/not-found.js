// 'use client'

import SubpageLayout from '@/components/home-layout'
import Image from 'next/image'
import Typography from '@/components/typography'
import GoBackButton from '@/components/go-back-button'

export default function NotFound() {
  return (
    <SubpageLayout>
      <div className="flex justify-center w-full h-full flex-col items-center gap-2">
        <Typography size="2xl" fontWeight="bold" className="mt-14">
          {`Oops looks like you're lost`}
        </Typography>

        <GoBackButton />

        <Image
          src="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/404/popsicle-island.png"
          alt="404 - Not Found"
          className="rounded-md mt-10"
          width={400}
          height={400}
        />
        {/* <Link href="/">Return Home</Link> */}
      </div>
    </SubpageLayout>
  )
}
