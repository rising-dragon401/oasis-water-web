import { Button } from '@/components/ui/button'
import Typography from '@/components/typography'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function CTASection() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl sm:px-6 py-10">
        <div className="relative isolate overflow-hidden border-secondary border py-24 text-center rounded-3xl px-8">
          <Typography size="4xl" fontWeight="bold">
            Making conscious consumption effortless
          </Typography>
          <Typography size="base" fontWeight="normal" className="text-secondary mt-6">
            Only water products rated over 70 are available for purchase, ensuring your choices are
            not just healthy, but informed. No guesswork, just good decisions.
          </Typography>
          <Typography size="base" fontWeight="normal" className="text-secondary mt-6">
            At Oasis, we’re dedicated to simplifying the journey towards conscious consumption. We
            believe everyone deserves to know exactly what they’re putting into their bodies,
            effortlessly. In a world where water labels and food packaging may not disclose
            contaminants like nitrates, we step in to remove the guesswork. Our mission is to
            centralize all necessary data, making it easy for individuals to make informed choices
            about their drinking water and beyond. We strive for transparency, empowering our
            community and team with the knowledge needed for a healthier, more conscious lifestyle.
            Together, we’re not just making choices; we’re making a difference.
          </Typography>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signin" className={`w-48 ${buttonVariants()}`}>
              Create my oasis
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#232c74" />
                <stop offset={1} stopColor="#7591b8" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
