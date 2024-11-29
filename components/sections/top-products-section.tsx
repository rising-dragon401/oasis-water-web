'use client'

import { H2, Muted, P } from '@/components/ui/typography'
import { CATEGORIES } from '@/lib/constants/categories'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export default function TopProductsSection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-4 items-start w-full">
        <H2 className="text-left">Discover the top rated products</H2>
        <P>Access real-time lab data to find the healthiest products for you across categories</P>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
        {CATEGORIES.map((category) => {
          const linkContent = (
            <div
              className="flex flex-col items-center gap-2 py-4 w-full rounded-lg hover:shadow-md border border-muted bg-card cursor-pointer"
              onMouseEnter={() => {
                setHoveredCategory(category.id)
              }}
            >
              <div className="md:w-32 md:h-32 w-20 h-20 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col items-center">
                <P className="md:text-xl text-sm">{category.title}</P>
                {category.isComingSoon && <Muted>Coming soon</Muted>}
              </div>
            </div>
          )

          return category.isComingSoon ? (
            <div key={category.id} onClick={() => toast('Very soon!')}>
              {linkContent}
            </div>
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
