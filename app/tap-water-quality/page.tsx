'use client'

import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import TapWaterGlobe from '@/components/sections/tap-water-globe'
import { H2, Muted, P } from '@/components/ui/typography'

export default function WaterQualityPage() {
  const isMobile = window.innerWidth <= 768

  const isTablet = window.innerWidth <= 1024

  const isDesktop = window.innerWidth > 1024

  const globeWidth = isMobile ? 300 : isTablet ? 400 : 500
  const globeHeight = isMobile ? 300 : isTablet ? 400 : 500

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full max-w-lg mx-auto mb-8 py-14 items-center px-8">
        <div className="flex flex-col justify-center items-center mb-8 w-full">
          <H2>Tap water quality</H2>
          <P className="text-center">Check for the contaminants in your tap water</P>

          <div className="flex flex-row mt-4 w-full">
            <BasicSearch
              showSearch={true}
              size="medium"
              indices={['tap_water_locations']}
              placeholder="Search locations"
            />
          </div>
        </div>

        <div className="flex flex-col p-10 gap-4">
          <TapWaterGlobe width={globeWidth} height={globeHeight} />
          <Muted className="text-center">Major US cities only, international coming soon</Muted>
        </div>
      </div>
    </SubpageLayout>
  )
}
