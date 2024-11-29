'use client'

import DownloadAppButton from '@/components/shared/download-app-button'
import { H2 } from '@/components/ui/typography'
import useDevice from '@/lib/hooks/use-device'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const oasisMap = `https://connect.live-oasis.com/storage/v1/object/public/website/landing/oasis_map.jpg`
const oasisMapMobile = `https://connect.live-oasis.com/storage/v1/object/public/website/landing/oasis_map_mobile.jpg?t=2024-11-23T06%3A28%3A27.453Z`

export default function TapWaterSection() {
  const [mapImage, setMapImage] = useState(oasisMap)
  const { isMobile } = useDevice()

  useEffect(() => {
    setMapImage(isMobile ? oasisMapMobile : oasisMap)
  }, [isMobile])

  return (
    <div className="flex flex-col w-full p-0 mx-auto">
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={mapImage}
          alt="Oasis world map"
          width={1000}
          height={1000}
          className={`md:h-[80%] h-full w-full ${isMobile ? 'mt-4' : ''}`}
        />
        <div className="absolute inset-x-0 md:top-16 top-0 flex flex-col items-center justify-start">
          <H2 className="text-center md:text-4xl text-3xl md:max-w-none max-w-sm">
            Prioritize your health, everywhere.
          </H2>
          <div className="mt-4">
            <DownloadAppButton variant="outline" showIcon overrideText="Check your water" />
          </div>
        </div>
      </div>
    </div>
  )
}
