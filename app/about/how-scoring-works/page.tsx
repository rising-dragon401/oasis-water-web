'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function HowScoringWorksPage() {
  return (
    <div className="min-h-screen  p-4 md:p-10">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How Scoring Works</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Formula behind how Oasis scores water, filters, and tap water
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full mx-auto"
        >
          <Image
            src="https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/blog/how_we_score_water/Red%20center%20circles.jpg"
            alt="Scoring system illustration"
            width={800}
            height={400}
            className="rounded-xl mx-auto"
          />
        </motion.div>
      </section>

      {/* Table of Contents */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Table of Contents</h2>
        <ul className="text-lg text-gray-600 space-y-3">
          <li>
            <Link href="#overview" className="hover:underline">
              Overview
            </Link>
          </li>
          <li>
            <Link href="#scoring-bottled-water" className="hover:underline">
              How we score bottled water
            </Link>
          </li>
          <li>
            <Link href="#scoring-filters" className="hover:underline">
              How we score filters
            </Link>
          </li>
          <li>
            <Link href="#scoring-tap-water" className="hover:underline">
              How we score tap water
            </Link>
          </li>
          <li>
            <Link href="#scoring-flavored-water" className="hover:underline">
              How we score flavored water and energy drinks
            </Link>
          </li>
        </ul>
      </section>

      {/* Overview Section */}
      <section id="overview" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Overview</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          We all need water, but not all water is the same. Whether it&apos;s bottled, straight from
          the tap, or filtered, understanding the cleanliness and health of water is vital for
          taking care of our health and supporting longevity.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Every water has its own unique characteristics and we&apos;ve created a scoring system to
          help you understand the quality of the water you drink. Please note our scoring system is
          subject to change in light of new scientific evidence and research.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          We choose to open-source our scoring system to allow for transparency and to encourage
          feedback and improvement.
        </p>
      </section>

      {/* How We Score Bottled Water */}
      <section id="scoring-bottled-water" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How we score bottled water</h2>
        <Image
          src="https://connect.live-oasis.com/storage/v1/object/public/website/images/about/how-scoring-works/bottled-water.jpeg?t=2024-10-17T17%3A55%3A15.557Z"
          alt="Bottled water scoring"
          width={800}
          height={600}
          className="rounded-lg h-96 w-full mx-auto mb-6 object-cover"
        />

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Everything is scored out of 100, and we penalize each item depending on a few factors:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Source</li>
          <li>Contaminant amount and levels</li>
          <li>PFAS</li>
          <li>Packaging/material</li>
          <li>Filtration method</li>
          <li>PH</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Source</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The source of water is the first thing we consider when scoring water. Not all water is
          the same and it starts with the source. A large portion of bottled water comes straight
          from municipal water supplies and undergoes intense treatment to remove the countless
          toxins inside. This treatment strips water of its natural minerals, making it harder for
          the body to digest and often adds disinfectant by-products to the water.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Other sources of water include natural springs, aquifers, icebergs, deep wells, and other
          natural sources. Ideally, the water doesn&apos;t need to be filtered much and comes from a
          natural source which includes healthy minerals.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <strong>Penalties:</strong>
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Municipal water supply: 20</li>
          <li>Rain: 10</li>
          <li>Unknown (not stated in report): 20</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contaminant amount and levels</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          It&apos;s hard to find water on Earth anymore without some level of contamination.
          However, we set a high standard and believe water can only be 100/100 if it has no harmful
          contaminants. We penalize water for the number of unique contaminants and the levels of
          each substance (based on the legal limit or health guideline).
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <strong>Penalties:</strong>
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Contaminant severity score (1-5) * amount over health guideline</li>
          <li>Max penalty per contaminant: 40</li>
          <li>No lab report: 25</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Packaging</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The container a water is stored in greatly impacts its quality as contaminants can leech
          into the water from packaging..
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <strong>Penalties:</strong>
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Plastic: 20</li>
          <li>Can: 15</li>
          <li>Aluminum: 15</li>
          <li>Cardboard: 12</li>
          <li>Glass: 0</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">PFAS</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          PFAS (perfluoroalkyl and polyfluoroalkyl substances) are a class of chemicals that are
          very common in water sources across the United States and are highly toxic. No amounts of
          PFAS are recommended for consumption. This is an added penalty in addition to the one it
          receives in the contaminant scoring.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <strong>Penalties:</strong>
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Postive PFAS: 10</li>
          <li>Untested for PFAS: 10</li>
          <li>Non-detect: 0</li>
        </ul>

        {/* Add more details for PFAS, Packaging, Filtration, and PH as per your MDX content */}
      </section>

      {/* How We Score Filters */}
      <section id="scoring-filters" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How we score filters</h2>
        <Image
          src="https://connect.live-oasis.com/storage/v1/object/public/website/images/about/how-scoring-works/water%20filter.jpeg?t=2024-10-17T17%3A54%3A10.098Z"
          alt="Water filter scoring"
          width={800}
          height={600}
          className="rounded-lg h-96 w-full mx-auto mb-6 object-cover"
        />
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          As Earth&apos;s water becomes more and more polluted, the need for water filters has
          increased. There are many different types of filters, and often it isn&apos;t clear which
          filter is best. We analyze the testing report of the filter to determine the percentage of
          each contaminant category removed.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Contaminant categories commonly found in water:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Chemical disinfectants (i.e. chlorine, bromine, etc.)</li>
          <li>Fluoride</li>
          <li>Haloacetic Acids</li>
          <li>Heavy Metals</li>
          <li>Microplastics</li>
          <li>PFAS</li>
          <li>Pesticides</li>
          <li>Pharmaceuticals</li>
          <li>Phthalates</li>
          <li>Radiological Elements</li>
          <li>Volatile Organic Compounds (VOCs)</li>
          <li>Microbiological elements</li>
        </ul>
        1050/1200
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The overall filter score is calculated by the percentage of each contaminant category
          removed divided by all contamiant categorie removed. For example if a filter removes 20%
          of Haloacetic Acids and 30% of Microplastics and 100% of all other categories it will
          receive a score of 87.5%
        </p>
      </section>

      {/* How We Score Tap Water */}
      <section id="scoring-tap-water" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How we score tap water</h2>
        <Image
          src="https://connect.live-oasis.com/storage/v1/object/public/website/images/about/how-scoring-works/tap-water.jpeg?t=2024-10-17T17%3A52%3A27.027Z"
          alt="Tap water scoring"
          width={800}
          height={600}
          className="rounded-lg h-96 w-full mx-auto mb-6 object-cover"
        />

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Tap water is popularly known as a commodity that is safe to drink and available to
          everyone. However, the quality of tap water can vary greatly depending on where you live,
          and it has become increasingly polluted. When analyzing tap water, we consider the
          following factors:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Unique contaminants</li>
          <li>
            Levels of each substance (contaminant severity score * amount over health guideline)
          </li>
        </ul>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Important Note: Because tap water does not come in a container, nor is it tested for
          microplastics / PFAS ever it is not rated on the same scale as bottled water. For example
          if a city&apos;s water is rated at 30 and a bottled water is rated at 25 this DOES NOT
          necessarily mean the tap water is better. Majority of the time bottled water is far better
          than any tap water source.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6"></p>
      </section>
    </div>
  )
}
