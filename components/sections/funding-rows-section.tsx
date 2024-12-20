'use client'

import { fetchUntestedThings } from '@/app/actions/labs'
import ItemFundingRow from '@/components/shared/item-funding-row'
import { Skeleton } from '@/components/ui/skeleton'
import { H2, P } from '@/components/ui/typography'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AllProductsPage() {
  const [untestedItems, setUntestedItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUntestedItems = async () => {
      const untestedItems = await fetchUntestedThings({ tables: ['items'], limit: 5 })

      const sortedUntestedItems = untestedItems.sort((a, b) => b.raised_amount - a.raised_amount)

      setUntestedItems(sortedUntestedItems)
      setIsLoading(false)
    }

    fetchUntestedItems()
  }, [])

  return (
    <div className="md:max-w-4xl max-w-2xl mx-auto p-8">
      <div className="flex flex-col gap-2 mb-8 items-center">
        <H2 className="text-center">Independent product testing</H2>
        <P className="text-center">
          Support unbiased information and help us share accurate, science-backed ratings
        </P>
      </div>

      <div className="flex flex-col gap-4 w-full mt-6">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-lg" />
            ))}
          </>
        ) : (
          untestedItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ItemFundingRow
                item={item}
                raisedAmount={item.raised_amount}
                totalCost={item.total_cost}
                contributions={item.user_contributions}
                showFundButton={false}
                linkToProduct={true}
                showFundProgress={true}
                titleClassName="md:text-lg sm:text-sm"
              />
            </motion.div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/product-testing" className="underline">
          View all product lab testing
        </Link>
      </div>
    </div>
  )
}
