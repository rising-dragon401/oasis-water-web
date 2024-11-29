import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'
import { CATEGORIES } from '@/lib/constants/categories'
import { OG_IMAGE } from '@/lib/constants/images'

export async function generateMetadata({ params }: { params: any }) {
  const id = params.id
  const category = CATEGORIES.find((item: any) => item.id === id)
  const name = category?.title || 'Top Rated'

  return {
    title: `Best ${name}  | Oasis`,
    description: `Discover the top-rated ${name.toLowerCase()} products based on science.`,
    openGraph: {
      title: `Best ${name} | Oasis`,
      description: `Browse the highest-rated ${name.toLowerCase()} for you.`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/top-rated/${id}`,
      type: 'website',
      locale: 'en_US',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} Products | Oasis`,
      description: `Explore the best ${name.toLowerCase()} products, rated for quality and transparency.`,
      images: [OG_IMAGE],
    },
  }
}

export default async function TopRatedItems({ params }: { params: any }) {
  const id = params.id

  return (
    <SubpageLayout>
      <div className="md:px-0 px-2 ">
        <RankingList categoryId={id} />
      </div>
    </SubpageLayout>
  )
}
