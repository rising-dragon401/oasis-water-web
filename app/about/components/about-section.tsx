'use client'

import { motion } from 'framer-motion'
import CTAButton from '@/components/cta-button'
import Typography from '@/components/typography'

const meta = {
  title: 'About Oaisys',
  description: 'We are on a mission to empower people to live cleaner and healthier lives.',
  cardImage:
    'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/twitter_open_graph.png',
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oaisys.com'),
  openGraph: {
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: meta.cardImage,
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: [meta.cardImage],
  },
}

export default function ManifestoSection() {
  return (
    <>
      <motion.div
        className="text-white p-10 min-h-[80vh] flex justify-center items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          The world is sick
        </Typography>
      </motion.div>

      {/* Blurred shape */}
      <div
        className="absolute bottom-0 -mb-20 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
          <defs>
            <linearGradient id="bs2-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
              <stop offset="0%" stopColor="#232c74" />
              <stop offset="100%" stopColor="#232c74" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bs2-a)"
            fillRule="evenodd"
            d="m346 898 461 369-284 58z"
            transform="translate(-346 -898)"
          />
        </svg>
      </div>

      <div className=" text-white p-20 min-h-screen">
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          Our tap water is polluted, bottled water is filled with hidden chemicals and clouded by
          corporate brands that care more about the bottom line than our health. Food is marketed as
          healthy but is filled with chemicals, preservatives and additives that are damaging our
          wellbeing
        </Typography>
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          We have gone away from source.
        </Typography>
        {/* <p className="text-xl">This is a description for section 3.</p> */}

        {/* Blurred shape */}
        <div className="absolute right-0 top-0 blur-2xl" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="342" height="393">
            <defs>
              <linearGradient id="bs-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                <stop offset="0%" stopColor="#232c74" />
                <stop offset="100%" stopColor="#232c74" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs-a)"
              fillRule="evenodd"
              d="m104 .827 461 369-284 58z"
              transform="translate(0 -112.827)"
              opacity=".7"
            />
          </svg>
        </div>
      </div>

      <div className="text-white p-20 min-h-screen">
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          All is not lost. More and more people are becoming aware of what is in their water and
          food. Amazing entrepreneurs are creating new brands built on transparency and quality.
        </Typography>
        {/* <p className="text-xl">This is a description for section 3.</p> */}
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          Our bodies and earth are capable of healing themselves if we give the the right care.
        </Typography>

        {/* Blurred shape */}
        <div
          className="absolute top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
            <defs>
              <linearGradient id="bs3-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                <stop offset="0%" stopColor="#232c74" />
                <stop offset="100%" stopColor="#232c74" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs3-a)"
              fillRule="evenodd"
              d="m410 0 461 369-284 58z"
              transform="matrix(1 0 0 -1 -410 427)"
            />
          </svg>
        </div>
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          We are on a mission to promote transparency in the products we consume and help people
          live cleaner and healthier lives.
        </Typography>

        {/* <p className="text-xl mt-6">The more you use it the better you become</p> */}

        {/* Blurred shape */}
        <div
          className="absolute top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
            <defs>
              <linearGradient id="bs3-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                <stop offset="0%" stopColor="#232c74" />
                <stop offset="100%" stopColor="#232c74" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs3-a)"
              fillRule="evenodd"
              d="m410 0 461 369-284 58z"
              transform="matrix(1 0 0 -1 -410 427)"
            />
          </svg>
        </div>
      </div>

      <div className=" text-white p-20 min-h-[70vh] relative">
        <Typography size="5xl" className="text-primary" fontWeight="normal">
          We are building a platform that will help you discover and learn about the best products
          for your health and the health of our planet. Connecting you to source.
        </Typography>

        {/* Blurred shape */}
        <div
          className="absolute top-0 -mt-24 left-0 -ml-16 blur-2xl opacity-70 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
            <defs>
              <linearGradient id="bs4-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                <stop offset="0%" stopColor="#232c74" />
                <stop offset="100%" stopColor="#232c74" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs4-a)"
              fillRule="evenodd"
              d="m0 0 461 369-284 58z"
              transform="matrix(1 0 0 -1 0 427)"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-center mb-60 ">
        <div className="w-40">
          <CTAButton />
        </div>
      </div>
    </>
  )
}
