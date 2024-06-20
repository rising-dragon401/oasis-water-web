import Typography from '@/components/typography'
import Image from 'next/image'
import Link from 'next/link'
import { getRecommendedItems } from '@/app/actions/items'

export default async function RecommendationsSection() {
  const recommended = await getRecommendedItems()

  const ranked = recommended.sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center py-24 gap-4 mx-w-lg">
        <Typography size="5xl" className="text-primary text-center max-w-md" fontWeight="normal">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
          {ranked &&
            ranked.map((recommendation, index) => (
              // @ts-ignore
              <Link href={`item/${recommendation.id}`} passHref legacyBehavior key={index}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform transition-transform duration-500 hover:scale-105"
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
                    {recommendation.score} /100
                  </Typography>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
