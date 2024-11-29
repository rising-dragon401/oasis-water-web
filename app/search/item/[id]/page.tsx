import { getItem } from '@/app/actions/items'
import SubpageLayout from '@/components/home-layout'
import { Item } from '@/types/custom'
import type { Metadata, ResolvingMetadata } from 'next'
import ItemForm from './components/item-form'

type Props = {
  params: { id: string }
  searchParams: { name: string; [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Read route params
  const id = params.id

  // Fetch data
  const item = (await getItem(id)) as Item | null

  const name = item ? `${item.name} Health Rating` : 'Oasis - Trusted Product Health Ratings'
  const description =
    item &&
    `Discover the health rating and contaminants inside of ${item.name}, based on the latest scientific data and lab tests.`

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description: description || undefined,
      type: 'website',
    },
    twitter: {
      title: name,
      description: description || undefined,
    },
  }
}

export default async function ItemPage({ params, searchParams }: Props) {
  const id = params.id

  return (
    <SubpageLayout>
      <ItemForm id={id} />
    </SubpageLayout>
  )
}
