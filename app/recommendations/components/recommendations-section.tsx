'use client'

import { motion } from 'framer-motion'
import Typography from '@/components/typography'
import { RECOMMENDATIONS } from '../constants'
import Image from 'next/image'

export default function RecommendationsSection() {
  return (
    <>
      <div className="flex flex-col justify-center items-center py-24 gap-4 mx-w-lg">
        <Typography size="5xl" className="text-primary text-center" fontWeight="normal">
          Our recommended bottled water brands
        </Typography>
        <Typography
          size="base"
          className="text-primaryMuted text-center max-w-xl"
          fontWeight="normal"
        >
          Not all water is created equal. We suggest choosing these brands for their pure
          ingredients, absence of detrimental chemicals, and overall benefits to human health.
        </Typography>
      </div>

      <div className="flex justify-center mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 space-y-4">
          {RECOMMENDATIONS.map((recommendation, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col justify-center items-center"
            >
              <Image
                src={recommendation.image}
                className="w-72 h-72 rounded-md object-cover hover:cursor-pointer"
                width={300}
                height={300}
                alt={recommendation.name}
              />
              <Typography size="2xl" fontWeight="normal" className="mt-10 text-center">
                {recommendation.name}
              </Typography>
              <Typography size="lg" fontWeight="normal" className="mt-2 text-center max-w-sm">
                {recommendation.description}
              </Typography>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
