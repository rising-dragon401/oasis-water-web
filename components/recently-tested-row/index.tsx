'use client'

import { fetchTestedPreview } from '@/app/actions/labs'
import { Skeleton } from '@/components/ui/skeleton'
import { P } from '@/components/ui/typography'
import { determineLink } from '@/utils/helpers'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RecentlyTestedRow() {
  const [isLoading, setIsLoading] = useState(true)
  const [testedThings, setTestedThings] = useState<any[]>([])
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Fetch tested items data
    const fetchData = async () => {
      const data = await fetchTestedPreview({ limit: 10 })
      setTestedThings(data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (testedThings.length > 0 && !isHovered) {
      const contentWidth = testedThings.length * 288

      // Start the infinite scrolling animation
      controls.start({
        x: [-contentWidth, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 100,
            ease: 'linear',
          },
        },
      })
    } else if (isHovered) {
      controls.stop()
    }
  }, [controls, testedThings, isHovered])

  return (
    <div className="flex flex-col  max-w-[90vw] mx-auto overflow-hidden">
      <P className="text-center mb-4 text-muted-foreground">Recently Tested</P>

      {isLoading ? (
        <div className="flex justify-center flex-row gap-4 items-center h-20 max-w-4xl">
          <Skeleton className="w-96 h-20 rounded-lg" />
          <Skeleton className="w-96 h-20 rounded-lg" />
          <Skeleton className="w-96 h-20 rounded-lg" />
        </div>
      ) : (
        <motion.div className="flex" animate={controls}>
          {[...testedThings, ...testedThings].map((item, index) => (
            <Link
              href={determineLink(item)}
              key={index}
              className="flex flex-row items-start justify-center p-2 pr-6 shadow-lg mr-6 w-full h-20 rounded-lg bg-card border-border border"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="w-14 h-14 overflow-hidden rounded-xs">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
              <div
                className={`ml-4 text-left flex flex-col justify-center gap-1 py-1 ${
                  item.name.length > 28 ? '' : ''
                }`}
              >
                <P
                  className={`break-words text-xs font-bold w-40 h-8  ${
                    item.name.length > 28 ? 'h-10' : 'h-10'
                  }`}
                >
                  {item.name}
                </P>
                {/* {item.type === 'filter' && (
                <P className="text-xs text-muted-foreground">
                  {15 - item.filtered_contaminant_categories.length} categories not filtered
                </P>
              )} */}

                {item.type === 'bottled_water' && (
                  <div className="flex flex-row gap-2 items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.cont_count > 0 ? 'bg-danger' : 'bg-neutral'
                      }`}
                    />
                    <P className="text-xs text-muted-foreground">{item?.cont_count} contaminants</P>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  )
}
