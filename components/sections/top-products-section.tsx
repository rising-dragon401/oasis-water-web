'use client'

import { H2, Muted, P } from '@/components/ui/typography'
import { CATEGORIES } from '@/lib/constants/categories'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function TopProductsSection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-4 items-start w-full">
        <H2 className="text-left">The Best Products for Your Health</H2>
        <P>Access real-time lab data to find the healthiest products for you</P>
      </div>

      <div className="grid grid-cols-2">
        {CATEGORIES.map((category, index) => {
          const linkContent = (
            <div
              className={`flex flex-row items-center gap-4 md:py-8 py-4 w-full md:pl-4 pl-2 border-b border-border relative ${
                index % 2 === 0 ? 'md:border-r' : ''
              }`}
              onMouseEnter={() => {
                setHoveredCategory(category.id)
              }}
            >
              <div className="w-14 h-14 overflow-hidden">
                <Image src={category.image} alt={category.title} width={100} height={100} />
              </div>

              <div className="flex flex-col flex-grow">
                <P className="text-xl ">{category.title}</P>
                {category.isComingSoon && <Muted>Coming soon</Muted>}
                {/* <Muted>{category.description}</Muted> */}
              </div>

              {hoveredCategory === category.id && (
                <ArrowRight className="w-4 h-4 text-background absolute bottom-4 right-4" />
              )}
            </div>
          )

          return category.isComingSoon ? (
            <div key={category.id}>{linkContent}</div>
          ) : (
            <Link key={category.id} href={`/top-rated/${category.id}`}>
              {linkContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
