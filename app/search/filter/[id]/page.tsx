import { getFilter } from '@/app/actions/filters'
import SubpageLayout from '@/components/home-layout'
import type { Metadata, ResolvingMetadata } from 'next'
import FilterForm from './components/filter-form'

type Props = {
  params: { id: string }
  searchParams: { id: string; [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Read route params
  const id = params.id

  // Fetch filter data
  const filter = (await getFilter(id)) as any | null

  // Dynamic metadata
  const name = filter ? `${filter.name} Filter Rating` : 'Oasis - Trusted Filter Ratings'
  const description = filter
    ? `Discover the detailed rating of ${filter.name}. Find out how it performs on filtration, including contaminants removed, build quality, and suitability for your needs.`
    : 'Explore Oasis for trusted filter ratings. Compare filtration systems to find the best fit for your health and location.'

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      type: 'website',
    },
    twitter: {
      title: name,
      description,
    },
  }
}

export default async function FilterPage({ params, searchParams }: Props) {
  const id = params.id

  return (
    <SubpageLayout>
      <FilterForm id={id} />
    </SubpageLayout>
  )
}
