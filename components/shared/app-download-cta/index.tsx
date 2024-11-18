import Image from 'next/image'

import AppleButton from '@/components/shared/apple-button'
import GooglePlayButton from '@/components/shared/google-play-button'

import { H2, P } from '@/components/ui/typography'
const appPreviewImage =
  'https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/landing-graphic-dark.png?t=2024-11-18T18%3A13%3A09.535Z'

export default function AppDownloadCta({
  title = 'Get the Oasis app for the full picture',
}: {
  title?: string
}) {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-y-4 p-4 rounded-2xl pt-8 ob-0 bg-primary">
      <H2 className="text-center text-background">{title}</H2>

      <P className="text-secondary-foreground text-center">
        View scores and ratings, scan your water and get notified when lab results change.
      </P>

      <div className="flex flex-row gap-4 w-full max-w-lg">
        <GooglePlayButton />
        <AppleButton />
      </div>

      <div className="flex justify-center">
        <Image src={appPreviewImage} alt="app store" width={300} height={400} objectFit="contain" />
      </div>
    </div>
  )
}
