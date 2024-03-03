import SubpageLayout from '@/components/home-layout'
import FilterForm from './components/filter-form'
import type { Metadata, ResolvingMetadata } from 'next'
import { getFilter } from '@/app/actions/filters'
import { OG_IMAGE } from '@/lib/constants/images'
import { Item } from '@/types/custom'
import { AuthOverlay } from '@/components/shared/auth-overlay'
import { getSession } from '@/utils/supabase/server'

type Props = {
  params: { id: string }
  searchParams: { id: string; [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id

  // fetch data
  const item = (await getFilter(id)) as Item | null

  const name = item && item.name + ' Filter Rating'
  const image = item && item.image

  return {
    title: name || 'Oasis',
    openGraph: {
      images: [image || OG_IMAGE],
    },
  }
}

export default async function FilterPage({ params, searchParams }: Props) {
  const id = params.id

  const session = await getSession()
  const user = session?.user

  return (
    <SubpageLayout>
      <FilterForm id={id} />

      {!user && <AuthOverlay referral={`/search/filter/${id}`} />}
    </SubpageLayout>
  )
}
