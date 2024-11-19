'use client'

import { H2, P } from '@/components/ui/typography'
import TapWaterGlobe from './tap-water-globe'

export default function TapWaterSection() {
  const isMobile = window.innerWidth <= 768

  const isTablet = window.innerWidth <= 1024

  const isDesktop = window.innerWidth > 1024

  const globeWidth = isMobile ? 300 : isTablet ? 400 : 500
  const globeHeight = isMobile ? 300 : isTablet ? 400 : 500

  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-8 items-center w-full">
        <H2 className="text-center">Hydrate healthy wherever you go</H2>
        <P className="text-center">
          Mapping global water quality to empower your best self no matter the destination
        </P>
      </div>

      <div>
        <TapWaterGlobe width={globeWidth} height={globeHeight} />
      </div>
    </div>
  )
}
