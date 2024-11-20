'use client'

import DownloadAppButton from '@/components/shared/download-app-button'
import { H2, P } from '@/components/ui/typography'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const TapWaterGlobe = dynamic(() => import('./tap-water-globe'), {
  ssr: false,
  loading: () => <div>Loading globe...</div>,
})

export default function TapWaterSection() {
  const [globeDimensions, setGlobeDimensions] = useState({ width: 500, height: 500 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(typeof window !== 'undefined')

    if (isClient) {
      const updateDimensions = () => {
        const isMobile = window.innerWidth <= 768
        const isTablet = window.innerWidth <= 1024

        const width = isMobile ? 300 : isTablet ? 400 : 500
        const height = isMobile ? 300 : isTablet ? 400 : 500

        setGlobeDimensions({ width, height })
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)

      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [isClient])

  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-8 items-center w-full">
        <H2 className="text-center">Hydrate healthy anywhere</H2>
        <P className="text-center">Locate the healthiest waters wherever you go - coming soon.</P>
      </div>
      {isClient && <TapWaterGlobe width={globeDimensions.width} height={globeDimensions.height} />}
      <div className="flex flex-row justify-center w-full mt-4">
        <DownloadAppButton variant="outline" showIcon overrideText="Check your water" />
      </div>
    </div>
  )
}
