import SubpageLayout from '@/components/home-layout'
import ItemForm from './components/item-form'
import type { Metadata, ResolvingMetadata } from 'next'
import { getItem } from '@/app/actions/items'
import { Item } from '@/types/custom'

type Props = {
  params: { id: string }
  searchParams: { name: string; [key: string]: string | string[] | undefined }
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

  return {
    title: name || 'Oasis',
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
