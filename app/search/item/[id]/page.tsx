import SubpageLayout from '@/components/home-layout'
import ItemForm from './components/item-form'
import type { Metadata, ResolvingMetadata } from 'next'
import { getItem } from '@/app/actions/items'
import { OG_IMAGE } from '@/lib/constants/images'
import { Item } from '@/types/custom'
import { getSession } from '@/utils/supabase/server'
import { AuthOverlay } from '@/components/shared/auth-overlay'

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
  const image = item && item.image

  return {
    title: name || 'Oasis',
    openGraph: {
      images: [image || OG_IMAGE],
    },
  }
}

export default async function ItemPage({ params, searchParams }: Props) {
  const id = params.id

  const session = await getSession()
  const user = session?.user

  return (
    <SubpageLayout>
      <ItemForm id={id} />

      {!user && <AuthOverlay referral={`/search/item/${id}`} />}
    </SubpageLayout>
  )
}
