'use client'

import { fetchTestedThings } from '@/app/actions/labs'
import { H1 } from '@/components/ui/typography'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function RecentlyTestedRow() {
  const [testedThings, setTestedThings] = useState<any[]>([])
  const controls = useAnimation()

  useEffect(() => {
    // Fetch tested items data
    const fetchData = async () => {
      const data = await fetchTestedThings({
        tables: ['items', 'water_filters', 'tap_water_locations'],
        limit: 20,
      })
      setTestedThings(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (testedThings.length > 0) {
      const contentWidth = testedThings.length * 288

      // Start the infinite scrolling animation
      controls.start({
        x: [-contentWidth, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 120,
            ease: 'linear',
          },
        },
      })
    }
  }, [controls, testedThings])

  return (
    <div className="max-w-4xl mx-auto  overflow-hidden">
      <H1 className="text-center mb-4">Recently Tested</H1>
      <p className="text-center text-gray-600 mb-12 text-xl">
        Earning and sharing with Oasis is simple, follow the steps below to kickstart your affiliate
        income.
      </p>

      <motion.div className="flex whitespace-nowrap" animate={controls}>
        {[...testedThings, ...testedThings].map((item, index) => (
          <div key={index} className="inline-block p-4 shadow-lg mr-14 w-96 h-48 rounded-lg">
            <div className="flex flex-col items-center justify-center rounded-lg p-4">
              <Image src={item.image} alt={item.name} width={100} height={100} />
            </div>
            <div className="text-center mt-2 max-w-30 flex-wrap">{item.name}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
