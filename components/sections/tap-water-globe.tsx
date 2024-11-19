'use client'

import { TAP_WATER_MARKERS } from '@/lib/locations'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

const TapWaterGlobe = React.memo(({ width, height }: { width: number; height: number }) => {
  const globeRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width, height })
  const [markers, setMarkers] = useState<
    { name: string; score: number; lat: number; lng: number }[]
  >([])

  // Initialize globe controls
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.pointOfView({ lat: 37.0902, lng: -95.7129, altitude: 1.5 }, 0)
    }
  }, [])

  // Memoized globe props
  const globeProps = useMemo(
    () => ({
      globeImageUrl: '//unpkg.com/three-globe/example/img/earth-night.jpg',
      bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      pointsData: markers,
      pointAltitude: 0,
      pointColor: () => '#0d00f3',
      pointLabel: (point: object) => {
        const { name, score } = point as { name: string; score: number }
        return `
          <div class="bg-card text-primary p-2 rounded-lg border border-border px-4">
            <div class="flex flex-row items-end gap-1">
              <p class="text-primary text-xl">${score}</p>
              <p class="text-muted-foreground text-sm">/100</p>
            </div>
            <p>${name}</p>
          </div>
        `
      },
      pointRadius: 0.2,
      width: dimensions.width,
      height: dimensions.height,
    }),

    [markers, dimensions]
  )

  // Lazy-load markers
  useEffect(() => {
    const loadMarkers = async () => {
      setMarkers(TAP_WATER_MARKERS.slice(0, 50)) // Load initial markers
      setTimeout(() => setMarkers(TAP_WATER_MARKERS), 1000) // Load the rest
    }
    loadMarkers()
  }, [])

  return (
    <div className="flex justify-center items-center">
      <Globe ref={globeRef} {...globeProps} />
    </div>
  )
})

TapWaterGlobe.displayName = 'TapWaterGlobe'

export default TapWaterGlobe
