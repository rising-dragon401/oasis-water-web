import SubpageLayout from '@/components/home-layout'
import ItemForm from './components/item-form'
import type { Metadata, ResolvingMetadata } from 'next'
import { getItem } from '@/app/actions/items'
import { OG_IMAGE } from '@/lib/constants/images'
import { Item } from '@/types/custom'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id

  // fetch data
  const item = (await getItem(id)) as Item | null

  const name = item && item.name + ' Health Rating'
  const image = item && item.image

  return {
    title: name || 'Oaisys',
    openGraph: {
      images: [image || OG_IMAGE],
    },
  }
}

export default function ItemPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <SubpageLayout>
      <ItemForm id={id} />
    </SubpageLayout>
  )
}
